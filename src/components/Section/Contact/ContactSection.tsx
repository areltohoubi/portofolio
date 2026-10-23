"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { contactConfig as c } from "./contact.config";
import { ContactForm } from "./ContactForm";
import { CopyEmail } from "./CopyEmail";

const EASE = [0.22, 1, 0.36, 1] as const;

export function ContactSection() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const glyphRef = useRef<HTMLSpanElement>(null);

  // GSAP : légère parallaxe du glyphe décoratif uniquement.
  // Motion gère les révélations ; GSAP ne touche que cet élément.
  useEffect(() => {
    if (reduce) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      if (glyphRef.current && sectionRef.current) {
        gsap.to(glyphRef.current, {
          yPercent: -14,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [reduce]);

  const reveal = (delay = 0, y = 20) => ({
    initial: reduce ? (false as const) : { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "0px 0px -10% 0px" },
    transition: { duration: 0.6, delay, ease: EASE },
  });

  const socials = c.socials.filter((s) => s.href);

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-title"
      className="relative overflow-hidden bg-[var(--background)] px-6 pb-28 pt-28 text-[var(--foreground)] sm:px-10 md:pb-40 md:pt-40 lg:px-16"
    >
      {/* Détail graphique unique : grand "@" monospace partiellement visible */}
      <span
        ref={glyphRef}
        aria-hidden
        className="pointer-events-none absolute -right-[6vw] top-[12%] hidden select-none font-[family-name:var(--font-mono)] text-[38vw] leading-none text-transparent lg:block"
        style={{ WebkitTextStroke: "1px var(--border-subtle)" }}
      >
        @
      </span>

      <div className="relative mx-auto max-w-[88rem]">
        {/* Indicateur éditorial + disponibilité */}
        <motion.div
          {...reveal(0, 8)}
          className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--foreground-secondary)]"
        >
          <p>
            <span className="text-[var(--primary)]">{c.sectionNumber}</span> /{" "}
            {c.eyebrow}
          </p>
          {c.availability.show && (
            <p className="flex items-center gap-2 text-[var(--foreground)]">
              <span
                aria-hidden
                className="h-2 w-2 rounded-full bg-[var(--primary)] motion-safe:animate-[contact-dot_3.2s_ease-in-out_infinite]"
              />
              {c.availability.label}
            </p>
          )}
        </motion.div>

        <div className="mt-14 grid gap-16 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          {/* Colonne éditoriale : titre + e-mail dominent */}
          <div className="lg:col-span-7">
            <motion.h2
              id="contact-title"
              {...reveal(0.05, 28)}
              className="font-[family-name:var(--font-sans)] text-[clamp(2.75rem,8.2vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.035em]"
            >
              <span className="block">{c.title.line1}</span>
              <span className="block">
                {c.title.line2Before}{" "}
                <span className="text-[var(--primary)]">
                  {c.title.highlight}
                </span>
                {c.title.line2After}
              </span>
            </motion.h2>

            <motion.p
              {...reveal(0.15)}
              className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--foreground-secondary)]"
            >
              {c.intro}
            </motion.p>

            {c.email && (
              <motion.div {...reveal(0.25)} className="mt-14">
                <p className="mb-3 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--foreground-muted)]">
                  Write to me
                </p>
                <a
                  href={`mailto:${c.email}`}
                  className="group relative inline-block max-w-full break-all text-[clamp(1.4rem,3.4vw,2.75rem)] font-medium leading-tight tracking-[-0.02em] text-[var(--foreground)] transition-colors hover:text-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[var(--focus-ring)]"
                >
                  {c.email}
                  <span
                    aria-hidden
                    className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[var(--primary)] transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                </a>
                <div className="mt-3">
                  <CopyEmail email={c.email} />
                </div>
              </motion.div>
            )}

            {socials.length > 0 && (
              <motion.ul
                {...reveal(0.35)}
                aria-label="Professional profiles"
                className="mt-14 max-w-md border-t border-[var(--border-subtle)]"
              >
                {socials.map((s) => (
                  <li
                    key={s.label}
                    className="border-b border-[var(--border-subtle)]"
                  >
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center justify-between py-4 text-base text-[var(--foreground)] transition-colors hover:text-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
                    >
                      <span>
                        {s.label}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </span>
                      <ArrowUpRight
                        aria-hidden
                        className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                      <span
                        aria-hidden
                        className="absolute bottom-[-1px] left-0 h-px w-full origin-left scale-x-0 bg-[var(--primary)] transition-transform duration-300 ease-out group-hover:scale-x-100"
                      />
                    </a>
                  </li>
                ))}
              </motion.ul>
            )}
          </div>

          {/* Colonne formulaire : complément, pas protagoniste */}
          <div className="lg:col-span-5 lg:pt-6">
            <motion.p
              {...reveal(0.1, 8)}
              className="mb-8 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--foreground-secondary)]"
            >
              Or send a message
            </motion.p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
