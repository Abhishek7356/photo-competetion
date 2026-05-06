"use client";
import { useEffect, useState } from "react";


export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

useEffect(() => {
  const pass = prompt("Enter admin password");

  if (pass === "admin123") {
    setAuthorized(true);
  } else {
    setAuthorized(false);
    window.location.href = "/";
  }
}, []);

// 👇 IMPORTANT: prevent mismatch
if (authorized === null) {
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Checking access...
    </div>
  );
}

if (!authorized) return null;

  const handleUpload = async () => {
    if (!file || !title || !name || !phone) {
      alert("All fields are required");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("name", name);
    formData.append("phone", phone);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    setLoading(false);
    if (res.ok) {
      alert("Uploaded successfully ✅");
      setFile(null);
      setTitle("");
      setName("");
      setPhone("");
    } else {
      const data = await res.json();
      alert(data.error || "Upload failed");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-12">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-indigo-500/6 rounded-full blur-[80px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="relative bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-sm shadow-2xl shadow-black/50">
          {/* Top shimmer */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

          {/* Header */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
              <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div className="text-center">
              <h1 className="text-white text-xl font-semibold tracking-tight">Admin Upload</h1>
              <p className="text-white/40 text-sm mt-1">Add a new competition entry</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Photo Title */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-widest">
                Photo Title
              </label>
              <input
                type="text"
                placeholder="Enter a title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none transition-all duration-200 focus:border-violet-500/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-violet-500/20"
              />
            </div>

            {/* Participant Name */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-widest">
                Participant Name
              </label>
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none transition-all duration-200 focus:border-violet-500/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-violet-500/20"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-widest">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+91 00000 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none transition-all duration-200 focus:border-violet-500/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-violet-500/20"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-widest">
                Photo File
              </label>
              <label
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
                  dragOver
                    ? "border-violet-500/60 bg-violet-500/10"
                    : file
                    ? "border-violet-500/40 bg-violet-500/5"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-violet-500/30 hover:bg-white/[0.04]"
                }`}
              >
                {file ? (
                  <div className="flex flex-col items-center gap-2 px-4 text-center">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                      <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-violet-300 text-xs font-medium truncate max-w-[200px]">{file.name}</span>
                    <span className="text-white/30 text-[10px]">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="text-white/30 text-xs">Drop image here or <span className="text-violet-400">browse</span></span>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </label>
            </div>

            {/* Submit */}
            <button
              onClick={handleUpload}
              disabled={!file || !title || !name || !phone || loading}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/30 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>
                  Upload Photo
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          Restricted access — admins only
        </p>
      </div>
    </div>
  );
}