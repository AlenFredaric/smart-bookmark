// dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import BookmarkForm from "@/components/BookmarkForm";
import BookmarkList from "@/components/BookmarkList";

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: "", show: false });
    const [searchQuery, setSearchQuery] = useState("");
    const [noMatches, setNoMatches] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (!data.user) {
                router.push("/login");
            } else {
                setUser(data.user);
            }
            setLoading(false);
        };
        checkUser();
    }, [router]);

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ ...toast, show: false });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const showSuccessToast = () => {
        setToast({ message: "Bookmark added successfully!", show: true });
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && noMatches && searchQuery.trim()) {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, "_blank");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#030712]">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-blue-500 animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-4 border-white/5 border-b-indigo-500 animate-spin-slow"></div>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#030712] relative overflow-x-hidden font-sans antialiased text-slate-200">
            {/* Cinematic Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1f] via-[#030712] to-black" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[500px] bg-indigo-500/10 blur-[160px] rounded-full opacity-60" />
            </div>

            {/* Toast Notification */}
            <div className={`fixed top-6 right-6 z-50 transition-all duration-500 transform ${toast.show ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0 pointer-events-none'}`}>
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-4 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white tracking-tight">{toast.message}</p>
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Header */}
                <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#030712]/60 border-b border-white/5 shadow-2xl transition-all duration-300">
                    <div className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between">
                        <div className="flex items-center space-x-4 group cursor-default">
                            <div className="w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all group-hover:scale-110 group-hover:border-white/20 group-hover:shadow-blue-500/20">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">Smart Bookmark</span>
                            
                            </div>
                        </div>
                        <div className="flex items-center space-x-6">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-xs font-bold text-slate-300 lowercase tracking-wider">{user.email}</span>
                                <span className="text-[9px] font-black text-blue-500/50 uppercase tracking-widest mt-0.5">Verified Session</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black text-white uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg backdrop-blur-md"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 pb-32">
                    <div className="space-y-16">
                        <section className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-700" />
                            <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
                                <BookmarkForm onSuccess={showSuccessToast} />
                            </div>
                        </section>

                        <div className="flex justify-center">
                            <div className="relative w-full max-w-xl group">
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-2xl border border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] group-hover:shadow-[0_15px_40px_-10px_rgba(59,130,246,0.15)] transition-all duration-300" />
                                <div className="relative flex items-center">
                                    <svg
                                        className="absolute left-5 w-5 h-5 text-slate-500 pointer-events-none group-focus-within:text-blue-500 transition-colors"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2.5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                                        />
                                    </svg>

                                    <input
                                        type="text"
                                        placeholder="Find bookmarks or search Google"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={handleSearchKeyDown}
                                        className="w-full bg-transparent pl-14 pr-6 py-4 rounded-2xl text-base font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    />
                                </div>

                                {searchQuery && noMatches && (
                                    <div className="absolute -bottom-8 right-0 text-[10px] font-black text-blue-500/60 uppercase tracking-widest animate-pulse">
                                        No local matches • Press <span className="text-blue-500">Enter</span> for Google
                                    </div>
                                )}
                            </div>
                        </div>

                        <section className="space-y-8">
                            <BookmarkList searchQuery={searchQuery} onNoMatchesChange={setNoMatches} />
                        </section>
                    </div>
                </main>

                {/* Footer */}
                <footer className="relative z-30 py-10 text-center text-[10px] text-slate-600 font-bold uppercase tracking-[0.4em] bg-black/40 border-t border-white/5">
                    @2026 SMART BOOKMARK SYSTEM • QUANTUM ENCRYPTED STORAGE
                </footer>
            </div>
        </div>
    );
}
