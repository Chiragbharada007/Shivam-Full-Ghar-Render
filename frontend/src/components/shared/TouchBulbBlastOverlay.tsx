"use client";

import React, { useEffect, useRef } from "react";

interface BulbGlow {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  decay: number;
  color: string;
}

interface RippleRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
  lineWidth: number;
  color: string;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  friction: number;
  color: string;
}

function getThemePalette(): string[] {
  if (typeof window === "undefined") {
    return ["#aef6cf", "#5fe6a0", "#fff7d6", "#ffffff"];
  }
  const styles = getComputedStyle(document.documentElement);
  const primary = styles.getPropertyValue("--brand-primary").trim() || "#244C38";
  const accent = styles.getPropertyValue("--brand-accent").trim() || "#5fe6a0";
  const light = styles.getPropertyValue("--brand-light").trim() || "#aef6cf";
  return [accent, light, primary, "#fff6cc", "#ffffff"];
}

export function TouchBulbBlastOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let palette = getThemePalette();

    const bulbs: BulbGlow[] = [];
    const ripples: RippleRing[] = [];
    const particles: SparkParticle[] = [];

    let lastInteraction = performance.now();
    let lastTrailTime = 0;
    let lastIdlePulse = 0;
    let rafId = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const refreshPalette = () => {
      palette = getThemePalette();
    };

    const spawnBurst = (x: number, y: number, isBigBlast: boolean) => {
      const mainColor = palette[0] || "#5fe6a0";
      const highlightColor = palette[1] || "#aef6cf";
      const warmBulb = "#fff8d6";

      // Luminous central bulb flash
      bulbs.push({
        x,
        y,
        radius: isBigBlast ? 18 : 10,
        maxRadius: isBigBlast ? 150 : 75,
        alpha: isBigBlast ? 0.95 : 0.72,
        decay: isBigBlast ? 0.032 : 0.045,
        color: isBigBlast ? warmBulb : highlightColor,
      });

      // Expanding shockwave ring(s)
      ripples.push({
        x,
        y,
        radius: 4,
        maxRadius: isBigBlast ? 165 : 85,
        alpha: isBigBlast ? 0.95 : 0.75,
        speed: isBigBlast ? 5.2 : 3.6,
        lineWidth: isBigBlast ? 3 : 2,
        color: mainColor,
      });

      if (isBigBlast) {
        ripples.push({
          x,
          y,
          radius: 12,
          maxRadius: 220,
          alpha: 0.75,
          speed: 6.4,
          lineWidth: 1.8,
          color: warmBulb,
        });
      }

      // Radial glowing bulb sparks
      const count = isBigBlast ? 40 : 18;
      const maxSpeed = isBigBlast ? 8.5 : 4.8;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
        const speed = 1.4 + Math.random() * maxSpeed;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: isBigBlast ? 2.5 + Math.random() * 4 : 1.8 + Math.random() * 2.6,
          alpha: 1,
          decay: isBigBlast ? 0.014 + Math.random() * 0.015 : 0.022 + Math.random() * 0.02,
          friction: 0.94,
          color: palette[Math.floor(Math.random() * palette.length)],
        });
      }

      // Cap total particles for smooth 60fps on mobile
      if (particles.length > 260) {
        particles.splice(0, particles.length - 260);
      }
    };

    const spawnTrailSpark = (x: number, y: number) => {
      bulbs.push({
        x,
        y,
        radius: 6,
        maxRadius: 34,
        alpha: 0.42,
        decay: 0.055,
        color: palette[1] || "#aef6cf",
      });
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.8;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.5 + Math.random() * 2,
          alpha: 0.85,
          decay: 0.035 + Math.random() * 0.02,
          friction: 0.92,
          color: palette[Math.floor(Math.random() * palette.length)],
        });
      }
    };

    const isMenuOrInteractive = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return Boolean(
        target.closest(
          "header, nav, [role='menuitem'], [role='menu'], .btn-brand, button"
        )
      );
    };

    const onPointerDown = (e: PointerEvent) => {
      lastInteraction = performance.now();
      const bigBlast = isMenuOrInteractive(e.target);
      spawnBurst(e.clientX, e.clientY, bigBlast);
    };

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      lastInteraction = now;
      if (now - lastTrailTime > 38) {
        lastTrailTime = now;
        spawnTrailSpark(e.clientX, e.clientY);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      const now = performance.now();
      lastInteraction = now;
      if (now - lastTrailTime > 38 && e.touches.length > 0) {
        lastTrailTime = now;
        const touch = e.touches[0];
        spawnTrailSpark(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("brand-theme-changed", refreshPalette);

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const now = performance.now();

      ctx.clearRect(0, 0, width, height);

      // Ambient idle menu/header blast pulse when user is not touching
      if (now - lastInteraction > 2400 && now - lastIdlePulse > 2600) {
        lastIdlePulse = now;
        const headerEl = document.querySelector("header nav, header");
        if (headerEl) {
          const rect = headerEl.getBoundingClientRect();
          const pulseX = rect.left + rect.width * (0.25 + Math.random() * 0.5);
          const pulseY = rect.top + rect.height * 0.55;
          spawnBurst(pulseX, pulseY, true);
        } else {
          spawnBurst(width * 0.5, 42, true);
        }
      }

      ctx.globalCompositeOperation = "lighter";

      // Draw luminous bulb glows
      for (let i = bulbs.length - 1; i >= 0; i--) {
        const b = bulbs[i];
        b.radius += (b.maxRadius - b.radius) * 0.14;
        b.alpha -= b.decay;
        if (b.alpha <= 0.01) {
          bulbs.splice(i, 1);
          continue;
        }
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        grad.addColorStop(0, b.color);
        grad.addColorStop(0.35, b.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.save();
        ctx.globalAlpha = Math.max(0, b.alpha * 0.65);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw shockwave ripple rings
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.alpha = 1 - r.radius / r.maxRadius;
        if (r.alpha <= 0.01) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, r.alpha);
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = r.color;
        ctx.lineWidth = r.lineWidth;
        ctx.shadowBlur = 16;
        ctx.shadowColor = r.color;
        ctx.stroke();
        ctx.restore();
      }

      // Draw glowing spark particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0.01) {
          particles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.globalCompositeOperation = "source-over";
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("brand-theme-changed", refreshPalette);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-[9999] pointer-events-none block w-screen h-screen"
    />
  );
}
