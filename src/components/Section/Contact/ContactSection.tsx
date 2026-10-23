"use client";

import { Fragment, useEffect, useRef, useState, type MouseEvent } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Variants,
} from "motion/react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import {
  EASE,
  Reveal,
  RevealList,
  fadeItem,
  revealHeader,
} from "../About/section-motion";
import { contactConfig } from "./contact.config";
import ContactForm from "./ContactForm";
import s from "./Contact.module.css";

gsap.registerPlugin(useGSAP);

const t = { duration: 0.3, ease: EASE };
const underline: Variants = { rest: { scaleX: 0 }, hover: { scaleX: 1 } };
const nudge: Variants = { rest: { x: 0, y: 0 }, hover: { x: 3, y: -3 } };

/** Met le mot `accent` en vert citron dans une ligne du titre */
function renderLine(line: string, accent: string) {
  const i = accent ? line.indexOf(accent) : -1;
  if (i === -1) return line;
  return (
    <>
      {line.slice(0, i)}
      <span className={s.accent}>{accent}</span>
      {line.slice(i + accent.length)}
    </>
  );
}

/* ---------------------------------------------------------------------------
   Email : lien mailto + copie dans le presse-papiers (avec repli et erreur)
   --------------------------------------------------------------------------- */
type CopyState = "idle" | "copied" | "error";

