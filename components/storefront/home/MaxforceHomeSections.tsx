import Link from "next/link";
import {
  ArrowRight, BookOpen, BriefcaseBusiness, Check, Download, GraduationCap,
  HeartPulse, LayoutTemplate, MonitorSmartphone, ShoppingBag, Sparkles, Utensils,
} from "lucide-react";

const benefits = [
  { icon: BookOpen, title: "Premium eBooks & Guides", text: "Thoughtfully created guides with practical knowledge and ideas you can put to work." },
  { icon: LayoutTemplate, title: "Ready-to-Use Templates", text: "Professional templates, planners and checklists that are simple to customize." },
  { icon: GraduationCap, title: "Learn at Your Own Pace", text: "Clear, accessible resources you can revisit whenever it works for you." },
  { icon: Sparkles, title: "Tools for Everyday Success", text: "Digital resources that help you stay organized, work smarter and keep growing." },
];

const industries = [
  { slug: "e-commerce", name: "E-commerce", text: "Sell products globally and grow revenue with scalable commerce experiences.", image: "/brand/industry-ecommerce.jpg", icon: ShoppingBag },
  { slug: "education", name: "Education", text: "Digital learning experiences that empower educators and learners.", image: "/brand/industry-education.jpg", icon: GraduationCap },
  { slug: "healthcare-industry-solutions", name: "Healthcare", text: "Secure, scalable technology built around modern healthcare needs.", image: "/brand/industry-healthcare.jpg", icon: HeartPulse },
  { slug: "food-beverage", name: "Food & Beverage", text: "Customer-friendly digital products for ambitious food businesses.", image: "/brand/industry-food.jpg", icon: Utensils },
];

const packages = [
  { name: "Shopify Development", strap: "E-commerce solutions that sell", price: "10,999", features: ["Custom store design", "Theme customization", "App integration", "Payment setup", "Speed optimization", "Ongoing support"] },
  { name: "WordPress Development", strap: "Powerful websites, easy to manage", price: "14,999", featured: true, features: ["Custom website design", "Theme customization", "Plugin integration", "SEO optimization", "Security & backup", "Website maintenance"] },
  { name: "Custom Development", strap: "Tailored solutions for unique needs", price: "24,999", features: ["Custom web applications", "Frontend development", "Backend development", "API development", "Database integration", "Maintenance & support"] },
];

const testimonials = [
  { quote: "The eBook was easy to understand, practical, and gave me ideas I could immediately put into action.", name: "Priya Sharma", role: "Digital product customer" },
  { quote: "The templates have saved me so much time. I can customize them and get things done much faster.", name: "Aditi Verma", role: "Freelancer & creator" },
  { quote: "The resources are simple and well organized. They have made it much easier to stay focused on my goals.", name: "Rohit Mehta", role: "Entrepreneur" },
];

const posts = [
  { slug: "built-just-for-you", title: "10 Must-Have Digital Resources to Boost Your Productivity", text: "Practical resources that improve your workflow and help turn ideas into action." },
  { slug: "future-proofing-your-business", title: "Why eBooks Are a Smart Way to Learn New Skills", text: "Flexible, focused learning you can fit around work and everyday life." },
  { slug: "stop-juggling-vendors", title: "How Templates Can Save You Hours Every Week", text: "Start from a reliable framework instead of rebuilding routine work every time." },
];

const faqs = [
  ["What digital products do you offer?", "We offer practical online courses, eBooks, templates, guides and downloadable learning resources."],
  ["How do I access a purchase?", "After successful payment, access instructions appear in your account and are also sent to your email address."],
  ["Are the products available across India?", "Yes. Digital resources can be purchased and accessed from anywhere in India."],
  ["Can I download eBooks and templates?", "Eligible resources can be downloaded securely after payment from your account or access email."],
  ["Which payment methods are supported?", "Razorpay supports UPI, debit cards, credit cards, net banking and other available methods."],
  ["Can I request a refund?", "Digital purchases are governed by our refund policy because access may be granted immediately after payment."],
];

export function HeroBanner() {
  return <section className="maxforce-hero" aria-labelledby="maxforce-hero-title">
    <h1 id="maxforce-hero-title" className="sr-only">Learn new skills. Build your future. Grow with digital knowledge.</h1>
    <img src="/brand/maxforce-hero.webp" alt="Learn new skills, build your future and grow with knowledge" width={1536} height={639} fetchPriority="high" />
    <Link href="/shop?category=courses" className="maxforce-hero-cta">Explore courses <ArrowRight size={18} /></Link>
  </section>;
}

