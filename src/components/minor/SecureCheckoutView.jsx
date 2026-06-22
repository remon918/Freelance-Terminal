"use client";

import React from "react";
import { CreditCard, ArrowLeft, Lock, Layers, Calendar } from "lucide-react";

const SecureCheckoutView = ({ proposal, onBack }) => {
  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8 text-inherit min-h-screen antialiased font-sans selection:bg-cyan-500/20 selection:text-cyan-500">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-cyan-500 transition-all mb-10 cursor-pointer text-inherit"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        Back to proposals
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* বাম পাশ - Total Payable */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-cyan-400 to-teal-400 flex items-center justify-center text-zinc-950 font-black text-xs tracking-wider shadow-[0_2px_8px_rgba(6,182,212,0.2)]">
              FT
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-wider uppercase text-inherit">Freelance Terminal</h2>
              <p className="text-[9px] opacity-50 font-bold tracking-widest uppercase text-inherit">Secure Escrow System</p>
            </div>
          </div>

          {/* 🌟 হার্ডকোডেড নিউট্রাল ব্যাকগ্রাউন্ড বদলে থিম-অ্যাডাপ্টিভ গ্লাস কার্ড */}
          <div className="p-6 border border-current/10 bg-current/5 rounded-2xl backdrop-blur-md shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-50 block mb-1 text-inherit">Total Payable</span>
            <div className="flex items-baseline gap-1 text-inherit">
              <span className="text-5xl font-black tracking-tight">${proposal.proposedBudget}</span>
              <span className="text-xs font-bold opacity-50 uppercase tracking-wider text-inherit">USD</span>
            </div>
          </div>
        </div>

        {/* ডান পাশ - Parameters & Checkout Form */}
        {/* 🌟 বর্ডার এবং ব্যাকগ্রাউন্ড ব্রাইট ও গ্লাস-মরফিজম এফেক্ট করা হয়েছে */}
        <div className="lg:col-span-7 border border-current/10 bg-current/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between backdrop-blur-md shadow-sm">
          <div className="space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-cyan-500 flex items-center gap-2 border-b border-current/10 pb-4">
              <Layers className="w-3.5 h-3.5" />
              Contract Parameters
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-50 block text-inherit">Project Title</span>
                <p className="text-base font-bold leading-snug text-inherit">{proposal.taskTitle}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-current/10 pt-5">
                {/* Freelancer Box */}
                <div className="p-4 bg-current/5 rounded-xl border border-current/10">
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-50 block mb-1 text-inherit">Freelancer</span>
                  <span className="text-inherit opacity-90 text-xs font-bold block truncate">{proposal.freelancerEmail}</span>
                </div>
                
                {/* Timeline Box */}
                <div className="p-4 bg-current/5 rounded-xl border border-current/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-50 block mb-1 text-inherit">Timeline Setup</span>
                    <span className="text-inherit opacity-90 text-xs font-extrabold block">{proposal.estimatedDays} Days</span>
                  </div>
                  <Calendar className="w-4 h-4 opacity-40 text-inherit" />
                </div>
              </div>
            </div>
          </div>

          {/* Form Submission */}
          <div className="mt-10 pt-6 border-t border-current/10 space-y-4">
            <form action={"/api/payment"} method="POST">
              <input type="hidden" name="price" value={proposal.proposedBudget} />
              <input type="hidden" name="title" value={proposal.taskTitle} />
              <input type="hidden" name="taskId" value={proposal.taskId} />
              <input type="hidden" name="proposalId" value={proposal.proposalId} />
              
              <button
                type="submit"
                className="w-full bg-linear-to-r from-cyan-400 to-teal-400 hover:opacity-95 text-zinc-950 font-extrabold py-4 px-4 rounded-xl text-xs uppercase tracking-widest transition-all active:scale-[0.99] shadow-[0_4px_20px_rgba(6,182,212,0.25)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Authorize & Pay ${proposal.proposedBudget}</span>
              </button>
            </form>

            <div className="flex items-center justify-center gap-1.5 text-[9px] opacity-40 font-bold tracking-widest uppercase text-inherit">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Secured encryption by Stripe network</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SecureCheckoutView;