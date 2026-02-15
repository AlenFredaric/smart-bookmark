//app/login/page.tsx
"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const loginWithGoogle = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen h-[100dvh] bg-[#030712] flex items-center justify-center relative overflow-hidden font-sans antialiased text-slate-200">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1f] via-[#030712] to-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[500px] bg-indigo-500/10 blur-[160px] rounded-full opacity-60" />
      </div>
      <div className="relative z-10 w-full max-w-5xl mx-4 group h-fit max-h-[90vh]">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-blue-500/10 to-indigo-500/20 rounded-[2.5rem] blur-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
        <div className="relative p-[1px] rounded-[2.5rem] bg-gradient-to-b from-white/20 via-white/5 to-white/10 shadow-[0_40px_100px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
          <div className="grid md:grid-cols-2 rounded-[2.45rem] overflow-hidden backdrop-blur-3xl bg-[#030712]/40">

            {/* LEFT PANEL */}
            <div className="bg-white p-8 md:p-14 flex flex-col justify-center items-center md:items-start rounded-[2rem] m-2 shadow-2xl space-y-12">
              <div className="w-full">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-10">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl overflow-hidden transition-transform group-hover:zoom-in">
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-black flex items-center justify-center">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </div>
                  </div>

                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    Smart <span className="text-[#1c1b54]">Bookmark</span>
                  </span>

                </div>

                <div className="space-y-3 text-center md:text-left">
                  <h2 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-none">Welcome Back.</h2>
                  <p className="text-slate-500 font-semibold text-lg tracking-tight">Login to your creative workspace.</p>
                </div>
              </div>

              <div className="w-full space-y-8">
                <button
                  onClick={loginWithGoogle}
                  disabled={loading}
                  className="w-full group/btn relative flex items-center justify-center gap-4 py-5 bg-[#1a1a1a] hover:bg-black text-white rounded-2xl font-bold text-lg shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />

                  {loading ? (
                    <span className="flex items-center gap-3">
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    <>
                      <div className="bg-white p-1 rounded-lg">
                        <svg className="w-6 h-6" viewBox="0 0 48 48">
                          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.8 6.1 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10.5 0 19.4-7.6 19.4-20 0-1.3-.1-2.4-.4-3.5z" />
                          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16.1 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.8 6.1 29.2 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                          <path fill="#4CAF50" d="M24 44c5.2 0 9.8-2 13.1-5.2l-6-5.1c-2 1.5-4.6 2.3-7.1 2.3-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z" />
                          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 3-3 5.3-5.2 6.8l6 5.1C39.6 36.6 43.6 29.6 43.6 24c0-1.3-.1-2.4-.4-3.5z" />
                        </svg>
                      </div>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                  Protected by Enterprise Security
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="relative hidden md:flex bg-blue-400 overflow-hidden group/right items-start justify-center pt-8">
              <div className="absolute inset-0 z-0">
                <div className="absolute w-[200%] h-[200%] -top-[50%] -right-[50%] bg-gradient-to-br from-blue-600 via-indigo-950 to-[#020617] blur-[120px] opacity-90" />
                <div className="absolute top-[20%] right-[20%] w-72 h-72 bg-blue-500/30 blur-[100px] rounded-full animate-pulse duration-[4000ms]" />
                <div className="absolute bottom-[20%] left-[20%] w-96 h-96 bg-indigo-600/20 blur-[110px] rounded-full" />
              </div>

              <div className="relative z-10  p-12 text-center transform transition-all duration-700 group-hover/right:scale-105">
                <div className="space-y-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] mb-4">
                    <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <div className="space-y-0">
                    <h3 className="text-5xl font-black tracking-tighter text-white leading-[0.9]">
                      Design. <br /> Organize. <br /> Conquer.
                    </h3>
                    <p className="text-indigo-200/50 font-bold uppercase tracking-widest text-[11px] max-w-[240px] mx-auto leading-relaxed">
                      The ultimate hub for your digital universe.
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-10 left-10 right-10 py-5 px-8 rounded-3xl bg-white/5 backdrop-blur-3xl border border-white/5 text-[9px] text-indigo-100/30 text-center uppercase tracking-[0.3em] font-black leading-relaxed">
                @2026 SMART BOOKMARK SYSTEM <br />
                ENCRYPTED ACCESS ONLY
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
