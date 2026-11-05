import { EDUCATION, EMAIL, GITHUB, HF_ORG, LINKEDIN, SITE_URL } from "@/lib/catalog";

const person = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: "Alan Joshua",
  alternateName: "Alan Joshua A",
  url: SITE_URL,
  image: `${SITE_URL}/hero1.png`,
  email: `mailto:${EMAIL}`,
  jobTitle: "AI Engineer",
  description: "AI engineer in Coimbatore, India, who builds and evaluates AI systems and created the clov-embed-v2 embedding model.",
  address: { "@type": "PostalAddress", addressLocality: "Coimbatore", addressRegion: "Tamil Nadu", addressCountry: "IN" },
  alumniOf: EDUCATION.map((e) => ({ "@type": "EducationalOrganization", name: e.school })),
  knowsAbout: [
    "Generative AI",
    "LLM fine-tuning",
    "Text embeddings",
    "RAG",
    "Voice agents",
    "Document extraction",
    "PyTorch",
    "TensorFlow",
    "ONNX",
    "Next.js",
    "Flutter",
    "AWS",
    "GCP",
  ],
  sameAs: [LINKEDIN, GITHUB, HF_ORG],
};

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    person,
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: "Alan Joshua", inLanguage: "en-IN", publisher: { "@id": person["@id"] } },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profile`,
      url: SITE_URL,
      name: "Alan Joshua | AI Engineer in Coimbatore, India",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: { "@id": person["@id"] },
    },
  ],
};

/** Tells search engines who this page is about, and links it to the same person's other profiles. */
export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
