import { notFound } from "next/navigation";
import { getSiteContent } from "@/lib/site-content";

export async function PolicyPage({ slug }: { slug: string }) {
  const { policies } = await getSiteContent();
  const policy = policies.find((item: any) => item.slug === slug);
  if (!policy) notFound();
  const lines = String(policy.body).split("\n").map((line) => line.trim());
  const updatedAt = lines[0]?.startsWith("Last updated:") ? lines.shift() : undefined;
  const sections: Array<{ heading: string; paragraphs: string[] }> = [];
  let paragraph: string[] = [];
  const flushParagraph = () => {
    if (!paragraph.length) return;
    if (!sections.length) sections.push({ heading: "Overview", paragraphs: [] });
    sections[sections.length - 1].paragraphs.push(paragraph.join(" "));
    paragraph = [];
  };
  for (const line of lines) {
    if (line.startsWith("## ")) {
      flushParagraph();
      sections.push({ heading: line.slice(3), paragraphs: [] });
    } else if (!line) flushParagraph();
    else paragraph.push(line);
  }
  flushParagraph();
  const anchor = (heading: string) => heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return <main className="policy-page mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
    <header className="policy-header rounded-2xl px-5 py-8 sm:rounded-3xl sm:px-10 sm:py-12">
      <p className="policy-eyebrow">MAXFORCE DIGITAL · LEGAL</p>
      <h1>{policy.title}</h1>
      {updatedAt && <p className="policy-updated">{updatedAt}</p>}
    </header>

    <div className="mt-8 grid min-w-0 gap-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:items-start">
      <nav aria-label={`${policy.title} sections`} className="policy-toc">
        <p>On this page</p>
        <ol>{sections.map((section) => <li key={section.heading}><a href={`#${anchor(section.heading)}`}>{section.heading}</a></li>)}</ol>
      </nav>

      <article className="policy-document">
        {sections.map((section) => <section key={section.heading} aria-labelledby={anchor(section.heading)}>
          <h2 id={anchor(section.heading)}>{section.heading}</h2>
          {section.paragraphs.map((paragraph, index) => <p key={`${section.heading}-${index}`}>{paragraph}</p>)}
        </section>)}
      </article>
    </div>
    <p className="policy-note">These terms are provided for transparency and should be reviewed whenever our products, services or legal obligations change.</p>
  </main>;
}
