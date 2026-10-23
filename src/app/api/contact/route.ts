import { validateContact } from "@/components/Section/Contact/contact-schema";
import { NextResponse } from "next/server";

/* ==========================================================================
   POST /api/contact
   - Envoie réellement un email via l'API REST de Resend (aucune dépendance).
   - Variables d'environnement requises (jamais exposées au client) :
       RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL
   - Si elles manquent : erreur 503 explicite. Jamais de faux succès.
   ========================================================================== */

export const runtime = "nodejs";

const MAX_BODY_BYTES = 20_000;
const MIN_FILL_MS = 1500; // un humain met plus de 1,5 s à remplir le formulaire
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;

/* Limitation de débit en mémoire : suffisante pour un portfolio, mais propre à
   chaque instance (en serverless, chaque instance a son compteur). Pour une
   protection stricte, ajoute un store partagé (ex. Upstash Redis) ou un CAPTCHA. */
const hits = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 1000) {
    for (const [key, entry] of hits) if (entry.reset < now) hits.delete(key);
  }
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_MAX;
}

const json = (body: Record<string, unknown>, status: number) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  // 1. Même origine uniquement
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (origin) {
    try {
      if (new URL(origin).host !== host)
        return json({ ok: false, error: "Forbidden." }, 403);
    } catch {
      return json({ ok: false, error: "Forbidden." }, 403);
    }
  }

  // 2. Configuration : échec explicite si le service d'envoi n'est pas prêt
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    return json(
      {
        ok: false,
        error:
          "The contact form isn’t configured yet, so your message was not sent.",
      },
      503,
    );
  }

  // 3. Taille et format
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return json({ ok: false, error: "Message too large." }, 413);
  }
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await req.json();
    if (typeof parsed !== "object" || parsed === null)
      throw new Error("bad body");
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  // 4. Anti-spam : champ piège + temps de remplissage + débit
  const elapsed = typeof body.elapsed === "number" ? body.elapsed : 0;
  if (typeof body.hp === "string" && body.hp !== "") {
    return json({ ok: false, error: "Your message could not be sent." }, 400);
  }
  if (elapsed < MIN_FILL_MS) {
    return json(
      {
        ok: false,
        error: "That was fast. Please take a moment and try again.",
      },
      400,
    );
  }
  const ip = (req.headers.get("x-forwarded-for") ?? "unknown")
    .split(",")[0]
    .trim();
  if (isRateLimited(ip)) {
    return json(
      { ok: false, error: "Too many messages. Please try again later." },
      429,
    );
  }

  // 5. Validation côté serveur (celle qui fait foi)
  const { values, errors } = validateContact(body);
  if (Object.keys(errors).length > 0) {
    return json(
      {
        ok: false,
        error: "Please check the highlighted fields.",
        fieldErrors: errors,
      },
      422,
    );
  }

  // 6. Envoi réel (texte brut uniquement : aucun HTML injecté)
  const subject =
    `[Portfolio] ${values.subject || "New message"} (from ${values.name})`.slice(
      0,
      200,
    );
  const text = [
    "New message from your portfolio contact form",
    "",
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Subject: ${values.subject || "(none)"}`,
    "",
    "Message:",
    values.message,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: values.email,
        subject,
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      // On journalise le statut seulement : jamais le contenu du message ni la clé
      console.error(
        `[contact] Email provider responded with status ${res.status}`,
      );
      return json(
        {
          ok: false,
          error: "The message could not be delivered. Please try again later.",
        },
        502,
      );
    }
    return json({ ok: true }, 200);
  } catch (err) {
    console.error(
      "[contact] Email provider request failed:",
      err instanceof Error ? err.name : "unknown",
    );
    return json(
      {
        ok: false,
        error: "The message could not be delivered. Please try again later.",
      },
      502,
    );
  }
}
