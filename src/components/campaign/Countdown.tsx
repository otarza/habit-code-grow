import { useEffect, useState } from "react";

const TARGET = new Date("2026-05-26T23:59:59+04:00").getTime();

function Cell({ n, label }: { n: number; label: string }) {
  return (
    <div className="campaign-countdown__cell">
      <div className="campaign-countdown__number">{String(n).padStart(2, "0")}</div>
      <div className="campaign-countdown__label">{label}</div>
    </div>
  );
}

export function Countdown() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, TARGET - now);

  if (diff === 0) {
    return <div className="campaign-countdown campaign-countdown--ended">შეთავაზება დასრულდა</div>;
  }

  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1_000);

  return (
    <div className="campaign-countdown">
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
