import SiteContent from "@/models/SiteContent";
import { connectDB } from "@/lib/db";

export const DEFAULT_SITE_CONTENT = {
  about: {
    title: "The Success Story of Maxforce Digital",
    intro: "Maxforce Services Private Limited was created with one clear objective: to provide integrated digital solutions that empower entrepreneurs, businesses and learners to build, automate and scale. From strategy and design to development, marketing and practical digital education, our in-house team brings every part of the digital journey together under one roof.",
    mission: "To make dependable technology and digital expertise accessible to growing businesses. We combine clear strategy, thoughtful design and maintainable engineering to create solutions that improve operations, strengthen customer experiences and produce measurable value.",
    vision: "To become a trusted 360° digital partner for organizations in India and around the world—known for integrity, innovation, transparent communication and future-ready work that continues to perform as our clients grow.",
    stats: [
      { value: "10+", label: "Years of experience" },
      { value: "360°", label: "Integrated digital expertise" },
      { value: "Noida", label: "Headquarters" },
    ],
    values: [
      { title: "Integrated full-stack expertise", description: "Technology, design, marketing and automation work together as one coordinated delivery team." },
      { title: "Future-ready architecture", description: "We build maintainable foundations that can evolve without expensive, disruptive rebuilds." },
      { title: "Transparent communication", description: "Clear milestones, realistic timelines and visible progress keep clients involved throughout delivery." },
      { title: "Practical business outcomes", description: "Every decision is connected to a real objective—better efficiency, stronger engagement or sustainable growth." },
    ],
    team: [
      { name: "Jagdeep Singh", role: "Managing Director", bio: "Brings more than a decade of IT and digital-solutions experience to Maxforce, connecting business strategy with scalable technical execution.", image: "" },
      { name: "Neeraj Prajapati", role: "Chief Operating Officer", bio: "Guides day-to-day operations, delivery standards and cross-functional coordination so every engagement stays focused and dependable.", image: "" },
      { name: "Pushkar Verma", role: "Chief Marketing Officer", bio: "Leads brand, growth and market strategy with a focus on measurable campaigns and clear customer communication.", image: "" },
      { name: "Deepak Singh", role: "CFO, HR & Admin", bio: "Oversees finance, people operations and administration.", image: "" },
      { name: "Akshat Singh", role: "Head – Digital Marketing", bio: "Drives performance-focused digital marketing programs.", image: "" },
      { name: "Akanksha Arya", role: "Senior Designer", bio: "Creates clear, effective digital experiences and visual systems.", image: "" },
      { name: "Jyoti Chaudhary", role: "IT Project Manager", bio: "Coordinates product delivery across teams and stakeholders.", image: "" },
      { name: "Anish Yadav", role: "Developer", bio: "Builds and maintains modern web products.", image: "" },
      { name: "Sameer Bose", role: "Business Head – Product Mix", bio: "Develops practical product opportunities for customers and learners.", image: "" },
    ],
  },
  contact: {
    title: "Let's build something valuable",
    intro: "Planning a website, application, digital campaign or custom software project? Tell us what you want to achieve, your preferred timeline and the challenges you need to solve. Our team will review your enquiry and recommend a practical next step. Office hours: Monday to Saturday, 10:00 AM–7:00 PM IST.",
    email: "info@maxforcedigital.com", phone: "0120 318 9653", address: "2nd Floor, E-29, Sector 63, Noida, Gautam Buddha Nagar, Uttar Pradesh 201301, India", mapUrl: "",
  },
  services: [
    { slug: "mobile-apps-ios-android", title: "Mobile Apps — iOS & Android", summary: "Reliable mobile products designed around real customer journeys and business goals.", body: `We turn product ideas into intuitive mobile experiences for customers, teams and partners.

Our process covers discovery, interface design, development, API integration, testing and release support. We can deliver platform-specific applications or a shared cross-platform solution when speed and maintainability are the priority.

Every build is planned around security, performance, accessibility and a codebase your team can continue to evolve.`, features: ["iOS and Android applications", "React Native and cross-platform development", "UI/UX design and prototyping", "Backend and third-party API integration", "Testing, release and maintenance support"], isActive: true },
    { slug: "technology-consulting", title: "Technology Consulting", summary: "Clear technical direction for complex product, platform and transformation decisions.", body: `Good technology decisions begin with a clear understanding of the business problem.

We assess your current systems, workflows and delivery constraints before recommending platforms, architecture or implementation priorities. The result is a realistic roadmap that balances immediate needs with long-term maintainability.

Our consulting can support a new product, modernization initiative, vendor evaluation or a focused review of an existing application.`, features: ["Technology strategy and roadmaps", "Architecture and platform guidance", "Product discovery and scope definition", "Technical audits and modernization planning", "Vendor and solution evaluation"], isActive: true },
    { slug: "websites-web-apps", title: "Websites & Web Apps", summary: "Fast, accessible websites and applications built around your customers and goals.", body: `Your website should do more than look polished—it should communicate clearly, load quickly and guide visitors toward action.

We design and develop corporate websites, e-commerce storefronts, customer portals and custom web applications. Each project receives responsive layouts, SEO-ready foundations, analytics integration and a maintainable content experience.

From an initial launch to ongoing optimization, our team can support design, engineering, integrations, migration and performance improvements.`, features: ["Corporate and marketing websites", "E-commerce storefronts", "Custom web applications and portals", "Responsive and accessible UI", "SEO, analytics and performance optimization", "Maintenance and continuous improvement"], isActive: true },
    { slug: "domain-web-hosting", title: "Domain & Web Hosting", summary: "Dependable hosting foundations, secure configuration and straightforward support.", body: `A reliable digital presence starts with well-managed infrastructure.

We help businesses choose and configure domains, DNS, hosting, SSL certificates, email records and deployment environments. We also establish backups, monitoring and recovery practices appropriate to the size and importance of the website.

Our team can manage a new launch or help stabilize an existing setup with minimal disruption.`, features: ["Domain registration and DNS configuration", "Cloud and managed hosting setup", "SSL certificates and security configuration", "Business email DNS records", "Backups, monitoring and recovery support"], isActive: true },
    { slug: "digital-marketing", title: "Digital Marketing", summary: "Focused campaigns that turn attention into qualified enquiries, sales and measurable growth.", body: `Digital marketing works best when every channel supports the same commercial objective.

We plan campaigns around your audience, offer and customer journey, then combine search visibility, content, social media and paid promotion where they can make a measurable difference.

Reporting focuses on meaningful outcomes—not vanity metrics—so priorities can be refined as performance data develops.`, features: ["Digital strategy and campaign planning", "Search engine optimization", "Social media marketing", "Paid search and performance campaigns", "Content planning", "Analytics and performance reporting"], isActive: true },
    { slug: "email-marketing-automation", title: "Email Marketing & Automation", summary: "Lifecycle communication that saves time, improves follow-up and builds stronger relationships.", body: `Timely, relevant communication can turn a first enquiry into a long-term customer relationship.

We design email journeys for lead nurturing, onboarding, abandoned carts, customer education, repeat purchases and re-engagement. Segmentation and automation help each message reach the right audience without creating repetitive manual work.

Every workflow includes clear measurement so subject lines, content and timing can improve over time.`, features: ["Customer journey and lifecycle mapping", "Newsletter and campaign setup", "Lead nurturing and onboarding flows", "E-commerce and cart automation", "Audience segmentation", "Testing and performance reporting"], isActive: true },
    { slug: "custom-software-development", title: "Custom Software Development", summary: "Purpose-built software for workflows that off-the-shelf tools cannot solve.", body: `When generic software creates workarounds instead of efficiency, a focused custom solution can simplify the way your organization operates.

We design and build internal tools, customer platforms, workflow systems, APIs and integrations around your actual processes. Discovery begins with users and operating requirements before architecture and delivery are planned.

Our approach emphasizes secure access, maintainable code, dependable data and a roadmap that supports future features.`, features: ["Custom business applications", "Internal portals and workflow systems", "Backend services and APIs", "Database design and integration", "Third-party system integration", "Maintenance, monitoring and support"], isActive: true },
  ],
  industries: [
    { slug: "e-commerce", title: "E-commerce", summary: "Conversion-focused storefronts, connected operations and smoother buying experiences.", body: `Modern commerce depends on much more than a product catalogue. Customers expect fast discovery, trusted payments, clear communication and a consistent experience across devices.

Maxforce Digital helps commerce businesses build and improve storefronts, checkout journeys, customer accounts and the integrations behind fulfilment. We can support a new launch, migration or focused optimization of an existing store.

Our work connects customer experience with day-to-day operations so the solution remains practical as orders, products and channels grow.`, features: ["Custom and platform-based storefronts", "Product catalogue and search experiences", "Razorpay and payment integrations", "Order, inventory and fulfilment workflows", "Marketing automation and analytics", "Performance and conversion optimization"], isActive: true },
    { slug: "education", title: "Education", summary: "Accessible digital learning experiences for educators, training businesses and learners.", body: `Education platforms must make it easy to discover, purchase and engage with useful learning material.

We help educators and training organizations present courses, eBooks and resources clearly, automate enrolment and communication, and create dependable learner experiences across devices.

Solutions can begin with secure digital delivery and grow into richer learning workflows as the audience and catalogue expand.`, features: ["Course and digital-resource storefronts", "Secure learner access and downloads", "Student onboarding and communication", "Content and programme management", "Payment and enrolment automation", "Analytics and engagement insights"], isActive: true },
    { slug: "food-beverage", title: "Food & Beverage", summary: "Digital journeys that make discovery, ordering, repeat business and loyalty easier.", body: `Food and beverage customers make quick decisions, often from a mobile device. Clear menus, dependable ordering and timely communication directly influence whether they complete a purchase and return.

We build customer-facing websites, ordering experiences, campaign systems and practical integrations for restaurants, packaged-food brands and growing hospitality businesses.

The result is a digital presence that supports both customer convenience and operational efficiency.`, features: ["Mobile-first websites and digital menus", "Ordering and payment experiences", "Location and enquiry journeys", "Offers, loyalty and customer engagement", "Social and performance marketing", "Operational integrations and reporting"], isActive: true },
    { slug: "healthcare-industry-solutions", title: "Healthcare", summary: "Secure, accessible and scalable digital solutions for modern healthcare teams.", body: `Healthcare technology must earn trust from both patients and professionals.

We design clear websites, portals and workflow tools with privacy, accessibility and operational reliability in mind. Discovery focuses on the people using the service, the sensitivity of the information involved and the controls required by the organization.

We do not replace clinical or regulatory expertise; instead, we work with your stakeholders to translate approved requirements into dependable digital experiences.`, features: ["Accessible healthcare websites", "Patient and staff workflow interfaces", "Appointment and enquiry journeys", "Role-based access and secure integrations", "Operational dashboards", "Maintenance and monitoring"], isActive: true },
  ],
  policies: [
    { slug: "privacy-policy", title: "Privacy Policy", body: `Last updated: 22 September 2026

## 1. Introduction
Maxforce Services Private Limited ("Maxforce Digital", "we", "our" or "us") respects your privacy. This policy explains what information we collect through maxforcedigital.com, why we use it, how we protect it and the choices available to you.

## 2. Information we collect
We may collect information you provide directly, including your name, email address, telephone number, company, billing or delivery address, account details, enquiry content and order information. When you use the website, limited technical information such as IP address, browser type, device information, referring page and website activity may also be recorded.

Payment card or banking information is processed by our payment provider. We do not intentionally store complete payment-card details on our servers.

## 3. How we use information
We use personal information to create and manage accounts; process payments and orders; provide digital products or requested services; respond to enquiries; send transactional messages; improve website security and performance; prevent fraud or misuse; meet legal obligations; and send marketing communication where permitted. You can unsubscribe from promotional email at any time.

## 4. Cookies and analytics
We may use essential cookies for authentication, shopping-cart functions and security. Analytics or preference technologies may be used to understand website performance and improve the experience. You can manage cookies through your browser, although disabling essential cookies may affect website functions.

## 5. Sharing of information
We share information only where reasonably necessary with service providers that support hosting, databases, file delivery, analytics, communication and payment processing; professional advisers; government or regulatory authorities where legally required; or a successor involved in a lawful business reorganization. We do not sell personal information.

## 6. Data retention and security
We retain information only for as long as needed for the purpose for which it was collected, including accounting, dispute-resolution and legal requirements. We use reasonable administrative and technical safeguards, but no online system can guarantee absolute security.

## 7. Your choices and rights
Subject to applicable law, you may ask to access, correct or delete your personal information, withdraw consent, object to certain processing or unsubscribe from marketing. We may need to verify your identity before completing a request, and some records may be retained where required by law.

## 8. Third-party links and children's privacy
External websites and services have their own privacy practices, and we are not responsible for them. Our services are not intentionally directed to children under 18 without involvement from a parent or legal guardian.

## 9. Changes and contact
We may update this policy when our services or legal obligations change. The latest version will appear on this page.

For privacy questions or requests, contact info@maxforcedigital.com or write to Maxforce Services Private Limited, 2nd Floor, E-29, Sector 63, Noida, Uttar Pradesh 201301, India.` },
    { slug: "refund-policy", title: "Refund and Cancellation Policy", body: `Last updated: 22 September 2026

## 1. Overview
This policy applies to purchases made directly through maxforcedigital.com. Because our catalogue includes immediately accessible digital products and separately scoped professional services, refund eligibility depends on what was purchased and whether access or work has begun.

## 2. Digital products
Courses, eBooks, templates, downloads and external-access products are generally non-refundable once the download link, file or course access has been delivered or accessed. If you receive the wrong product, cannot access your purchase, or the supplied file is materially defective, contact us within 7 days of purchase. We will first try to restore access, replace the file or correct the issue. If we cannot do so within a reasonable period, we may issue a refund.

## 3. Duplicate and unauthorized payments
Verified duplicate charges will be refunded to the original payment method. If you believe a payment was unauthorized, notify us promptly and contact your bank or payment provider. We may request information needed to verify the transaction.

## 4. Professional services
Website, application, marketing, consulting and custom-development services follow the proposal, statement of work or service agreement accepted by the client. Unless that agreement says otherwise, completed milestones and work already performed are non-refundable. A client requesting cancellation remains responsible for completed work and approved third-party costs incurred up to the cancellation date.

## 5. How to request a review
Email info@maxforcedigital.com with your name, order number, purchase email, product or service name and a clear description of the issue. Requests missing sufficient transaction information may take longer to review.

## 6. Approved refunds
Approved refunds are initiated to the original payment method. Banks and payment providers control final processing times, which commonly take 5–10 business days after initiation. Original third-party transaction charges may be non-refundable where permitted by law.

Nothing in this policy limits rights that cannot lawfully be excluded under applicable consumer-protection law.` },
    { slug: "shipping-policy", title: "Shipping Policy", body: "Digital products are delivered electronically after successful payment. Any physical-product delivery terms will be displayed during checkout." },
    { slug: "terms-and-conditions", title: "Terms and Conditions", body: `Last updated: 22 September 2026

## 1. Acceptance of these terms
These terms govern your use of maxforcedigital.com and purchases made from Maxforce Services Private Limited. By accessing the website, creating an account or placing an order, you agree to these terms and the policies referenced on this website. If you do not agree, do not use the website.

## 2. Accounts and acceptable use
You must provide accurate information and keep account credentials secure. You are responsible for activity performed through your account. You must not use the website unlawfully; interfere with security or availability; attempt unauthorized access; upload malicious material; scrape the service in a way that causes harm; or misuse another person's information.

## 3. Products, pricing and orders
We aim to describe products and services accurately, but minor differences may occur between previews and delivered digital files. Prices are displayed in Indian rupees unless stated otherwise. We may correct obvious errors, reject fraudulent orders or cancel an order that cannot be fulfilled. If payment has already been captured for a cancelled order, the eligible amount will be returned to the original payment method.

## 4. Digital licences
Unless a product page expressly grants broader rights, a digital product is licensed to the purchaser for personal or internal business use. You may not resell, redistribute, publicly share, sublicense, reproduce for commercial distribution or make access credentials available to another person. Copyright and other intellectual-property rights remain with Maxforce Digital or the identified rights holder.

## 5. Professional services
Custom development, consulting, marketing and related services may be governed by a separate proposal or agreement covering scope, responsibilities, milestones, payment, intellectual property and support. Where that agreement conflicts with these website terms, the signed or accepted service agreement controls for that engagement.

## 6. Payments, delivery and refunds
Payments are processed through approved third-party providers. Digital delivery normally begins after successful payment and account verification. Refunds and cancellations are handled under our Refund and Cancellation Policy.

## 7. Third-party services
The website may use or link to third-party platforms. Their availability and terms are outside our control. We are not responsible for external content, service interruptions or changes made by those providers, except where responsibility cannot legally be excluded.

## 8. Disclaimers and liability
Educational content and general information are provided for learning and informational purposes and do not guarantee employment, revenue or a specific business outcome. To the extent permitted by law, Maxforce Digital is not liable for indirect, incidental or consequential loss arising from use of the website or a digital product. Nothing in these terms excludes liability that cannot lawfully be excluded.

## 9. Governing law and changes
These terms are governed by the laws of India. Subject to applicable consumer law, courts with jurisdiction in Gautam Buddha Nagar, Uttar Pradesh will have jurisdiction over disputes. We may update these terms from time to time; continued use after publication means the updated terms apply from their effective date.

## 10. Contact
Questions about these terms can be sent to info@maxforcedigital.com or Maxforce Services Private Limited, 2nd Floor, E-29, Sector 63, Noida, Uttar Pradesh 201301, India.` },
  ],
};

export async function getSiteContent() {
  await connectDB();
  const stored = await SiteContent.findOne({ singletonKey: "main" }).lean();
  if (!stored) return DEFAULT_SITE_CONTENT;
  return {
    ...DEFAULT_SITE_CONTENT, ...stored,
    about: { ...DEFAULT_SITE_CONTENT.about, ...(stored as any).about },
    contact: { ...DEFAULT_SITE_CONTENT.contact, ...(stored as any).contact },
  };
}
