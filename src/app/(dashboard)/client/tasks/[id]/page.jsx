"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTaskDetails } from "@/lib/api/tasks";
import { Calendar, DollarSign, Briefcase, Edit3, Trash2, Loader2 } from "lucide-react";
import EditTaskModal from "@/components/minor/EditTaskModal";
import { deleteTask, rejectProposalAction } from "@/lib/actions/actions";
import toast from "react-hot-toast";
import DeleteTaskModal from "@/components/minor/DeleteTaskModal";
import RejectTaskModal from "@/components/minor/RejectTaskModal";
// 💳 পেমেন্ট গেটওয়ে কম্পোনেন্টটি ইম্পোর্ট করা হলো
import SecureCheckoutView from "@/components/minor/SecureCheckoutView";

const MyTaskDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Reject Modal এর জন্য স্টেটসমূহ
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState(null);
  const [rejectLoading, setRejectLoading] = useState(false);

  // 💳 পেমেন্ট স্ক্রিন কন্ট্রোল করার জন্য নতুন স্টেটস
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProposalData, setSelectedProposalData] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getTaskDetails(id);
        setTask(data);
      } catch (error) {
        console.error("Error fetching task details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center mt-10 text-rose-500 font-bold">Task not found!</div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleDelete = async () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteTask = async () => {
    try {
      setDeleteLoading(true);
      const result = await deleteTask(task._id);
      if (result.success) {
        toast.success("Task deleted successfully");
        router.push("/client/tasks");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete task");
    } finally {
      setDeleteLoading(false);
    }
  };

  // প্রপোজাল রেজেক্ট করার হ্যান্ডলার ফাংশনস
  const handleRejectClick = (proposalId) => {
    setSelectedProposalId(proposalId);
    setShowRejectModal(true);
  };

  const confirmRejectProposal = async () => {
    if (!selectedProposalId) return;

    try {
      setRejectLoading(true);
      const result = await rejectProposalAction(task._id, selectedProposalId);

      if (result.success) {
        toast.success(result.message);

        setTask((prevTask) => ({
          ...prevTask,
          proposals: prevTask.proposals.filter(
            (p) => p.proposalId !== selectedProposalId,
          ),
        }));

        router.refresh();
        setShowRejectModal(false);
        setSelectedProposalId(null);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setRejectLoading(false);
    }
  };

  // 💳 Accept Pitch বাটনে ক্লিক করলে এই ফাংশনটি রান হবে
  const handleAcceptPitchClick = (proposal) => {
    // পেমেন্ট গেটওয়ের রিকোয়ার্ড ফিল্ডসহ অবজেক্টটি তৈরি করে স্টেটে পাঠানো হলো
    setSelectedProposalData({
      ...proposal,
      taskId: task._id,
      taskTitle: task.title,
    });
    setShowCheckout(true);
  };

  // 💳 পেমেন্ট সাকসেস হওয়ার পর এক্সেপ্ট অ্যাকশন সাবমিট করার হ্যান্ডলার
  const handleAcceptSuccessSubmit = async (taskId, proposalId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/proposals/${taskId}/${proposalId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "Accept",
            status: "Accepted",
          }),
        },
      );

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(result.message);
        
        // রিয়েল-টাইম স্টেট ও ইউআই আপডেট
        setTask((prevTask) => {
          const updatedProposals = prevTask.proposals.map((p) => {
            if (p.proposalId !== proposalId) {
              return { ...p, status: "Rejected" };
            }
            return { ...p, status: "Accepted" };
          });

          return {
            ...prevTask,
            status: "assigned",
            proposals: updatedProposals,
          };
        });

        setShowCheckout(false);
        setSelectedProposalData(null);
        router.refresh();
      } else {
        toast.error(result.message || "Action failed");
      }
    } catch (error) {
      console.error("Failed to accept proposal:", error);
      toast.error("Something went wrong");
    }
  };

  // 💳 কন্ডিশনাল রেন্ডারিং: পেমেন্ট গেটওয়ে স্ক্রিন ওন হলে এটি দেখাবে
  if (showCheckout && selectedProposalData) {
    return (
      <SecureCheckoutView
        proposal={selectedProposalData}
        onBack={() => {
          setShowCheckout(false);
          setSelectedProposalData(null);
        }}
        onPaymentSuccess={async () => {
          await handleAcceptSuccessSubmit(
            selectedProposalData.taskId,
            selectedProposalData.proposalId
          );
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6 text-inherit font-sans min-h-screen selection:bg-cyan-500/20 selection:text-cyan-500">
      <div className="space-y-6 mt-10 md:mt-0">
        
        {/* ১. মেইন টাস্ক কার্ড */}
        <div className="border border-current/10 bg-current/5 rounded-2xl p-6 shadow-sm backdrop-blur-md relative overflow-hidden">
          <div className="space-y-2 mb-6">
            <h1 className="text-xl md:text-2xl font-extrabold">{task.title}</h1>
            <p className="opacity-70 text-sm md:text-base leading-relaxed">
              {task.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm font-medium">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${
                task.status === "open"
                  ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
                  : "bg-current/10 text-inherit opacity-50 border-transparent"
              }`}
            >
              {task.status}
            </span>

            <span className="flex items-center gap-1.5 bg-current/5 px-3 py-1 rounded-md text-xs border border-current/5">
              <Briefcase className="w-3.5 h-3.5" />
              {task.category || "Development"}
            </span>

            <span className="flex items-center gap-0.5 bg-current/5 px-3 py-1 rounded-md text-xs border border-current/5">
              <DollarSign className="w-3.5 h-3.5 text-cyan-500" />
              <span className="font-bold">{task.budget}</span>
            </span>

            <span className="flex items-center gap-1.5 bg-current/5 px-3 py-1 rounded-md text-xs border border-current/5 opacity-70">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(task.deadline)}
            </span>
          </div>

          <div className="border-t border-current/5 my-4"></div>

          <div className="flex items-center gap-3 pt-2">
            <button
              disabled={task.status !== "open"}
              onClick={() => setShowEditModal(true)}
              className={`flex items-center gap-2 px-4 py-2 font-bold text-sm rounded-xl transition border ${
                task.status === "open"
                  ? "border-current/10 hover:bg-current/5 cursor-pointer"
                  : "border-current/5 opacity-40 cursor-not-allowed"
              }`}
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
            <button
              disabled={task.status !== "open"}
              onClick={handleDelete}
              className={`flex items-center gap-2 px-4 py-2 font-bold text-sm rounded-xl transition border ${
                task.status === "open"
                  ? "border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 cursor-pointer"
                  : "border-current/5 opacity-40 cursor-not-allowed"
              }`}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* ২. প্রপোজাল সেকশন কার্ড */}
        <div className="border border-current/10 rounded-2xl p-6 shadow-sm bg-current/5 backdrop-blur-md">
          <h3 className="text-lg font-extrabold mb-4">
            Proposals ({task.proposals?.length || 0})
          </h3>

          {task.proposals && task.proposals.length > 0 ? (
            <div className="space-y-4">
              {task.proposals.map((proposal) => {
                const isPending = proposal.status === "Pending" || !proposal.status;
                const isAccepted = proposal.status === "Accepted";
                const isRejected = proposal.status === "Rejected";

                return (
                  <div
                    key={proposal.proposalId}
                    className="border border-current/10 rounded-xl p-5 space-y-3 bg-current/5 transition duration-300 hover:border-cyan-500/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-bold opacity-90">
                        <div className="w-7 h-7 rounded-full bg-current/10 flex items-center justify-center text-xs">
                          👤
                        </div>
                        {proposal.freelancerEmail}
                      </div>
                      <span
                        className={`px-3 py-0.5 rounded-full text-xs font-bold border ${
                          isAccepted
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : isRejected
                              ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                              : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }`}
                      >
                        {proposal.status || "Pending"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs opacity-60">
                      <span className="font-extrabold text-cyan-500 text-sm">
                        ${proposal.proposedBudget}
                      </span>
                      <span>•</span>
                      <span className="font-medium">
                        {proposal.estimatedDays}{" "}
                        {proposal.estimatedDays > 1 ? "days" : "day"}
                      </span>
                      <span>•</span>
                      <span>{formatDate(proposal.createdAt)}</span>
                    </div>

                    <p className="text-sm opacity-70 leading-relaxed bg-current/5 p-3 rounded-lg border border-current/5">
                      {proposal.coverNote || "No cover note provided."}
                    </p>

                    {task.status === "open" && isPending && (
                      <div className="flex items-center gap-2 pt-2">
                        {/* 💳 Accept বাটনে পেমেন্ট গেটওয়ে ট্রিগার লিঙ্ক করা হলো */}
                        <button
                          type="button"
                          onClick={() => handleAcceptPitchClick(proposal)}
                          className="px-4 py-1.5 bg-gradient-to-r from-cyan-400 to-teal-400 text-zinc-950 font-extrabold text-xs rounded-lg shadow-[0_2px_8px_rgba(6,182,212,0.15)] hover:opacity-90 transition cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectClick(proposal.proposalId)}
                          className="px-4 py-1.5 bg-current/5 border border-current/10 text-rose-500 font-bold text-xs rounded-lg hover:bg-rose-500/10 transition cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="opacity-50 text-sm italic">
              No proposals yet. Freelancers will apply soon!
            </p>
          )}
        </div>
      </div>

      {showEditModal && (
        <EditTaskModal
          task={task}
          onClose={() => setShowEditModal(false)}
          onSuccess={(updatedTask) => {
            setTask(updatedTask);
            setShowEditModal(false);
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteTaskModal
          task={task}
          loading={deleteLoading}
          onClose={() => setShowDeleteModal(false)}
          onDelete={confirmDeleteTask}
        />
      )}

      <RejectTaskModal
        isOpen={showRejectModal}
        loading={rejectLoading}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedProposalId(null);
        }}
        onConfirm={confirmRejectProposal}
      />
    </div>
  );
};

export default MyTaskDetailsPage;