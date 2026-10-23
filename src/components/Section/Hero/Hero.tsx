"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { MotionConfig, motion, type Variants } from "motion/react";
import s from "./Hero.module.css";

gsap.registerPlugin(useGSAP);

/* -------------------------------------------------------------------------
   Contenu : à ajuster
   ------------------------------------------------------------------------- */
const LOCATION = "Working remotely";
const EXPERTISE = "Full Stack, Next.js and Laravel";

type HeroProps = {
  workHref?: string;
  contactHref?: string;
};

/* -------------------------------------------------------------------------
   Motion : variantes d'interaction (propagées depuis le lien parent)
   GSAP n'anime jamais ces éléments : il cible uniquement les wrappers.
   ------------------------------------------------------------------------- */
const ease = { duration: 0.35, ease: [0.22, 1, 0.36, 1] } as const;

const rollTop: Variants = { rest: { y: "0%" }, hover: { y: "-110%" } };
const rollBottom: Variants = { rest: { y: "110%" }, hover: { y: "0%" } };
const underline: Variants = { rest: { scaleX: 0 }, hover: { scaleX: 1 } };
const arrowNudge: Variants = { rest: { x: 0, y: 0 }, hover: { x: 3, y: -3 } };

const MotionLink = motion.create(Link);

function RollLabel({ children }: { children: string }) {
  return (
    <span className={s.roll}>
      <motion.span className={s.rollTop} variants={rollTop} transition={ease}>
        {children}
      </motion.span>
      <motion.span
        className={s.rollBottom}
        variants={rollBottom}
        transition={ease}
        aria-hidden="true"
      >
        {children}
      </motion.span>
    </span>
  );
}

function DiagonalArrow() {
  return (
    <motion.svg
      className={s.arrow}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      variants={arrowNudge}
      transition={ease}
    >
      <path
        d="M3 11L11 3M4.5 3H11v6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </motion.svg>
  );
}

/* -------------------------------------------------------------------------
   Élément graphique : tige + ramifications (croissance organique)
   pathLength=1 permet de « dessiner » chaque tracé via strokeDashoffset.
   ------------------------------------------------------------------------- */
const STEMS = [
  "M200 600C200 520 160 470 170 400S230 280 210 190S190 90 200 20",
  "M170 400C125 375 95 330 85 275",
  "M201 302C250 290 292 255 305 205",
  "M210 190C165 170 145 135 148 90",
  "M194 97C235 85 268 62 282 28",
  "M181 496C225 480 262 450 292 410",
];

const NODES: Array<[number, number]> = [
  [200, 20],
  [85, 275],
  [305, 205],
  [148, 90],
  [282, 28],
  [292, 410],
];

function GrowthMark() {
  return (
    <svg
      viewBox="0 0 400 600"
      preserveAspectRatio="xMidYMin meet"
      aria-hidden="true"
      focusable="false"
    >
      {STEMS.map((d) => (
        <path
          key={d}
          d={d}
          pathLength={1}
          className={s.stem}
          data-hero="stem"
        />
      ))}
      {NODES.map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="3"
          className={s.node}
          data-hero="node"
        />
      ))}
    </svg>
  );
}

/* -------------------------------------------------------------------------
   Hero
   ------------------------------------------------------------------------- */
