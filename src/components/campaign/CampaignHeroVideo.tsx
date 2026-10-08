import { useState } from "react";
import { Volume2 } from "lucide-react";

// General BitCamp AI course intro video, shared by /ai and /ai-starter.
const VIDEO_BASE_URL =
  "https://player.mediadelivery.net/embed/678241/5c33a6d3-33fc-41a5-83ca-1a9c8ee702ff?autoplay=true&loop=false&muted=true&preload=true&responsive=true";

const getVideoUrl = (soundEnabled: boolean) =>
  VIDEO_BASE_URL.replace("muted=true", `muted=${soundEnabled ? "false" : "true"}`);

export function CampaignHeroVideo({
  className = "",
  title = "AI სრული პროგრამის ვიდეო",
}: {
  className?: string;
  title?: string;
}) {
  const [soundEnabled, setSoundEnabled] = useState(false);

  return (
    <div className={`campaign-hero-video ${className}`} aria-label={title}>
      <iframe
        key={soundEnabled ? "sound-on" : "muted"}
        src={getVideoUrl(soundEnabled)}
        title={title}
        loading="lazy"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
      <button
        type="button"
        className={`campaign-hero-video__sound${soundEnabled ? " is-on" : ""}`}
        onClick={() => setSoundEnabled(true)}
        disabled={soundEnabled}
      >
        <Volume2 aria-hidden="true" size={16} />
        <span>{soundEnabled ? "ხმა ჩართულია" : "ჩართე ხმა"}</span>
      </button>
    </div>
  );
}
