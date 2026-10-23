import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { existsSync } from "node:fs";
import path from "node:path";
import {
  getAdjacentProjects,
  getProjectBySlug,
  projects,
  statusLabels,
  type Project,
} from "@/data/projects";
import s from "./CaseStudy.module.css";

type Params = { slug: string };

/* Les slugs viennent des données ; tout autre slug renvoie une 404 */
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return projects.map(({ slug }) => ({ slug }));
}

/* Next.js 15+ : params est une Promise. (Next 14 : `await` fonctionne aussi.) */
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };

  const hasImage = localImageExists(project.image);
  return {
    title: `${project.title}: case study`,
    description: project.longDescription ?? project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      ...(hasImage && project.image ? { images: [project.image] } : {}),
    },
  };
}

/* ------------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------------ */
const pad = (n: number) => String(n).padStart(2, "0");

/** Image distante : acceptée telle quelle. Image locale : on vérifie /public. */
function localImageExists(src?: string): boolean {
  if (!src) return false;
  if (/^https?:\/\//.test(src)) return true;
  return existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
}

function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p, i) => (
          <p key={i} className={s.text}>
            {p}
          </p>
        ))}
    </>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className={s.list}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function Shot({
  src,
  alt,
  title,
  sizes,
  priority = false,
}: {
  src?: string;
  alt: string;
  title: string;
  sizes: string;
  priority?: boolean;
}) {
  if (src && localImageExists(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={s.img}
      />
    );
  }
  return (
    <div
      className={s.placeholder}
      role="img"
      aria-label={`No screenshot available for ${title}`}
    >
      <span className={s.placeholderText}>Screenshot to add</span>
    </div>
  );
}

function ExternalLink({
  href,
  label,
  title,
}: {
  href: string;
  label: string;
  title: string;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={s.ext}>
      <span className={s.extLabel}>{label}</span>
      <span aria-hidden="true" className={s.arrow}>
        ↗
      </span>
      <span className={s.srOnly}> of {title} (opens in a new tab)</span>
    </a>
  );
}

type Section = { id: string; title: string; body: ReactNode };

