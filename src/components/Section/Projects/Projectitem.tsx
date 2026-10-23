"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "motion/react";
import type { Project } from "@/data/projects";
import s from "./Projects.module.css";
import { EASE, Reveal } from "../About/section-motion";

/* Motion : zoom de l'image + micro-interactions des liens.
   GSAP n'anime jamais ces éléments (il ne touche que la piste et la ligne). */
const zoom: Variants = { idle: { scale: 1 }, zoom: { scale: 1.04 } };
const underline: Variants = { rest: { scaleX: 0 }, hover: { scaleX: 1 } };
const nudgeDiag: Variants = { rest: { x: 0, y: 0 }, hover: { x: 2, y: -2 } };
const nudgeRight: Variants = { rest: { x: 0 }, hover: { x: 4 } };
const t = { duration: 0.35, ease: EASE };

const MotionLink = motion.create(Link);
const pad = (n: number) => String(n).padStart(2, "0");
const MAX_TECH = 5;

type ArrowLinkProps = {
  href: string;
  label: string;
  context: string;
  external?: boolean;
  className?: string;
};

function ArrowLink({
  href,
  label,
  context,
  external = false,
  className = "",
}: ArrowLinkProps) {
  const inner = (
    <>
      <span className={s.linkLabel}>
        {label}
        <motion.span
          className={s.linkLine}
          style={{ originX: 0 }}
          variants={underline}
          transition={t}
          aria-hidden="true"
        />
      </span>
      <motion.svg
        className={s.linkArrow}
        width="12"
        height="12"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
        variants={external ? nudgeDiag : nudgeRight}
        transition={t}
      >
        <path
          d={external ? "M3 11L11 3M4.5 3H11v6.5" : "M2 7h10M8 3l4 4-4 4"}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
        />
      </motion.svg>
      <span className={s.srOnly}>
        {" "}
        {context}
        {external ? " (opens in a new tab)" : ""}
      </span>
    </>
  );

  const common = {
    className: `${s.link} ${className}`,
    initial: "rest",
    animate: "rest",
    whileHover: "hover",
    whileFocus: "hover",
  } as const;

  return external ? (
    <motion.a href={href} target="_blank" rel="noopener noreferrer" {...common}>
      {inner}
    </motion.a>
  ) : (
    <MotionLink href={href} {...common}>
      {inner}
    </MotionLink>
  );
}

type Props = {
  project: Project;
  index: number;
  active: boolean;
};

export default function ProjectItem({ project, index, active }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const {
    slug,
    title,
    description,
    category,
    year,
    image,
    imageAlt,
    technologies,
    demo,
  } = project;

  const showImage = Boolean(image) && !imageFailed;
  const visibleTech = technologies.slice(0, MAX_TECH);
  const extraTech = technologies.length - visibleTech.length;

  return (
    <li
      className={s.item}
      data-p="item"
      data-index={index}
      data-active={active}
    >
      <Reveal className={s.itemInner} delay={Math.min(index, 3) * 0.06}>
        <motion.article
          className={s.article}
          aria-labelledby={`project-${slug}`}
          initial="idle"
          animate="idle"
          whileHover="zoom"
        >
          <div className={s.media}>
            <motion.div
              className={s.mediaZoom}
              variants={zoom}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {showImage ? (
                <Image
                  src={image as string}
                  alt={imageAlt ?? `Screenshot of ${title}`}
                  fill
                  sizes="(min-width: 1024px) 736px, 90vw"
                  className={s.img}
                  loading={index < 3 ? "eager" : "lazy"}
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <div
                  className={s.placeholder}
                  role="img"
                  aria-label={`No screenshot available for ${title}`}
                >
                  <span className={s.placeholderText}>Screenshot to add</span>
                </div>
              )}
            </motion.div>
            {demo && <span className={s.demoTag}>Demo content</span>}
          </div>

          <div className={s.info}>
            <div className={s.metaRow}>
              <span className={s.marker} aria-hidden="true" />
              <span className={s.num}>{pad(index + 1)}</span>
              <span className={s.meta}>{category}</span>
              {year && <span className={`${s.meta} ${s.metaSep}`}>{year}</span>}
            </div>

            <h3 id={`project-${slug}`} className={s.itemTitle}>
              {title}
            </h3>
            <p className={s.desc}>{description}</p>

            {visibleTech.length > 0 && (
              <ul className={s.itemTech} aria-label="Technologies">
                {visibleTech.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
                {extraTech > 0 && (
                  <li aria-label={`and ${extraTech} more`}>+{extraTech}</li>
                )}
              </ul>
            )}

            <div className={s.actions}>
              {project.liveUrl && (
                <ArrowLink
                  href={project.liveUrl}
                  label="Live preview"
                  context={`of ${title}`}
                  external
                  className={s.ext}
                />
              )}
              {project.githubUrl && (
                <ArrowLink
                  href={project.githubUrl}
                  label="Source code"
                  context={`of ${title}`}
                  external
                  className={s.ext}
                />
              )}
              <ArrowLink
                href={`/projects/${slug}`}
                label="Read case study"
                context={`: ${title}`}
                className={s.caseLink}
              />
            </div>
          </div>
        </motion.article>
      </Reveal>
    </li>
  );
}
