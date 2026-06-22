"use client";

import React from "react";
import { Button } from "@heroui/react";
import { ArrowLeft, Home, Layers, ShieldAlert } from "lucide-react";
import Link from "next/link";

const UltimatePremiumErrorPage = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0A0F11] px-4 font-sans text-white">
      
      {/* 🌌 ১. ইউনিক প্রিমিয়াম ব্যাকগ্রাউন্ড: সাইবার গ্রিড প্যাটার্ন */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none" 
        style={{
          backgroundImage: `
            linear-linear(to right, #22d3ee 1px, transparent 1px),
            linear-linear(to bottom, #22d3ee 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* 🔮 ২. অ্যাবস্ট্রাক্ট মেটালিক লাইট বিম (গ্লোয়িং অরিস) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 md:w-175 md:h-175 rounded-full bg-linear-to-tr from-cyan-500/20 via-teal-500/10 to-transparent blur-[140px] animate-pulse duration-8000 pointer-events-none" />
      
      {/* ৩. সাইড অ্যাঙ্গেল লাইটিং ইফেক্ট */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full" />

      {/* 🛡️ মেইন ফ্লোটিং লাক্সারি কার্ড কন্টেইনার */}
      <div className="relative z-10 max-w-xl w-full border border-white/6 bg-linear-to-b from-white/4 to-transparent backdrop-blur-2xl rounded-[32px] p-8 md:p-14 text-center shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* কার্ডের চারপাশের প্রিমিয়াম নিয়ন বর্ডার শার্পনেস */}
        <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-cyan-400/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-linear-to-r from-transparent via-teal-500/20 to-transparent" />

        {/* 🚨 ইউনিক ফ্লোটিং মেটালিক ব্যাজ */}
        <div className="mx-auto w-12 h-12 rounded-2xl bg-linear-to-b from-white/10 to-white/2 border border-white/10 flex items-center justify-center shadow-inner mb-8">
          <ShieldAlert className="w-5 h-5 text-cyan-400 animate-bounce duration-3000" />
        </div>

        {/* 💎 নিও-মরফিক থ্রিডি স্টাইল এরর কোড */}
        <div className="relative select-none">
          <h1 className="text-9xl font-extrabold tracking-tighter bg-linear-to-b from-white via-neutral-300 to-neutral-700 bg-clip-text text-transparent opacity-90">
            404
          </h1>
          {/* রিফ্লেকশন শ্যাডো */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-6 bg-cyan-400/20 blur-md rounded-full opacity-40 scale-x-150" />
        </div>

        {/* 📝 প্রিমিয়াম টাইপোগ্রাফি ও মেসেজ */}
        <div className="mt-10 space-y-3">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white/90">
            System Out of Bounds
          </h2>
          <p className="text-sm text-neutral-400 max-w-sm mx-auto leading-relaxed font-light">
            The resource you are attempting to access has broken containment or migrated to a different sector.
          </p>
        </div>

        {/* ⚡ আল্ট্রা-প্রিমিয়াম বাটন আর্কিটেকচার */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          
          {/* সলিড সাইয়ান গ্লো বাটন */}
          <Link href="/" className="w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto h-12 px-8 font-semibold bg-white text-black hover:bg-neutral-200 shadow-[0_0_30px_rgba(255,255,255,0.15)] rounded-xl transition-all duration-300 hover:scale-103 flex items-center justify-center gap-2"
              radius="none"
            >
              <Home size={16} strokeWidth={2.5} />
              Return Home
            </Button>
          </Link>

          {/* মিনিমাল বর্ডারলেস ব্লার বাটন */}
          <Button
            onClick={handleRefresh}
            className="w-full sm:w-auto h-12 px-8 font-medium border border-white/10 bg-white/3 hover:bg-white/8 text-neutral-300 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            radius="none"
          >
            <Layers size={16} />
            Retry Request
          </Button>
        </div>

        {/* 🔗 লাক্সারি ড্যাশবোর্ড ফুটার */}
        <div className="mt-12 pt-6 border-t border-white/4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-widest text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
            <span>NODE_ERROR: 0x404</span>
          </div>
          <Link href="/help" className="hover:text-cyan-400 transition-colors duration-300">
            Protocol Documentation &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
};

export default UltimatePremiumErrorPage;