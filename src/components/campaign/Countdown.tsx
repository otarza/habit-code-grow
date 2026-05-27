import { useEffect, useState } from "react";

const CAMPAIGN_DEADLINE = new Date("2026-05-26T23:59:59+04:00").getTime();
const OVERTIME_DEADLINE = new Date("2026-05-28T02:59:59+04:00").getTime();

export type CampaignCountdownPhase = "standard" | "overtime" | "ended";

export type CampaignCountdownState = {
  phase: CampaignCountdownPhase;
  diff: number;
};

export function getCampaignCountdownState(now: number): CampaignCountdownState {
  if (now <= CAMPAIGN_DEADLINE) {
    return {
      phase: "standard",
      diff: CAMPAIGN_DEADLINE - now,
    };
  }

  if (now <= OVERTIME_DEADLINE) {
    return {
      phase: "overtime",
      diff: OVERTIME_DEADLINE - now,
    };
  }

  return {
    phase: "ended",
    diff: 0,
  };
}

export function useCampaignCountdownState() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return getCampaignCountdownState(now);
}

function Cell({ n, label }: { n: number; label: string }) {
  return (
    <div className="campaign-countdown__cell">
      <div className="campaign-countdown__number">{String(n).padStart(2, "0")}</div>
      <div className="campaign-countdown__label">{label}</div>
    </div>
  );
}

export function CountdownDisplay({ state }: { state: CampaignCountdownState }) {
  const diff = Math.max(0, state.diff);

  if (state.phase === "ended") {
    return <div className="campaign-countdown campaign-countdown--ended">ოვერტაიმი დასრულდა</div>;
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

export function Countdown() {
  const state = useCampaignCountdownState();
  return <CountdownDisplay state={state} />;
}
