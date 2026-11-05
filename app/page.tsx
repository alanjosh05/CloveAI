import { Building } from "@/components/site/building";
import { Closing } from "@/components/site/closing";
import { Datasets } from "@/components/site/datasets";
import { Docs } from "@/components/site/docs";
import { Experience } from "@/components/site/experience";
import { Hero } from "@/components/site/hero";
import { ModelIndex } from "@/components/site/model-index";
import { Nav } from "@/components/site/nav";
import { Projects } from "@/components/site/projects";
import { Education, Skills } from "@/components/site/skills";
import { StructuredData } from "@/components/site/structured-data";

export default function Home() {
  return (
    <>
      <StructuredData />
      <Nav />
      <main>
        <Hero />
        <Building />
        <Docs />
        <Projects />
        <ModelIndex />
        <Datasets />
        <Skills />
        <Experience />
        <Education />
      </main>
      <Closing />
    </>
  );
}