export function BenefitsSection() {
  return <section className="mf-section mf-benefits"><div className="mf-benefit-heading"><div className="mf-eyebrow">Why Maxforce IT Solution?</div><h2>Everything You Need to Learn, Create &amp; Grow</h2><p className="mf-lead">Practical digital products designed to help you save time, gain knowledge and turn ideas into action.</p></div><div className="mf-benefit-grid">{benefits.map(({ icon: Icon, title, text }, index) => <article key={title}><div className="mf-benefit-top"><span className="mf-icon"><Icon size={25} /></span><span className="mf-benefit-number">0{index + 1}</span></div><div className="mf-benefit-copy"><h3>{title}</h3><p>{text}</p></div></article>)}</div></section>;
}

export function IndustriesSection() {
  return <section className="mf-band"><div className="mf-section"><div className="mf-eyebrow">Industries</div><h2>End-to-end expertise under one roof</h2><p className="mf-lead">From strategy to execution, we cover the full stack so you do not have to juggle multiple vendors.</p><div className="mf-industry-grid">{industries.map(({ slug, name, text, image, icon: Icon }) => <Link href={`/industries/${slug}`} key={slug} className="mf-industry-card"><img src={image} alt="" width={640} height={420} loading="lazy" /><span className="mf-industry-icon"><Icon size={21} /></span><div><h3>{name}</h3><p>{text}</p><span>Read more <ArrowRight size={15} /></span></div></Link>)}</div></div></section>;
}

export function PartnersSection() {
  return <section className="mf-section mf-partners"><div className="mf-eyebrow">Our Partners</div><h2>Built on trusted technology</h2><div className="mf-partner-row">{["Razorpay", "MongoDB", "Cloudinary", "Next.js", "Vercel", "Google Cloud"].map(name => <span key={name}>{name}</span>)}</div></section>;
}

export function PackagesSection() {
  return <section className="mf-section"><div className="mf-eyebrow">Web Development Packages</div><h2>Launch a website built to grow</h2><p className="mf-lead">Responsive, high-converting websites tailored to your business.</p><div className="mf-package-grid">{packages.map(pkg => <article key={pkg.name} className={pkg.featured ? "featured" : ""}>{pkg.featured && <span className="mf-popular">Most popular</span>}<MonitorSmartphone size={28} /><h3>{pkg.name}</h3><p>{pkg.strap}</p><ul>{pkg.features.map(f => <li key={f}><Check size={15} />{f}</li>)}</ul><div className="mf-price"><small>Starting from</small><strong>₹{pkg.price}</strong></div><Link href={`/contact-us?service=${encodeURIComponent(pkg.name)}`}>Request a quote</Link></article>)}</div></section>;
}

export function TestimonialsSection() {
  return <section className="mf-band"><div className="mf-section"><div className="mf-eyebrow">Testimonials</div><h2>Loved by learners, creators &amp; professionals</h2><div className="mf-testimonial-grid">{testimonials.map(item => <figure key={item.name}><div className="mf-stars">★★★★★</div><blockquote>“{item.quote}”</blockquote><figcaption><strong>{item.name}</strong><span>{item.role}</span></figcaption></figure>)}</div></div></section>;
}

export function BlogPreviewSection() {
  return <section className="mf-section"><div className="mf-section-head"><div><div className="mf-eyebrow">Insights</div><h2>Our Blogs</h2></div><Link href="/blog">View all <ArrowRight size={16} /></Link></div><div className="mf-blog-grid">{posts.map(post => <article key={post.slug}><span>Blog</span><h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3><p>{post.text}</p><Link href={`/blog/${post.slug}`}>Read more <ArrowRight size={15} /></Link></article>)}</div></section>;
}

export function FaqSection() {
  return <section className="mf-section mf-faq"><div><div className="mf-eyebrow">FAQ</div><h2>Frequently asked questions</h2><p>Everything you need to know before choosing a course or digital resource.</p><Download size={42} /></div><div>{faqs.map(([q, a]) => <details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section>;
}

export function NewsletterSection() {
  return <section className="mf-newsletter"><div><div className="mf-eyebrow">Stay inspired</div><h2>Useful ideas, resources and offers in your inbox</h2></div><form action="/api/newsletter" method="post"><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" name="email" type="email" placeholder="Enter your email address" required /><button type="submit">Subscribe <ArrowRight size={16} /></button></form></section>;
}

export function ServicesTeaser() {
  return <section className="mf-section mf-services-teaser"><div><div className="mf-eyebrow">Your 360° digital partner</div><h2>Technology and growth expertise for ambitious businesses</h2></div><Link href="/services">Explore our services <BriefcaseBusiness size={18} /></Link></section>;
}
