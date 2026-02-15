// components/BookmarkList.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  user_id: string;
  created_at: string;
}

export default function BookmarkList({
  searchQuery = "",
  onNoMatchesChange
}: {
  searchQuery?: string;
  onNoMatchesChange?: (noMatches: boolean) => void;
}) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredBookmarks = bookmarks.filter((bookmark) =>
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (onNoMatchesChange) {
      const isSearchActive = searchQuery.trim().length > 0;
      const noResults = isSearchActive && filteredBookmarks.length === 0;
      onNoMatchesChange(noResults);
    }
  }, [filteredBookmarks.length, searchQuery, onNoMatchesChange]);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const initialize = async (userId: string) => {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setBookmarks(data);
      }

      setLoading(false);

      channel = supabase
        .channel(`bookmarks-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            console.log("Realtime payload:", payload);

            if (payload.eventType === "INSERT") {
              const newBookmark = payload.new as Bookmark;

              setBookmarks((prev) => {
                if (prev.some((b) => b.id === newBookmark.id)) {
                  return prev;
                }
                return [newBookmark, ...prev];
              });
            }

            if (payload.eventType === "DELETE") {
              setBookmarks((prev) =>
                prev.filter((b) => b.id !== payload.old.id)
              );
            }

            if (payload.eventType === "UPDATE") {
              const updated = payload.new as Bookmark;

              setBookmarks((prev) =>
                prev.map((b) =>
                  b.id === updated.id ? updated : b
                )
              );
            }
          }
        )
        .subscribe((status) => {
          console.log("Realtime status:", status);
        });
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        initialize(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    const previousBookmarks = [...bookmarks];

    setBookmarks((prev) => prev.filter((b) => b.id !== id));

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Failed to delete bookmark");
      setBookmarks(previousBookmarks);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-40 bg-white/5 animate-pulse rounded-[2rem] border border-white/5"
          />
        ))}
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-xl group-hover:scale-110 transition-transform duration-500">
            <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">No bookmarks found</h3>
          <p className="mt-3 text-slate-500 font-bold max-w-xs mx-auto text-sm uppercase tracking-widest leading-relaxed">
            Your digital repository is currently empty. Add your first resource above.
          </p>
        </div>
      </div>
    );
  }

  if (filteredBookmarks.length === 0) {
    return (
      <div className="text-center py-24 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-50" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
            <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight uppercase">No matches found</h3>
          <p className="mt-4 text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            No bookmarks match your search query "<span className="text-blue-500">{searchQuery}</span>"
          </p>
          <div className="mt-8 px-6 py-2 bg-white/5 border border-white/5 rounded-full text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">
            Press <span className="text-blue-500">Enter</span> to Search Google instead
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredBookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          onClick={() => window.open(bookmark.url, "_blank")}
          className="group relative h-full flex flex-col rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-2xl border border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(59,130,246,0.15)] hover:-translate-y-2 transition-all duration-300 overflow-hidden cursor-pointer before:absolute before:inset-0 before:rounded-3xl before:border before:border-white/5 before:pointer-events-none hover:border-white/20"
        >
          <div className="flex-1 p-7 flex flex-col justify-between relative z-10">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-black text-white text-xl tracking-tight leading-tight line-clamp-2" title={bookmark.title}>
                  {bookmark.title}
                </h3>
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-colors">
                  <svg className="w-5 h-5 text-slate-500 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                </div>
              </div>
              <div className="text-sm font-bold text-white/50 group-hover:text-white break-all line-clamp-2 transition-colors inline-block ">
                {bookmark.url}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between pt-5 border-t border-white/5">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                {new Date(bookmark.created_at).toLocaleDateString()}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(bookmark.id, bookmark.title);
                }}
                className="text-[10px] font-black text-red-500/65 hover:text-red-500 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-all tracking-widest z-20"
                title="Remove Bookmark"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
