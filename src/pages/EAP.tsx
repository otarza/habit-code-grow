import { useEffect, useRef, useState } from "react";
import { VIEW_H, VIEW_W } from "@/game/eap/constants";
import { isMuted, setMuted, unlockAudio } from "@/game/eap/audio";
import { arriveAt, createGame, createInput, drawGame, restartGame, updateGame } from "@/game/eap/game";

// EAP — Evaporate All Parasites
// 2D side-view canvas game. Hero: GRAVE, an employee of EAP Corporation, in a forest.

const EAP = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef(createInput());
  const [muted, setMutedState] = useState(isMuted);
  const toggleMute = () => {
    setMuted(!isMuted());
    setMutedState(isMuted());
  };

  useEffect(() => {
    document.title = "EAP — Evaporate All Parasites";
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const input = inputRef.current;
    // ?level=2 or ?level=3 jumps straight to that part of the story
    const startLevel = new URLSearchParams(window.location.search).get("level");
    let game = startLevel === "2" ? arriveAt(2) : startLevel === "3" ? arriveAt(3) : createGame();
    const mouse = { x: VIEW_W / 2, y: VIEW_H / 2 };

    const isOver = () => game.status === "won" || game.status === "lost";
    const restart = () => {
      game = restartGame(game);
      input.firing = false;
    };

    const setKey = (code: string, down: boolean) => {
      if (code === "ArrowLeft" || code === "KeyA") input.left = down;
      else if (code === "ArrowRight" || code === "KeyD") input.right = down;
      else if (code === "ArrowUp" || code === "KeyW" || code === "Space") input.jump = down;
      else if (code === "KeyE") input.action = down;
      else if (code === "ArrowDown" || code === "KeyS") input.down = down;
      else return false;
      return true;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      unlockAudio();
      if (e.code === "KeyR" && isOver()) return restart();
      if (e.code === "KeyM" && !e.repeat) return toggleMute();
      // Ignore OS key auto-repeat so holding jump doesn't re-trigger it
      if (e.repeat) {
        if (e.code === "Space" || e.code.startsWith("Arrow")) e.preventDefault();
        return;
      }
      if (setKey(e.code, true)) e.preventDefault();
    };
    // Jump / E / S are taps: the game clears them once used, so releasing the key
    // must not wipe a press the game loop hasn't seen yet
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") input.left = false;
      else if (e.code === "ArrowRight" || e.code === "KeyD") input.right = false;
    };

    // Mouse aims; right button shoots (hold to charge)
    const toCanvas = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) * VIEW_W) / rect.width;
      mouse.y = ((e.clientY - rect.top) * VIEW_H) / rect.height;
    };
    const onMouseMove = (e: MouseEvent) => {
      toCanvas(e);
      input.aimWithMouse = true;
    };
    const onMouseDown = (e: MouseEvent) => {
      unlockAudio();
      toCanvas(e);
      if (isOver()) return restart();
      if (e.button === 2) {
        input.aimWithMouse = true;
        input.firing = true;
      }
    };
    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 2) input.firing = false;
    };
    const onContextMenu = (e: MouseEvent) => e.preventDefault();
    const onBlur = () => {
      input.left = input.right = input.jump = input.firing = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("blur", onBlur);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("contextmenu", onContextMenu);

    let last = performance.now();
    let frame = 0;
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      input.aimX = mouse.x + game.camX;
      input.aimY = mouse.y;
      updateGame(game, input, dt);
      drawGame(ctx, game, input);

      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("blur", onBlur);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("contextmenu", onContextMenu);
    };
  }, []);

  const touch = (key: "left" | "right" | "jump" | "down" | "firing") => ({
    onPointerDown: () => {
      unlockAudio();
      if (key === "firing") inputRef.current.aimWithMouse = false;
      inputRef.current[key] = true;
    },
    onPointerUp: () => (inputRef.current[key] = false),
    onPointerLeave: () => (inputRef.current[key] = false),
  });

  const btn = "h-14 w-14 rounded-full bg-[#1c2433] text-[#35e0a1] text-2xl";
  return (
    <div className="min-h-screen bg-[#0a0e16] flex flex-col items-center justify-center gap-4 p-4">
      <canvas
        ref={canvasRef}
        width={VIEW_W}
        height={VIEW_H}
        className="w-full max-w-[960px] rounded-lg border border-[#35e0a1]/40 cursor-crosshair"
      />
      <button
        onClick={(e) => {
          unlockAudio();
          toggleMute();
          e.currentTarget.blur(); // so Space (jump) doesn't toggle it again
        }}
        className="text-sm text-[#9aa3b5] hover:text-[#35e0a1]"
      >
        {muted ? "🔇 Sound off" : "🔊 Sound on"} (M)
      </button>
      <div className="flex gap-3 md:hidden select-none touch-none">
        <button className={btn} {...touch("left")}>←</button>
        <button className={btn} {...touch("jump")}>↑</button>
        <button className={btn} {...touch("down")}>↓</button>
        <button className={btn} {...touch("right")}>→</button>
        <button className={`${btn} text-[#ffe24a]`} {...touch("firing")}>⚡</button>
      </div>
    </div>
  );
};

export default EAP;
