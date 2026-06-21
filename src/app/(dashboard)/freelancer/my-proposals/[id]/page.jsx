"use client";

import React, { useEffect, useState, use } from "react";
// import { useRouter } from "navigation";
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
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ProposalDetailsPage = ({ params }) => {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id; // ডাইনামিক [id] রুট থেকে আইডি নেওয়া হলো
  
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
          bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.15)]",
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
          title: "Proposal Accepted",
          desc: "Congratulations! The client has accepted your pitch. Check your email or workspace for the next steps.",
        };
      case "rejected":
        return {
          bg: "bg-rose-500/10 border-rose-500/20 text-rose-400",
          icon: <XCircle className="w-5 h-5 text-rose-400" />,
          title: "Proposal Declined",
          desc: "The client decided to go with another freelancer for this project. Don't lose hope, try other opportunities!",
        };
      default:
        return {
          bg: "bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.1)]",
          icon: <Clock className="w-5 h-5 text-amber-400" />,
          title: "Under Review",
          desc: "Your proposal is successfully submitted and currently being reviewed by the client.",
        };
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col gap-3 items-center justify-center min-h-screen bg-neutral-950 text-gray-400">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-medium tracking-wider text-neutral-500 uppercase animate-pulse">Loading Proposal Details...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <div className="text-center py-12 px-6 border border-neutral-800 rounded-3xl max-w-sm bg-neutral-900/50 backdrop-blur-md">
          <ShieldAlert className="w-10 h-10 mx-auto mb-4 text-rose-500" />
          <h3 className="text-lg font-bold text-white mb-1">Access Denied</h3>
          <p className="text-gray-400 text-sm mb-6">Please authenticate your session to view this track.</p>
          <button onClick={() => router.push("/login")} className="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm transition-all">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <div className="text-center py-12 px-6 border border-dashed border-neutral-800 rounded-3xl max-w-sm">
          <AlertCircle className="w-10 h-10 mx-auto mb-3 text-amber-500" />
          <h3 className="text-base font-bold text-gray-200">Proposal Not Found</h3>
          <p className="text-gray-500 text-xs mt-1 mb-5">The proposal track ID might be invalid or deleted.</p>
          <button onClick={() => router.back()} className="text-xs text-cyan-400 font-semibold flex items-center justify-center gap-1 mx-auto hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Proposals
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(proposal.status);

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-100 p-4 md:p-8 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-all duration-300 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to List
        </button>

        <div className={`relative border rounded-3xl p-6 md:p-8 overflow-hidden backdrop-blur-xl ${statusConfig.bg}`}>
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-current opacity-5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                {statusConfig.icon}
                <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
                  {statusConfig.title}
                </h2>
              </div>
              <p className="text-sm opacity-80 leading-relaxed max-w-xl">
                {statusConfig.desc}
              </p>
            </div>
            
            <div className="border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 shrink-0">
              <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mb-1">Track Timeline</span>
              <div className="flex items-center gap-2 text-sm text-neutral-200">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <span>{formatDate(proposal.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="border border-neutral-800 bg-neutral-900/40 rounded-3xl p-6 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-2 text-neutral-400 text-xs font-bold uppercase tracking-wider">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                <span>Associated Project</span>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg md:text-xl font-bold text-white leading-snug">
                  {proposal.taskTitle}
                </h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-neutral-500">Client Budget Setup:</span>
                  <span className="text-emerald-400 font-bold">${proposal.taskBudget}</span>
                </div>
              </div>

              <Link
                href={`/tasks/${proposal.taskId}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/30 rounded-xl transition-all"
              >
                View Original Task Requirements
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <div className="border border-neutral-800 bg-neutral-900/20 rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-neutral-400 text-xs font-bold uppercase tracking-wider border-b border-neutral-800/60 pb-3">
                <FileText className="w-4 h-4 text-amber-500" />
                <span>Your Cover Letter / Pitch Statement</span>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line font-medium italic bg-neutral-950/40 p-4 rounded-2xl border border-neutral-900/80">
                {proposal.coverNote || "No pitch statement or cover note was included during submission."}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-neutral-800 bg-neutral-900/60 backdrop-blur-md rounded-3xl p-5 md:p-6 space-y-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-800/80 pb-3">
                Bid Statement
              </h4>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-neutral-500 block font-semibold uppercase">Proposed Budget</span>
                  <span className="text-xl font-black text-emerald-400">${proposal.proposedBudget}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-neutral-500 block font-semibold uppercase">Estimated Time</span>
                  <span className="text-base font-bold text-neutral-200">
                    {proposal.estimatedDays} {proposal.estimatedDays > 1 ? "Days" : "Day"}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800/80 text-[10px] text-neutral-500 space-y-1">
                <span className="block font-mono tracking-wider">TRACK_ID: {id}</span>
                <span className="block font-mono tracking-wider">CLIENT_REF: {proposal.taskId}</span>
              </div>
            </div>

            <div className="border border-dashed border-neutral-800 rounded-3xl p-5 bg-neutral-950/40 text-xs text-neutral-500 leading-relaxed">
              <span className="font-bold text-neutral-400 block mb-1">💡 Platform Advice:</span>
              Never start working or share credential source files until the project status moves to <span className="text-emerald-400 font-medium">Accepted</span> and proper contracts are active.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProposalDetailsPage;