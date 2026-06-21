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
} from "lucide-react";
import { getMyTasks } from "@/lib/api/tasks";
import RejectTaskModal from "@/components/minor/RejectTaskModal";
// 💳 নতুন পেমেন্ট গেটওয়ে কম্পোনেন্টটি ইম্পোর্ট করলাম (নিচে এই ফাইলটির কোড দেওয়া আছে)
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

  // প্রপোজাল Accept/Reject হ্যান্ডলার (পেমেন্ট সাকসেস হওয়ার পর এটা কল হবে)
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

  // 💳 Accept Pitch বাটনে ক্লিক করলে সরাসরি এপিআই কল না হয়ে এই ফাংশনটি রান হবে
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
        <span className="loading loading-spinner loading-lg text-cyan-400"></span>
      </div>
    );
  }

  // 💳 কন্ডিশনাল রেন্ডারিং: যদি showCheckout ট্রু হয়, তবে স্ট্রাইপ পেমেন্ট গেটওয়ে স্ক্রিন দেখাবে
  if (showCheckout && selectedProposalData) {
    return (
      <SecureCheckoutView
        proposal={selectedProposalData}
        onBack={() => {
          setShowCheckout(false);
          setSelectedProposalData(null);
        }}
        onPaymentSuccess={async () => {
          // পেমেন্ট গেটওয়ে থেকে পেমেন্ট কনফার্ম হলে এই হ্যান্ডলার ব্যাকএন্ড এক্সেপ্ট অ্যাকশনটি কল করবে
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
    <div className="mx-auto max-w-6xl p-4 md:p-8 text-gray-100 min-h-screen">
      {/* হেডার সেকশন */}
      <div className="relative mb-10 p-6 rounded-3xl overflow-hidden bg-linear-to-r from-neutral-800/80 via-neutral-800/70 to-cyan-950/40 border border-neutral-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-linear-to-r from-white via-gray-200 to-cyan-400 bg-clip-text text-transparent">
          Manage Proposals
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Review, filter, and respond to incoming pitches from global freelancers.
        </p>
      </div>

      {/* স্ট্যাটাস ফিল্টার ট্যাব */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
        {["All", "Pending", "Accepted", "Rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-5 py-2 text-xs font-semibold rounded-xl transition-all duration-300 cursor-pointer border ${
              filterStatus === status
                ? "bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                : "bg-neutral-900 text-gray-400 border-neutral-800 hover:border-neutral-700 hover:text-white"
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
        <div className="text-center p-12 border border-dashed border-neutral-800 rounded-3xl bg-neutral-900/50">
          <Layers className="mx-auto text-gray-600 mb-3" size={40} />
          <p className="text-gray-400 font-medium">
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
                className="group relative border border-neutral-800 hover:border-cyan-500/30 rounded-2xl p-5 md:p-6 bg-neutral-900/60 backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.05)]"
              >
                {/* কার্ডের উপরের সেকশন */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-neutral-800/60">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 flex items-center gap-1 mb-1">
                      Project Base <ArrowUpRight size={12} />
                    </span>
                    <h2 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors duration-300">
                      {proposal.taskTitle}
                    </h2>
                  </div>

                  {/* স্ট্যাটাস ব্যাজ */}
                  <span
                    className={`self-start md:self-center px-4 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 backdrop-blur-md ${
                      isAccepted
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : isRejected
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {isAccepted && <CheckCircle size={13} />}
                    {isRejected && <XCircle size={13} />}
                    {isPending && <Clock size={13} />}
                    {proposal.status || "Pending"}
                  </span>
                </div>

                {/* ফ্রিল্যান্সার প্রোফাইল স্ট্রিপ */}
                <div className="flex items-center gap-3 mb-4 bg-neutral-950/40 p-3 rounded-xl border border-neutral-800/40">
                  <div className="w-9 h-9 rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-black font-bold">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Proposal submitted by</p>
                    <p className="text-sm font-semibold text-gray-200">
                      {proposal.freelancerEmail}
                    </p>
                  </div>
                </div>

                {/* কভার নোট */}
                <div className="mb-5">
                  <p className="text-sm text-gray-400 leading-relaxed bg-neutral-950/20 p-4 rounded-xl border border-neutral-800/30 whitespace-pre-line">
                    {proposal.coverNote || "No cover note provided."}
                  </p>
                </div>

                {/* মেটাডেটা এবং অ্যাকশন বাটন সেকশন */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1 bg-neutral-800/40 px-3 py-1.5 rounded-lg border border-neutral-800">
                      <DollarSign size={14} className="text-cyan-400" />
                      <span className="text-gray-200 font-bold">${proposal.proposedBudget}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-neutral-800/40 px-3 py-1.5 rounded-lg border border-neutral-800">
                      <Clock size={14} className="text-amber-400" />
                      <span className="text-gray-200 font-medium">{proposal.estimatedDays} Days</span>
                    </div>
                    <div className="flex items-center gap-1 bg-neutral-800/40 px-3 py-1.5 rounded-lg border border-neutral-800">
                      <Calendar size={14} className="text-gray-500" />
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
                        className="flex-1 sm:flex-none px-4 py-2 bg-neutral-800 hover:bg-rose-950/30 border border-neutral-700 hover:border-rose-900/50 text-rose-400 font-semibold text-xs rounded-xl transition-all duration-300 cursor-pointer"
                      >
                        Reject
                      </button>
                      
                      {/* 💳 বাটন ক্লিক হ্যান্ডলার পরিবর্তন করে ম্যাপ করা প্রপোজাল অবজেক্টটি পাস করলাম */}
                      <button
                        onClick={() => handleAcceptPitchClick(proposal)}
                        className="flex-1 sm:flex-none px-5 py-2 bg-linear-to-r from-cyan-400 to-teal-400 hover:from-cyan-500 hover:to-teal-500 text-black font-bold text-xs rounded-xl shadow-[0_4px_15px_rgba(34,211,238,0.2)] hover:shadow-[0_4px_20px_rgba(34,211,238,0.4)] transition-all duration-300 cursor-pointer"
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