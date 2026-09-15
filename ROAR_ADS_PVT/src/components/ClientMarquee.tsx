import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

// Client names supplied by ROAR. Text treatments only, not invented brand logos.
const CLIENTS = [
  { name: "United Way of Bangalore", primary: "United Way", secondary: "of Bangalore" },
  { name: "United Way of Chennai", primary: "United Way", secondary: "of Chennai" },
  { name: "Dean Foundation", primary: "Dean", secondary: "Foundation" },
  { name: "SKID Bangalore", primary: "SKID", secondary: "Bangalore" },
  { name: "Cosh Hospital", primary: "Cosh", secondary: "Hospital" },
  { name: "Petzapp", primary: "Petzapp", secondary: "" },
  { name: "Cambridge International School", primary: "Cambridge", secondary: "International School" },
  { name: "Kids Chaupal", primary: "Kids", secondary: "Chaupal" },
  { name: "Drink Prime", primary: "Drink", secondary: "Prime" },
  { name: "Sanrakshan", primary: "Sanrakshan", secondary: "" },
];

export default function ClientMarquee() {
  const [paused, setPaused] = useState(false);

  return <section className="client-marquee" aria-labelledby="client-marquee-heading" data-testid="client-marquee-section">
    <div className="client-marquee-header">
      <h2 id="client-marquee-heading" className="client-marquee-heading" data-testid="client-marquee-heading">Trusted by leading brands</h2>
      <Button variant="ghost" size="icon" className="client-marquee-toggle" onClick={() => setPaused((current) => !current)} aria-label={paused ? "Resume client names" : "Pause client names"} aria-pressed={paused} data-testid="client-marquee-pause-button">{paused ? <Play size={13} /> : <Pause size={13} />}</Button>
    </div>
    <div className="client-marquee-viewport" data-testid="client-marquee-viewport">
      <div className="client-marquee-track" data-paused={paused} data-testid="client-marquee-track">
        {[0, 1].map((copy) => <ul className="client-marquee-group" key={copy} aria-hidden={copy === 1 ? true : undefined} data-testid={`client-marquee-group-${copy + 1}`}>
          {CLIENTS.map((client, index) => <li className="client-wordmark" aria-label={client.name} key={client.name} data-testid={`client-name-${index + 1}-copy-${copy + 1}`}>
            <span className="client-wordmark-primary" aria-hidden="true" data-testid={`client-name-${index + 1}-primary-${copy + 1}`}>{client.primary}</span>
            <span className="client-wordmark-secondary" aria-hidden="true" data-testid={`client-name-${index + 1}-secondary-${copy + 1}`}>{client.secondary || "\u00a0"}</span>
          </li>)}
        </ul>)}
      </div>
    </div>
  </section>;
}