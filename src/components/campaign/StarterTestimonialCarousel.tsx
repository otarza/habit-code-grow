import { useRef, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { TestimonialStars } from "./TestimonialStars";
import { aiStarterTestimonials } from "@/data/aiStarterTestimonials";

// Editorial highlights of the quoted feedback.
const featured = [
  { ...aiStarterTestimonials[0], highlight: "გასაგები ახსნა" },
  { ...aiStarterTestimonials[3], highlight: "სწავლების სტილი" },
  { ...aiStarterTestimonials[4], highlight: "მოკლე ვიდეოები" },
];

export function StarterTestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollToCard = (next: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll<HTMLElement>(".starter-review-preview__slide");
    const target = Math.max(0, Math.min(next, cards.length - 1));
    track.scrollTo({
      left: cards[target].offsetLeft - cards[0].offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };
  const syncIndex = () => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll<HTMLElement>(".starter-review-preview__slide"));
    const maxScroll = track.scrollWidth - track.clientWidth;
    const distances = cards.map(card => Math.abs(track.scrollLeft - Math.min(card.offsetLeft - cards[0].offsetLeft, maxScroll)));
    setIndex(distances.indexOf(Math.min(...distances)));
  };

  return <section className="starter-review-preview" aria-label="AI კურსის სტუდენტების გამოხმაურებები" aria-roledescription="კარუსელი">
    <div className="starter-review-preview__header">
      <span><Quote size={17} aria-hidden="true" /> სტუდენტები კურსზე</span>
      <a href="#starter-testimonials">ყველა შეფასება</a>
    </div>
    <div ref={trackRef} className="starter-review-preview__track" tabIndex={0}
      role="group" aria-label="გადაასრიალე შეფასებების სანახავად" onScroll={syncIndex}
      onKeyDown={event => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        scrollToCard(event.key === "Home" ? 0 : event.key === "End" ? featured.length - 1 : index + (event.key === "ArrowRight" ? 1 : -1));
      }}>
      {featured.map((review, cardIndex) => <figure className="starter-review-preview__slide" key={review.name}
        role="group" aria-roledescription="ბარათი" aria-label={`${cardIndex + 1} / ${featured.length}`}>
        <TestimonialStars />
        <blockquote>„{review.quote}“</blockquote>
        <figcaption><strong>{review.name}</strong><span><CheckCircle2 size={13} aria-hidden="true" />{review.highlight}</span></figcaption>
      </figure>)}
    </div>
    <div className="starter-review-preview__bottom">
      <small>BitCamp-ის AI კურსის მონაწილეები</small>
      <div className="starter-review-preview__controls">
        <button type="button" aria-label="წინა შეფასება" disabled={index === 0} onClick={() => scrollToCard(index - 1)}><ChevronLeft size={17} aria-hidden="true" /></button>
        <span aria-live="polite" aria-atomic="true">{index + 1} / {featured.length}</span>
        <button type="button" aria-label="შემდეგი შეფასება" disabled={index === featured.length - 1} onClick={() => scrollToCard(index + 1)}><ChevronRight size={17} aria-hidden="true" /></button>
      </div>
    </div>
  </section>;
}
