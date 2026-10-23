"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react";
import { Menu, X } from "lucide-react";
import s from "./Navbar.module.css";
import Link from "next/link";

gsap.registerPlugin(useGSAP);

/* -------------------------------------------------------------------------
   Contenu : à ajuster. Les id doivent correspondre aux id des sections.
   ------------------------------------------------------------------------- */
const BRAND = "Arel";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
] as const;

const CONTACT_HREF = "#contact";

/* -------------------------------------------------------------------------
   Motion
   ------------------------------------------------------------------------- */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const ease: Transition = { duration: 0.35, ease: EASE };

const underline: Variants = { rest: { scaleX: 0 }, hover: { scaleX: 1 } };
const arrowNudge: Variants = { rest: { x: 0, y: 0 }, hover: { x: 3, y: -3 } };
const itemV: Variants = {
  closed: { opacity: 0, y: 10 },
  open: { opacity: 1, y: 0 },
};

function DiagonalArrow() {
  return (
    <motion.svg
      className={s.arrow}
      width="12"
      height="12"
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

function TalkLink({ onClick }: { onClick?: () => void }) {
  return (
    <motion.a
      href={CONTACT_HREF}
      className={s.cta}
      onClick={onClick}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
    >
      <span className={s.ctaLabel}>
        Let’s talk
        <motion.span
          className={s.underline}
          style={{ originX: 0 }}
          variants={underline}
          transition={ease}
          aria-hidden="true"
        />
      </span>
      <DiagonalArrow />
    </motion.a>
  );
}

/* -------------------------------------------------------------------------
   Navbar
   ------------------------------------------------------------------------- */
export default function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("home");
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  /* GSAP : entrée courte (≈0,9 s), démarre en même temps que celle de la Hero
     et n'anime que opacity/y des wrappers [data-nav] (Motion n'y touche pas). */
  useGSAP(
    () => {
      const root = headerRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.fromTo(
          gsap.utils.selector(root)("[data-nav]"),
          { opacity: 0, y: -8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
            stagger: 0.05,
            clearProps: "transform",
          },
        );
        return () => tween.kill();
      });

      return () => mm.revert();
    },
    { scope: headerRef },
  );

  /* Haut de page : sentinelle observée (aucun écouteur de scroll) */
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) =>
      setScrolled(!entry.isIntersecting),
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Lien actif : une fine bande de détection au milieu de l'écran */
  useEffect(() => {
    const els = SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!els.length) return;

    const band = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    els.forEach((el) => band.observe(el));

    // Dernière section courte : active quand elle est entièrement visible
    const last = els[els.length - 1];
    const bottom = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(last.id);
      },
      { threshold: 1 },
    );
    bottom.observe(last);

    return () => {
      band.disconnect();
      bottom.disconnect();
    };
  }, []);

  /* Menu mobile : Escape + fermeture si on repasse en desktop */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Tout en haut de page, l'accueil est toujours le lien actif
  const current = scrolled ? active : "home";

  const handleNav = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    // Si aucune section #home n'existe, retour en haut de page
    if (id === "home" && !document.getElementById("home")) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    }
    setOpen(false);
  };

  const k = reduce ? 0 : 1;
  const panelV: Variants = {
    closed: { height: 0, transition: { duration: 0.3 * k, ease: EASE } },
    open: {
      height: "auto",
      transition: {
        duration: 0.4 * k,
        ease: EASE,
        staggerChildren: 0.05 * k,
        delayChildren: 0.08 * k,
      },
    },
  };

  return (
    <>
      <div ref={sentinelRef} className={s.sentinel} aria-hidden="true" />

      <MotionConfig reducedMotion="user">
        <header
          ref={headerRef}
          className={s.header}
          data-scrolled={scrolled}
          data-open={open}
        >
          <div className={s.bar}>
            {/* A. Identité */}
            <div className={s.reveal} data-nav>
              <Link
                href="/"
                className={s.brand}
                aria-label={`${BRAND}. Back to top`}
                // onClick={(e) => handleNav(e, "home")}
              >
                {BRAND}
                <span className={s.brandDot}>.</span>
              </Link>
            </div>

            {/* B. Navigation (desktop) */}
            <nav className={s.nav} aria-label="Primary">
              <ul className={s.navList}>
                {SECTIONS.map(({ id, label }) => {
                  const isActive = current === id;
                  return (
                    <li key={id} className={s.reveal} data-nav>
                      <Link
                        href={`#${id}`}
                        className={s.link}
                        aria-current={isActive ? "location" : undefined}
                        onClick={(e) => handleNav(e, id)}
                      >
                        {label}
                        {isActive && (
                          <motion.span
                            layoutId="nav-active"
                            className={s.activeLine}
                            transition={ease}
                            aria-hidden="true"
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* C. Disponibilité + contact */}
            <div className={s.right}>
              <div className={s.reveal} data-nav>
                <TalkLink />
              </div>
            </div>

            {/* Bouton menu (mobile) */}
            <div className={`${s.burgerWrap} ${s.reveal}`} data-nav>
              <button
                ref={buttonRef}
                type="button"
                className={s.burger}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((v) => !v)}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={open ? "close" : "menu"}
                    className={s.burgerIcon}
                    initial={{ opacity: 0, rotate: -45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.15 * (reduce ? 0 : 1) }}
                  >
                    {open ? (
                      <X size={22} strokeWidth={1.5} aria-hidden="true" />
                    ) : (
                      <Menu size={22} strokeWidth={1.5} aria-hidden="true" />
                    )}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Panneau mobile */}
          <AnimatePresence>
            {open && (
              <motion.div
                key="scrim"
                className={s.scrim}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 * k }}
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />
            )}
            {open && (
              <motion.div
                key="panel"
                id="mobile-menu"
                className={s.panel}
                variants={panelV}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <div className={s.panelInner}>
                  <nav aria-label="Mobile">
                    <ul className={s.mList}>
                      {SECTIONS.map(({ id, label }) => {
                        const isActive = current === id;
                        return (
                          <motion.li key={id} variants={itemV}>
                            <Link
                              href={`#${id}`}
                              className={s.mLink}
                              aria-current={isActive ? "location" : undefined}
                              onClick={(e) => handleNav(e, id)}
                            >
                              {label}
                              {isActive && (
                                <span className={s.mMark} aria-hidden="true" />
                              )}
                            </Link>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </nav>

                  <motion.div className={s.mFooter} variants={itemV}>
                    <TalkLink onClick={() => setOpen(false)} />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      </MotionConfig>
    </>
  );
}
