"use client";

import { Fragment, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MotionConfig, motion, type Variants } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import {
  EASE,
  fadeItem,
  rise,
  stagger,
  useReveal,
} from "../../Section/About/section-motion";
import s from "./Footer.module.css";
import { footerConfig } from "./footer.config";

/* Motion gère uniquement l'apparition (opacity + petit déplacement, une fois).
   Les survols (couleur, décalage, soulignement) sont en CSS, sur des éléments
   différents de ceux que Motion anime : aucune propriété n'est animée deux fois.
   GSAP n'apporterait rien ici : il n'est volontairement pas utilisé. */
const titleV: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const lineV: Variants = {
  hidden: { y: "105%", transition: { duration: 0 } },
  show: { y: "0%", transition: { duration: 0.9, ease: EASE } },
};

export default function Footer() {
  const {
    name,
    statement,
    description,
    email,
    socials,
    availability,
    tagline,
    nav,
  } = footerConfig;
  const pathname = usePathname();
  const onHome = pathname === "/";

  // Marge nulle : le pied de page est tout en bas, il doit pouvoir se révéler
  const reveal = useReveal<HTMLDivElement>();

  const socialLinks = socials.filter((l) => l.href.trim() !== "");

  // Sans section #home, "Home" ramène simplement en haut de page
  const handleNav = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (onHome && id === "home" && !document.getElementById("home")) {
      e.preventDefault();
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <footer id="contact" className={s.footer} aria-labelledby="footer-title">
        <motion.div
          ref={reveal.ref}
          className={s.inner}
          variants={stagger}
          initial={false}
          animate={reveal.state}
        >
          {/* ---------------------------------------- Zone principale */}
          <motion.h2
            id="footer-title"
            className={s.title}
            variants={titleV}
            initial={false}
          >
            {statement.map((line, i) => {
              const hasDot = line.endsWith(".");
              const text = hasDot ? line.slice(0, -1) : line;
              return (
                <Fragment key={line}>
                  <span className={`${s.line} ${i % 2 === 1 ? s.indent : ""}`}>
                    <motion.span
                      className={`${s.lineInner} ${i === 0 ? s.light : ""}`}
                      variants={lineV}
                      initial={false}
                    >
                      {text}
                      {hasDot && <span className={s.dot}>.</span>}
                    </motion.span>
                  </span>{" "}
                </Fragment>
              );
            })}
          </motion.h2>

          <div className={s.grid}>
            <div className={s.lead}>
              <motion.p
                className={s.description}
                variants={rise}
                initial={false}
              >
                {description}
              </motion.p>

              {email.trim() !== "" && (
                <motion.div variants={rise} initial={false}>
                  <a href={`mailto:${email}`} className={s.email}>
                    <span className={s.emailText}>{email}</span>
                    <ArrowUpRight
                      className={s.arrow}
                      size={24}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <span className={s.srOnly}>Send me an email</span>
                  </a>
                </motion.div>
              )}
            </div>

            {/* ------------------------------------------- Navigation */}
            <nav className={s.navGroup} aria-label="Footer">
              <p className={s.groupTitle}>Index</p>
              <ul className={s.list}>
                {nav.map(({ id, label }) => (
                  <motion.li key={id} variants={fadeItem} initial={false}>
                    <Link
                      href={`/#${id}`}
                      className={s.link}
                      onClick={(e) => handleNav(e, id)}
                    >
                      <span className={s.linkText}>{label}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* --------------------------------------------- Profils */}
            {socialLinks.length > 0 && (
              <div className={s.socialGroup}>
                <p className={s.groupTitle}>Elsewhere</p>
                <ul className={s.list}>
                  {socialLinks.map(({ label, href }) => (
                    <motion.li key={label} variants={fadeItem} initial={false}>
                      <a
                        href={href}
                        className={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className={s.linkText}>{label}</span>
                        <ArrowUpRight
                          className={s.arrow}
                          size={18}
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                        <span className={s.srOnly}> (opens in a new tab)</span>
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ---------------------------------------- Barre inférieure */}
          <motion.div className={s.bar} variants={rise} initial={false}>
            <p className={s.copy}>
              © <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
              — {name}
            </p>
            <p className={s.tagline}>{tagline}</p>
            {availability.trim() !== "" && (
              <p className={s.status}>
                <span className={s.statusDot} aria-hidden="true" />
                {availability}
              </p>
            )}
          </motion.div>
        </motion.div>
      </footer>
    </MotionConfig>
  );
}
