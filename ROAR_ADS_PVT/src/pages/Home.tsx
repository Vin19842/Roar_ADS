import { useEffect, useMemo, useState, type FormEvent, type MouseEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowRight, Check, ChevronDown, ChevronUp, CirclePlay, ExternalLink, Instagram, Linkedin, Menu, MoveUpRight, X } from "lucide-react";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/ServiceCard";
import ClientMarquee from "@/components/ClientMarquee";
import { apiGet, apiPost } from "@/lib/api";
import { DEFAULT_SITE_CONTENT, getYouTubeId, imageAtWidth, imageSrcSet } from "@/lib/siteData";
import type { GalleryImage, PortfolioCategory, SiteContent, SubmissionAck, VideoItem } from "@/lib/siteData";
import "@/styles/restoration.css";

interface InquiryForm {
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  details: string;
}

interface CareerForm {
  name: string;
  email: string;
  skill: string;
  experience: string;
  reel: string;
  bio: string;
}

const initialInquiry: InquiryForm = { name: "", email: "", company: "", service: "", budget: "", details: "" };
const initialCareer: CareerForm = { name: "", email: "", skill: "", experience: "", reel: "", bio: "" };

const linkTo = (event: MouseEvent<HTMLAnchorElement>, target: string) => {
  event.preventDefault();
  document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

function Logo({ compact = false, testId }: { compact?: boolean; testId: string }) {
  return (
    <span className={compact ? "brand-lockup brand-lockup--compact" : "brand-lockup"} data-testid={testId}>
      <img className="brand-logo-image" src="/roar-logo.svg" alt="ROAR Ads" width="908" height="344" decoding="async" data-testid={`${testId}-image`} />
    </span>
  );
}

function SectionIntro({ eyebrow, title, detail, id }: { eyebrow: string; title: string; detail?: string; id: string }) {
  return (
    <div className="section-intro" data-testid={`${id}-section-intro`}>
      <span className="eyebrow" data-testid={`${id}-eyebrow`}>{eyebrow}</span>
      <h2 data-testid={`${id}-heading`}>{title}</h2>
      {detail && <p data-testid={`${id}-description`}>{detail}</p>}
    </div>
  );
}

function VideoCard({ item, onOpen, index, revealed = false }: { item: VideoItem; onOpen: (item: VideoItem) => void; index: number; revealed?: boolean }) {
  const videoId = getYouTubeId(item.url);
  return (
    <button className={`video-card${revealed ? " video-card--revealed" : ""}`} style={revealed ? { animationDelay: `${Math.min(index - 3, 5) * 55}ms` } : undefined} onClick={() => onOpen(item)} data-testid={`portfolio-video-${index + 1}-button`} aria-label={`Play ${item.title}`}>
      <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt={`${item.title} thumbnail`} loading="lazy" data-testid={`portfolio-video-${index + 1}-thumbnail`} />
      <span className="video-shade" />
      <span className="video-play"><CirclePlay size={27} strokeWidth={1.5} /></span>
      <span className="video-caption" data-testid={`portfolio-video-${index + 1}-caption`}>
        <small>Watch now <ArrowRight size={13} /></small>
      </span>
    </button>
  );
}

export default function Home() {
  const contentQuery = useQuery({ queryKey: ["site-content"], queryFn: () => apiGet<SiteContent>("/site-content"), retry: false });
  const content = contentQuery.data ?? DEFAULT_SITE_CONTENT;
  const [heroIndex, setHeroIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("Documentaries");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const [inquiry, setInquiry] = useState(initialInquiry);
  const [career, setCareer] = useState(initialCareer);
  const [inquirySent, setInquirySent] = useState(false);
  const [careerSent, setCareerSent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1050);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (content.hero_images.length < 2) return undefined;
    const timer = window.setInterval(() => setHeroIndex((current) => (current + 1) % content.hero_images.length), 7000);
    return () => window.clearInterval(timer);
  }, [content.hero_images.length]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setActiveVideo(null);
        setLightboxImage(null);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    if (!menuOpen && !activeVideo && !lightboxImage) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [menuOpen, activeVideo, lightboxImage]);

  const activePortfolio: PortfolioCategory = useMemo(
    () => content.portfolio.find((category) => category.title === activeCategory) ?? content.portfolio[0],
    [activeCategory, content.portfolio],
  );
  const portfolioExpanded = expandedCategory === activePortfolio?.id;
  const visibleVideos = portfolioExpanded ? activePortfolio?.videos : activePortfolio?.videos.slice(0, 3);
  // The editor's first three photos appear once, in the Our Story collage only.
  const collage = content.gallery.slice(0, 3);

  const inquiryMutation = useMutation({
    mutationFn: (payload: InquiryForm) => apiPost<SubmissionAck>("/inquiries", payload),
    onSuccess: () => { setInquirySent(true); toast.success("Inquiry received. We will be in touch shortly."); },
    onError: () => toast.error("Could not send the inquiry. Please email us directly."),
  });
  const careerMutation = useMutation({
    mutationFn: (payload: CareerForm) => apiPost<SubmissionAck>("/careers", payload),
    onSuccess: () => { setCareerSent(true); toast.success("Application received. Thank you."); },
    onError: () => toast.error("Could not send the application. Please try again."),
  });

  const handleInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    inquiryMutation.mutate(inquiry);
  };
  const handleCareer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    careerMutation.mutate(career);
  };

  return (
    <div className="site-shell" data-testid="roar-ads-home-page">
      {loading && <div className="site-loader" data-testid="site-loader"><Logo testId="loader-logo" /><span className="loader-line" /></div>}

      <header className="site-header" data-testid="site-header">
        <a href="#top" onClick={(event) => linkTo(event, "#top")} data-testid="header-logo-link"><Logo testId="header-logo" /></a>
        <nav className="desktop-nav" aria-label="Primary navigation" data-testid="desktop-navigation">
          {["story", "services", "portfolio", "careers"].map((item) => (
            <a key={item} href={`#${item}`} onClick={(event) => linkTo(event, `#${item}`)} data-testid={`header-${item}-link`}>{item === "story" ? "Our Story" : item === "portfolio" ? "Portfolio" : item === "footprint" ? "Footprint" : item[0].toUpperCase() + item.slice(1)}</a>
          ))}
        </nav>
        <div className="header-actions">
          <a href="#start-project" className="nav-cta" onClick={(event) => linkTo(event, "#start-project")} data-testid="header-start-project-link">Start a Project</a>
          <Button variant="ghost" size="icon" className="menu-trigger" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen} aria-controls="mobile-navigation" data-testid="mobile-menu-open-button"><Menu /></Button>
        </div>
      </header>

      {menuOpen && <div className="mobile-menu" id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Navigation menu" data-testid="mobile-menu">
        <div className="mobile-menu-top"><Logo testId="mobile-menu-logo" /><Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)} aria-label="Close menu" data-testid="mobile-menu-close-button"><X /></Button></div>
        <div className="mobile-menu-links">
          {["story", "services", "portfolio", "careers"].map((item) => (
            <a key={item} href={`#${item}`} onClick={(event) => { setMenuOpen(false); linkTo(event, `#${item}`); }} data-testid={`mobile-${item}-link`}>{item === "story" ? "Our Story" : item === "portfolio" ? "Portfolio" : item === "footprint" ? "Footprint" : item[0].toUpperCase() + item.slice(1)}</a>
          ))}
          <a href="#start-project" className="gold-button" onClick={(event) => { setMenuOpen(false); linkTo(event, "#start-project"); }} data-testid="mobile-start-project-link">Start a Project <ArrowRight size={16} /></a>
        </div>
      </div>}

      <main id="top">
        <section className="hero" data-testid="hero-section">
          {content.hero_images.map((image, index) => <img key={image.id} className={`hero-image ${heroIndex === index ? "is-active" : ""}`} src={imageAtWidth(image.src, 2560)} srcSet={imageSrcSet(image.src)} sizes="100vw" alt={image.alt} loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} decoding="async" data-testid={`hero-banner-${index + 1}-image`} />)}
          <div className="hero-grain" /><div className="hero-vignette" /><div className="hero-letterbox hero-letterbox--top" /><div className="hero-letterbox hero-letterbox--bottom" />
          <div className="hero-content">
            <span className="eyebrow hero-eyebrow" data-testid="hero-eyebrow">ROAR ADS / VISUAL PRODUCTION AGENCY</span>
            <h1 data-testid="hero-heading">{content.hero_title}</h1>
            <p data-testid="hero-subheading">{content.hero_subtitle}</p>
            <div className="hero-actions">
              <a className="gold-button" href="#portfolio" onClick={(event) => linkTo(event, "#portfolio")} data-testid="hero-portfolio-button">Our Portfolio <ArrowRight size={16} /></a>
              <a className="outline-button" href="#start-project" onClick={(event) => linkTo(event, "#start-project")} data-testid="hero-start-project-button">Start a Project <MoveUpRight size={15} /></a>
            </div>
          </div>
          <div className="hero-controls" data-testid="hero-slider-controls">
            <span data-testid="hero-slide-count">0{heroIndex + 1} / 0{content.hero_images.length}</span>
            <div className="hero-dots">{content.hero_images.map((image, index) => <button key={image.id} className={heroIndex === index ? "is-active" : ""} onClick={() => setHeroIndex(index)} aria-label={`Show banner ${index + 1}`} data-testid={`hero-banner-${index + 1}-button`} />)}</div>
          </div>
        </section>

        <div className="marquee" data-testid="marquee-strip"><div className="marquee-track">{["Cinema", "Scale", "Precision", "Motion", "Authority", "Cinema", "Scale", "Precision", "Motion", "Authority"].map((word, index) => <span key={`${word}-${index}`}>{word} <b>✦</b></span>)}</div></div>

        <section className="section story-section" id="story" data-testid="story-section">
          <div className={`story-grid${collage.length ? "" : " story-grid--text-only"}`}>
            {collage.length > 0 && <div className={`story-collage story-collage--${collage.length}`} data-testid="story-collage">
              <figure className="collage-tall">
                <button className="collage-photo-button" onClick={() => setLightboxImage(collage[0])} aria-label={`Open ${collage[0].title}`} data-testid="story-collage-1-button"><img src={imageAtWidth(collage[0].src, 1600)} alt={collage[0].title} loading="lazy" decoding="async" data-testid="story-collage-1-image" /></button>
                <span className="collage-corner collage-corner--top" aria-hidden="true" />
                <span className="collage-corner collage-corner--bottom" aria-hidden="true" />
                <figcaption className="collage-label" data-testid="story-collage-label">Behind the Lens</figcaption>
              </figure>
              {collage[1] && <div className="collage-stack">
                <figure><button className="collage-photo-button" onClick={() => setLightboxImage(collage[1])} aria-label={`Open ${collage[1].title}`} data-testid="story-collage-2-button"><img src={imageAtWidth(collage[1].src, 1600)} alt={collage[1].title} loading="lazy" decoding="async" data-testid="story-collage-2-image" /></button></figure>
                {collage[2] && <figure>
                  <button className="collage-photo-button" onClick={() => setLightboxImage(collage[2])} aria-label={`Open ${collage[2].title}`} data-testid="story-collage-3-button"><img src={imageAtWidth(collage[2].src, 1600)} alt={collage[2].title} loading="lazy" decoding="async" data-testid="story-collage-3-image" /></button>
                  <figcaption className="collage-badge" data-testid="story-legacy-badge"><strong>2017</strong><small>Legacy Born</small></figcaption>
                </figure>}
              </div>}
            </div>}
            <div className="story-content">
              <SectionIntro id="story" eyebrow="Established 2017" title={content.story_title} />
              <p className="story-copy" data-testid="story-body">{content.story_body}</p>
              <blockquote className="story-quote" data-testid="story-quote">"Our stories and visuals are really making a difference."</blockquote>
            </div>
          </div>
        </section>

        <section className="section services-section" id="services" data-testid="services-section">
          <SectionIntro id="services" eyebrow="What We Do" title="Our Services." detail="Specializing in every aspect of video and audio production for the modern world." />
          <div className="service-grid">{content.services.map((service, index) => <ServiceCard key={service.id} service={service} index={index} expanded={expandedService === index} onToggle={() => setExpandedService(expandedService === index ? null : index)} onInquire={() => {
            setInquiry((current) => ({ ...current, service: service.title }));
            document.getElementById("start-project")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }} />)}</div>
        </section>

        <section className="section portfolio-section" id="portfolio" data-testid="portfolio-section">
          <SectionIntro id="portfolio" eyebrow="Selected Work" title="Selected Works." detail="A moving archive of films engineered to hold attention." />
          <div className="portfolio-tabs" role="tablist" aria-label="Portfolio categories" data-testid="portfolio-category-tabs">{content.portfolio.map((category) => <button key={category.id} className={activeCategory === category.title ? "is-active" : ""} onClick={() => { setActiveCategory(category.title); setExpandedCategory(null); }} role="tab" aria-selected={activeCategory === category.title} data-testid={`portfolio-${category.id}-tab`}>{category.title}</button>)}</div>
          <div className="portfolio-grid" id="portfolio-videos" data-testid="portfolio-video-grid">{visibleVideos?.map((item, index) => <VideoCard key={item.id} item={item} onOpen={setActiveVideo} index={index} revealed={index >= 3} />)}</div>
          {activePortfolio?.videos.length > 3 && <div className="portfolio-expand-controls">
            <Button variant="outline" className="portfolio-expand-button" aria-expanded={portfolioExpanded} aria-controls="portfolio-videos" onClick={() => {
              setExpandedCategory(portfolioExpanded ? null : activePortfolio.id);
              if (portfolioExpanded) document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }} data-testid="portfolio-expand-button"><span data-testid="portfolio-expand-label">{portfolioExpanded ? "Show less" : "Show more"}</span>{portfolioExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</Button>
          </div>}
        </section>

        <section className="section process-section" id="process" data-testid="process-section">
          <SectionIntro id="process" eyebrow="The Blueprint" title="The Blueprint: A Structured Production Flow." detail="Every project follows a rigorous four-stage process." />
          <div className="process-grid">{content.process.map((stage, index) => <article className="process-card" key={stage.id} data-testid={`process-stage-${index + 1}-card`}><span className="process-stage">{stage.stage}</span><span className="process-index">0{index + 1}</span><h3 data-testid={`process-stage-${index + 1}-title`}>{stage.title}</h3><p>{stage.description}</p></article>)}</div>
        </section>

        <section className="impact-section" id="impact" data-testid="impact-section">
          <div className="impact-inner">
            <span className="eyebrow" data-testid="impact-eyebrow">Why ROAR</span>
            <h2 data-testid="impact-heading">Why Choose Us?</h2>
            <ul>{content.why_points.map((point, index) => <li key={point} data-testid={`impact-point-${index + 1}`}>{point}</li>)}</ul>
            <div className="impact-stats" data-testid="impact-statistics">
              <div className="impact-stat" data-testid="impact-projects-stat"><strong data-testid="impact-projects-count">100+</strong><span data-testid="impact-projects-label">Projects</span></div>
              <div className="impact-stat impact-stat--inverse" data-testid="impact-professionals-stat"><strong data-testid="impact-professionals-count">80+</strong><span data-testid="impact-professionals-label">Professionals</span></div>
            </div>
          </div>
        </section>

        <section className="section footprint-section" id="footprint" data-testid="footprint-section"><SectionIntro id="footprint" eyebrow="Operational Network" title="Our Footprint." detail="Cross-border infrastructure that deploys creative teams seamlessly across major industrial, commercial, and creative capitals." /><ul className="city-rail" data-testid="city-list">{content.cities.map((city) => <li className="city-rail-item" key={city.id} data-testid={`city-${city.id}-row`}><strong title={city.label} data-testid={`city-${city.id}-name`}>{city.name}</strong></li>)}</ul></section>

        <ClientMarquee />

        <section className="section contact-section engagement-section" id="start-project" aria-labelledby="start-project-heading" data-testid="start-project-section">
          <div className="contact-head engagement-head">
            <span className="eyebrow" data-testid="start-project-eyebrow">Start a Project</span>
            <h2 id="start-project-heading" data-testid="start-project-heading">Architect Your Brand's<br /><em>Next Asset.</em></h2>
            <p data-testid="start-project-description">Tell us what you are building. We will bring the right crew, process, and precision to the frame.</p>
          </div>
          <div className="form-card engagement-card" data-testid="inquiry-form-panel">
            {inquirySent ? <div className="success-state" role="status" data-testid="inquiry-success-state">
              <Check size={26} aria-hidden="true" />
              <h3 data-testid="inquiry-success-heading">Inquiry Received.</h3>
              <p data-testid="inquiry-success-description">Our team will review your brief and get back to you within 24 hours.</p>
            </div> : <form onSubmit={handleInquiry} data-testid="inquiry-form">
              <div className="form-row">
                <label data-testid="inquiry-name-label">Name<input required autoComplete="name" value={inquiry.name} onChange={(event) => setInquiry({ ...inquiry, name: event.target.value })} placeholder="Your name" data-testid="inquiry-name-input" /></label>
                <label data-testid="inquiry-email-label">Email<input required type="email" autoComplete="email" value={inquiry.email} onChange={(event) => setInquiry({ ...inquiry, email: event.target.value })} placeholder="you@company.com" data-testid="inquiry-email-input" /></label>
              </div>
              <div className="form-row">
                <label data-testid="inquiry-company-label">Company<input autoComplete="organization" value={inquiry.company} onChange={(event) => setInquiry({ ...inquiry, company: event.target.value })} placeholder="Company name" data-testid="inquiry-company-input" /></label>
                <label data-testid="inquiry-service-label">Service<select required value={inquiry.service} onChange={(event) => setInquiry({ ...inquiry, service: event.target.value })} data-testid="inquiry-service-select"><option value="" data-testid="inquiry-service-placeholder">Select service</option>{content.services.map((service) => <option key={service.id} data-testid={`inquiry-service-${service.id}-option`}>{service.title}</option>)}</select></label>
              </div>
              <label data-testid="inquiry-details-label">Project brief<textarea required minLength={10} value={inquiry.details} onChange={(event) => setInquiry({ ...inquiry, details: event.target.value })} placeholder="Tell us about the project, timeline, and vision..." data-testid="inquiry-details-textarea" /></label>
              <div className="engagement-actions">
                <Button type="submit" className="form-submit" disabled={inquiryMutation.isPending} data-testid="inquiry-submit-button">{inquiryMutation.isPending ? "Sending..." : "Send Inquiry"}<ArrowRight size={16} aria-hidden="true" /></Button>
              </div>
            </form>}
          </div>
        </section>

        <section className="career-section engagement-section" id="careers" aria-labelledby="careers-heading" data-testid="careers-section">
          <div className="engagement-head">
            <span className="eyebrow" data-testid="careers-eyebrow">Join the Journey</span>
            <h2 id="careers-heading" data-testid="careers-heading">Bring Your<br /><em>Point of View.</em></h2>
          </div>
          <div className="form-card engagement-card" data-testid="career-form-panel">
            {careerSent ? <div className="success-state" role="status" data-testid="career-success-state">
              <Check size={26} aria-hidden="true" />
              <h3 data-testid="career-success-heading">Application Received.</h3>
            </div> : <form className="career-form" onSubmit={handleCareer} data-testid="career-form">
              <div className="form-row">
                <label data-testid="career-name-label">Name<input required autoComplete="name" placeholder="Name" value={career.name} onChange={(event) => setCareer({ ...career, name: event.target.value })} data-testid="career-name-input" /></label>
                <label data-testid="career-email-label">Email<input required type="email" autoComplete="email" placeholder="Email" value={career.email} onChange={(event) => setCareer({ ...career, email: event.target.value })} data-testid="career-email-input" /></label>
              </div>
              <div className="form-row">
                <label data-testid="career-skill-label">Core skill<input placeholder="Core skill" value={career.skill} onChange={(event) => setCareer({ ...career, skill: event.target.value })} data-testid="career-skill-input" /></label>
                <label data-testid="career-reel-label">Reel link<input type="url" placeholder="Reel link" value={career.reel} onChange={(event) => setCareer({ ...career, reel: event.target.value })} data-testid="career-reel-input" /></label>
              </div>
              <label data-testid="career-bio-label">A little about your work<textarea placeholder="A little about your work" value={career.bio} onChange={(event) => setCareer({ ...career, bio: event.target.value })} data-testid="career-bio-textarea" /></label>
              <div className="engagement-actions">
                <Button type="submit" className="form-submit" variant="outline" disabled={careerMutation.isPending} data-testid="career-submit-button">{careerMutation.isPending ? "Sending..." : "Submit application"}<ArrowRight size={16} aria-hidden="true" /></Button>
              </div>
            </form>}
          </div>
        </section>
      </main>

      <footer className="site-footer" id="contact" data-testid="site-footer"><div className="footer-top"><div><Logo compact testId="footer-logo" /><p data-testid="footer-tagline">The stride forward to growth.</p></div><div className="footer-contact"><span className="eyebrow">Let's create.</span><a href={`mailto:${content.contact_email}`} data-testid="footer-email-link">{content.contact_email}</a><a href={`tel:${content.contact_phone.replaceAll(" ", "")}`} data-testid="footer-phone-link">{content.contact_phone}</a><p data-testid="footer-address">{content.contact_address}</p></div></div><div className="footer-bottom"><span data-testid="footer-copyright">© 2026 ROAR Ads. All rights reserved.</span><div className="footer-socials">{content.social_links.map((link) => <a key={link.id} href={link.url} target="_blank" rel="noreferrer" data-testid={`footer-${link.platform.toLowerCase()}-link`}>{link.platform === "Instagram" ? <Instagram size={16} /> : link.platform === "LinkedIn" ? <Linkedin size={16} /> : <ExternalLink size={16} />}{link.platform}</a>)}</div></div></footer>

      <a className="whatsapp-fab" href="https://wa.me/919361661636" target="_blank" rel="noreferrer" aria-label="Chat with ROAR Ads on WhatsApp" data-testid="whatsapp-fab"><SiWhatsapp size={25} aria-hidden="true" /></a>

      {activeVideo && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={activeVideo.title} data-testid="video-modal"><div className="video-modal"><Button variant="ghost" size="icon" onClick={() => setActiveVideo(null)} className="modal-close" aria-label="Close video" data-testid="video-modal-close-button"><X /></Button><iframe src={`https://www.youtube-nocookie.com/embed/${getYouTubeId(activeVideo.url)}?autoplay=0&rel=0`} title={activeVideo.title} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" data-testid="video-modal-iframe" /><a href={activeVideo.url} target="_blank" rel="noreferrer" className="modal-watch-link" data-testid="video-modal-youtube-link">Watch on YouTube <ExternalLink size={14} /></a></div></div>}
      {lightboxImage && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={lightboxImage.title} onClick={() => setLightboxImage(null)} data-testid="gallery-lightbox"><div className="lightbox"><Button variant="ghost" size="icon" onClick={() => setLightboxImage(null)} className="modal-close" aria-label="Close gallery image" data-testid="gallery-lightbox-close-button"><X /></Button><img src={imageAtWidth(lightboxImage.src, 2560)} alt={lightboxImage.title} data-testid="gallery-lightbox-image" /><p data-testid="gallery-lightbox-caption">{lightboxImage.title}</p></div></div>}
    </div>
  );
}