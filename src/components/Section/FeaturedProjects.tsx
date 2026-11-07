// "use client";
// import { motion } from "framer-motion";
// import { FiGithub, FiArrowRight } from "react-icons/fi";
// import Image from "next/image";
// import { LinkPreview } from "../ui/link-preview";
// import Link from "next/dist/client/link";
// import { useScopedI18n } from "../../../locales/client";
// import { useTranslatedProjects } from "@/hook/useTranslatedProjects";

// export default function FeaturedProjects() {
//   const t = useScopedI18n("projects")
//   const projects = useTranslatedProjects();

//   return (
//     <section id="projets" className="py-24 bg-white dark:bg-black transition-colors duration-500">
//       <div className="container mx-auto px-6">
        
//         <div className="mb-24">
//           <motion.h2 
//             initial={{ opacity: 0, y: 10 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="text-[10px] font-bold tracking-[0.4em] text-neutral-400 uppercase mb-6"
//           >
//             {t('title')}
//           </motion.h2>
//           <motion.p 
//             initial={{ opacity: 0, y: 10 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             viewport={{ once: true }}
//             className="text-3xl md:text-5xl font-light text-neutral-900 dark:text-neutral-100 max-w-2xl leading-tight"
//           >
//             {t('header.line1')} <span className="italic">{t('header.clarity')}</span> {t('header.and')} <span className="italic">{t('header.precision')}</span>.
//           </motion.p>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
//           {projects.map((project, index) => (
//             <motion.div
//               key={project.id}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               viewport={{ once: true }}
//               className="group flex flex-col"
//             >
//               <LinkPreview url={project.preview}>
//                 <div className="relative aspect-[16/11] overflow-hidden bg-neutral-100 dark:bg-neutral-900 rounded-sm mb-8">
//                   <Image
//                     src={project.image}
//                     alt={project.title}
//                     fill
//                     className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-in-out scale-[1.01] group-hover:scale-105"
//                   />
//                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
//                 </div>
//               </LinkPreview>

//               {/* Contenu */}
//               <div className="flex flex-col flex-grow space-y-4">
//                 <div className="flex justify-between items-end border-b border-neutral-100 dark:border-neutral-900 pb-4">
//                   <div className="space-y-1">
//                     <h3 className="text-xl font-light tracking-tight text-neutral-900 dark:text-neutral-100">
//                       {project.title}
//                     </h3>
//                     <div className="flex flex-wrap gap-x-3">
//                       {project.tech.slice(0, 3).map((t) => (
//                         <span key={t} className="text-[9px] uppercase tracking-widest text-neutral-400">
//                           {t}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
                  
//                   <div className="flex gap-4 pb-1">
//                     <a href={project.github} target="_blank" className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
//                       <FiGithub size={18} />
//                     </a>
//                   </div>
//                 </div>
                
//                 <p className="text-sm text-neutral-500 dark:text-neutral-500 font-light leading-relaxed line-clamp-2 pt-2">
//                   {project.description}
//                 </p>

//                 <div className="pt-4">
//                   <Link 
//                     href={`/projects/${project.id}`} 
//                     className="inline-flex items-center gap-3 group/link"
//                   >
//                     <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-black dark:text-white">
//                       {t('caseStudy')}
//                     </span>
//                     <div className="relative overflow-hidden">
//                        <FiArrowRight className="transform -translate-x-2 opacity-0 group-hover/link:translate-x-0 group-hover/link:opacity-100 transition-all duration-300" />
//                        <FiArrowRight className="absolute top-0 left-0 transform group-hover/link:translate-x-4 group-hover/link:opacity-0 transition-all duration-300 text-neutral-400" />
//                     </div>
//                   </Link>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }