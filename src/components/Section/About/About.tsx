"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import {
  EASE,
  Reveal,
  ScrollTrigger,
  fadeItem,
  revealHeader,
  stagger,
  trail,
  useReveal,
} from "./section-motion";
import {
  bio,
  expertise,
  intro,
  methodology,
  profileInfo,
} from "./portfolio-data";
import s from "./Sections.module.css";

gsap.registerPlugin(useGSAP);

const pad = (n: number) => String(n).padStart(2, "0");

export default function AboutSection() {
  const rootRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduce = useReducedMotion();

  const info = profileInfo.filter((f) => f.value.trim() !== "");
  const dl = useReveal<HTMLDListElement>();
  const steps = useReveal<HTMLOListElement>();

  /* GSAP : révélation du titre, fils conducteurs, parallaxe légère.
     Aucune de ces propriétés n'est animée par Motion. */
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add(
        {
          allowed: "(prefers-reduced-motion: no-preference)",
          wide: "(min-width: 1024px)",
        },
        (ctx) => {
          const { allowed, wide } = ctx.conditions as {
            allowed: boolean;
            wide: boolean;
          };
          if (!allowed) return;

          revealHeader(root);

          const expertiseEl = root.querySelector<HTMLElement>(
            '[data-s="expertise"]',
          );
          if (expertiseEl) trail(expertiseEl, { axis: "y" });

          const method = root.querySelector<HTMLElement>('[data-s="method"]');
          if (method) {
            trail(
              method,
              wide
                ? { axis: "x", start: "top 80%", end: "top 40%" }
                : { axis: "y" },
            );
          }

          // Parallaxe très légère sur l'initiale décorative (desktop uniquement)
          const glyph = root.querySelector<HTMLElement>('[data-s="glyph"]');
          const host = root.querySelector<HTMLElement>(
            '[data-s="presentation"]',
          );
          if (wide && glyph && host) {
            gsap.fromTo(
              glyph,
              { yPercent: -6 },
              {
                yPercent: 6,
                ease: "none",
                scrollTrigger: {
                  trigger: host,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          }
        },
      );

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={rootRef}
        id="about"
        className={s.section}
        aria-labelledby="about-title"
      >
        <div className={s.inner}>
          {/* ------------------------------------------------ En-tête */}
          <div data-s="head">
            <div className={s.kicker}>
              <span className={s.kickerText}>
                <span className={s.kickerNum}>01</span> / ABOUT
              </span>
              <span className={s.rule} data-s="rule" />
            </div>

            <div className={s.headGrid}>
              <h2 id="about-title" className={s.title}>
                <span className={s.line}>
                  <span
                    className={`${s.lineInner} ${s.titleLight}`}
                    data-s="line"
                  >
                    More than code.
                  </span>
                </span>{" "}
                <span className={s.line}>
                  <span className={s.lineInner} data-s="line">
                    A <span className={s.accent}>mindset</span>
                  </span>
                </span>{" "}
                <span className={`${s.line} ${s.indent}`}>
                  <span className={s.lineInner} data-s="line">
                    for building.
                  </span>
                </span>
              </h2>

              <Reveal delay={0.15} className={s.introWrap}>
                <p className={s.intro}>{intro}</p>
              </Reveal>
            </div>
          </div>

          {/* ------------------------------------------ Présentation */}
          <div className={s.presentation} data-s="presentation">
            <span className={s.glyph} data-s="glyph" aria-hidden="true">
              A
            </span>

            <div className={s.bioCol}>
              {bio.map((text, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <p className={i === 0 ? s.lead : s.body}>{text}</p>
                </Reveal>
              ))}
            </div>

            {info.length > 0 && (
              <aside className={s.profile} aria-label="Profile details">
                <motion.dl
                  ref={dl.ref}
                  className={s.dl}
                  variants={stagger}
                  initial={false}
                  animate={dl.state}
                >
                  {info.map(({ label, value }) => (
                    <motion.div
                      key={label}
                      className={s.dlRow}
                      variants={fadeItem}
                      initial={false}
                    >
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </motion.div>
                  ))}
                </motion.dl>
              </aside>
            )}
          </div>

          {/* ---------------------------------------------- Expertise */}
          <div className={s.block}>
            <Reveal className={s.blockHead}>
              <h3 className={s.blockTitle}>Areas of expertise</h3>
              <p className={s.blockNote}>
                What I work on, and the tools I reach for. Open a row to see the
                technologies.
              </p>
            </Reveal>

            <div className={s.trailWrap} data-s="expertise">
              <span className={s.trailLine} aria-hidden="true" />
              <span className={s.trailFill} data-s="fill" aria-hidden="true" />

              <ul className={s.exList}>
                {expertise.map((d, i) => {
                  const open = openIndex === i;
                  const btnId = `ex-btn-${d.id}`;
                  const panelId = `ex-panel-${d.id}`;
                  return (
                    <li key={d.id} className={s.exRow} data-open={open}>
                      <span
                        className={s.mark}
                        data-s="mark"
                        data-passed="false"
                        aria-hidden="true"
                      />
                      <span className={s.exNum} aria-hidden="true">
                        {pad(i + 1)}
                      </span>
                      <h4 className={s.exTitle}>
                        <button
                          id={btnId}
                          type="button"
                          className={s.exButton}
                          aria-expanded={open}
                          aria-controls={panelId}
                          onClick={() => setOpenIndex(open ? null : i)}
                        >
                          {d.title}
                        </button>
                      </h4>
                      <p className={s.exDesc}>{d.description}</p>
                      <span className={s.exIcon} aria-hidden="true">
                        +
                      </span>

                      <motion.div
                        id={panelId}
                        className={s.exPanel}
                        aria-hidden={!open}
                        initial={false}
                        animate={
                          open
                            ? { height: "auto", opacity: 1 }
                            : { height: 0, opacity: 0 }
                        }
                        transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                        onAnimationComplete={() => ScrollTrigger.refresh()}
                      >
                        <ul className={s.techs}>
                          {d.tech.map((t) => (
                            <li key={t} className={s.tech}>
                              {t}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* ------------------------------------------ Méthodologie */}
          <div className={s.block}>
            <Reveal className={s.blockHead}>
              <h3 className={s.blockTitle}>How I approach a build</h3>
              <p className={s.blockNote}>
                A loose sequence I come back to, not a fixed process.
              </p>
            </Reveal>

            <div className={s.method} data-s="method">
              <span className={s.mTrail} aria-hidden="true" />
              <span className={s.mFill} data-s="fill" aria-hidden="true" />

              <motion.ol
                ref={steps.ref}
                className={s.steps}
                variants={stagger}
                initial={false}
                animate={steps.state}
              >
                {methodology.map((m, i) => (
                  <motion.li
                    key={m.title}
                    className={s.step}
                    variants={fadeItem}
                    initial={false}
                  >
                    <span
                      className={s.mark}
                      data-s="mark"
                      data-passed="false"
                      aria-hidden="true"
                    />
                    <span className={s.stepNum} aria-hidden="true">
                      {pad(i + 1)}
                    </span>
                    <h4 className={s.stepTitle}>{m.title}</h4>
                    <p className={s.stepDesc}>{m.description}</p>
                  </motion.li>
                ))}
              </motion.ol>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
