"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client"; 
import { getFreelancerProposals } from "@/lib/actions/actions";
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowUpRight, 
  Link2 
} from "lucide-react";
import Link from "next/link";

const MyProposalsPage = () => {
  const { data: session, isPending: authLoading } = authClient.useSession();
  const [proposals, setProposals] = useState([]);
  const [dataLoading, setDataLoading] = useState(false); 

  useEffect(() => {
    if (authLoading || !session?.user?.email) return;

    const fetchProposals = async () => {
      try {
        setDataLoading(true);
        const data = await getFreelancerProposals(session.user.email);
        setProposals(data);
      } catch (error) {
        console.error("Failed to fetch proposals:", error);
      } finally {
        setDataLoading(false); 
      }
    };

    fetchProposals();
  }, [session?.user?.email, authLoading]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        };
      case "rejected":
        return {
          bg: "bg-rose-500/10 border-rose-500/30 text-rose-400",
          icon: <XCircle className="w-3.5 h-3.5" />,
        };
      default:
        return {
          bg: "bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.05)]",
          icon: <Clock className="w-3.5 h-3.5" />,
        };
    }
  };

  if (authLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-20 text-gray-400 border border-gray-800 rounded-2xl max-w-md mx-auto mt-10">
        <AlertCircle className="w-8 h-8 mx-auto mb-3 text-amber-500" />
        <p>Please login to view your submitted proposals.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 md:mt-0 px-4 md:px-8 space-y-8 font-sans">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
          My Submitted Proposals
        </h1>
        <p className="text-gray-500 text-sm">
          Track your bids, monitor responses, and manage client responses. Total: {proposals.length}
        </p>
      </div>

      {proposals.length > 0 ? (
        <div className="grid grid-cols-1 gap-5">
          {proposals.map((item) => {
            const statusStyle = getStatusStyles(item.status);
            return (
              <div
                key={item.proposalId}
                className="group relative border border-neutral-800 hover:border-neutral-700 bg-neutral-950/60 backdrop-blur-md rounded-2xl p-5 md:p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                {/* 🛠️ ফিক্সড পাথ: তোমার নতুন রুট অনুযায়ী সেট করা হলো */}
                <Link 
                  href={`/freelancer/my-proposals/${item.proposalId}`} 
                  className="absolute inset-0 z-10"
                />

                <div className="absolute top-5 right-5 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none z-20 w-8 h-8 rounded-lg bg-gray-500/10 border border-gray-500/20 flex items-center justify-center text-gray-400 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                  <Link2 className="w-4 h-4 text-gray-300" />
                </div>

                <div className="absolute -inset-px bg-gradient-to-r from-transparent via-gray-500/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none" />

                <div className="space-y-4 relative z-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1 max-w-3xl">
                      <div className="text-base md:text-lg font-bold text-gray-200 group-hover:text-cyan-400 transition flex items-center gap-1.5">
                        {item.taskTitle}
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition text-gray-400 group-hover:text-cyan-400" />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Original Task Budget:</span>
                        <span className="text-gray-400 font-medium">${item.taskBudget}</span>
                      </div>
                    </div>

                    <div className={`self-start flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider relative z-20 ${statusStyle.bg}`}>
                      {statusStyle.icon}
                      {item.status || "Pending"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-neutral-900/40 border border-neutral-900 rounded-xl p-3 text-xs md:text-sm relative z-20">
                    <div className="space-y-0.5">
                      <span className="text-gray-500 block">Your Bid Budget</span>
                      <div className="flex items-center font-bold text-emerald-400">
                        <DollarSign className="w-4 h-4 shrink-0 -ml-1" />
                        {item.proposedBudget}
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-gray-500 block">Estimated Time</span>
                      <div className="flex items-center gap-1.5 font-semibold text-gray-300">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        {item.estimatedDays} {item.estimatedDays > 1 ? "Days" : "Day"}
                      </div>
                    </div>
                    <div className="space-y-0.5 col-span-2 sm:col-span-1">
                      <span className="text-gray-500 block">Submitted On</span>
                      <div className="flex items-center gap-1.5 text-gray-400 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        {formatDate(item.createdAt)}
                      </div>
                    </div>
                  </div>

                  {item.coverNote && (
                    <div className="space-y-1.5 pt-1 relative z-20">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Your Cover Note</span>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed bg-neutral-900/20 border border-neutral-900/50 rounded-xl p-3 italic">
                        {item.coverNote}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-neutral-800 rounded-2xl bg-neutral-950/20">
          <p className="text-gray-500 text-sm italic">You have not submitted any proposals yet.</p>
        </div>
      )}
    </div>
  );
};

export default MyProposalsPage;