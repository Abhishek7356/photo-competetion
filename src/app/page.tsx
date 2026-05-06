"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [photos, setPhotos] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedId, setVotedId] = useState<string | null>(null);
  const [modalPhoto, setModalPhoto] = useState<any | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // Auth check — redirect to /login if no userId
  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) {
      router.replace("/login");
    } else {
      setUserId(id);
    }
  }, []);

  const fetchPhotos = async () => {
    const res = await fetch("/api/photos");
    const data = await res.json();
    setPhotos(data);
  };

  useEffect(() => {
    if (userId) fetchPhotos();
  }, [userId]);

  // Close modal on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalPhoto(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    window.location.reload();
  };

  const vote = async (photoId: string) => {
    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, photoId }),
    });
    const data = await res.json();
    if (res.ok) {
      setHasVoted(true);
      setVotedId(photoId);
      fetchPhotos();
    } else {
      alert(data.error);
      setHasVoted(true);
    }
  };

  if (!userId) return null;

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-serif">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-px h-5 bg-stone-800" />
            <span className="text-stone-800 text-sm font-semibold tracking-widest uppercase">
              Photo Competition
            </span>
          </div>

          {/* Nav actions */}
          <div className="flex items-center gap-2">
            {/* Voting status pill */}
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Voting Open
            </span>

            {/* Admin */}
            <a
              href="/admin"
              className="flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg px-3 py-1.5 transition-all duration-150"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin
            </a>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg px-3 py-1.5 transition-all duration-150"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Page heading */}
        <div className="mb-10 border-b border-stone-200 pb-8">
          <p className="text-xs text-stone-400 uppercase tracking-widest font-medium mb-2">Annual Exhibition</p>
          <h1 className="text-stone-900 text-3xl font-semibold tracking-tight mb-2">
            Entries Gallery
          </h1>
          <p className="text-stone-500 text-sm">
            {hasVoted
              ? "Your vote has been recorded. Thank you for participating."
              : "Review all submissions and cast your single vote for the entry you find most outstanding."}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo: any) => {
            const isVoted = votedId === photo.id;
            return (
              <div
                key={photo.id}
                className={`group bg-white border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md ${
                  isVoted
                    ? "border-stone-800 shadow-sm ring-1 ring-stone-800/10"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                {/* Voted ribbon */}
                {isVoted && (
                  <div className="flex items-center gap-1.5 bg-stone-800 px-4 py-1.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white text-[10px] font-semibold tracking-widest uppercase">Your Vote</span>
                  </div>
                )}

                {/* Image */}
                <div
                  className="relative aspect-[4/3] overflow-hidden bg-stone-100 cursor-zoom-in"
                  onClick={() => setModalPhoto(photo)}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 backdrop-blur-sm border border-stone-200 rounded-full px-3 py-1.5 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2m8-16h2a2 2 0 012 2v2m0 8v2a2 2 0 01-2 2h-2" />
                      </svg>
                      <span className="text-stone-600 text-[10px] font-medium">View</span>
                    </div>
                  </div>
                </div>

                {/* Card footer */}
                <div className="px-4 py-3.5 border-t border-stone-100">
                  <h3 className="text-stone-800 text-sm font-semibold tracking-tight mb-3 truncate">
                    {photo.title}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-stone-400">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-medium">{photo.likes}</span>
                    </div>

                    <button
                      disabled={hasVoted}
                      onClick={() => vote(photo.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 ${
                        hasVoted
                          ? isVoted
                            ? "bg-stone-800 text-white cursor-default"
                            : "bg-stone-100 text-stone-300 cursor-not-allowed"
                          : "bg-stone-800 hover:bg-stone-700 text-white active:scale-[0.97]"
                      }`}
                    >
                      {isVoted ? (
                        <>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Voted
                        </>
                      ) : hasVoted ? (
                        "Unavailable"
                      ) : (
                        "Cast Vote"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {photos.length === 0 && (
          <div className="text-center py-24 border border-dashed border-stone-300 rounded-xl bg-white">
            <svg className="w-10 h-10 mx-auto mb-4 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-stone-400 text-sm font-medium">No entries submitted yet.</p>
            <p className="text-stone-300 text-xs mt-1">Check back soon.</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-stone-200 flex items-center justify-between">
          <p className="text-stone-400 text-xs">Each participant may cast one vote only.</p>
          <p className="text-stone-300 text-xs">Photo Competition · {new Date().getFullYear()}</p>
        </div>
      </main>

      {/* ── Photo Modal ── */}
      {modalPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
          onClick={() => setModalPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                {votedId === modalPhoto.id && (
                  <span className="flex items-center gap-1 bg-stone-800 text-white text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Your Vote
                  </span>
                )}
                <h2 className="text-stone-800 text-sm font-semibold">{modalPhoto.title}</h2>
              </div>
              <button
                onClick={() => setModalPhoto(null)}
                className="flex items-center justify-center w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-700 transition-all duration-150"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Full image */}
            <div className="bg-stone-50 flex items-center justify-center" style={{ maxHeight: "65vh" }}>
              <img
                src={modalPhoto.imageUrl}
                alt={modalPhoto.title}
                className="w-full object-contain"
                style={{ maxHeight: "65vh" }}
              />
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-stone-100 bg-white">
              <div className="flex items-center gap-1.5 text-stone-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-stone-500">{modalPhoto.likes} votes</span>
              </div>

              <button
                disabled={hasVoted}
                onClick={() => {
                  vote(modalPhoto.id);
                  setModalPhoto(null);
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 ${
                  hasVoted
                    ? votedId === modalPhoto.id
                      ? "bg-stone-800 text-white cursor-default"
                      : "bg-stone-100 text-stone-300 cursor-not-allowed"
                    : "bg-stone-800 hover:bg-stone-700 text-white active:scale-[0.97]"
                }`}
              >
                {votedId === modalPhoto.id ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Voted
                  </>
                ) : hasVoted ? "Unavailable" : "Cast Vote for This Entry"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}