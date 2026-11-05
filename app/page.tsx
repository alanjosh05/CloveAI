import { Closing } from "@/components/site/closing";
import { Datasets } from "@/components/site/datasets";
import { Docs } from "@/components/site/docs";
import { Experience } from "@/components/site/experience";
import { Hero } from "@/components/site/hero";
import { ModelIndex } from "@/components/site/model-index";
import { Nav } from "@/components/site/nav";
import { Projects } from "@/components/site/projects";
import { Skills } from "@/components/site/skills";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Experience />
        <Docs />
        <Projects />
        <ModelIndex />
        <Datasets />
        <Skills />
      </main>
      <Closing />
    </>
  );
}
