import { useEffect, useState } from "react";
import { BOOTCAMP_PRICE_INCREASE_DEADLINE } from "@/lib/bootcampPricing";

export type CampaignCountdownPhase = "standard" | "ended";

export type CampaignCountdownState = {
  phase: CampaignCountdownPhase;
  diff: number;
};

export function getCampaignCountdownState(
  now: number,
  deadline = BOOTCAMP_PRICE_INCREASE_DEADLINE
): CampaignCountdownState {
  if (now <= deadline) {
    return {
      phase: "standard",
      diff: deadline - now,
    };
  }

  return {
    phase: "ended",
    diff: 0,
  };
}

export function useCampaignCountdownState(deadline = BOOTCAMP_PRICE_INCREASE_DEADLINE) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return getCampaignCountdownState(now, deadline);
}

function Cell({ n, label }: { n: number; label: string }) {
  return (
    <div className="campaign-countdown__cell">
      <div className="campaign-countdown__number">{String(n).padStart(2, "0")}</div>
      <div className="campaign-countdown__label">{label}</div>
    </div>
  );
}

export function CountdownDisplay({
  state,
  endedLabel = "ფასი უკვე გაიზარდა",
}: {
  state: CampaignCountdownState;
  endedLabel?: string;
}) {
  const diff = Math.max(0, state.diff);

  if (state.phase === "ended") {
    return <div className="campaign-countdown campaign-countdown--ended">{endedLabel}</div>;
  }

  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1_000);

  return (
    <div className={`campaign-countdown campaign-countdown--${state.phase}`}>
      <Cell n={days} label="დღე" />
      <span className="campaign-countdown__separator" aria-hidden="true">
        :
      </span>
      <Cell n={hours} label="საათი" />
      <span className="campaign-countdown__separator" aria-hidden="true">
        :
      </span>
      <Cell n={minutes} label="წუთი" />
      <span className="campaign-countdown__separator" aria-hidden="true">
        :
      </span>
      <Cell n={seconds} label="წამი" />
    </div>
  );
}

export function Countdown({
  deadline = BOOTCAMP_PRICE_INCREASE_DEADLINE,
  endedLabel,
}: {
  deadline?: number;
  endedLabel?: string;
}) {
  const state = useCampaignCountdownState(deadline);
  return <CountdownDisplay state={state} endedLabel={endedLabel} />;
}
