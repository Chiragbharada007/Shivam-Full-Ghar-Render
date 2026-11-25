"use client";

import React, { useState } from "react";

// 1. Range Slider with Price Histogram
export function RangeHistogramSlider({
  min = 500,
  max = 15000,
  value,
  onChange,
}: {
  min?: number;
  max?: number;
  value: [number, number];
  onChange: (next: [number, number]) => void;
}) {
  const bars = [25, 45, 70, 95, 80, 60, 42, 30, 50, 20];
  return (
    <div className="space-y-2">
      <div className="flex items-end gap-1 h-12 px-1">
        {bars.map((h, i) => {
          const barPrice = min + ((max - min) * i) / (bars.length - 1);
          const inRange = barPrice >= value[0] && barPrice <= value[1];
          return (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className={`flex-1 rounded-t-md transition-colors ${
                inRange ? "bg-gradient-to-t from-emerald-600 to-rose-500" : "bg-zinc-200 dark:bg-zinc-800"
              }`}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={250}
          value={value[0]}
          onChange={(e) => onChange([Math.min(Number(e.target.value), value[1] - 250), value[1]])}
          className="w-full accent-emerald-600 cursor-pointer"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={250}
          value={value[1]}
          onChange={(e) => onChange([value[0], Math.max(Number(e.target.value), value[0] + 250)])}
          className="w-full accent-rose-500 cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-[11px] font-mono-tech text-zinc-500 dark:text-zinc-400">
        <span>₹{value[0].toLocaleString("en-IN")}</span>
        <span>₹{value[1].toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}

// 2. Stepped Slider
export function SteppedSlider({
  steps = ["3 ft", "4 ft", "5 ft", "6 ft"],
  index,
  onChange,
}: {
  steps?: string[];
  index: number;
  onChange: (idx: number) => void;
}) {
  return (
    <div className="space-y-2">
      <input
        type="range"
        min={0}
        max={steps.length - 1}
        step={1}
        value={index}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-emerald-600 cursor-pointer"
      />
      <div className="flex justify-between text-[11px] font-mono-tech">
        {steps.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => onChange(i)}
            className={`px-2 py-0.5 rounded-lg transition-colors ${
              i === index ? "bg-emerald-600 text-white font-bold" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// 3. Value Bubble Slider
export function ValueBubbleSlider({
  min = 0,
  max = 100,
  value,
  onChange,
  unit = "%",
}: {
  min?: number;
  max?: number;
  value: number;
  onChange: (val: number) => void;
  unit?: string;
}) {
  const pct = ((value - min) / (max - min || 1)) * 100;
  return (
    <div className="relative pt-7">
      <div
        className="absolute top-0 -translate-x-1/2 px-2 py-0.5 rounded-lg bg-emerald-600 text-white font-mono-tech text-[11px] font-bold shadow-md pointer-events-none"
        style={{ left: `${pct}%` }}
      >
        {value}
        {unit}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-emerald-600 cursor-pointer"
      />
    </div>
  );
}

// 4. Vertical Slider
export function VerticalSlider({
  value,
  onChange,
  label = "Depth",
}: {
  value: number;
  onChange: (val: number) => void;
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="h-24 flex items-center justify-center">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-24 -rotate-90 accent-emerald-600 cursor-pointer"
        />
      </div>
      <span className="text-[10px] font-mono-tech text-zinc-400">
        {label}: {value}%
      </span>
    </div>
  );
}

// 5. Emoji Feedback Slider
export function EmojiFeedbackSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) {
  const emojis = ["😞", "😐", "🙂", "😊", "🤩"];
  const idx = Math.min(4, Math.max(0, value - 1));
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
      <span className="text-2xl">{emojis[idx]}</span>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-rose-500 cursor-pointer"
      />
      <span className="text-xs font-mono-tech font-bold">{value}/5</span>
    </div>
  );
}

// 6. Color Hue Slider
export function ColorHueSlider({
  hue,
  onChange,
}: {
  hue: number;
  onChange: (hue: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-400">Floral Theme Hue</span>
        <span
          className="w-5 h-5 rounded-full border border-white/30 shadow-sm"
          style={{ backgroundColor: `hsl(${hue}, 82%, 56%)` }}
        />
      </div>
      <input
        type="range"
        min={0}
        max={360}
        value={hue}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-3 rounded-full appearance-none cursor-pointer"
        style={{
          background:
            "linear-gradient(to right, #ef4444, #eab308, #22c55e, #06b6d4, #6366f1, #ec4899, #ef4444)",
        }}
      />
    </div>
  );
}

// 7. Rotary Knob Slider
export function RotaryKnobSlider({
  value,
  onChange,
  label = "Intensity",
}: {
  value: number;
  onChange: (val: number) => void;
  label?: string;
}) {
  const angle = -135 + (value / 100) * 270;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange((value + 20) % 120)}
        title="Click to adjust"
        className="relative w-14 h-14 rounded-full bg-zinc-900 border-2 border-emerald-500/50 flex items-center justify-center shadow-lg cursor-pointer"
      >
        <div
          className="w-1 h-5 bg-rose-400 rounded-full origin-bottom transition-transform"
          style={{ transform: `rotate(${angle}deg) translateY(-6px)` }}
        />
      </button>
      <span className="text-[10px] font-mono-tech text-zinc-400">
        {label} {value}%
      </span>
    </div>
  );
}

// 8. Scrubber Slider with Preview Pill
export function VideoScrubberSlider({
  totalFrames = 6,
  frame,
  onChange,
}: {
  totalFrames?: number;
  frame: number;
  onChange: (frame: number) => void;
}) {
  const [hovering, setHovering] = useState(false);
  return (
    <div
      className="relative pt-2"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {hovering && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-lg bg-black/85 text-white text-[10px] font-mono-tech border border-emerald-500/40">
          Angle {frame + 1}/{totalFrames}
        </div>
      )}
      <input
        type="range"
        min={0}
        max={totalFrames - 1}
        step={1}
        value={frame}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-emerald-500 cursor-pointer"
      />
    </div>
  );
}
