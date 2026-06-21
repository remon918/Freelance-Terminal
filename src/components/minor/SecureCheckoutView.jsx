"use client";

import React, { useState } from "react";
import { CreditCard, ShieldCheck, ArrowLeft, Lock, Layers, Calendar, DollarSign } from "lucide-react";

const SecureCheckoutView = ({ proposal, onBack, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleRealPayment = async () => {
    setLoading(true);
    try {
      // 🚀 এখানে তোমার রিয়েল Stripe বা এপিআই কলটি বসবে
      await onPaymentSuccess();
    } catch (error) {
      console.error("Payment integration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8 text-gray-100 min-h-screen antialiased selection:bg-cyan-500/30">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-cyan-400 transition-all mb-10 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        Back to proposals
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* বাম পাশ: ব্র্যান্ডিং ও অ্যামাউন্ট হাইলাইটার */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-neutral-950 font-black text-xs tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              FT
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-wider uppercase">Freelance Terminal</h2>
              <p className="text-[9px] text-neutral-500 font-bold tracking-widest uppercase">Secure Escrow System</p>
            </div>
          </div>

          <div className="p-6 bg-neutral-900/40 border border-neutral-800/60 rounded-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block mb-1">Total Payable</span>
            <div className="flex items-baseline gap-1 text-white">
              <span className="text-5xl font-black tracking-tight">${proposal.proposedBudget}</span>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">USD</span>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs text-emerald-400/90 font-medium bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Your funds will be held locked securely in escrow. Freelancer will only receive the payout after you approve the completed project milestones.
            </p>
          </div>
        </div>

        {/* ডান পাশ: মডার্ন সামারি ও অ্যাকশন কার্ড */}
        <div className="lg:col-span-7 bg-linear-to-b from-neutral-900/60 to-neutral-900/20 border border-neutral-800/80 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
          
          <div className="space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2 border-b border-neutral-800/60 pb-4">
              <Layers className="w-3.5 h-3.5" />
              Contract Parameters
            </h3>

            {/* ইনফরমেশন গ্রিড */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block">Project Title</span>
                <p className="text-base font-bold text-white leading-snug tracking-tight">
                  {proposal.taskTitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-neutral-800/60 pt-5">
                <div className="p-4 bg-neutral-950/40 rounded-xl border border-neutral-800/40">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Freelancer Address</span>
                  <span className="text-neutral-200 text-xs font-bold block truncate" title={proposal.freelancerEmail}>
                    {proposal.freelancerEmail}
                  </span>
                </div>
                <div className="p-4 bg-neutral-950/40 rounded-xl border border-neutral-800/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Timeline Setup</span>
                    <span className="text-neutral-200 text-xs font-extrabold block">{proposal.estimatedDays} Days</span>
                  </div>
                  <Calendar className="w-4 h-4 text-neutral-600" />
                </div>
              </div>
            </div>
          </div>

          {/* পেমেন্ট বাটন এরিয়া */}
          <div className="mt-10 pt-6 border-t border-neutral-800/60 space-y-4">
            <button
              onClick={handleRealPayment}
              disabled={loading}
              className="w-full bg-linear-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 active:scale-[0.99] text-neutral-950 font-black py-4 px-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(34,211,238,0.1)] hover:shadow-[0_0_35px_rgba(34,211,238,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Authorize & Pay ${proposal.proposedBudget}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[9px] text-neutral-500 font-bold tracking-widest uppercase">
              <CreditCard className="w-3.5 h-3.5 text-neutral-600" />
              <span>Secured encryption by Stripe network</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SecureCheckoutView;