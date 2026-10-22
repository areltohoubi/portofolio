import PersonalAbout from "@/components/Section/About/About";
import StackSection from "@/components/Section/About/StackSection";
import { ContactSection } from "@/components/Section/Contact/ContactSection";
import FeaturedProjects from "@/components/Section/FeaturedProjects";
import Hero from "@/components/Section/Hero/Hero";
import ProjectsSection from "@/components/Section/Projects/Projectssection";

export default function Home() {
  return (
    <>
      <Hero />
      <PersonalAbout />
      <ProjectsSection />
      <StackSection />
      <ContactSection />
    </>
  );
}
