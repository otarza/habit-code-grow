import { Star } from "lucide-react";

// Five-star ratings confirmed by the owner during local page review.
export function TestimonialStars() {
  return <div className="starter-testimonial-stars" role="img" aria-label="5 ვარსკვლავი">
    {Array.from({ length: 5 }, (_, index) => <Star key={index} size={15} fill="currentColor" strokeWidth={1.5} aria-hidden="true" />)}
  </div>;
}