function EmailBlock({ email }: { email: string }) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(email);
      ok = true;
    } catch {
      // Repli pour les contextes sans API Clipboard (HTTP, anciens navigateurs)
      try {
        const area = document.createElement("textarea");
        area.value = email;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        ok = document.execCommand("copy");
        document.body.removeChild(area);
      } catch {
        ok = false;
      }
    }
    setState(ok ? "copied" : "error");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2500);
  };

  const label =
    state === "copied"
      ? "Copied!"
      : state === "error"
        ? "Copy failed"
        : "Copy address";

  return (
    <div className={s.emailBlock}>
      <a href={`mailto:${email}`} className={s.emailLink}>
        <span className={s.emailText}>{email}</span>
        <ArrowUpRight
          className={s.emailArrow}
          size={28}
          strokeWidth={1.25}
          aria-hidden="true"
        />
        <span className={s.srOnly}>Send me an email</span>
      </a>

      <div className={s.copyRow}>
        <button
          type="button"
          className={s.copyBtn}
          onClick={copy}
          aria-label="Copy email address"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={state}
              className={s.copyLabel}
              data-state={state}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {label}
            </motion.span>
          </AnimatePresence>
        </button>
        {state === "error" && (
          <span className={s.copyHint}>
            Select the address above and copy it manually.
          </span>
        )}
        <span className={s.srOnly} role="status" aria-live="polite">
          {state === "copied" && "Email address copied to clipboard."}
          {state === "error" &&
            "Could not copy the address. Please select it manually."}
        </span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Section
   --------------------------------------------------------------------------- */
export default function ContactSection() {
  const {
    sectionNumber,
    eyebrow,
    titleLines,
    accent,
    intro,
    email,
    socials,
    availability,
    closing,
    signature,
  } = contactConfig;

  const rootRef = useRef<HTMLElement>(null);
  const hasEmail = email.trim() !== "";
  const socialLinks = socials.filter((l) => l.href.trim() !== "");

  /* GSAP : titre ligne par ligne, filet principal, tracé de « circuit » qui se
     dessine avec le scroll. Rien n'est épinglé : le formulaire reste utilisable. */
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealHeader(root);

        const circuit = root.querySelector<SVGElement>('[data-s="circuit"]');
        const path = root.querySelector<SVGPathElement>(
          '[data-s="circuit-path"]',
        );
        const end = root.querySelector<SVGElement>('[data-s="circuit-end"]');
        if (circuit && path) {
          gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1 });
          gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: circuit,
              start: "top 90%",
              end: "top 45%",
              scrub: 0.4,
              onUpdate: (self) => {
                if (end)
                  end.dataset.passed = self.progress > 0.98 ? "true" : "false";
              },
            },
          });
        }
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  // Sans section #home, « Back to top » remonte simplement en haut de page
  const toTop = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!document.getElementById("home")) {
      e.preventDefault();
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={rootRef}
        id="contact"
        className={s.section}
        aria-labelledby="contact-title"
      >
        <div className={s.inner}>
          {/* --------------------------------------------- En-tête */}
          <div data-s="head">
            <div className={s.kicker}>
              <span className={s.kickerText}>
                <span className={s.kickerNum}>{sectionNumber}</span> / {eyebrow}
              </span>
              <span className={s.rule} data-s="rule" />
            </div>

            <h2 id="contact-title" className={s.title}>
              {titleLines.map((line, i) => (
                <Fragment key={line}>
                  <span className={`${s.line} ${i % 2 === 1 ? s.indent : ""}`}>
                    <span
                      className={`${s.lineInner} ${i === 0 ? s.light : ""}`}
                      data-s="line"
                    >
                      {renderLine(line, accent)}
                    </span>
                  </span>{" "}
                </Fragment>
              ))}
            </h2>
          </div>

          {/* Détail graphique : tracé de circuit, il sert aussi de séparateur */}
          <svg
            className={s.circuit}
            viewBox="0 0 800 64"
            preserveAspectRatio="xMinYMid meet"
            aria-hidden="true"
            focusable="false"
            data-s="circuit"
          >
            <path
              className={s.circuitPath}
              d="M0 32H180V12H360V52H560V32H800"
              pathLength={1}
              data-s="circuit-path"
            />
            <circle className={s.circuitNode} cx="180" cy="32" r="2.5" />
            <circle className={s.circuitNode} cx="360" cy="12" r="2.5" />
            <circle className={s.circuitNode} cx="560" cy="52" r="2.5" />
            <circle
              className={s.circuitEnd}
              cx="800"
              cy="32"
              r="4"
              data-s="circuit-end"
              data-passed="false"
            />
          </svg>

          {/* ---------------------------------- Deux colonnes asymétriques */}
          <div className={s.grid}>
            <div className={s.left}>
              <Reveal>
                <p className={s.intro}>{intro}</p>
              </Reveal>

              {hasEmail && (
                <Reveal delay={0.08}>
                  <EmailBlock email={email} />
                </Reveal>
              )}

              {socialLinks.length > 0 && (
                <RevealList className={s.socials}>
                  {socialLinks.map(({ label, href }) => (
                    <motion.li key={label} variants={fadeItem} initial={false}>
                      <motion.a
                        href={href}
                        className={s.social}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial="rest"
                        animate="rest"
                        whileHover="hover"
                        whileFocus="hover"
                      >
                        <span className={s.socialLabel}>
                          {label}
                          <motion.span
                            className={s.socialLine}
                            style={{ originX: 0 }}
                            variants={underline}
                            transition={t}
                            aria-hidden="true"
                          />
                        </span>
                        <motion.span
                          className={s.socialArrow}
                          variants={nudge}
                          transition={t}
                        >
                          <ArrowUpRight
                            size={20}
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </motion.span>
                        <span className={s.srOnly}> (opens in a new tab)</span>
                      </motion.a>
                    </motion.li>
                  ))}
                </RevealList>
              )}

              {availability.trim() !== "" && (
                <Reveal delay={0.1}>
                  <p className={s.availability}>
                    <span className={s.availabilityDot} aria-hidden="true" />
                    {availability}
                  </p>
                </Reveal>
              )}
            </div>

            <div className={s.right}>
              <ContactForm email={hasEmail ? email : undefined} />
            </div>
          </div>

          {/* ------------------------------------- Signature de fin */}
          <Reveal className={s.end}>
            <p className={s.closing}>{closing}</p>
            <p className={s.signature}>{renderSignature(signature)}</p>
            <a href="#home" className={s.toTop} onClick={toTop}>
              <span>Back to top</span>
              <ArrowUp size={16} strokeWidth={1.5} aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </section>
    </MotionConfig>
  );
}

/** « Arel. » : le point final reprend l'accent vert citron de la marque */
function renderSignature(text: string) {
  if (!text.endsWith(".")) return text;
  return (
    <>
      {text.slice(0, -1)}
      <span className={s.accent}>.</span>
    </>
  );
}
