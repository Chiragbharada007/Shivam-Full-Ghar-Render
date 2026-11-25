"use client";

import React, { useRef, useState } from "react";
import { Eye, EyeOff, Search, X, CheckCircle2, AlertCircle, Plus, Minus, Calendar } from "lucide-react";

// 01 Floating Label Input
export function FloatingLabelInput({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className="peer w-full px-4 pt-5 pb-2 rounded-2xl bg-white/80 dark:bg-white/5 border border-black/15 dark:border-white/15 text-sm text-zinc-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition-all"
      />
      <label className="pointer-events-none absolute left-4 top-3.5 text-xs text-zinc-500 dark:text-zinc-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-emerald-500 peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px]">
        {label}
      </label>
    </div>
  );
}

// 02 Password Input with visibility toggle & strength
export function PasswordInput({
  label = "Password",
  value,
  onChange,
  showStrength = false,
}: {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  showStrength?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const score = Math.min(4, (value.length >= 6 ? 1 : 0) + (/[A-Z]/.test(value) ? 1 : 0) + (/[0-9]/.test(value) ? 1 : 0) + (/[^A-Za-z0-9]/.test(value) ? 1 : 0));

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          className="w-full px-4 py-3 pr-11 rounded-2xl bg-white/80 dark:bg-white/5 border border-black/15 dark:border-white/15 text-sm text-zinc-900 dark:text-white focus:border-emerald-500 focus:outline-hidden"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {showStrength && value.length > 0 && (
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((lvl) => (
            <div
              key={lvl}
              className={`h-1 flex-1 rounded-full transition-colors ${
                score >= lvl ? (score >= 3 ? "bg-emerald-500" : "bg-amber-500") : "bg-zinc-200 dark:bg-zinc-800"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// 03 Search Input
export function SearchInput({
  value,
  onChange,
  placeholder = "Search garlands, mogra, car decor...",
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative flex items-center">
      <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-16 py-2.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-black/15 dark:border-white/15 text-sm text-zinc-900 dark:text-white focus:border-emerald-500 focus:outline-hidden"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-zinc-400"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      ) : (
        <span className="absolute right-3 text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-zinc-500">
          ⌘K
        </span>
      )}
    </div>
  );
}

// 04 Validation Input
export function ValidationInput({
  label,
  value,
  onChange,
  error,
  valid,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  valid?: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          className={`w-full px-4 py-3 pr-10 rounded-2xl bg-white/80 dark:bg-white/5 border text-sm focus:outline-hidden ${
            error
              ? "border-rose-500 text-rose-600 dark:text-rose-300"
              : valid
              ? "border-emerald-500 text-zinc-900 dark:text-white"
              : "border-black/15 dark:border-white/15 text-zinc-900 dark:text-white"
          }`}
        />
        {error && <AlertCircle className="w-4 h-4 text-rose-500 absolute right-3.5 top-1/2 -translate-y-1/2" />}
        {!error && valid && <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3.5 top-1/2 -translate-y-1/2" />}
      </div>
      {error && <p className="text-[11px] text-rose-500 px-1">{error}</p>}
    </div>
  );
}

// 05 One-Time Code (OTP) Input
export function OtpCodeInput({
  length = 6,
  value,
  onChange,
}: {
  length?: number;
  value: string;
  onChange: (val: string) => void;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] || "");

  const updateDigit = (idx: number, char: string) => {
    const clean = char.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = clean;
    onChange(next.join(""));
    if (clean && idx < length - 1) refs.current[idx + 1]?.focus();
  };

  return (
    <div className="flex items-center gap-2">
      {digits.map((d, idx) => (
        <input
          key={idx}
          ref={(el) => {
            refs.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => updateDigit(idx, e.target.value)}
          className="w-10 h-12 rounded-xl bg-white/80 dark:bg-white/10 border border-black/15 dark:border-white/20 text-center font-mono-tech font-bold text-base focus:border-emerald-500 focus:outline-hidden"
        />
      ))}
    </div>
  );
}

// 06 Stepper Input
export function StepperInput({
  value,
  onChange,
  min = 1,
  max = 50,
  label,
}: {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  label?: string;
}) {
  return (
    <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-black/15 dark:border-white/15">
      {label && <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>}
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-7 h-7 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="font-mono-tech font-bold text-sm w-6 text-center">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-7 h-7 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// 07 Tags Input
export function TagsInput({
  tags,
  onChange,
  placeholder = "Add flower or colour tag & press Enter...",
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const clean = draft.trim();
    if (clean && !tags.includes(clean)) {
      onChange([...tags, clean]);
    }
    setDraft("");
  };

  return (
    <div className="p-2.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-black/15 dark:border-white/15 flex flex-wrap gap-1.5 items-center">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30"
        >
          <span>{tag}</span>
          <button type="button" onClick={() => onChange(tags.filter((t) => t !== tag))}>
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag();
          }
        }}
        placeholder={placeholder}
        className="flex-1 min-w-[140px] bg-transparent text-xs px-2 py-1 focus:outline-hidden text-zinc-900 dark:text-white"
      />
    </div>
  );
}

// 08 Date Mask Input (DD/MM/YYYY)
export function DateMaskInput({
  value,
  onChange,
  label = "Event Date (DD/MM/YYYY)",
}: {
  value: string;
  onChange: (val: string) => void;
  label?: string;
}) {
  const handleInput = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    let formatted = digits;
    if (digits.length > 2) formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    if (digits.length > 4) formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    onChange(formatted);
  };

  return (
    <div className="relative">
      <Calendar className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => handleInput(e.target.value)}
        placeholder={label}
        maxLength={10}
        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-black/15 dark:border-white/15 font-mono-tech text-sm text-zinc-900 dark:text-white focus:border-emerald-500 focus:outline-hidden"
      />
    </div>
  );
}
