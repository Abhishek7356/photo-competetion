"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    setLoading(true);
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (res.ok) setStep("otp");
  };

  const verifyOtp = async () => {
    setLoading(true);
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      localStorage.setItem("userId", data.userId);
      window.location.href = "/";
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">

          {/* Brand bar */}
          <div className="flex items-center gap-2.5 mb-7 pb-5 border-b border-stone-200">
            <div className="w-px h-5 bg-stone-800" />
            <span className="text-stone-500 text-[11px] font-semibold tracking-widest uppercase">
              Photo Competition
            </span>
          </div>

          {/* Icon */}
          <div className="w-10 h-10 rounded-lg border border-stone-200 bg-stone-50 flex items-center justify-center mb-4">
            {step === "email" ? (
              <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            )}
          </div>

          {/* Heading */}
          <h1 className="text-stone-900 text-xl font-semibold tracking-tight mb-1">
            {step === "email" ? "Welcome back" : "Check your inbox"}
          </h1>
          <p className="text-stone-400 text-sm mb-5">
            {step === "email" ? "Sign in with your email address." : `We sent a code to ${email}`}
          </p>

          {/* Step progress */}
          <div className="flex gap-1.5 mb-6">
            <div className="flex-1 h-0.5 rounded-full bg-stone-800" />
            <div className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${step === "otp" ? "bg-stone-800" : "bg-stone-200"}`} />
          </div>

          {/* Fields */}
          <div className="space-y-4">
            {step === "email" ? (
              <>
                <div>
                  <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-widest mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-stone-800 placeholder-stone-300 text-sm outline-none transition-all duration-150 focus:border-stone-400 focus:bg-white"
                  />
                </div>
                <button
                  onClick={sendOtp}
                  disabled={!email || loading}
                  className="w-full bg-stone-800 hover:bg-stone-700 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl text-sm transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <>
                      Send code
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-widest mb-2">
                    One-time password
                  </label>
                  <input
                    placeholder="000000"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
                    maxLength={6}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-stone-800 placeholder-stone-300 text-sm outline-none transition-all duration-150 focus:border-stone-400 focus:bg-white tracking-[0.5em] font-mono text-center"
                  />
                </div>
                <button
                  onClick={verifyOtp}
                  disabled={!code || loading}
                  className="w-full bg-stone-800 hover:bg-stone-700 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl text-sm transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <>
                      Verify &amp; sign in
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setStep("email")}
                  className="w-full text-stone-300 hover:text-stone-500 text-xs py-2 transition-colors duration-150"
                >
                  ← Use a different email
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-stone-300 text-xs mt-5">
          By continuing, you agree to our Terms &amp; Privacy Policy
        </p>
      </div>
    </div>
  );
}