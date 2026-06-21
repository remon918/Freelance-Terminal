"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTaskDetails } from "@/lib/api/tasks";
import {
  Calendar,
  DollarSign,
  Briefcase,
  Edit3,
  Trash2,
  Clock,
  User,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const TaskDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending: authLoading } = authClient.useSession();

  // States
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // Proposal Form States
  const [proposedBudget, setProposedBudget] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // User Role Simulation (Better Auth থেকে সেশন ডাটা অনুযায়ী ডায়নামিক হবে)
  const userRole = "freelancer";

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getTaskDetails(id);
        setTask(data);

        // 🔥 রিফ্রেশ করলেও যাতে সাবমিটেড থাকে: এপিআই থেকে আসা প্রপোজাল লিস্ট চেক করা হচ্ছে
        if (data && session?.user?.email) {
          const hasAlreadySubmitted = data.proposals?.some(
            (proposal) => proposal.freelancerEmail === session.user.email
          );
          if (hasAlreadySubmitted) {
            setIsSubmitted(true);
          }
        }
      } catch (error) {
        console.error("Error fetching task details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id && !authLoading) fetchDetails();
  }, [id, session?.user?.email, authLoading]); // 🔥 সেশন লোড হওয়ার পর রি-রান হবে নির্ভুল চেকের জন্য

  // Handle Proposal Submission
  const handleSubmitProposal = async (e) => {
    e.preventDefault();

    if (!session?.user?.email) {
      alert("You must be logged in to submit a proposal.");
      return;
    }
    
    // সেফটি গার্ড: অলরেডি সাবমিট করা থাকলে ফাংশন ব্রেক করবে
    if (isSubmitted) {
      alert("You have already submitted a proposal for this task.");
      return;
    }

    if (!proposedBudget || !estimatedDays || !coverNote) return;

    setIsSubmitting(true);

    const proposalData = {
      taskId: id,
      proposedBudget: Number(proposedBudget),
      estimatedDays: Number(estimatedDays),
      coverNote,
      freelancerEmail: session.user.email,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/proposals`,
        {
          format: "json",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(proposalData),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubmitted(true);
        
        // সাবমিট হওয়ার সাথে সাথে লোকাল স্টেট টাস্ক অবজেক্টেও প্রপোজালটি পুশ করে দেওয়া হলো যেন সিঙ্ক থাকে
        setTask((prev) => ({
          ...prev,
          proposals: [...(prev?.proposals || []), { freelancerEmail: session.user.email }],
        }));
      } else {
        alert(result.message || "Failed to submit proposal");
      }
    } catch (error) {
      console.error("Failed to submit proposal:", error);
      alert("Network error, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="text-center mt-10 text-gray-500 font-medium animate-pulse">
        Loading task details...
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        Task not found!
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 font-sans mt-6">
      {/* মেইন গ্রিড লেআউট */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* বাম দিকের সেকশন: টাইটেল, ডেসক্রিপশন ও প্রপোজাল ফর্ম/লিস্ট */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-gray-500/30 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize tracking-wide ${
                  task.status === "open"
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : "bg-gray-500/10 text-gray-500"
                }`}
              >
                {task.status}
              </span>
              <span className="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-medium">
                <Briefcase className="w-3.5 h-3.5" />
                {task.category || "Development"}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {task.title}
            </h1>

            <p className="text-gray-500 text-base leading-relaxed whitespace-pre-line pt-2">
              {task.description}
            </p>

            {/* Client Role Buttons */}
            {userRole === "client" && (
              <div className="border-t border-gray-500/20 my-6 pt-4 flex items-center gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-500/40 text-gray-400 italic font-medium text-sm rounded-xl transition shadow-sm hover:bg-gray-500/5"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>

                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-500/40 text-rose-600 italic font-medium text-sm rounded-xl transition shadow-sm hover:bg-rose-500/5"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* ------------------------------- */}
          {/* PROPOSAL SECTION OR FORM */}
          {/* ------------------------------- */}
          {userRole === "freelancer" ? (
            <div className="border border-gray-500/30 rounded-2xl p-6 shadow-sm relative overflow-hidden backdrop-blur-sm">
              {/* Already Submitted State */}
              {isSubmitted ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in zoom-in-95 duration-300">
                  <div className="p-3 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-500 shadow-lg shadow-emerald-500/5">
                    <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-emerald-500">
                    Proposal Already Submitted
                  </h3>
                  <p className="text-sm text-gray-400 max-w-sm">
                    You have already applied for this task. Your interest has been recorded, and the client can view your application from their dashboard.
                  </p>
                </div>
              ) : (
                /* Dynamic Form State */
                <form onSubmit={handleSubmitProposal} className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-500/10">
                    <Send className="w-5 h-5 text-amber-500 rotate-[-10deg]" />
                    <h3 className="text-lg font-bold tracking-tight">
                      Submit a Proposal
                    </h3>
                  </div>

                  {/* Two Column Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Proposed Budget (USD)
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-gray-400 text-sm">
                          $
                        </span>
                        <input
                          type="number"
                          required
                          value={proposedBudget}
                          onChange={(e) => setProposedBudget(e.target.value)}
                          placeholder="e.g. 50.00"
                          className="w-full pl-8 pr-4 py-3 bg-gray-500/5 border border-gray-500/20 rounded-xl text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition placeholder-gray-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Estimated Days
                      </label>
                      <input
                        type="number"
                        required
                        value={estimatedDays}
                        onChange={(e) => setEstimatedDays(e.target.value)}
                        placeholder="e.g. 3"
                        className="w-full px-4 py-3 bg-gray-500/5 border border-gray-500/20 rounded-xl text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition placeholder-gray-500"
                      />
                    </div>
                  </div>

                  {/* Cover Note Textarea */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Cover Note
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      placeholder="Explain why you're the best fit for this task..."
                      className="w-full px-4 py-3 bg-gray-500/5 border border-gray-500/20 rounded-xl text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition placeholder-gray-500 resize-none"
                    />
                  </div>

                  {/* Submit Action Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 bg-amber-500 text-white dark:text-neutral-900 font-bold text-sm rounded-xl hover:bg-amber-600 active:scale-[0.99] transition shadow-md shadow-amber-500/10 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </                    >
                    ) : (
                      "Submit Proposal"
                    )}
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Fallback/Client View: Displays total proposals count */
            <div className="border border-gray-500/30 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                Proposals
                <span className="bg-gray-500/10 text-gray-500 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {task.proposals?.length || 0}
                </span>
              </h3>
              <p className="text-gray-400 text-sm italic">
                No proposals yet. Freelancers will apply soon!
              </p>
            </div>
          )}
        </div>

        {/* ডান দিকের সেকশন: মেটাডেটা ওভারভিউ কার্ড */}
        <div className="border border-gray-500/30 rounded-2xl p-6 shadow-sm space-y-5 sticky top-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">
            Task Overview
          </h2>

          {/* Budget Row */}
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-500">
              <DollarSign className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400">Budget</p>
              <p className="text-2xl font-bold text-amber-500 tracking-tight">
                ${task.budget || "0"}
              </p>
            </div>
          </div>

          {/* Deadline Row */}
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-500">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400">Deadline</p>
              <p className="text-base font-bold">{formatDate(task.deadline)}</p>
            </div>
          </div>

          {/* Posted Date Row */}
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-500">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400">Posted</p>
              <p className="text-base font-bold">
                {formatDate(task.createdAt || new Date())}
              </p>
            </div>
          </div>

          {/* Client Row */}
          <div className="flex items-start gap-4 border-t border-gray-500/20 pt-4">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-500">
              <User className="w-5 h-5" />
            </div>
            <div className="overflow-hidden w-full">
              <p className="text-xs font-medium text-gray-400">Client</p>
              <p
                className="text-sm font-semibold truncate"
                title={task.clientEmail || "client@example.com"}
              >
                {task.clientEmail || "client@example.com"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPage;