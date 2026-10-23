"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Loader2 } from "lucide-react";
import {
  LIMITS,
  validateContact,
  type FieldErrors,
} from "./contact.validation";

type Status = "idle" | "loading" | "success" | "error";

const EASE = [0.22, 1, 0.36, 1] as const;

const fieldClass =
  "peer block w-full border-0 border-b border-[var(--border)] bg-transparent px-0 py-3 text-base text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-[var(--error)] transition-colors";

function Field({
  id,
  label,
  optional,
  error,
  index,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  index: number;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: EASE }}
      className="group relative"
    >
      <label
        htmlFor={id}
        className="mb-1 flex items-baseline justify-between font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--foreground-secondary)] transition-colors group-focus-within:text-[var(--primary)]"
      >
        <span>{label}</span>
        {optional && <span className="text-[var(--foreground-muted)]">Optional</span>}
      </label>
      <div className="relative">
        {children}
        {/* Soulignement animé au focus (CSS uniquement) */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[var(--primary)] transition-transform duration-300 ease-out peer-focus:scale-x-100"
        />
      </div>
      <p
        id={`${id}-error`}
        className="min-h-5 pt-1.5 text-sm text-[var(--error)]"
        aria-live="polite"
      >
        {error}
      </p>
    </motion.div>
  );
}

export function ContactForm() {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [feedback, setFeedback] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const sending = useRef(false); // garde synchrone contre le double envoi

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending.current) return;

    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const { values, errors: clientErrors } = validateContact(data);
    setErrors(clientErrors);

    const firstInvalid = (Object.keys(clientErrors) as (keyof FieldErrors)[])[0];
    if (firstInvalid) {
      setStatus("idle");
      setFeedback("");
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    sending.current = true;
    setStatus("loading");
    setFeedback("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = (await res.json().catch(() => null)) as {
        ok?: boolean;
        message?: string;
        errors?: FieldErrors;
      } | null;

      if (res.ok && json?.ok) {
        setStatus("success");
        setFeedback("Message sent. Thank you — I'll get back to you soon.");
        formRef.current?.reset();
      } else {
        if (json?.errors) setErrors(json.errors);
        setStatus("error");
        setFeedback(json?.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setFeedback("Network error. Check your connection and try again.");
    } finally {
      sending.current = false;
    }
  }

  const loading = status === "loading";
  const describe = (k: keyof FieldErrors) => (errors[k] ? `${k}-error` : undefined);

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-busy={loading} className="space-y-3">
      {/* Honeypot : invisible pour les humains */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Field id="name" label="Name" error={errors.name} index={0}>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={LIMITS.name}
          placeholder="Your name"
          disabled={loading}
          aria-invalid={!!errors.name}
          aria-describedby={describe("name")}
          className={fieldClass}
        />
      </Field>

      <Field id="email" label="Email" error={errors.email} index={1}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={LIMITS.email}
          placeholder="you@example.com"
          disabled={loading}
          aria-invalid={!!errors.email}
          aria-describedby={describe("email")}
          className={fieldClass}
        />
      </Field>

      <Field id="subject" label="Subject" optional error={errors.subject} index={2}>
        <input
          id="subject"
          name="subject"
          type="text"
          maxLength={LIMITS.subject}
          placeholder="What's it about?"
          disabled={loading}
          aria-invalid={!!errors.subject}
          aria-describedby={describe("subject")}
          className={fieldClass}
        />
      </Field>

      <Field id="message" label="Message" error={errors.message} index={3}>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          maxLength={LIMITS.message}
          placeholder="Tell me about your project…"
          disabled={loading}
          aria-invalid={!!errors.message}
          aria-describedby={describe("message")}
          className={`${fieldClass} resize-y`}
        />
      </Field>

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={loading}
          className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-[var(--radius-sm)] bg-[var(--primary)] px-6 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-ring)]"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Sending…
            </>
          ) : (
            <>
              Send message
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden
              />
            </>
          )}
        </button>

        {/* Zone annoncée aux lecteurs d'écran */}
        <div role="status" aria-live="polite" className="min-h-6 text-sm">
          <AnimatePresence mode="wait">
            {feedback && (
              <motion.p
                key={status + feedback}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={status === "success" ? "text-[var(--green-sage)]" : "text-[var(--error)]"}
              >
                {feedback}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </form>
  );
}
