import { useEffect, useRef } from "react";
import { VIEW_H, VIEW_W } from "@/game/eap/constants";
import { arriveAt, createGame, createInput, drawGame, restartGame, updateGame } from "@/game/eap/game";

// EAP — Evaporate All Parasites
// 2D side-view canvas game. Hero: GRAVE, an employee of EAP Corporation, in a forest.

const EAP = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef(createInput());

  useEffect(() => {
    document.title = "EAP — Evaporate All Parasites";
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const input = inputRef.current;
    // ?level=2 jumps straight to THE RESTING OF THE UNSTABLE
    let game = new URLSearchParams(window.location.search).get("level") === "2" ? arriveAt(2) : createGame();
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
      else return false;
      return true;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyR" && isOver()) return restart();
      // Ignore OS key auto-repeat so holding jump doesn't re-trigger it
      if (e.repeat) {
        if (e.code === "Space" || e.code.startsWith("Arrow")) e.preventDefault();
        return;
      }
      if (setKey(e.code, true)) e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (setKey(e.code, false)) e.preventDefault();
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

  const touch = (key: "left" | "right" | "jump" | "firing") => ({
    onPointerDown: () => {
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
      <div className="flex gap-3 md:hidden select-none touch-none">
        <button className={btn} {...touch("left")}>←</button>
        <button className={btn} {...touch("jump")}>↑</button>
        <button className={btn} {...touch("right")}>→</button>
        <button className={`${btn} text-[#ffe24a]`} {...touch("firing")}>⚡</button>
      </div>
    </div>
  );
};

export default EAP;
