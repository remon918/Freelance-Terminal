"use client";

import React, { useEffect, useState, use } from "react";
import { authClient } from "@/lib/auth-client";
import { getProposalDetails } from "@/lib/actions/actions"; 
import {
  Calendar,
  DollarSign,
  Clock,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Briefcase,
  ExternalLink,
  ShieldAlert,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ProposalDetailsPage = ({ params }) => {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id; // ডাইনামিক [id] রুট থেকে আইডি নেওয়া হলো
  
  const router = useRouter();
  const { data: session, isPending: authLoading } = authClient.useSession();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !session?.user?.email || !id) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getProposalDetails(id);
        setProposal(data);
      } catch (error) {
        console.error("Failed to fetch proposal details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, session?.user?.email, authLoading]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
          title: "Proposal Accepted",
          desc: "Congratulations! The client has accepted your pitch. Check your email or workspace for the next steps.",
        };
      case "rejected":
        return {
          bg: "bg-rose-500/10 border-rose-500/20 text-rose-500",
          icon: <XCircle className="w-5 h-5 text-rose-500" />,
          title: "Proposal Declined",
          desc: "The client decided to go with another freelancer for this project. Don't lose hope, try other opportunities!",
        };
      default:
        return {
          bg: "bg-amber-500/10 border-amber-500/20 text-amber-500",
          icon: <Clock className="w-5 h-5 text-amber-500" />,
          title: "Under Review",
          desc: "Your proposal is successfully submitted and currently being reviewed by the client.",
        };
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col gap-3 items-center justify-center min-h-[60vh] text-inherit">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
        <p className="text-xs font-semibold tracking-wider opacity-50 uppercase animate-pulse">Loading Proposal Details...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4 text-inherit">
        <div className="text-center py-12 px-6 border border-current/10 rounded-3xl max-w-sm bg-current/5 backdrop-blur-md">
          <ShieldAlert className="w-10 h-10 mx-auto mb-4 text-rose-500" />
          <h3 className="text-lg font-bold text-inherit mb-1">Access Denied</h3>
          <p className="opacity-60 text-sm mb-6">Please authenticate your session to view this track.</p>
          <button onClick={() => router.push("/login")} className="px-5 py-2 bg-current/10 hover:bg-current/20 text-inherit font-semibold rounded-xl text-sm transition">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4 text-inherit">
        <div className="text-center py-12 px-6 border border-dashed border-current/10 rounded-3xl max-w-sm bg-current/5">
          <AlertCircle className="w-10 h-10 mx-auto mb-3 text-amber-500" />
          <h3 className="text-base font-bold text-inherit">Proposal Not Found</h3>
          <p className="opacity-50 text-xs mt-1 mb-5">The proposal track ID might be invalid or deleted.</p>
          <button onClick={() => router.back()} className="text-xs text-cyan-500 font-bold flex items-center justify-center gap-1 mx-auto hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Proposals
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(proposal.status);

  return (
    <div className="max-w-4xl mx-auto mt-10 md:mt-0 px-4 md:px-8 py-8 space-y-6 font-sans text-inherit selection:bg-cyan-500/20 selection:text-cyan-500">
      
      {/* ব্যাক বাটন */}
      <button
        onClick={() => router.back()}
        className="group flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-60 hover:opacity-100 transition duration-300 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to List
      </button>

      {/* স্ট্যাটাস ব্যানার */}
      <div className={`relative border rounded-3xl p-6 md:p-8 overflow-hidden backdrop-blur-xl ${statusConfig.bg}`}>
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-current opacity-[0.03] rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              {statusConfig.icon}
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-inherit">
                {statusConfig.title}
              </h2>
            </div>
            <p className="text-sm opacity-80 leading-relaxed max-w-xl">
              {statusConfig.desc}
            </p>
          </div>
          
          <div className="border-t md:border-t-0 md:border-l border-current/10 pt-4 md:pt-0 md:pl-6 shrink-0">
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-50 block mb-1">Track Timeline</span>
            <div className="flex items-center gap-2 text-sm font-medium opacity-90">
              <Calendar className="w-4 h-4 opacity-60" />
              <span>{formatDate(proposal.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* মেইন কন্টেন্ট গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* বাম পাশের সেকশন: প্রজেক্ট এবং কভার লেটার */}
        <div className="md:col-span-2 space-y-6">
          
          {/* প্রজেক্ট ইনফো */}
          <div className="border border-current/10 bg-current/5 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 opacity-50 text-xs font-bold uppercase tracking-wider">
              <Briefcase className="w-4 h-4 text-cyan-500" />
              <span>Associated Project</span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-bold text-inherit leading-snug">
                {proposal.taskTitle}
              </h3>
              <div className="flex items-center gap-2 text-xs opacity-60">
                <span>Client Budget Setup:</span>
                <span className="text-emerald-500 font-bold">${proposal.taskBudget}</span>
              </div>
            </div>

            <Link
              href={`/tasks/${proposal.taskId}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-cyan-500 bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/30 rounded-xl transition-all"
            >
              View Original Task Requirements
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* কভার লেটার */}
          <div className="border border-current/10 bg-current/5 rounded-3xl p-6 space-y-3">
            <div className="flex items-center gap-2 opacity-50 text-xs font-bold uppercase tracking-wider border-b border-current/10 pb-3">
              <FileText className="w-4 h-4 text-amber-500" />
              <span>Your Cover Letter / Pitch Statement</span>
            </div>
            <p className="text-sm opacity-80 leading-relaxed whitespace-pre-line font-medium italic bg-current/5 p-4 rounded-2xl border border-current/5">
              {proposal.coverNote || "No pitch statement or cover note was included during submission."}
            </p>
          </div>
        </div>

        {/* ডান পাশের সেকশন: বিড স্টেটমেন্ট এবং প্ল্যাটফর্ম অ্যাডভাইস */}
        <div className="space-y-6">
          
          {/* বিড স্টেটমেন্ট কার্ড */}
          <div className="border border-current/10 bg-current/5 backdrop-blur-md rounded-3xl p-5 md:p-6 space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest opacity-50 border-b border-current/10 pb-3">
              Bid Statement
            </h4>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] opacity-50 block font-bold uppercase">Proposed Budget</span>
                <span className="text-xl font-black text-emerald-500">${proposal.proposedBudget}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] opacity-50 block font-bold uppercase">Estimated Time</span>
                <span className="text-base font-bold opacity-90">
                  {proposal.estimatedDays} {proposal.estimatedDays > 1 ? "Days" : "Day"}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-current/10 text-[10px] opacity-40 space-y-1 font-mono tracking-wider">
              <span className="block">TRACK_ID: {id}</span>
              <span className="block">CLIENT_REF: {proposal.taskId}</span>
            </div>
          </div>

          {/* প্ল্যাটফর্ম অ্যাডভাইস */}
          <div className="border border-dashed border-current/10 rounded-3xl p-5 bg-current/5 text-xs opacity-50 leading-relaxed">
            <span className="font-bold opacity-80 block mb-1">💡 Platform Advice:</span>
            Never start working or share credential source files until the project status moves to <span className="text-emerald-500 font-bold">Accepted</span> and proper contracts are active.
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProposalDetailsPage;