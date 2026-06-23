"use client";

import React, { useEffect, useState } from "react";
import {
  Mail,
  Camera,
  Save,
  Edit2,
  CheckCircle,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

const AdminProfilePage = () => {
  const { data: session, isPending } = authClient.useSession();
  
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);

  // ১. অ্যাডমিন প্রোফাইল ডেটা লোড করা
  useEffect(() => {
    const loadAdminProfile = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/admins/${session.user.id}`);
        const data = await res.json();

        if (data && !data.error) {
          setProfile(data);
          setEditedProfile(data);
        }
      } catch (error) {
        console.error("Error fetching admin profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAdminProfile();
  }, [session]);

  const handleStartEdit = () => {
    setEditedProfile({ ...profile });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  // ২. রিয়েল-টাইম স্টেট আপডেট লজিক (No page refresh window.location.reload)
  const handleSave = async () => {
    try {
      setIsSaving(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const payload = {
        name: editedProfile.name,
        image: editedProfile.image,
        bio: editedProfile.bio,
        title: editedProfile.title,
      };

      const response = await fetch(`${apiUrl}/api/admins/${session.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        // লাইভ চেঞ্জ উইদাউট রিলোড
        setProfile({ ...editedProfile });
        setIsEditing(false);
        setShowToast(true);

        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error saving admin profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2 text-inherit opacity-60 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
        <p className="text-sm font-bold tracking-wider uppercase">Loading Core Registry...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center mt-12 text-rose-500 font-sans p-6 border border-rose-500/10 bg-rose-500/5 max-w-md mx-auto rounded-2xl">
        <p className="text-base font-extrabold">System Guard: Record Unresolved</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mt-12 md:mt-0 mx-auto px-4 md:px-6 space-y-6 font-sans antialiased relative text-inherit min-h-screen selection:bg-cyan-500/20 selection:text-cyan-500">
      
      {/* সাকসেস টোস্ট অ্যালার্ট */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-500 text-zinc-950 px-4 py-3 rounded-xl shadow-lg text-sm font-extrabold animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-5 h-5" /> Master Records Updated!
        </div>
      )}

      {/* প্রোফাইল হেডার ও অ্যাকশন বাটন */}
      <div className="flex items-center justify-between border-b border-current/10 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-inherit flex items-center gap-2">
            <Terminal className="w-6 h-6 text-cyan-500 stroke-[2.5]" /> Root Profile
          </h1>
          <p className="text-xs opacity-50 font-bold">
            System Administrator core cryptographic profile configurations
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={handleStartEdit}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-linear-to-r from-cyan-400 to-teal-400 text-zinc-950 px-4 py-3 rounded-xl shadow-[0_4px_14px_rgba(6,182,212,0.2)] hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 stroke-[2.5]" /> Edit Configurations
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs font-bold uppercase tracking-widest border border-current/10 bg-current/5 hover:bg-current/10 text-inherit px-4 py-3 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-linear-to-r from-cyan-400 to-teal-400 text-zinc-950 px-4 py-3 rounded-xl shadow-[0_4px_14px_rgba(6,182,212,0.2)] hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-950" />
              ) : (
                <Save className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
              {isSaving ? "Saving..." : "Commit Changes"}
            </button>
          </div>
        )}
      </div>

      {/* মূল লেআউট গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* বাম কলাম: মেম্বার কার্ড ও কুইক অথ ডোমেন */}
        <div className="md:col-span-1 space-y-6">
          <div className="border border-current/10 bg-current/5 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-cyan-400/10 to-transparent rounded-full blur-2xl" />

            {/* প্রোফাইল ইমেজআপলোড */}
            <div className="relative p-1 bg-linear-to-tr from-cyan-400 to-teal-400 rounded-full shadow-[0_4px_12px_rgba(6,182,212,0.15)] group">
              <Image
                src={
                  (isEditing ? editedProfile.image : profile.image)?.startsWith("http")
                    ? (isEditing ? editedProfile.image : profile.image)
                    : "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg"
                }
                alt="Admin Avatar"
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover bg-zinc-900"
                unoptimized
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer transition opacity-0 group-hover:opacity-100">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            <h2 className="text-lg font-extrabold text-inherit mt-4">
              {profile.name}
            </h2>
            <p className="text-[10px] uppercase font-black tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/20 mt-1.5">
              {profile.title || "System Administrator"}
            </p>

            <div className="w-full border-t border-current/10 pt-4 mt-4 space-y-3 text-left text-xs font-bold opacity-70">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 shrink-0">
                  <Mail className="w-3.5 h-3.5 text-cyan-500" /> Root Mail
                </span>
                <span className="text-inherit opacity-90 truncate max-w-35">
                  {profile.email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> Security Status
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    profile.role === "admin" ? "bg-teal-500/10 text-teal-400" : "bg-amber-500/10 text-amber-500"
                  }`}
                >
                  {profile.role || "Admin"}
                </span>
              </div>
            </div>
          </div>

          {/* অতিরিক্ত এডমিন প্রিমিয়াম ব্যাজ */}
          <div className="border border-current/10 bg-current/5 rounded-3xl p-5 backdrop-blur-md flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.1)]">
              <ShieldAlert className="w-5 h-5 stroke-2" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-inherit">Access Privileges</h4>
              <p className="text-[11px] opacity-50 font-bold mt-0.5">Full Read/Write Ledger Terminal Authority</p>
            </div>
          </div>
        </div>

        {/* ডান কলাম: এডিটেবল ফর্ম সেকশন */}
        <div className="md:col-span-2 space-y-6">
          <div className="border border-current/10 bg-current/5 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 backdrop-blur-md">
            
            {/* ১. নাম ও পজিশন/টাইটেল ফিল্ড */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest opacity-50">
                  Identity Label (Name)
                </label>
                <input
                  type="text"
                  name="name"
                  value={isEditing ? editedProfile.name : profile.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full text-sm border border-current/10 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 rounded-xl px-4 py-3 outline-none bg-current/5 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-inherit placeholder:opacity-40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest opacity-50">
                  System Title / Role Label
                </label>
                <input
                  type="text"
                  name="title"
                  value={isEditing ? (editedProfile?.title || "") : (profile?.title || "")}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="System Administrator"
                  className="w-full text-sm border border-current/10 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 rounded-xl px-4 py-3 outline-none bg-current/5 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-inherit placeholder:opacity-40"
                />
              </div>
            </div>

            {/* ইমেজের ইউআরএল ফিল্ড */}
            {isEditing && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <label className="text-xs font-black uppercase tracking-widest opacity-50">
                  Global Avatar Web Asset Resource URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={editedProfile.image}
                  onChange={handleInputChange}
                  className="w-full text-xs border border-current/10 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 rounded-xl px-4 py-3 outline-none bg-current/5 transition font-mono text-inherit placeholder:opacity-40"
                />
              </div>
            )}

            {/* ২. বায়ো / ডেসক্রিপশন ফিল্ড */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest opacity-50">
                Administrative Notes / Summary
              </label>
              <textarea
                rows="5"
                name="bio"
                value={isEditing ? editedProfile.bio : profile.bio || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Write system bio, rules summary, or custom structural profiles logs data notes here..."
                className="w-full text-sm border border-current/10 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 rounded-xl px-4 py-3 outline-none bg-current/5 disabled:opacity-50 disabled:cursor-not-allowed transition resize-none leading-relaxed font-bold text-inherit placeholder:opacity-40"
              />
            </div>

            {/* ৩. সিস্টেম লগ স্ট্যাটাস বা টাইম স্ট্যাম্প */}
            <div className="pt-4 border-t border-current/10 flex flex-wrap gap-4 text-[10px] uppercase font-black tracking-wider opacity-40">
              <div>Created At: {new Date(profile.createdAt).toLocaleDateString()}</div>
              <div>System Status: Operational</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;