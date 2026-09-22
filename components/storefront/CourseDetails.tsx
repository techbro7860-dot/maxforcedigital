import { Check, Clock3, Download, Infinity, MonitorSmartphone } from "lucide-react";

interface CourseDetailsProps {
  slug: string;
  title: string;
  description: string;
}

interface CourseProfile {
  intro: string;
  learning: string[];
  includes: string[];
  modules: Array<{ title: string; meta?: string }>;
}

const digitalMarketingMega: CourseProfile = {
  intro: "Build practical digital marketing skills across branding, SEO, social media, content, email, paid advertising and AI-assisted workflows.",
  learning: [
    "Understand digital marketing fundamentals and their role in modern business.",
    "Create effective strategies for different audiences and business goals.",
    "Apply on-page and off-page SEO to improve search visibility.",
    "Build content strategies that support measurable marketing objectives.",
    "Use Facebook, Instagram, LinkedIn, YouTube and Pinterest effectively.",
    "Plan email marketing, Google Ads and Meta Ads campaigns.",
    "Develop persuasive copy and video content for digital channels.",
    "Use influencer, affiliate and mobile marketing in a complete campaign.",
  ],
  includes: [
    "116 hours of on-demand learning",
    "Practice test and assignments",
    "200 downloadable resources",
    "Lifetime course access",
    "Access on mobile, tablet and desktop",
  ],
  modules: [
    { title: "Introduction", meta: "3 lessons • 7 min" },
    { title: "Branding", meta: "8 lessons • 1 hr 47 min" },
    { title: "TikTok Marketing", meta: "91 lessons • 7 hr 43 min" },
    { title: "Facebook Marketing (Organic)", meta: "9 lessons • 1 hr 10 min" },
    { title: "Instagram Marketing (Organic)", meta: "18 lessons • 1 hr 19 min" },
    { title: "YouTube Marketing", meta: "35 lessons • 2 hr 56 min" },
    { title: "LinkedIn, Pinterest and Quora Marketing" },
    { title: "Facebook Advertising", meta: "111 lessons • 19 hr 48 min" },
  ],
};

function profileFor(slug: string, title: string, description: string): CourseProfile {
  if (slug === "digital-marketing-mega-course-for-2026") return digitalMarketingMega;

  const topic = title.replace(/\s+(course|masterclass|bootcamp).*$/i, "").trim();
  const intro = description && description !== title
    ? description
    : `Learn ${topic} through a clear, practical and self-paced digital course.`;

  return {
    intro,
    learning: [
      `Understand the essential concepts and terminology of ${topic}.`,
      "Follow a structured workflow from fundamentals to practical application.",
      "Use relevant tools and techniques with confidence.",
      "Apply your knowledge through guided examples and hands-on practice.",
      "Recognize common mistakes and follow reliable best practices.",
      "Build skills you can use in professional and personal projects.",
    ],
    includes: [
      "Self-paced digital course",
      "Practical learning resources",
      "Lifetime course access",
      "One-time payment",
      "Access on mobile, tablet and desktop",
    ],
    modules: [
      { title: "Course introduction" },
      { title: "Core concepts and foundations" },
      { title: "Tools and practical workflow" },
      { title: "Guided examples and exercises" },
      { title: "Real-world applications" },
      { title: "Best practices and next steps" },
    ],
  };
}

export function CourseDetails({ slug, title, description }: CourseDetailsProps) {
  const profile = profileFor(slug, title, description);
  const includeIcons = [Clock3, Download, Infinity, MonitorSmartphone, Check];

  return (
    <section className="mt-12 border-t border-hairline pt-10" aria-labelledby="course-overview-heading">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Course overview</p>
        <h2 id="course-overview-heading" className="mt-2 text-2xl font-bold md:text-3xl">What You&apos;ll Learn</h2>
        <p className="mt-3 text-sm leading-7 text-muted md:text-base">{profile.intro}</p>
      </div>

      <div className="mt-7 grid gap-3 md:grid-cols-2">
        {profile.learning.map((item) => (
          <div key={item} className="flex gap-3 rounded-xl border border-hairline bg-surface p-4">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <p className="text-sm leading-6">{item}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="text-2xl font-bold">This Course Includes</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {profile.includes.map((item, index) => {
              const Icon = includeIcons[index % includeIcons.length];
              return (
                <div key={item} className="flex items-center gap-3 rounded-xl bg-primary/5 px-4 py-3">
                  <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold">Course Content</h2>
          <p className="mt-2 text-sm text-muted">A structured path you can complete at your own pace.</p>
          <div className="mt-5 overflow-hidden rounded-xl border border-hairline bg-surface">
            {profile.modules.map((module, index) => (
              <details key={module.title} className="group border-b border-hairline last:border-b-0" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-sm font-semibold marker:hidden">
                  <span>{index + 1}. {module.title}</span>
                  <span className="shrink-0 text-xs font-normal text-muted">{module.meta || "Self-paced"}</span>
                </summary>
                <p className="border-t border-hairline bg-background/50 px-4 py-3 text-sm leading-6 text-muted">
                  Review the key ideas, follow practical examples and apply what you learn before moving to the next section.
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
