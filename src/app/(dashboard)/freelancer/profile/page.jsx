"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Camera,
  Save,
  Edit2,
  Plus,
  X,
  CheckCircle,
  ShieldCheck,
  Briefcase,
  LayoutGrid,
} from "lucide-react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { getMyProfile, updateProfile } from "@/lib/api/tasks";
import { useRouter } from "next/navigation";

const MyProfilePage = () => {
  const { data: session, isPending } = authClient.useSession();
  console.log(session);
  // ১. ইনিশিয়াল ডেমো ডেটা (আপনার দেওয়া ডেটা স্ট্রাকচার অনুযায়ী)
  const [profile, setProfile] = useState(null);

  // এডিটিং স্টেটস
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [newSkill, setNewSkill] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user?.id) return;

      try {
        const data = await getMyProfile(session.user.id);

        setProfile({
          ...data,
          skills: Array.isArray(data.skills)
            ? data.skills
            : data.skills
              ? data.skills.split(",")
              : [],
        });

        setEditedProfile({
          ...data,
          skills: Array.isArray(data.skills)
            ? data.skills
            : data.skills
              ? data.skills.split(",")
              : [],
        });
      } catch (error) {
        console.log(error);
      }
    };

    loadProfile();
  }, [session]);

  // এডিট মোড অন করার ফাংশন
  const handleStartEdit = () => {
    setEditedProfile({ ...profile });
    setIsEditing(true);
  };

  // ইনপুট চেঞ্জ হ্যান্ডলার
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  // নতুন স্কিল অ্যাড করার ফাংশন
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !editedProfile.skills.includes(newSkill.trim())) {
      setEditedProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  // স্কিল রিমুভ করার ফাংশন
  const handleRemoveSkill = (skillToRemove) => {
    setEditedProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };
  // ডাটা সেভ করার ফাংশন (Simulated API Call)
  const router = useRouter();
  const handleSave = async () => {
    try {
      setIsSaving(true);

      const payload = {
        name: editedProfile.name,
        title: editedProfile.title,
        image: editedProfile.image,
        bio: editedProfile.bio,
        skills: editedProfile.skills,
        hourlyRate: Number(editedProfile.hourlyRate),
      };

      const result = await updateProfile(session.user.id, payload);

      if (result.success) {
        setProfile({ ...editedProfile });

        setIsEditing(false);

        setShowToast(true);

        setTimeout(() => {
          setShowToast(false);
        }, 3000);

        await updateProfile(session.user.id, payload);

        await updateProfile(session.user.id, payload);

        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending || !profile || !editedProfile) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mt-12 md:mt-0 mx-auto px-4 md:px-6 space-y-6 font-sans  antialiased relative">
      {/* সাকসেস টোস্ট অ্যালার্ট */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-lg animate-bounce text-sm font-semibold">
          <CheckCircle className="w-5 h-5" /> Profile Updated Successfully!
        </div>
      )}

      {/* প্রোফাইল হেডার ও অ্যাকশন বাটন */}
      <div className="flex items-center justify-between border-b border-gray-400 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">My Profile</h1>
          <p className="text-xs text-gray-500">
            Manage and update your freelancer public portfolio layout
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={handleStartEdit}
            className="flex items-center gap-2 text-sm font-bold bg-linear-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white px-4 py-2.5 rounded-xl shadow-md shadow-teal-500/10 transition"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl shadow-md transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />{" "}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {/* মূল লেআউট গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* বাম কলাম: অ্যাভাটার ও কুইক স্ট্যাটাস */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-teal-300 border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-cyan-400/10 to-teal-400/0 rounded-full blur-2xl" />

            {/* প্রোফাইল ইমেজ আপলোড সেকশন */}
            <div className="relative p-1 bg-linear-to-tr from-teal-400 to-cyan-400 rounded-full shadow-md group">
              <Image
                src={
                  (isEditing ? editedProfile.image : profile.image)?.startsWith(
                    "http",
                  )
                    ? isEditing
                      ? editedProfile.image
                      : profile.image
                    : "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg"
                }
                alt="Avatar"
                width={96} // w-24 মানে ২৪ * ৪ = ৯৬ পিক্সেল
                height={96} // h-24 মানে ২৪ * ৪ = ৯৬ পিক্সেল
                className="w-24 h-24 rounded-full object-cover bg-white"
                unoptimized // এক্সটার্নাল র্যান্ডম ইউজার লিঙ্ক বা কারাপ্ট ইউআরএল এর কারণে যেন বিল্ড এরর না দেয়
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer transition opacity-0 group-hover:opacity-100">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-4">
              {profile.name}
            </h2>
            <p className="text-xs text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100/50 mt-1.5">
              {profile.title || "Frontend Web Developer"}
            </p>

            <div className="w-full border-t border-gray-50 pt-4 mt-4 space-y-3 text-left text-xs font-medium text-gray-500">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-teal-500" /> Account
                  Identity
                </span>
                <span className="text-gray-800 font-semibold max-w-35 truncate">
                  {profile.email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />{" "}
                  Verification Status
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${profile.emailVerified ? "bg-teal-50 text-teal-700" : "bg-amber-50 text-amber-700"}`}
                >
                  {profile.emailVerified ? "Verified" : "Unverified"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ডান কলাম: এডিটেবল ফর্ম সেকশন */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-teal-300 border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            {/* ১. নাম ও টাইটেল ফিল্ড */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={isEditing ? editedProfile.name : profile.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full text-sm border border-gray-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 rounded-xl px-3 py-2.5 outline-none bg-gray-50/50 disabled:bg-gray-50 disabled:text-gray-500 transition font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">
                  Professional Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={isEditing ? editedProfile.title : profile.title}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full text-sm border border-gray-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 rounded-xl px-3 py-2.5 outline-none bg-gray-50/50 disabled:bg-gray-50 disabled:text-gray-500 transition font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">
                ${profile.hourlyRate}/hr
              </label>

              <input
                type="number"
                name="hourlyRate"
                value={
                  isEditing
                    ? editedProfile.hourlyRate || ""
                    : profile.hourlyRate || ""
                }
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full text-sm border border-gray-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 rounded-xl px-3 py-2.5 outline-none bg-gray-50/50 disabled:bg-gray-50 disabled:text-gray-500 transition font-medium"
              />
            </div>

            {/* ইমেজের ইউআরএল এডিট করার ফিল্ড (শুধুমাত্র এডিট মোডে দেখাবে) */}
            {isEditing && (
              <div className="space-y-1.5 animate-fadeIn">
                <label className="text-xs font-bold text-gray-500">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={editedProfile.image}
                  onChange={handleInputChange}
                  className="w-full text-sm border border-gray-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 rounded-xl px-3 py-2.5 outline-none bg-gray-50/50 transition font-mono"
                />
              </div>
            )}

            {/* ২. বায়ো ফিল্ড */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">
                Professional Summary (Bio)
              </label>
              <textarea
                rows="4"
                name="bio"
                value={isEditing ? editedProfile.bio : profile.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full text-sm border border-gray-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 rounded-xl px-3 py-2.5 outline-none bg-gray-50/50 disabled:bg-gray-50 disabled:text-gray-500 transition resize-none leading-relaxed font-medium"
              />
            </div>

            {/* ৩. স্কিলস ম্যানেজমেন্ট সেকশন */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-gray-500 block">
                Skills & Core Expertise
              </label>

              {/* লাইভ স্কিল ট্যাগ লিস্ট */}
              <div className="flex flex-wrap gap-2">
                {(isEditing ? editedProfile.skills : profile.skills).map(
                  (skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 bg-linear-to-r from-teal-50/60 to-cyan-50/60 border border-teal-100 text-teal-800 px-3 py-1.5 rounded-xl text-xs font-bold animate-fadeIn"
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="p-0.5 rounded-full hover:bg-teal-200/50 text-teal-600 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ),
                )}
              </div>

              {/* নতুন স্কিল যোগ করার ইনপুট (শুধুমাত্র এডিট মোডে আসবে) */}
              {isEditing && (
                <form
                  onSubmit={handleAddSkill}
                  className="flex gap-2 pt-2 max-w-xs animate-fadeIn"
                >
                  <input
                    type="text"
                    placeholder="Add a skill (e.g. Next.js)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="w-full text-xs border border-gray-200 focus:border-teal-400 rounded-xl px-3 py-2 outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-xl transition shrink-0 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
