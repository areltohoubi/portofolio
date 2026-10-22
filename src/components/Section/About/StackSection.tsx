"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { MotionConfig, motion, type Variants } from "motion/react";
import {
  EASE,
  Reveal,
  RevealList,
  fadeItem,
  revealHeader,
  trail,
} from "./section-motion";
import {
  contactHref,
  coreStack,
  stackCategories,
  stackIntro,
} from "./portfolio-data";
import s from "./Sections.module.css";

gsap.registerPlugin(useGSAP);

const pad = (n: number) => String(n).padStart(2, "0");

const ctaUnderline: Variants = { rest: { scaleX: 0 }, hover: { scaleX: 1 } };
const ctaArrow: Variants = { rest: { x: 0, y: 0 }, hover: { x: 6, y: -6 } };
const ease = { duration: 0.35, ease: EASE };

export default function StackSection() {
  const rootRef = useRef<HTMLElement>(null);

  const core = coreStack.filter((t) => !t.hidden);
  const categories = stackCategories
    .map((c) => ({ ...c, items: c.items.filter((t) => !t.hidden) }))
    .filter((c) => c.items.length > 0);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealHeader(root);
        const cats = root.querySelector<HTMLElement>('[data-s="cats"]');
        if (cats) trail(cats, { axis: "y" });
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={rootRef}
        id="stack"
        className={s.section}
        aria-labelledby="stack-title"
      >
        <div className={s.inner}>
          {/* ------------------------------------------------ En-tête */}
          <div data-s="head">
            <div className={s.kicker}>
              <span className={s.kickerText}>
                <span className={s.kickerNum}>03</span> / STACK
              </span>
              <span className={s.rule} data-s="rule" />
            </div>

            <div className={s.headGrid}>
              <h2 id="stack-title" className={s.title}>
                <span className={s.line}>
                  <span className={s.lineInner} data-s="line">
                    Tools of
                  </span>
                </span>{" "}
                <span className={`${s.line} ${s.indent}`}>
                  <span
                    className={`${s.lineInner} ${s.titleLight}`}
                    data-s="line"
                  >
                    the trade.
                  </span>
                </span>
              </h2>

              <Reveal delay={0.15} className={s.introWrap}>
                <p className={s.intro}>{stackIntro}</p>
              </Reveal>
            </div>
          </div>

          {/* --------------------------------------------- Core stack */}
          <div className={s.block}>
            <Reveal className={s.blockHead}>
              <h3 className={s.blockTitle}>
                <span className={s.blockIndex}>01</span> Core stack
              </h3>
            </Reveal>

            <RevealList className={s.coreList}>
              {core.map((t) => (
                <motion.li
                  key={t.name}
                  className={s.coreRow}
                  variants={fadeItem}
                  initial={false}
                >
                  <span className={s.coreDot} aria-hidden="true" />
                  <span className={s.coreName}>
                    <span className={s.shift}>{t.name}</span>
                  </span>
                  {t.note && <span className={s.coreNote}>{t.note}</span>}
                </motion.li>
              ))}
            </RevealList>
          </div>

          {/* ---------------------------------- Écosystèmes & concepts */}
          <div className={s.block}>
            <div className={s.trailWrap} data-s="cats">
              <span className={s.trailLine} aria-hidden="true" />
              <span className={s.trailFill} data-s="fill" aria-hidden="true" />

              <ul className={s.catList}>
                {categories.map((c, i) => (
                  <li key={c.id} className={s.catRow}>
                    <span
                      className={s.mark}
                      data-s="mark"
                      data-passed="false"
                      aria-hidden="true"
                    />

                    <Reveal className={s.catHead}>
                      <span className={s.catNum}>{pad(i + 2)}</span>
                      <h3 className={s.catTitle}>{c.title}</h3>
                      <p className={s.catBlurb}>{c.blurb}</p>
                    </Reveal>

                    <RevealList className={s.techList}>
                      {c.items.map((t) => (
                        <motion.li
                          key={t.name}
                          className={s.techItem}
                          variants={fadeItem}
                          initial={false}
                        >
                          <span className={s.shift}>{t.name}</span>
                        </motion.li>
                      ))}
                    </RevealList>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ------------------------------------------ Appel final */}
          <Reveal className={s.ctaWrap}>
            <motion.a
              href={contactHref}
              className={s.cta}
              initial="rest"
              animate="rest"
              whileHover="hover"
              whileFocus="hover"
            >
              <span className={s.ctaLabel}>
                Let’s build something
                <motion.span
                  className={s.ctaLine}
                  style={{ originX: 0 }}
                  variants={ctaUnderline}
                  transition={ease}
                  aria-hidden="true"
                />
              </span>
              <motion.svg
                className={s.ctaArrow}
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
                variants={ctaArrow}
                transition={ease}
              >
                <path
                  d="M3 11L11 3M4.5 3H11v6.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="square"
                />
              </motion.svg>
              <span className={s.srOnly}>Get in touch</span>
            </motion.a>
          </Reveal>
        </div>
      </section>
    </MotionConfig>
  );
}
