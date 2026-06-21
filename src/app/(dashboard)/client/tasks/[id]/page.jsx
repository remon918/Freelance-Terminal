"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTaskDetails } from "@/lib/api/tasks";
import { Calendar, DollarSign, Briefcase, Edit3, Trash2 } from "lucide-react";
import EditTaskModal from "@/components/minor/EditTaskModal";
import { deleteTask, rejectProposalAction } from "@/lib/actions/actions";
import toast from "react-hot-toast";
import DeleteTaskModal from "@/components/minor/DeleteTaskModal";
import RejectTaskModal from "@/components/minor/RejectTaskModal";
// 🔴 নতুন মোডালটি ইমপোর্ট করা হলো
// import RejectTaskModal from "@/components/minor/RejectTaskModal";

const MyTaskDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 🔴 Reject Modal এর জন্য স্টেটসমূহ
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState(null);
  const [rejectLoading, setRejectLoading] = useState(false);

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
      <div className="text-center mt-10 text-gray-500">
        Loading task details...
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center mt-10 text-red-500">Task not found!</div>
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

  // 🔴 প্রপোজাল রেজেক্ট করার হ্যান্ডলার ফাংশনস
  const handleRejectClick = (proposalId) => {
    setSelectedProposalId(proposalId);
    setShowRejectModal(true);
  };

  const confirmRejectProposal = async () => {
  if (!selectedProposalId) return;

  try {
    setRejectLoading(true);

    // 🔥 সার্ভার অ্যাকশন কল করা হলো
    const result = await rejectProposalAction(task._id, selectedProposalId);

    if (result.success) {
      toast.success(result.message);

      // স্টেট ফিল্টার করে UI এবং কাউন্ট রিয়েল-টাইমে আপডেট
      setTask((prevTask) => ({
        ...prevTask,
        proposals: prevTask.proposals.filter(
          (p) => p.proposalId !== selectedProposalId
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

  return (
    <div className="">
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 font-sans mt-10 md:mt-0">
        {/* ১. মেইন টাস্ক কার্ড */}
        <div className="border border-gray-500 rounded-2xl p-6 shadow-sm">
          <div className="space-y-2 mb-6">
            <h1 className="text-xl md:text-2xl font-bold">{task.title}</h1>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {task.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm font-medium">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                task.status === "open"
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "bg-gray-500 text-gray-600"
              }`}
            >
              {task.status}
            </span>

            <span className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs">
              <Briefcase className="w-3.5 h-3.5" />
              {task.category || "Development"}
            </span>

            <span className="flex items-center text-gray-500 gap-0.5">
              <DollarSign className="w-4 h-4 shrink-0 -mr-0.5" />
              {task.budget}
            </span>

            <span className="flex items-center gap-1.5 text-gray-500">
              <Calendar className="w-4 h-4 shrink-0" />
              {formatDate(task.deadline)}
            </span>
          </div>

          <div className="border-t border-gray-500 my-4"></div>

          <div className="flex items-center gap-3 pt-2">
            <button
              disabled={task.status !== "open"}
              onClick={() => setShowEditModal(true)}
              className={`flex items-center gap-2 px-4 py-2 font-medium text-sm rounded-xl transition shadow-sm border ${
                task.status === "open"
                  ? "border-gray-500 hover:bg-gray-50/10 cursor-pointer"
                  : "border-gray-700 opacity-50 cursor-not-allowed"
              }`}
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
            <button
              disabled={task.status !== "open"}
              onClick={handleDelete}
              className={`flex items-center gap-2 px-4 py-2 font-medium text-sm rounded-xl transition shadow-sm border ${
                task.status === "open"
                  ? "border-rose-200/30 bg-rose-50/10 hover:bg-rose-50/20 text-rose-600 cursor-pointer"
                  : "border-gray-700 opacity-50 cursor-not-allowed text-gray-500"
              }`}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* ২. প্রপোজাল সেকশন কার্ড */}
        <div className="border border-gray-500 rounded-2xl p-6 shadow-sm bg-neutral-900/50">
          <h3 className="text-lg font-bold mb-4">
            Proposals ({task.proposals?.length || 0})
          </h3>

          {task.proposals && task.proposals.length > 0 ? (
            <div className="space-y-4">
              {task.proposals.map((proposal) => (
                <div
                  key={proposal.proposalId}
                  className="border border-gray-500/30 rounded-xl p-5 space-y-3 bg-neutral-900"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-200 font-medium">
                      <div className="w-7 h-7 rounded-full bg-gray-500/10 flex items-center justify-center text-gray-400">
                        <span className="text-xs">👤</span>
                      </div>
                      {proposal.freelancerEmail}
                    </div>
                    <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-0.5 rounded-full text-xs font-semibold">
                      {proposal.status || "Pending"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                    <span className="font-semibold text-gray-200">
                      ${proposal.proposedBudget}
                    </span>
                    <span>•</span>
                    <span>
                      {proposal.estimatedDays}{" "}
                      {proposal.estimatedDays > 1 ? "days" : "day"}
                    </span>
                    <span>•</span>
                    <span>{formatDate(proposal.createdAt)}</span>
                  </div>

                  <p className="text-sm text-gray-400 leading-relaxed pl-1">
                    {proposal.coverNote}
                  </p>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      className="px-4 py-1.5 bg-emerald-600 text-white font-semibold text-xs rounded-lg hover:bg-emerald-700 transition cursor-pointer"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRejectClick(proposal.proposalId)}
                      className="px-4 py-1.5 bg-neutral-800 border border-gray-500/30 text-rose-500 font-semibold text-xs rounded-lg hover:bg-rose-50/10 transition cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic">
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

      {/* 🔴 এখানে নতুন আলাদা করা কম্পোনেন্টটি কল করা হলো */}
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
