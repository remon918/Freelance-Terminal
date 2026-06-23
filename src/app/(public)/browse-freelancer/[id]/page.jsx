"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Mail, Star, ChevronLeft, Layers, Loader2 } from "lucide-react";
import { getFreelancerDetails } from "@/lib/api/tasks";

const FreelancerDetailsPage = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getFreelancerDetails(id);
        if (data && !data.error) {
          setFreelancer(data);
        } else {
          setFreelancer(null);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setFreelancer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-2 text-inherit opacity-60 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
        <p className="text-sm font-bold tracking-wider uppercase">Loading profile details...</p>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="text-center mt-12 text-rose-500 font-sans p-6 border border-rose-500/10 bg-rose-500/5 max-w-md mx-auto rounded-2xl">
        <p className="text-base font-extrabold">Freelancer Profile Not Found!</p>
        <button 
          onClick={() => router.back()} 
          className="mt-4 text-xs uppercase font-black tracking-widest text-inherit opacity-60 hover:opacity-100 hover:text-cyan-500 transition cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  const renderSkills = () => {
    if (Array.isArray(freelancer.skills)) return freelancer.skills;
    if (typeof freelancer.skills === "string" && freelancer.skills.trim() !== "") {
      return freelancer.skills.split(",").map((s) => s.trim());
    }
    return ["React", "Tailwind CSS", "Node.js", "JavaScript"]; 
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 font-sans text-inherit min-h-screen antialiased selection:bg-cyan-500/20 selection:text-cyan-500">
      
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-cyan-500 transition-all mb-4 cursor-pointer text-inherit"
      >
        <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> 
        Back to Freelancers
      </button>

      {/* মেইন প্রোফাইল কার্ড */}
      <div className="border border-current/10 bg-current/5 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-current/10">
          
          {/* লেফট সাইড: অ্যাভাটার এবং নাম/টাইটেল */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-linear-to-br from-cyan-400 to-teal-400 flex items-center justify-center text-zinc-950 font-black text-2xl md:text-3xl uppercase shadow-[0_4px_14px_rgba(6,182,212,0.25)] shrink-0">
              {freelancer.name ? freelancer.name[0] : 'F'}
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold text-inherit leading-tight">{freelancer.name}</h1>
              <p className="text-sm text-cyan-500 font-extrabold tracking-wide">{freelancer.title || "Professional Freelancer"}</p>
              
              {/* মেটা ইনফো */}
              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs opacity-60 font-bold">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-inherit opacity-90">{freelancer.rating || "5.0"}</span> (0 reviews)
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 opacity-70" />
                  {freelancer.email || freelancer.client_email}
                </span>
              </div>
            </div>
          </div>

          {/* রাইট সাইড: হায়ার বাটন */}
          <a 
            href={`mailto:${freelancer.email || freelancer.client_email}`}
            className="w-full md:w-auto text-center bg-linear-to-r from-cyan-400 to-teal-400 text-zinc-950 font-extrabold text-xs uppercase tracking-widest px-6 py-3 rounded-xl shadow-[0_4px_14px_rgba(6,182,212,0.25)] hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
          >
            Hire {freelancer.name?.split(" ")[0]}
          </a>
        </div>

        {/* বায়ো বা ডেসক্রিপশন সেকশন */}
        <div className="py-6 space-y-2">
          <h3 className="text-xs font-black uppercase tracking-widest opacity-50 flex items-center gap-1.5">
            About Me
          </h3>
          <p className="opacity-80 text-sm md:text-base leading-relaxed">
            {freelancer.bio || "This freelancer hasn't added a bio yet. Hire them to discuss your project guidelines directly!"}
          </p>
        </div>

        {/* স্কিল সেকশন */}
        <div className="pt-4 space-y-3 border-t border-current/5">
          <h3 className="text-xs font-black uppercase tracking-widest opacity-50">
            Skills & Expertise
          </h3>
          <div className="flex flex-wrap gap-2">
            {renderSkills().map((skill, index) => (
              <span 
                key={index} 
                className="bg-current/5 border border-current/10 text-inherit px-3 py-1.5 rounded-xl text-xs font-bold transition hover:bg-current/10"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* বটম সেকশন: ওয়ার্ক হিস্টোরি */}
      <div className="border border-current/10 bg-current/5 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-sm">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-cyan-500 flex items-center gap-2 border-b border-current/10 pb-4">
          <Layers className="w-3.5 h-3.5" />
          Work History & Reviews
        </h3>
        <p className="opacity-40 text-xs font-bold uppercase tracking-widest mt-4">
          No projects completed yet on FreelanceTerminal.
        </p>
      </div>

    </div>
  );
};

export default FreelancerDetailsPage;