function buildSections(project: Project): Section[] {
  const cs = project.caseStudy;
  const sections: Section[] = [];

  if (cs.context.trim()) {
    sections.push({
      id: "context",
      title: "Context & problem",
      body: <Paragraphs text={cs.context} />,
    });
  }

  if (cs.objectives.length > 0) {
    sections.push({
      id: "goals",
      title: "Goals & objectives",
      body: <BulletList items={cs.objectives} />,
    });
  }

  if (cs.challenges.length > 0) {
    sections.push({
      id: "challenges",
      title: "Challenges",
      body: <BulletList items={cs.challenges} />,
    });
  }

  if (cs.approach.trim()) {
    sections.push({
      id: "approach",
      title: "Approach & development",
      body: <Paragraphs text={cs.approach} />,
    });
  }

  const gallery = (project.gallery ?? []).filter((g) =>
    localImageExists(g.src),
  );
  if (cs.features.length > 0 || gallery.length > 0) {
    sections.push({
      id: "features",
      title: "Key features",
      body: (
        <>
          {cs.features.length > 0 && <BulletList items={cs.features} />}
          {gallery.length > 0 && (
            <div className={s.gallery}>
              {gallery.map((g) => (
                <figure key={g.src} className={s.figure}>
                  <div className={s.shot}>
                    <Image
                      src={g.src}
                      alt={g.alt}
                      fill
                      sizes="(min-width: 1024px) 560px, 90vw"
                      className={s.img}
                    />
                  </div>
                  {g.caption && (
                    <figcaption className={s.caption}>{g.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </>
      ),
    });
  }

  const arch = cs.architecture;
  if (arch && (arch.summary || (arch.layers && arch.layers.length > 0))) {
    sections.push({
      id: "architecture",
      title: "Technical architecture",
      body: (
        <>
          {arch.summary && <Paragraphs text={arch.summary} />}
          {arch.layers && arch.layers.length > 0 && (
            <dl className={s.layers}>
              {arch.layers.map((layer) => (
                <div key={layer.label} className={s.layer}>
                  <dt>{layer.label}</dt>
                  <dd>{layer.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </>
      ),
    });
  }

  const results = cs.results ?? [];
  const learnings = cs.learnings ?? [];
  const nextSteps = cs.nextSteps ?? [];
  if (results.length || learnings.length || nextSteps.length) {
    sections.push({
      id: "results",
      title: "Results & learnings",
      body: (
        <>
          {results.length > 0 && (
            <div className={s.sub}>
              <h3 className={s.subTitle}>Results</h3>
              <BulletList items={results} />
            </div>
          )}
          {learnings.length > 0 && (
            <div className={s.sub}>
              <h3 className={s.subTitle}>Learnings</h3>
              <BulletList items={learnings} />
            </div>
          )}
          {nextSteps.length > 0 && (
            <div className={s.sub}>
              <h3 className={s.subTitle}>Next steps</h3>
              <BulletList items={nextSteps} />
            </div>
          )}
        </>
      ),
    });
  }

  return sections;
}

/* ------------------------------------------------------------------------
   Page
   ------------------------------------------------------------------------ */
export default async function CaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const { previous, next } = getAdjacentProjects(project.slug);
  const sections = buildSections(project);

  const meta: { label: string; value: string }[] = [
    { label: "Category", value: project.category },
    ...(project.year ? [{ label: "Year", value: String(project.year) }] : []),
    ...(project.status
      ? [{ label: "Status", value: statusLabels[project.status] }]
      : []),
    ...(project.role ? [{ label: "Role", value: project.role }] : []),
  ];

  return (
    <article className={s.page}>
      <header className={s.hero}>
        <div className={s.inner}>
          <Link href="/#projects" className={s.back}>
            <span aria-hidden="true">←</span> All projects
          </Link>

          <p className={s.kicker} style={{ ["--d" as string]: "0ms" }}>
            Case study
          </p>
          <h1 className={s.title} style={{ ["--d" as string]: "80ms" }}>
            {project.title}
          </h1>
          <p className={s.subtitle} style={{ ["--d" as string]: "160ms" }}>
            {project.subtitle}
          </p>

          {project.demo && (
            <p className={s.demoNote}>
              Placeholder content. Replace this entry in{" "}
              <code>projects.ts</code> with a real project.
            </p>
          )}

          <div className={s.heroGrid} style={{ ["--d" as string]: "240ms" }}>
            <div>
              <p className={s.lede}>
                {project.longDescription ?? project.description}
              </p>

              {(project.liveUrl || project.githubUrl) && (
                <div className={s.extLinks}>
                  {project.liveUrl && (
                    <ExternalLink
                      href={project.liveUrl}
                      label="Live preview"
                      title={project.title}
                    />
                  )}
                  {project.githubUrl && (
                    <ExternalLink
                      href={project.githubUrl}
                      label="Source code"
                      title={project.title}
                    />
                  )}
                </div>
              )}
            </div>

            <div>
              <dl className={s.meta}>
                {meta.map(({ label, value }) => (
                  <div key={label} className={s.metaRow}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>

              {project.technologies.length > 0 && (
                <ul className={s.tech} aria-label="Technologies">
                  {project.technologies.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className={s.cover} style={{ ["--d" as string]: "320ms" }}>
            <Shot
              src={project.image}
              alt={project.imageAlt ?? `Screenshot of ${project.title}`}
              title={project.title}
              sizes="(min-width: 1024px) 1280px, 100vw"
              priority
            />
          </div>
        </div>
      </header>

      <div className={s.inner}>
        {sections.map((section, i) => (
          <section
            key={section.id}
            className={s.section}
            aria-labelledby={`cs-${section.id}`}
          >
            <div className={s.sectionHead}>
              <span className={s.secNum}>{pad(i + 1)}</span>
              <h2 id={`cs-${section.id}`} className={s.secTitle}>
                {section.title}
              </h2>
            </div>
            <div className={s.sectionBody}>{section.body}</div>
          </section>
        ))}

        {/* Navigation entre projets : déterminée par l'ordre du tableau */}
        <nav className={s.pager} aria-label="Project navigation">
          {previous ? (
            <Link
              href={`/projects/${previous.slug}`}
              className={s.pagerLink}
              rel="prev"
            >
              <span className={s.pagerLabel}>
                <span aria-hidden="true">←</span> Previous
              </span>
              <span className={s.pagerTitle}>{previous.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className={`${s.pagerLink} ${s.pagerNext}`}
              rel="next"
            >
              <span className={s.pagerLabel}>
                Next <span aria-hidden="true">→</span>
              </span>
              <span className={s.pagerTitle}>{next.title}</span>
            </Link>
          ) : (
            <Link href="/#projects" className={`${s.pagerLink} ${s.pagerNext}`}>
              <span className={s.pagerLabel}>
                Back <span aria-hidden="true">→</span>
              </span>
              <span className={s.pagerTitle}>All projects</span>
            </Link>
          )}
        </nav>
      </div>
    </article>
  );
}
