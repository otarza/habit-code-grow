import { ArrowRight } from "lucide-react";

export function CampaignStickyCta({
  eyebrow,
  label,
  price,
  onClick,
}: {
  eyebrow: string;
  label: string;
  price: string;
  onClick: () => void;
}) {
  return (
    <div className="campaign-sticky-cta" aria-label={label}>
      <div>
        <span>{eyebrow}</span>
        <strong>{price}</strong>
      </div>
      <button type="button" onClick={onClick}>
        <span>{label}</span>
        <ArrowRight aria-hidden="true" size={16} />
      </button>
    </div>
  );
}