export default function Hero({
  workHref = "#work",
  contactHref = "#contact",
}: HeroProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          wide: "(min-width: 768px)",
        },
        (context) => {
          const { motion: allowed, wide } = context.conditions as {
            motion: boolean;
            wide: boolean;
          };
          // Réduction des animations : le contenu reste affiché tel quel (CSS)
          if (!allowed) return;

          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          // 1. Filets + informations contextuelles
          tl.fromTo(
            q('[data-hero="rule"]'),
            { scaleX: 0 },
            { scaleX: 1, duration: 1.1, ease: "power2.inOut", stagger: 0.25 },
            0,
          ).fromTo(
            q('[data-hero="meta"]'),
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
            0.15,
          );

          // 2. Slogan : révélation ligne par ligne (le texte reste du vrai texte)
          tl.fromTo(
            q('[data-hero="line"]'),
            { yPercent: 105, y: 0 },
            { yPercent: 0, y: 0, duration: 1, stagger: 0.1, ease: "power4.out" },
            0.2,
          );

          // 3. Description puis actions
          tl.fromTo(
            q('[data-hero="desc"]'),
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.7 },
            0.85,
          ).fromTo(
            q('[data-hero="action"]'),
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
            0.95,
          );

          // 4. Élément graphique (desktop/tablette uniquement)
          if (wide) {
            const stems = q('[data-hero="stem"]');
            const nodes = q('[data-hero="node"]');

            gsap.set(stems, { strokeDasharray: 1, strokeDashoffset: 1 });
            gsap.set(nodes, { scale: 0, transformOrigin: "50% 50%" });

            tl.set(q('[data-hero="mark"]'), { opacity: 1 }, 0.3)
              .to(
                stems,
                {
                  strokeDashoffset: 0,
                  duration: 1.8,
                  stagger: 0.12,
                  ease: "power2.inOut",
                },
                0.3,
              )
              .to(nodes, { scale: 1, duration: 0.5, stagger: 0.12 }, 1.3);
          }

          return () => tl.kill();
        },
      );

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <MotionConfig reducedMotion="user">
      <section id="home" ref={rootRef} className={s.hero} aria-labelledby="hero-title">
        {/* Informations contextuelles */}
        <div>
          <ul className={s.meta}>
            <li className={`${s.metaItem} ${s.reveal}`} data-hero="meta">
              {LOCATION}
            </li>
            <li className={`${s.metaItem} ${s.reveal}`} data-hero="meta">
              {EXPERTISE}
            </li>
          </ul>
          <div className={s.rule} data-hero="rule" />
        </div>

        {/* Slogan */}
        <div className={s.main}>
          <div
            className={`${s.mark} ${s.reveal}`}
            data-hero="mark"
            aria-hidden="true"
          >
            <GrowthMark />
          </div>

          <h1 id="hero-title" className={s.title}>
            <span className={s.line}>
              <span className={`${s.lineInner} ${s.crafting}`} data-hero="line">
                Crafting
              </span>
            </span>{" "}
            <span className={`${s.line} ${s.lineIndent}`}>
              <span className={`${s.lineInner} ${s.modern}`} data-hero="line">
                modern
              </span>
            </span>{" "}
            <span className={s.line}>
              <span className={`${s.lineInner} ${s.web}`} data-hero="line">
                web experiences.
              </span>
            </span>
          </h1>
        </div>

        {/* Description + actions */}
        <div>
          <div className={s.rule} data-hero="rule" />
          <div className={s.bottom}>
            <p className={`${s.desc} ${s.reveal}`} data-hero="desc">
              Full Stack Developer building thoughtful digital products with{" "}
              <span className={s.stack}>Next.js, React and Laravel.</span>
            </p>

            <div className={s.actions}>
              <div className={`${s.action} ${s.reveal}`} data-hero="action">
                <MotionLink
                  href={workHref}
                  className={s.primary}
                  initial="rest"
                  animate="rest"
                  whileHover="hover"
                  whileFocus="hover"
                  whileTap={{ scale: 0.97 }}
                >
                  <RollLabel>Explore my work</RollLabel>
                </MotionLink>
              </div>

              <div className={`${s.action} ${s.reveal}`} data-hero="action">
                <MotionLink
                  href={contactHref}
                  className={s.secondary}
                  initial="rest"
                  animate="rest"
                  whileHover="hover"
                  whileFocus="hover"
                >
                  <span className={s.secondaryLabel}>
                    Get in touch
                    <motion.span
                      className={s.underline}
                      style={{ originX: 0 }}
                      variants={underline}
                      transition={ease}
                      aria-hidden="true"
                    />
                  </span>
                  <DiagonalArrow />
                </MotionLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
