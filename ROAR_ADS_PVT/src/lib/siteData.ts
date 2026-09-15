export interface HeroImage {
  id: string;
  src: string;
  alt: string;
}

export interface ServiceStep {
  title: string;
  description: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  steps: ServiceStep[];
}

export interface ProcessItem {
  id: string;
  stage: string;
  title: string;
  description: string;
}

export interface VideoItem {
  id: string;
  title: string;
  url: string;
}

export interface PortfolioCategory {
  id: string;
  title: string;
  videos: VideoItem[];
}

export interface GalleryImage {
  id: string;
  src: string;
  title: string;
}

export interface City {
  id: string;
  code: string;
  name: string;
  label: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface SubmissionAck {
  id: string;
  message: string;
  created_at: string;
}

export interface SiteContent {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_images: HeroImage[];
  story_title: string;
  story_body: string;
  services: ServiceItem[];
  portfolio: PortfolioCategory[];
  gallery: GalleryImage[];
  process: ProcessItem[];
  why_points: string[];
  cities: City[];
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  social_links: SocialLink[];
}

const id = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const video = (title: string, url: string): VideoItem => ({ id: `${id(title)}-${url.slice(-6)}`, title, url });

export const DEFAULT_SITE_CONTENT: SiteContent = {
  id: "default",
  hero_title: "The Engine for Cinematic Scale.",
  hero_subtitle: "ROAR is a premium visual production and ad agency engineering high-retention commercial assets. We turn physical spaces, manufacturing scale, and brand narratives into permanent digital authority.",
  hero_images: [
    { id: "hero-1", src: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=90&w=2000", alt: "Film projector beam cutting through a dark studio" },
    { id: "hero-2", src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=90&w=2000", alt: "Cinema camera lenses on a dark set" },
    { id: "hero-3", src: "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?auto=format&fit=crop&q=90&w=2000", alt: "Crew filming a talent on a lit studio stage" },
  ],
  story_title: "Our Story",
  story_body: "ROAR emerged as a collective of filmmakers obsessed with spatial geometry, industrial motion, and brand narrative. Seven years later, we operate across a multi-city network, deploying advanced cinema tools and rigorous strategy to build visual assets that command attention. We don't just capture scenes; we architect commercial authority.",
  services: [
    { id: "ad-films", title: "Ad Films", tagline: "Cinematic Campaigns", description: "Cinematic ad films designed for theatre or television impact that connect with audiences on a visceral level.", steps: [
      { title: "Discovery", description: "Brand analysis, audience research, competitive benchmarking" },
      { title: "Pre-Production", description: "Script writing, storyboarding, location scouting, casting" },
      { title: "Production", description: "Professional shoots with industry-grade gear and talent" },
      { title: "Post & Launch", description: "Edit, color grade, sound design, distribution strategy" },
    ] },
    { id: "social-media-promos", title: "Social Media Promos", tagline: "Digital Storytelling", description: "Visually treated promos optimized for high customer attraction across all digital platforms.", steps: [
      { title: "Strategy", description: "Platform-first content strategy tailored to your audience" },
      { title: "Content Design", description: "Short-form vertical and horizontal video production" },
      { title: "Optimization", description: "A/B testing, analytics review, iterative improvement" },
    ] },
    { id: "documentaries", title: "Documentaries", tagline: "Deeper Stories", description: "Detailed documentary films for NGOs, organizations, and brands that want to tell deeper stories.", steps: [
      { title: "Research", description: "Deep subject research, interviews, narrative arc development" },
      { title: "Field Production", description: "On-location shoots, verité coverage, expert interviews" },
      { title: "Post & Distribution", description: "Story editing, festival submission, digital premiere" },
    ] },
    { id: "corporate-videos", title: "Corporate Videos", tagline: "Company Identity", description: "Powerful corporate storytelling that elevates your brand, executive presence, and company identity.", steps: [
      { title: "Corporate Storytelling", description: "Narrative-driven content that humanizes your brand for stakeholders" },
      { title: "Executive Branding", description: "Leadership profiles, keynote films, thought leadership videos" },
      { title: "Company Showcase", description: "Business promotional films and investor-facing productions" },
    ] },
    { id: "tv-commercials", title: "TV Commercials", tagline: "Made for Broadcast", description: "Broadcast-ready television advertisements crafted for maximum impact and audience recall.", steps: [
      { title: "Television Ads", description: "High-production value 30/60 second commercial productions" },
      { title: "Broadcast Campaigns", description: "Multi-spot campaigns for national and regional channels" },
      { title: "Branded Commercials", description: "Scripted storytelling that sells and emotionally connects" },
    ] },
    { id: "ai-animated-videos", title: "AI & Animated Videos", tagline: "Beyond the Ordinary", description: "Next-generation AI-powered visuals and animated explainers that push the boundaries of storytelling.", steps: [
      { title: "AI-Generated Visuals", description: "Cutting-edge AI tools combined with human creativity for futuristic media" },
      { title: "Animated Explainers", description: "Motion graphics and animated storytelling that simplifies complex ideas" },
      { title: "AI Storytelling", description: "Synthetically-enhanced productions blending reality and animation" },
    ] },
  ],
  portfolio: [
    { id: "documentaries", title: "Documentaries", videos: [video("Documentary One", "https://youtu.be/CxHZt_h7t24"), video("Documentary Two", "https://youtu.be/Vo18KAGbVxI"), video("Documentary Three", "https://youtu.be/SDGGwHLAZaQ"), video("Documentary Four", "https://youtu.be/8bdCirDaaBI"), video("Documentary Five", "https://youtu.be/twNNpZp2Baw"), video("Documentary Six", "https://youtu.be/bbp98SWNnYg"), video("Documentary Seven", "https://youtu.be/LLRf_VUf3nU"), video("Documentary Eight", "https://youtu.be/RVbO_Tu_L9o")] },
    { id: "ad-films", title: "Ad Films", videos: [video("PetzApp", "https://youtu.be/SBq2ouHX4iI"), video("Brand Launch", "https://youtu.be/LHbcp5ts0j0"), video("Campaign Film", "https://youtu.be/hisHxBnlPHw"), video("Commercial Cut", "https://youtu.be/sfB-PJ05ipk"), video("Product Story", "https://youtu.be/LJEAVG78N2U"), video("Brand Pulse", "https://youtu.be/nfzVG-c9BsI"), video("Visual Resonance", "https://youtu.be/1LSmh6D6QnQ"), video("PetzApp Extended", "https://youtu.be/pv6rW0nucyc")] },
    { id: "social-media-promos", title: "Social Media Promos", videos: [video("Platform Native", "https://youtu.be/SBq2ouHX4iI"), video("Digital Surge", "https://youtu.be/LHbcp5ts0j0"), video("Scroll Stopper", "https://youtu.be/Vo18KAGbVxI")] },
    { id: "corporate-videos", title: "Corporate Videos", videos: [video("Enterprise Profile", "https://youtu.be/XSvdtntAumc"), video("Industrial Story", "https://youtu.be/SvFqlqi0m_0"), video("Manufacturing Walkthrough", "https://youtu.be/3kaGxc2J-bs"), video("Executive Presence", "https://youtu.be/0dHcFbOVwjU")] },
  ],
  gallery: [
    { id: "gallery-1", src: "/stills/dsc05078-1600.jpg", title: "A portrait from the field" },
    { id: "gallery-2", src: "/stills/dscf0845-1600.jpg", title: "Inside the science lab" },
    { id: "gallery-3", src: "/stills/jd_08783-1600.jpg", title: "Out at sea with the crew" },
    { id: "gallery-4", src: "/stills/dscf0861-1600.jpg", title: "Campus assembly, wide frame" },
    { id: "gallery-5", src: "/stills/dscf0929-1600.jpg", title: "Game day on the court" },
    { id: "gallery-6", src: "/stills/dji_0943-1600.jpg", title: "Mangroves from above" },
    { id: "gallery-7", src: "/stills/dsc05091-1600.jpg", title: "Generations in one frame" },
    { id: "gallery-8", src: "/stills/dscf0991-1600.jpg", title: "Backstage before the show" },
    { id: "gallery-9", src: "/stills/dscf1056-1600.jpg", title: "A full house" },
  ],
  process: [
    { id: "stage-1", stage: "Stage I", title: "Discovery & Deep Dive", description: "Brand alignment metrics, target profile mapping, and technical Location Recce to secure absolute spatial clarity." },
    { id: "stage-2", stage: "Stage II", title: "Architectural Pre-Production", description: "Scripting, frame-by-frame storyboarding, and technical gear scheduling." },
    { id: "stage-3", stage: "Stage III", title: "Cinematic Execution", description: "Principal photography utilizing high-end cinema packages, expert crews, and synchronized audio tracking." },
    { id: "stage-4", stage: "Stage IV", title: "Precision Post-Production", description: "Editorial assembly, high-fidelity color grading, sound architecture, and master distribution encoding." },
  ],
  why_points: ["Great talents with deep field experience", "Visual ideas for a hyper-competitive era", "Extensive knowledge & greed to learn", "National and International scope", "Experts who deliver on time", "Value for money, always"],
  cities: [
    { id: "bangalore", code: "01", name: "Bangalore", label: "BLR — The Silicon Hub" },
    { id: "chennai", code: "02", name: "Chennai", label: "MAA — Media Hub" },
    { id: "kochi", code: "03", name: "Kochi", label: "COK — Production Base" },
    { id: "dubai", code: "04", name: "Dubai", label: "DXB — Global Terminal" },
    { id: "abu-dhabi", code: "05", name: "Abu Dhabi", label: "AUH — Capital Network" },
    { id: "riyadh", code: "06", name: "Riyadh", label: "RUH — Gulf Operations" },
    { id: "jeddah", code: "07", name: "Jeddah", label: "JED — Red Sea Hub" },
  ],
  contact_email: "hello@roarads.in",
  contact_phone: "+91 93616 61636",
  contact_address: "Bangalore | Chennai | Kochi | Dubai",
  social_links: [
    { id: "instagram", platform: "Instagram", url: "https://www.instagram.com/roar.ads" },
    { id: "linkedin", platform: "LinkedIn", url: "https://www.linkedin.com/company/roar-ads/" },
  ],
};

export const getYouTubeId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{11})/);
  return match?.[1] ?? "";
};

// Only transform the original image provider's URLs. Owner uploads and custom URLs stay untouched.
export const imageAtWidth = (src: string, width: number) => {
  // Local files may not have resized siblings; always keep their exact saved path.
  if (!src.startsWith("https://images.unsplash.com/")) return src;
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", "90");
  return url.toString();
};

export const imageSrcSet = (src: string) => src.startsWith("https://images.unsplash.com/")
  ? [640, 960, 1440, 1920, 2560].map((width) => `${imageAtWidth(src, width)} ${width}w`).join(", ")
  : undefined;