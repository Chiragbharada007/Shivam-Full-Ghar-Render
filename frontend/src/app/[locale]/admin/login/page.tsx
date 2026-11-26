"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  Lock,
  Mail,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";

export default function AdminLoginPage() {
  const locale = useLocale();
  const router = useRouter();

  // Lamp pull-cord toggle state (Prompt 7)
  const [lampLit, setLampLit] = useState(true);

  // Step 1: credentials, Step 2: optional 2FA OTP verification, Step 3: security questions fallback
  const [step, setStep] = useState<"CREDENTIALS" | "OTP" | "SECURITY_QUESTIONS">("CREDENTIALS");

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [maskedMobile, setMaskedMobile] = useState("+91 99*** *8134");
  const [countdown, setCountdown] = useState(60);
  const [whatsappOtpUrl, setWhatsappOtpUrl] = useState<string>("");

  // Security Questions State
  const [securityQ1, setSecurityQ1] = useState("What is your primary flower shop location?");
  const [securityQ2, setSecurityQ2] = useState("What is your business registered brand name?");
  const [securityA1, setSecurityA1] = useState("");
  const [securityA2, setSecurityA2] = useState("");

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for resending OTP
  useEffect(() => {
    let timer: any;
    if (step === "OTP" && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Method 1: Direct Password Sign In (100% Free, Zero API, No SMS required)
  const handleDirectSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both administrator email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.detail || "Invalid credentials. Please verify your email and password.");
        setLoading(false);
      } else {
        router.push(`/${locale}/admin/dashboard`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to authenticate.");
      setLoading(false);
    }
  };

  // Method 3: Switch to Security Questions Fallback
  const handleSwitchToSecurityQuestions = async () => {
    if (!email) {
      setError("Please enter your administrator email first.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/admin-security-questions?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success) {
        if (data.question1) setSecurityQ1(data.question1);
        if (data.question2) setSecurityQ2(data.question2);
        setStep("SECURITY_QUESTIONS");
      } else {
        setError(data.message || "Failed to load security questions.");
      }
    } catch {
      setError("Failed to load security questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify Security Questions & Sign In
  const handleVerifySecurityQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityA1.trim() || !securityA2.trim()) {
      setError("Please answer both security questions.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/admin-security-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          answer1: securityA1,
          answer2: securityA2,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Security answers verification failed.");
        setLoading(false);
        return;
      }

      router.push(`/${locale}/admin/dashboard`);
    } catch (err: any) {
      setError(err.message || "Security questions verification failed");
      setLoading(false);
    }
  };

  // Method 2: Request 2FA OTP (via SMS / WhatsApp)
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password first.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/admin-otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        setMaskedMobile(data.maskedMobile || "+91 99*** *8134");
        setStep("OTP");
        setCountdown(60);

        if (data.rawPhone) {
          const raw = String(data.rawPhone).replace(/\D/g, "");
          const intlPhone = raw.startsWith("91") ? raw : `91${raw}`;
          const msg = `Shivam Full Ghar Admin Login: Your 60-second OTP code is required to complete authentication.`;
          setWhatsappOtpUrl(`https://wa.me/${intlPhone}?text=${encodeURIComponent(msg)}`);
        } else {
          setWhatsappOtpUrl("");
        }

        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 150);
      } else {
        setError(data.message || "Invalid email or password.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to authenticate. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  // OTP inputs handling
  const handleDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "");
    if (!clean) {
      const nextDigits = [...otpDigits];
      nextDigits[index] = "";
      setOtpDigits(nextDigits);
      return;
    }

    const nextDigits = [...otpDigits];
    nextDigits[index] = clean.slice(-1);
    setOtpDigits(nextDigits);

    // Auto-advance to next input
    if (index < 5 && clean) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const nextDigits = [...otpDigits];
    for (let i = 0; i < pasted.length; i++) {
      nextDigits[i] = pasted[i];
    }
    setOtpDigits(nextDigits);
    const focusIdx = Math.min(pasted.length, 5);
    otpInputRefs.current[focusIdx]?.focus();
  };

  // Step 2: Verify OTP & Sign In to NextAuth
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join("");

    if (enteredOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP code.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // 1. Verify OTP with our OTP service
      const verifyRes = await fetch("/api/auth/admin-otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: enteredOtp }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        setError(verifyData.message || "Invalid OTP code.");
        setLoading(false);
        return;
      }

      router.push(`/${locale}/admin/dashboard`);
    } catch (err: any) {
      setError(err.message || "OTP verification failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-3xl bg-stone-800/95 border border-stone-700/80 p-8 shadow-2xl space-y-6">
        {/* Lamp Pull-Cord Toggle (Prompt 7) */}
        <div className="flex flex-col items-center -mt-4 pb-1">
          <button
            type="button"
            onClick={() => setLampLit((v) => !v)}
            aria-label={lampLit ? "Dim admin lamp" : "Pull cord to light admin lamp"}
            aria-expanded={lampLit}
            className="group flex flex-col items-center cursor-pointer focus:outline-hidden"
          >
            <span className="w-0.5 h-5 bg-[#D7B77C]/70 group-hover:h-6 transition-all" />
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-mono-tech font-bold border transition-all ${
                lampLit
                  ? "bg-[#D7B77C] text-[#163526] border-[#D7B77C] shadow-lg shadow-[#D7B77C]/30"
                  : "bg-stone-900 text-stone-400 border-stone-700"
              }`}
            >
              {lampLit ? "Lamp On • Console Ready" : "Pull Cord to Unlock"}
            </span>
          </button>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="relative w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-rose-700 via-rose-800 to-amber-700 flex items-center justify-center text-white shadow-lg shadow-rose-950/40">
            <Image
              src="/icon.svg"
              alt="Shivam Full Ghar"
              width={40}
              height={40}
              className="object-contain"
              unoptimized
            />
          </div>
          <h1 className="text-2xl font-serif font-black text-white">
            Admin Access Portal
          </h1>
          <p className="text-xs text-stone-400">
            Shivam Full Ghar • Authorized Management Console
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-xs text-rose-300 font-medium flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ── STEP 1: Email & Password (Direct Sign In / 2FA Choice) ── */}
        {step === "CREDENTIALS" && (
          <form onSubmit={handleDirectSignIn} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-stone-300 font-medium">Administrator Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:ring-2 focus:ring-rose-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-stone-300 font-medium">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:ring-2 focus:ring-rose-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Primary Action: Direct Sign In (Instant, 100% Free, Zero API) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-800 hover:to-rose-900 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? "Authenticating..." : "Sign In to Admin Dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Optional 2FA Route & Security Questions Fallback */}
            <div className="pt-2 text-center border-t border-stone-700/50 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={loading}
                className="text-[11px] text-stone-400 hover:text-amber-400 font-medium transition-colors cursor-pointer"
              >
                Or verify with 2-Factor Mobile OTP / WhatsApp →
              </button>
              <button
                type="button"
                onClick={handleSwitchToSecurityQuestions}
                disabled={loading}
                className="text-[11px] text-rose-400 hover:text-rose-300 font-medium transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <HelpCircle className="w-3 h-3 text-rose-400" />
                <span>Limit reached or no OTP? Answer 2 Security Questions →</span>
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 2: Two-Factor OTP Verification ── */}
        {step === "OTP" && (
          <form onSubmit={handleVerifyOtp} className="space-y-5 text-xs">
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 space-y-2 text-center">
              <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Two-Factor Authentication</span>
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                6-digit security code sent to registered mobile:
                <strong className="block text-white font-mono text-xs mt-0.5">{maskedMobile}</strong>
                <span className="block text-[11px] text-stone-400 mt-1">and registered email: <strong className="text-stone-200">{email}</strong></span>
                <span className="block text-[10px] text-amber-300 mt-1 font-medium">Valid for 60 seconds • Do not share with anyone</span>
              </p>
            </div>

            {/* 100% Free WhatsApp Direct OTP Button (No API Fees!) */}
            {whatsappOtpUrl && (
              <a
                href={whatsappOtpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Receive Code on WhatsApp</span>
              </a>
            )}

            {/* 6 Digit Input Boxes */}
            <div className="space-y-2">
              <label className="text-stone-300 font-medium block text-center">
                Enter 6-Digit Security Code
              </label>
              <div className="flex items-center justify-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-12 sm:w-12 sm:h-14 rounded-xl bg-stone-900 border-2 border-stone-700 text-center text-lg sm:text-xl font-mono font-bold text-white focus:border-rose-500 focus:outline-hidden transition-colors"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? "Verifying Security Code..." : "Verify OTP & Access Dashboard"}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>

            {/* Resend & Back Actions */}
            <div className="flex items-center justify-between pt-1 text-[11px] text-stone-400">
              <button
                type="button"
                onClick={() => {
                  setStep("CREDENTIALS");
                  setError("");
                }}
                className="flex items-center gap-1 hover:text-stone-200 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back to Sign In</span>
              </button>

              {countdown > 0 ? (
                <span>Resend code in {countdown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleRequestOtp()}
                  className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                >
                  Resend OTP Now
                </button>
              )}
            </div>

            {/* Fallback to Security Questions if OTP limit or delivery fails */}
            <div className="pt-2 text-center border-t border-stone-700/50">
              <button
                type="button"
                onClick={handleSwitchToSecurityQuestions}
                disabled={loading}
                className="text-[11px] text-rose-400 hover:text-rose-300 font-medium transition-colors cursor-pointer flex items-center justify-center gap-1 mx-auto"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Limit reached or no OTP? Answer 2 Security Questions</span>
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 3: Security Questions Verification (Zero API / Limit Fallback) ── */}
        {step === "SECURITY_QUESTIONS" && (
          <form onSubmit={handleVerifySecurityQuestions} className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 space-y-1.5 text-center">
              <div className="flex items-center justify-center gap-1.5 text-rose-300 font-bold text-xs">
                <HelpCircle className="w-4 h-4 text-rose-400" />
                <span>Security Questions Verification</span>
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                Emergency fallback authentication when OTP delivery is unavailable or free monthly limits are reached.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-stone-300 font-medium block">
                Security Question 1:
              </label>
              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-amber-300 font-medium text-xs">
                {securityQ1}
              </div>
              <input
                type="text"
                required
                value={securityA1}
                onChange={(e) => setSecurityA1(e.target.value)}
                placeholder="Enter answer (e.g. Keshod)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:ring-2 focus:ring-rose-600 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-stone-300 font-medium block">
                Security Question 2:
              </label>
              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-amber-300 font-medium text-xs">
                {securityQ2}
              </div>
              <input
                type="text"
                required
                value={securityA2}
                onChange={(e) => setSecurityA2(e.target.value)}
                placeholder="Enter answer (e.g. Shivam Full Ghar)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:ring-2 focus:ring-rose-600 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-800 hover:to-rose-900 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? "Verifying Security Answers..." : "Verify & Sign In to Dashboard"}</span>
            </button>

            <div className="pt-2 text-center border-t border-stone-700/50">
              <button
                type="button"
                onClick={() => {
                  setStep("CREDENTIALS");
                  setError("");
                }}
                className="text-[11px] text-stone-400 hover:text-stone-200 transition-colors cursor-pointer flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back to Sign In</span>
              </button>
            </div>
          </form>
        )}

        <div className="pt-2 text-center text-[11px] text-stone-500 border-t border-stone-700/60">
          Shivam Full Ghar • Authorized Administrator Console Only
        </div>
      </div>
    </div>
  );
}
