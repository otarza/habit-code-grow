import { type CSSProperties } from "react";

// Same particles and animation styling as the original /ai promotion.
const PRO_PROMO_CONFETTI = [
  { x: "-44vw", y: "56vh", r: "-320deg", c: "#ff766a" },
  { x: "-36vw", y: "42vh", r: "260deg", c: "#f5f5f7" },
  { x: "-28vw", y: "62vh", r: "-210deg", c: "#da291c" },
  { x: "-20vw", y: "48vh", r: "340deg", c: "#ffb4ac" },
  { x: "-14vw", y: "66vh", r: "-280deg", c: "#9adbe8" },
  { x: "-8vw", y: "46vh", r: "220deg", c: "#ff766a" },
  { x: "-2vw", y: "70vh", r: "-360deg", c: "#f5f5f7" },
  { x: "6vw", y: "52vh", r: "300deg", c: "#da291c" },
  { x: "12vw", y: "68vh", r: "-240deg", c: "#ffb4ac" },
  { x: "18vw", y: "44vh", r: "280deg", c: "#9adbe8" },
  { x: "26vw", y: "64vh", r: "-300deg", c: "#ff766a" },
  { x: "34vw", y: "50vh", r: "240deg", c: "#f5f5f7" },
  { x: "42vw", y: "60vh", r: "-260deg", c: "#da291c" },
  { x: "-40vw", y: "74vh", r: "380deg", c: "#9adbe8" },
  { x: "-30vw", y: "78vh", r: "-340deg", c: "#ff766a" },
  { x: "-16vw", y: "82vh", r: "310deg", c: "#f5f5f7" },
  { x: "0vw", y: "84vh", r: "-390deg", c: "#ffb4ac" },
  { x: "16vw", y: "80vh", r: "330deg", c: "#da291c" },
  { x: "30vw", y: "76vh", r: "-310deg", c: "#9adbe8" },
  { x: "40vw", y: "72vh", r: "360deg", c: "#ff766a" },
] as const;

export function CampaignPromoConfetti() {
  return (
    <div className="campaign-promo-confetti" aria-hidden="true">
      {PRO_PROMO_CONFETTI.map((piece, index) => (
        <span
          key={`${piece.x}-${index}`}
          style={
            {
              "--confetti-x": piece.x,
              "--confetti-y": piece.y,
              "--confetti-r": piece.r,
              "--confetti-color": piece.c,
              "--confetti-delay": `${index * 18}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
