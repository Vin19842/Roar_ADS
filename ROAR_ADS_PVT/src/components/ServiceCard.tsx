import { Bot, BriefcaseBusiness, Camera, Film, Plus, Share2, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_SITE_CONTENT } from "@/lib/siteData";
import type { ServiceItem } from "@/lib/siteData";

const icons = [Film, Share2, Camera, BriefcaseBusiness, Tv, Bot];

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onInquire: () => void;
}

export default function ServiceCard({ service, index, expanded, onToggle, onInquire }: ServiceCardProps) {
  const Icon = icons[index % icons.length];
  const prefix = `service-${index + 1}`;
  const steps = service.steps?.length ? service.steps : DEFAULT_SITE_CONTENT.services.find((item) => item.title === service.title)?.steps ?? [];

  return (
    <article className={`service-card ${expanded ? "is-expanded" : ""}`} data-testid={`${prefix}-card`}>
      <h3 className="service-card-heading">
        <button className="service-toggle" onClick={onToggle} aria-expanded={expanded} aria-controls={`${prefix}-details`} data-testid={`${prefix}-toggle`}>
          <span className="service-topline" aria-hidden="true"><span className="service-icon-box"><Icon size={19} strokeWidth={1.8} /></span><Plus className="service-expand-icon" size={21} strokeWidth={1.5} /></span>
          <span className="service-title" data-testid={`${prefix}-title`}>{service.title}</span>
          <span className="service-summary" data-testid={`${prefix}-description`}>{service.description}</span>
        </button>
      </h3>
      <div className="service-expansion" id={`${prefix}-details`} inert={!expanded} aria-hidden={!expanded} data-testid={`${prefix}-details`}>
        <div className="service-expansion-inner">
          <ol className="service-timeline" data-testid={`${prefix}-timeline`}>
            {steps.map((step, stepIndex) => <li key={step.title} data-testid={`${prefix}-step-${stepIndex + 1}`}>
              <h4 data-testid={`${prefix}-step-${stepIndex + 1}-title`}>{step.title}</h4>
              <p data-testid={`${prefix}-step-${stepIndex + 1}-description`}>{step.description}</p>
            </li>)}
          </ol>
          <Button className="service-inquire" onClick={onInquire} data-testid={`${prefix}-inquire-button`}>Inquire Now</Button>
        </div>
      </div>
    </article>
  );
}