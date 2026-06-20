"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Mail, Star, ChevronLeft, Calendar } from "lucide-react";
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
    return <div className="text-center mt-12 text-gray-500">Loading profile details...</div>;
  }

  if (!freelancer) {
    return (
      <div className="text-center mt-12 text-red-500 font-sans">
        <p className="text-lg font-semibold">Freelancer Profile Not Found!</p>
        <button onClick={() => router.back()} className="mt-4 text-sm text-blue-600 hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  // স্কিল হ্যান্ডলিং (স্ট্রিং বা অ্যারে যাই হোক ক্র্যাশ করবে না)
  const renderSkills = () => {
    if (Array.isArray(freelancer.skills)) return freelancer.skills;
    if (typeof freelancer.skills === "string" && freelancer.skills.trim() !== "") {
      return freelancer.skills.split(",").map((s) => s.trim());
    }
    return ["React", "Tailwind CSS", "Node.js", "JavaScript"]; // ডিফল্ট ডামি স্কিল
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:px-6 space-y-6 mt-12 md:mt-0 font-sans">
      
      {/* back button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm hover:text-gray-800 transition"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Freelancers
      </button>

      {/* মেইন প্রোফাইল কার্ড */}
      <div className=" border border-gray-400 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-gray-400">
          
          {/* লেফট সাইড: অ্যাভাটার এবং নাম/টাইটেল */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-linear-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl md:text-3xl uppercase shadow-sm shrink-0">
              {freelancer.name ? freelancer.name[0] : 'F'}
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold  leading-tight">{freelancer.name}</h1>
              <p className="text-sm text-cyan-400 font-semibold">{freelancer.title || "Professional Freelancer"}</p>
              
              {/* মেটা ইনফো */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-gray-700">{freelancer.rating || "5.0"}</span> (0 reviews)
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {freelancer.email || freelancer.client_email}
                </span>
              </div>
            </div>
          </div>

          {/* রাইট সাইড: হায়ার বাটন বা অ্যাকশন */}
          <a 
            href={`mailto:${freelancer.email || freelancer.client_email}`}
            className="w-full md:w-auto text-center bg-cyan-500 hover:bg-cyan-400 text-white font-medium text-sm px-6 py-2.5 rounded-xl shadow-sm transition"
          >
            Hire {freelancer.name?.split(" ")[0]}
          </a>
        </div>

        {/* বায়ো বা ডেসক্রিপশন সেকশন */}
        <div className="py-6 space-y-2">
          <h3 className="text-base font-bold ">About Me</h3>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            {freelancer.bio || "This freelancer hasn't added a bio yet. Hire them to discuss your project guidelines directly!"}
          </p>
        </div>

        {/* স্কিল সেকশন */}
        <div className="pt-4 space-y-3">
          <h3 className="text-base font-bold ">Skills & Expertise</h3>
          <div className="flex flex-wrap gap-2">
            {renderSkills().map((skill, index) => (
              <span 
                key={index} 
                className="bg-blue-50/20 border border-blue-500 text-cyan-400 px-3 py-1 rounded-lg text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* বটম সেকশন: ওয়ার্ক হিস্টোরি (ফাঁকা কার্ড) */}
      <div className=" border border-gray-500 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold  mb-4">Work History & Reviews</h3>
        <p className="text-gray-400 text-sm">
          No projects completed yet on FreelanceTerminal.
        </p>
      </div>

    </div>
  );
};

export default FreelancerDetailsPage;