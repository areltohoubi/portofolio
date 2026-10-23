"use client";

import { useRef, useState, type FocusEvent } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { MotionConfig } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal, revealHeader } from "../About/section-motion";
import ProjectItem from "./Projectitem";
import s from "./Projects.module.css";
import { projects } from "@/data/projects";

gsap.registerPlugin(useGSAP);

const pad = (n: number) => String(n).padStart(2, "0");

/* Épinglage uniquement sur grand écran, viewport assez haut et sans demande de
   réduction des animations. Partout ailleurs : défilement horizontal natif
   (overflow-x + scroll-snap), qui ne détourne jamais le geste vertical. */
const PINNED_QUERY =
  "(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";

export default function ProjectsSection() {
  const n = projects.length;

  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false);
  const activeRef = useRef(0);
  const goToRef = useRef<(index: number) => void>(() => {});

  useGSAP(
    () => {
      const root = rootRef.current;
      const pin = pinRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      const fill = fillRef.current;
      if (!root || !pin || !viewport || !track || !fill || n === 0) return;

      const items = Array.from(
        track.querySelectorAll<HTMLElement>('[data-p="item"]'),
      );
      if (!items.length) return;

      const reduced = () =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const behavior = (): ScrollBehavior => (reduced() ? "auto" : "smooth");
      const clampIndex = (i: number) =>
        Math.max(0, Math.min(items.length - 1, i));

      /* Positions réelles des projets (mesurées, jamais codées en dur) */
      let lefts: number[] = [];
      const measure = () => {
        lefts = items.map((el) => el.offsetLeft - items[0].offsetLeft);
      };
      measure();

      const setFill = gsap.quickSetter(fill, "scaleX") as (
        value: number,
      ) => void;

      /* Synchronise ligne de progression, compteur, projet actif et indication
         à partir d'une progression 0 → 1 (identique en mode épinglé et natif) */
      const sync = (progress: number, distance: number) => {
        const p = items.length === 1 ? 1 : Math.min(1, Math.max(0, progress));
        setFill(p);

        let idx = 0;
        if (items.length > 1) {
          if (p >= 0.995) {
            idx = items.length - 1;
          } else {
            const x = p * distance;
            let best = Infinity;
            lefts.forEach((left, i) => {
              const d = Math.abs(x - left);
              if (d < best) {
                best = d;
                idx = i;
              }
            });
          }
        }
        activeRef.current = idx;
        setActive(idx);
        setStarted(p > 0.02);
      };

      /* ---- Mode natif (par défaut) : écouteur passif + rAF ---- */
      let raf = 0;
      const readNative = () => {
        const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
        sync(max > 0 ? viewport.scrollLeft / max : 0, max);
      };
      const onScroll = () => {
        if (root.dataset.mode === "pinned") return;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(readNative);
      };
      const onResize = () => {
        measure();
        if (root.dataset.mode !== "pinned") readNative();
      };

      const nativeGoTo = (i: number) => {
        viewport.scrollTo({ left: lefts[clampIndex(i)], behavior: behavior() });
      };
      goToRef.current = nativeGoTo;

      viewport.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });
      readNative();

      const mm = gsap.matchMedia();

      /* ---- Mode épinglé : le scroll vertical fait avancer la piste ---- */
      mm.add(PINNED_QUERY, () => {
        const distance = () =>
          Math.max(0, track.scrollWidth - viewport.clientWidth);
        if (distance() < 8) return; // tout tient à l'écran : pas d'épinglage inutile

        root.dataset.mode = "pinned";
        viewport.scrollLeft = 0;

        // La section épinglée se place sous la navbar sticky
        const headerOffset = () =>
          Math.max(0, window.innerHeight - pin.offsetHeight);

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: () => `top ${headerOffset()}px`,
            end: () => `+=${Math.max(1, distance())}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 1, // rafraîchi avant les sections situées plus bas
            onRefresh: (self) => {
              measure();
              sync(self.progress, distance());
            },
            onUpdate: (self) => sync(self.progress, distance()),
          },
        });
        const st = tween.scrollTrigger;

        goToRef.current = (i: number) => {
          if (!st) return;
          const d = distance();
          const prog = d > 0 ? Math.min(1, lefts[clampIndex(i)] / d) : 0;
          window.scrollTo({
            top: st.start + prog * (st.end - st.start),
            behavior: behavior(),
          });
        };

        return () => {
          delete root.dataset.mode;
          goToRef.current = nativeGoTo;
          readNative();
        };
      });

      /* ---- Révélation de l'en-tête (titre ligne par ligne + filet) ---- */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealHeader(root);
      });

      return () => {
        cancelAnimationFrame(raf);
        viewport.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        mm.revert();
      };
    },
    { scope: rootRef },
  );

  /* Clavier en mode épinglé : amène le projet focalisé à l'écran */
  const onFocusCapture = (e: FocusEvent<HTMLDivElement>) => {
    const root = rootRef.current;
    const viewport = viewportRef.current;
    if (!root || !viewport || root.dataset.mode !== "pinned") return;
    const item = (e.target as HTMLElement).closest<HTMLElement>(
      '[data-p="item"]',
    );
    if (!item) return;
    viewport.scrollLeft = 0;
    goToRef.current(Number(item.dataset.index));
  };

  const go = (delta: number) => goToRef.current(activeRef.current + delta);
  const atStart = active <= 0;
  const atEnd = active >= n - 1;

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={rootRef}
        id="projects"
        className={s.root}
        aria-labelledby="projects-title"
      >
        <div ref={pinRef} className={s.pin}>
          {/* --------------------------------------------- En-tête */}
          <div className={s.head} data-s="head">
            <div className={s.kicker}>
              <span className={s.kickerText}>
                <span className={s.kickerNum}>02</span> / SELECTED WORK
              </span>
              <span className={s.rule} data-s="rule" />
              <span className={s.count}>
                {pad(n)} {n === 1 ? "project" : "projects"}
              </span>
            </div>

            <div className={s.headGrid}>
              <h2 id="projects-title" className={s.title}>
                <span className={s.line}>
                  <span
                    className={`${s.lineInner} ${s.titleLight}`}
                    data-s="line"
                  >
                    Selected projects.
                  </span>
                </span>{" "}
                <span className={s.line}>
                  <span className={s.lineInner} data-s="line">
                    Built with intent.
                  </span>
                </span>
              </h2>

              <div className={s.introWrap}>
                <Reveal delay={0.15}>
                  <p className={s.intro}>
                    A collection of digital products, experiments and
                    applications built from concept to implementation.
                  </p>
                </Reveal>
                {n > 1 && (
                  <p
                    className={s.hint}
                    data-started={started}
                    aria-hidden="true"
                  >
                    SCROLL TO EXPLORE →
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ---------------------------------------------- Projets */}
          {n === 0 ? (
            <p className={s.empty}>No projects to show yet.</p>
          ) : (
            <div className={s.stage}>
              <div
                ref={viewportRef}
                className={s.viewport}
                data-p="viewport"
                onFocusCapture={onFocusCapture}
              >
                <ul ref={trackRef} className={s.track} role="list">
                  {projects.map((project, i) => (
                    <ProjectItem
                      key={project.slug}
                      project={project}
                      index={i}
                      active={i === active}
                    />
                  ))}
                </ul>
              </div>

              <div className={s.controls}>
                <div className={s.progress} aria-hidden="true">
                  <span className={s.progressTrack} />
                  <span ref={fillRef} className={s.progressFill} />
                </div>
                <p className={s.counter}>
                  <span className={s.counterNow}>{pad(active + 1)}</span> /{" "}
                  {pad(n)}
                </p>
                <div className={s.buttons}>
                  <button
                    type="button"
                    className={s.btn}
                    aria-label="Previous project"
                    aria-disabled={atStart}
                    onClick={() => !atStart && go(-1)}
                  >
                    <ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className={s.btn}
                    aria-label="Next project"
                    aria-disabled={atEnd}
                    onClick={() => !atEnd && go(1)}
                  >
                    <ArrowRight
                      size={18}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </MotionConfig>
  );
}
