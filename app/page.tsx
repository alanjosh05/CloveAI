import { Closing } from "@/components/site/closing";
import { Datasets } from "@/components/site/datasets";
import { Docs } from "@/components/site/docs";
import { Hero } from "@/components/site/hero";
import { ModelIndex } from "@/components/site/model-index";
import { Models } from "@/components/site/models";
import { Nav } from "@/components/site/nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Docs />
        <Models />
        <ModelIndex />
        <Datasets />
      </main>
      <Closing />
    </>
  );
}
