"use client";

import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Calendar,
  User,
  Layers,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { getMyTasks } from "@/lib/api/tasks";
import RejectTaskModal from "@/components/minor/RejectTaskModal";
// 💳 নতুন পেমেন্ট গেটওয়ে কম্পোনেন্টটি ইম্পোর্ট করলাম (নিচে এই ফাইলটির কোড দেওয়া আছে)
import SecureCheckoutView from "@/components/minor/SecureCheckoutView";

const ManageProposalsPage = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");

  // Reject Modal এর জন্য স্টেটস
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRejectData, setSelectedRejectData] = useState(null);
  const [rejectLoading, setRejectLoading] = useState(false);

  // 💳 পেমেন্ট স্ক্রিন কন্ট্রোল করার জন্য নতুন স্টেটস
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProposalData, setSelectedProposalData] = useState(null);

  // ডাটা আনা হচ্ছে
  useEffect(() => {
    const fetchProposals = async () => {
      if (!session?.user?.id) return;
      try {
        setLoading(true);
        const data = await getMyTasks(session.user.id);
        setTasks(data || []);
      } catch (error) {
        console.error("Error fetching proposals:", error);
        toast.error("Failed to load proposals");
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [session?.user?.id]);

  // প্রপোজাল Accept/Reject হ্যান্ডলার (পেমেন্ট সাকসেস হওয়ার পর এটা কল হবে)
  const handleProposalAction = async (taskId, proposalId, action) => {
    try {
      if (action === "Reject") {
        setRejectLoading(true);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/proposals/${taskId}/${proposalId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: action,
            status: action === "Accept" ? "Accepted" : "Rejected",
          }),
        },
      );

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(result.message);

        // স্টেট আপডেট
        setTasks((prevTasks) =>
          prevTasks.map((t) => {
            if (t._id !== taskId) return t;

            const updatedProposals = t.proposals.map((p) => {
              if (p.proposalId !== proposalId) {
                return action === "Accept" ? { ...p, status: "Rejected" } : p;
              }
              return {
                ...p,
                status: action === "Accept" ? "Accepted" : "Rejected",
              };
            });

            return {
              ...t,
              status: action === "Accept" ? "assigned" : t.status,
              proposals: updatedProposals,
            };
          }),
        );

        if (action === "Reject") {
          setShowRejectModal(false);
          setSelectedRejectData(null);
        }

        // 💳 পেমেন্ট সাকসেসফুল ভিউ থেকে ব্যাক করা
        if (action === "Accept") {
          setShowCheckout(false);
          setSelectedProposalData(null);
        }

        router.refresh();
      } else {
        toast.error(result.message || "Action failed");
      }
    } catch (error) {
      console.error(`Failed to ${action} proposal:`, error);
      toast.error("Something went wrong");
    } finally {
      if (action === "Reject") {
        setRejectLoading(false);
      }
    }
  };

  // রিজেক্ট বাটন ট্রিগার
  const handleRejectClick = (taskId, proposalId) => {
    setSelectedRejectData({ taskId, proposalId });
    setShowRejectModal(true);
  };

  // মোডালে "Confirm" চাপলে রিজেক্ট রান হবে
  const confirmRejectProposal = async () => {
    if (!selectedRejectData) return;
    const { taskId, proposalId } = selectedRejectData;
    await handleProposalAction(taskId, proposalId, "Reject");
  };

  // 💳 Accept Pitch বাটনে ক্লিক করলে সরাসরি এপিআই কল না হয়ে এই ফাংশনটি রান হবে
  const handleAcceptPitchClick = (proposal) => {
    setSelectedProposalData(proposal);
    setShowCheckout(true);
  };

  // সব টাস্ক থেকে প্রপোজালগুলোকে ফ্ল্যাট করে বের করে আনা
  const allProposals = tasks
    .flatMap((task) =>
      (task.proposals || []).map((proposal) => ({
        ...proposal,
        taskTitle: task.title,
        taskId: task._id,
        taskStatus: task.status,
      })),
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // ফিল্টার লজিক
  const filteredProposals = allProposals.filter((prop) => {
    if (filterStatus === "All") return true;
    return prop.status === filterStatus;
  });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
      </div>
    );
  }

  // 💳 কন্ডিশনাল রেন্ডারিং: যদি showCheckout ট্রু হয়, তবে স্ট্রাইপ পেমেন্ট গেটওয়ে স্ক্রিন দেখাবে
  if (showCheckout && selectedProposalData) {
    return (
      <SecureCheckoutView
        proposal={selectedProposalData}
        onBack={() => {
          setShowCheckout(false);
          setSelectedProposalData(null);
        }}
        onPaymentSuccess={async () => {
          // পেমেন্ট গেটওয়ে থেকে পেমেন্ট কনফার্ম হলে এই হ্যান্ডলার ব্যাকএন্ড এক্সেপ্ট অ্যাকশনটি কল করবে
          await handleProposalAction(
            selectedProposalData.taskId,
            selectedProposalData.proposalId,
            "Accept"
          );
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 mt-10 md:mt-0 md:px-8 text-inherit font-sans min-h-screen selection:bg-cyan-500/20 selection:text-cyan-500">
      {/* হেডার সেকশন */}
      <div className="relative mb-10 p-6 rounded-3xl overflow-hidden bg-current/5 border border-current/10 shadow-xl backdrop-blur-md">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-inherit">
          Manage Proposals
        </h1>
        <p className="mt-2 text-sm opacity-60">
          Review, filter, and respond to incoming pitches from global freelancers.
        </p>
      </div>

      {/* স্ট্যাটাস ফিল্টার ট্যাব */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
        {["All", "Pending", "Accepted", "Rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition duration-300 cursor-pointer border ${
              filterStatus === status
                ? "bg-cyan-500 text-zinc-950 border-cyan-400 shadow-[0_4px_12px_rgba(6,182,212,0.25)]"
                : "bg-current/5 text-inherit border-current/10 opacity-70 hover:opacity-100"
            }`}
          >
            {status} (
            {status === "All"
              ? allProposals.length
              : allProposals.filter((p) => p.status === status).length}
            )
          </button>
        ))}
      </div>

      {/* প্রপোজাল লিস্ট */}
      {filteredProposals.length === 0 ? (
        <div className="text-center p-16 border border-dashed border-current/10 rounded-3xl bg-current/5">
          <Layers className="mx-auto opacity-30 mb-3" size={40} />
          <p className="opacity-50 font-medium text-sm italic">
            No proposals found matching {filterStatus}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProposals.map((proposal) => {
            const isPending = proposal.status === "Pending" || !proposal.status;
            const isAccepted = proposal.status === "Accepted";
            const isRejected = proposal.status === "Rejected";

            return (
              <div
                key={proposal.proposalId}
                className="group relative border border-current/10 hover:border-cyan-500/30 rounded-2xl p-5 md:p-6 bg-current/5 backdrop-blur-md transition-all duration-300 hover:shadow-[0_8px_30px_rgba(6,182,212,0.03)]"
              >
                {/* কার্ডের উপরের সেকশন */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-current/5">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-500 flex items-center gap-1 mb-1">
                      Project Base <ArrowUpRight size={12} />
                    </span>
                    <h2 className="font-extrabold text-lg text-inherit group-hover:text-cyan-500 transition-colors duration-300">
                      {proposal.taskTitle}
                    </h2>
                  </div>

                  {/* স্ট্যাটাস ব্যাজ */}
                  <span
                    className={`self-start md:self-center px-4 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 backdrop-blur-md ${
                      isAccepted
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : isRejected
                          ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                          : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    }`}
                  >
                    {isAccepted && <CheckCircle size={13} />}
                    {isRejected && <XCircle size={13} />}
                    {isPending && <Clock size={13} />}
                    {proposal.status || "Pending"}
                  </span>
                </div>

                {/* ফ্রিল্যান্সার প্রোফাইল স্ট্রিপ */}
                <div className="flex items-center gap-3 mb-4 bg-current/5 p-3 rounded-xl border border-current/5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-zinc-950 font-bold">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-xs opacity-50">Proposal submitted by</p>
                    <p className="text-sm font-bold text-inherit opacity-90">
                      {proposal.freelancerEmail}
                    </p>
                  </div>
                </div>

                {/* কভার নোট */}
                <div className="mb-5">
                  <p className="text-sm opacity-70 leading-relaxed bg-current/5 p-4 rounded-xl border border-current/5 whitespace-pre-line">
                    {proposal.coverNote || "No cover note provided."}
                  </p>
                </div>

                {/* মেটাডেটা এবং অ্যাকশন বাটন সেকশন */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div className="flex items-center gap-1 bg-current/5 px-3 py-1.5 rounded-lg border border-current/10">
                      <DollarSign size={14} className="text-cyan-500" />
                      <span className="text-inherit font-extrabold">${proposal.proposedBudget}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-current/5 px-3 py-1.5 rounded-lg border border-current/10">
                      <Clock size={14} className="text-amber-500" />
                      <span className="text-inherit font-semibold">{proposal.estimatedDays} Days</span>
                    </div>
                    <div className="flex items-center gap-1 bg-current/5 px-3 py-1.5 rounded-lg border border-current/10 opacity-60">
                      <Calendar size={14} />
                      <span>
                        {new Date(proposal.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* অ্যাকশন বাটনসমূহ */}
                  {proposal.taskStatus === "open" && isPending && (
                    <div className="flex items-center gap-2 sm:justify-end w-full sm:w-auto">
                      <button
                        onClick={() => handleRejectClick(proposal.taskId, proposal.proposalId)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-current/5 hover:bg-rose-500/10 border border-current/10 hover:border-rose-500/30 text-rose-500 font-bold text-xs rounded-xl transition duration-300 cursor-pointer"
                      >
                        Reject
                      </button>
                      
                      {/* 💳 বাটন ক্লিক হ্যান্ডলার পরিবর্তন করে ম্যাপ করা প্রপোজাল অবজেক্টটি পাস করলাম */}
                      <button
                        onClick={() => handleAcceptPitchClick(proposal)}
                        className="flex-1 sm:flex-none px-5 py-2 bg-gradient-to-r from-cyan-400 to-teal-400 hover:opacity-90 text-zinc-950 font-extrabold text-xs rounded-xl shadow-[0_4px_12px_rgba(6,182,212,0.2)] transition duration-300 cursor-pointer"
                      >
                        Accept Pitch
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* রিজেক্ট করার কনফার্মেশন মোডাল উইন্ডো */}
      <RejectTaskModal
        isOpen={showRejectModal}
        loading={rejectLoading}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedRejectData(null);
        }}
        onConfirm={confirmRejectProposal}
      />
    </div>
  );
};

export default ManageProposalsPage;