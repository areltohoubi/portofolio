"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useInView, type Variants } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

/* ==========================================================================
   MOTION : apparitions (opacity + petit déplacement vertical, une seule fois)

   Robustesse : le HTML serveur est visible (initial={false}). Le masquage
   n'est armé qu'après l'hydratation, donc si le JS échoue, rien ne reste
   invisible.
   ========================================================================== */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const rise: Variants = {
  hidden: { opacity: 0, y: 14, transition: { duration: 0 } },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE, delay },
  }),
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

export const fadeItem: Variants = {
  hidden: { opacity: 0, y: 8, transition: { duration: 0 } },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const [armed, setArmed] = useState(false);
  useEffect(() => setArmed(true), []);
  return { ref, state: !armed || inView ? "show" : "hidden" } as const;
}

export function Reveal({
  delay = 0,
  className,
  children,
}: {
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const { ref, state } = useReveal<HTMLDivElement>();
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={rise}
      custom={delay}
      initial={false}
      animate={state}
    >
      {children}
    </motion.div>
  );
}

/** <ul> dont les enfants (motion.li variants={fadeItem}) apparaissent en cascade */
export function RevealList({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { ref, state } = useReveal<HTMLUListElement>();
  return (
    <motion.ul
      ref={ref}
      className={className}
      variants={stagger}
      initial={false}
      animate={state}
    >
      {children}
    </motion.ul>
  );
}

/* ==========================================================================
   GSAP / ScrollTrigger : à appeler dans useGSAP (nettoyage automatique)
   Le contenu reste visible côté serveur ; GSAP pose l'état initial à
   l'hydratation, donc aucun contenu ne reste bloqué si le JS échoue.
   ========================================================================== */

/** Titre ligne par ligne + filet principal qui se dessine */
export function revealHeader(root: HTMLElement) {
  const head = root.querySelector<HTMLElement>('[data-s="head"]') ?? root;
  const lines = root.querySelectorAll('[data-s="line"]');
  const rule = root.querySelector('[data-s="rule"]');
  const scrollTrigger = { trigger: head, start: "top 80%", once: true };

  gsap.fromTo(
    lines,
    { yPercent: 105 },
    {
      yPercent: 0,
      duration: 1,
      ease: "power4.out",
      stagger: 0.1,
      scrollTrigger,
    },
  );
  if (rule) {
    gsap.fromTo(
      rule,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.1, ease: "power2.inOut", scrollTrigger },
    );
  }
}

type TrailOptions = {
  axis: "x" | "y";
  start?: string;
  end?: string;
};

/**
 * Fil conducteur : la ligne [data-s="fill"] se remplit avec le scroll et les
 * repères [data-s="mark"] passent à data-passed="true" quand la ligne les
 * dépasse. Seuls transform (scale) et un attribut de données sont modifiés.
 */
export function trail(
  root: HTMLElement,
  { axis, start = "top 65%", end = "bottom 65%" }: TrailOptions,
) {
  const fill = root.querySelector<HTMLElement>('[data-s="fill"]');
  if (!fill) return;
  const marks = Array.from(
    root.querySelectorAll<HTMLElement>('[data-s="mark"]'),
  );
  let thresholds: number[] = [];

  const measure = () => {
    const r = root.getBoundingClientRect();
    thresholds = marks.map((m) => {
      const b = m.getBoundingClientRect();
      return axis === "y"
        ? (b.top + b.height / 2 - r.top) / r.height
        : (b.left + b.width / 2 - r.left) / r.width;
    });
  };
  const paint = (p: number) =>
    marks.forEach((m, i) => {
      m.dataset.passed = p >= thresholds[i] ? "true" : "false";
    });

  measure();
  gsap.fromTo(fill, axis === "y" ? { scaleY: 0 } : { scaleX: 0 }, {
    ...(axis === "y" ? { scaleY: 1 } : { scaleX: 1 }),
    ease: "none",
    scrollTrigger: {
      trigger: root,
      start,
      end,
      scrub: 0.4,
      onRefresh: measure,
      onUpdate: (self) => paint(self.progress),
    },
  });
}

export { ScrollTrigger };
