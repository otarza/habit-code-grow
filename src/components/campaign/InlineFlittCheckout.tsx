import { useEffect, useId, useRef, useState } from "react";
import { buildFlittOptions, loadFlitt } from "@/lib/flitt";

// Mounts Flitt's embedded checkout directly in the page (no modal).
// Remounts whenever the button (price) or email changes.
export function InlineFlittCheckout({ buttonId, email, onReady }: {
  buttonId: string;
  email: string;
  onReady?: () => void;
}) {
  // Kept in a ref so a new callback identity doesn't remount the payment form.
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const mountRef = useRef<HTMLDivElement>(null);
  const targetId = `flitt-inline-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    const node = mountRef.current;
    setStatus("loading");

    loadFlitt()
      .then((checkout) => {
        if (cancelled || !node) return;
        node.innerHTML = `<div id="${targetId}"></div>`;
        checkout(`#${targetId}`, buildFlittOptions(buttonId, email));
        setStatus("ready");
        onReadyRef.current?.();
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[InlineFlittCheckout]", err);
        setStatus("error");
      });

    return () => {
      cancelled = true;
      if (node) node.innerHTML = "";
    };
  }, [buttonId, email, targetId]);

  return (
    <div className="campaign-inline-checkout__flitt">
      {status === "loading" && (
        <div className="campaign-inline-checkout__status" role="status">
          იტვირთება უსაფრთხო გადახდის ფორმა…
        </div>
      )}
      {status === "error" && (
        <div className="campaign-inline-checkout__status campaign-inline-checkout__status--error" role="alert">
          გადახდის ფორმის ჩატვირთვა ვერ მოხერხდა. სცადე თავიდან ან მოგვწერე hello@bitcamp.ge
        </div>
      )}
      <div
        ref={mountRef}
        style={status === "ready" ? undefined : { opacity: 0, height: 0, overflow: "hidden" }}
      />
    </div>
  );
}
