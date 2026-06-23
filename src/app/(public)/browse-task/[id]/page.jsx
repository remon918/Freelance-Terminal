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
  Loader2,
  ArrowLeft, // ফিরে যাওয়ার আইকনের জন্য যুক্ত করা হয়েছে
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
// import { headers } from "next/headers";

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

  // ডাইনামিক রোল গেট করা (সেশন না থাকলে গেস্ট ইউজার)
  const userRole = session?.user?.role || "guest";

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getTaskDetails(id);
        setTask(data);

        if (data && session?.user?.email) {
          const hasAlreadySubmitted = data.proposals?.some(
            (proposal) => proposal.freelancerEmail === session.user.email,
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
  }, [id, session?.user?.email, authLoading]);

  // Handle Proposal Submission
  const handleSubmitProposal = async (e) => {
    e.preventDefault();

    if (!session?.user?.email) {
      alert("You must be logged in to submit a proposal.");
      return;
    }

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
      const { data: tokenData } = await authClient.token();
      // console.log(tokenData);

      // console.log("My JWT Token:", tokenData);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/proposals`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${tokenData?.token}`,
          },
          body: JSON.stringify(proposalData),
        },
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubmitted(true);

        setTask((prev) => ({
          ...prev,
          proposals: [
            ...(prev?.proposals || []),
            { freelancerEmail: session.user.email },
          ],
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
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="animate-spin text-cyan-500" size={36} />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center mt-10 text-rose-500 font-semibold">
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
    <div className="max-w-6xl mx-auto p-4 md:px-6 mt-12 md:0 font-sans text-inherit">
      {/* Back to Tasks Button */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/browse-task")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-current/10 bg-current/5 text-sm font-medium transition hover:bg-current/10 opacity-80 hover:opacity-100"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tasks
        </button>
      </div>

      {/* মেইন গ্রিড লেআউট */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* বাম দিকের সেকশন: টাইটেল, ডেসক্রিপশন ও প্রপোজাল ফর্ম/লিস্ট */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-current/10 bg-current/5 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-semibold capitalize tracking-wide ${
                  task.status === "open"
                    ? "bg-cyan-500/10 text-cyan-500 border border-cyan-500/20"
                    : "bg-current/10 opacity-60"
                }`}
              >
                {task.status}
              </span>
              <span className="flex items-center gap-1.5 bg-current/5 border border-current/10 px-3 py-0.5 rounded-full text-xs font-medium opacity-80">
                <Briefcase className="w-3.5 h-3.5 text-cyan-500" />
                {task.category || "Development"}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-inherit">
              {task.title}
            </h1>

            <p className="opacity-70 text-sm md:text-base leading-relaxed whitespace-pre-line pt-2">
              {task.description}
            </p>

            {/* Client Role Buttons */}
            {userRole === "client" && (
              <div className="border-t border-current/10 my-6 pt-4 flex items-center gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-1.5 border border-current/10 text-inherit opacity-60 font-medium text-sm rounded-lg transition hover:bg-current/5"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>

                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-1.5 border border-rose-500/20 text-rose-500 font-medium text-sm rounded-lg transition hover:bg-rose-500/5"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* PROPOSAL SECTION OR FORM */}
          {userRole === "guest" || userRole === "freelancer" ? (
            <div className="border border-current/10 bg-current/5 rounded-xl p-6 relative overflow-hidden">
              {/* Already Submitted State */}
              {isSubmitted ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in zoom-in-95 duration-300">
                  <div className="p-3 bg-cyan-500/10 rounded-full border border-cyan-500/20 text-cyan-500">
                    <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-cyan-500">
                    Proposal Already Submitted
                  </h3>
                  <p className="text-sm opacity-60 max-w-sm">
                    You have already applied for this task. Your interest has
                    been recorded, and the client can view your application from
                    their dashboard.
                  </p>
                </div>
              ) : (
                /* Dynamic Form State */
                <form onSubmit={handleSubmitProposal} className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-current/10">
                    <Send className="w-5 h-5 text-cyan-500 rotate-[-10deg]" />
                    <h3 className="text-lg font-bold tracking-tight">
                      Submit a Proposal
                    </h3>
                  </div>

                  {/* Two Column Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider opacity-60">
                        Proposed Budget (USD)
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 opacity-50 text-sm">
                          $
                        </span>
                        <input
                          type="number"
                          required
                          value={proposedBudget}
                          onChange={(e) => setProposedBudget(e.target.value)}
                          placeholder="e.g. 50.00"
                          className="w-full pl-8 pr-4 py-2 bg-current/5 border border-current/10 rounded-lg text-sm text-inherit focus:outline-none focus:border-cyan-500 transition placeholder:opacity-30"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider opacity-60">
                        Estimated Days
                      </label>
                      <input
                        type="number"
                        required
                        value={estimatedDays}
                        onChange={(e) => setEstimatedDays(e.target.value)}
                        placeholder="e.g. 3"
                        className="w-full px-4 py-2 bg-current/5 border border-current/10 rounded-lg text-sm text-inherit focus:outline-none focus:border-cyan-500 transition placeholder:opacity-30"
                      />
                    </div>
                  </div>

                  {/* Cover Note Textarea */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider opacity-60">
                      Cover Note
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      placeholder={
                        userRole === "guest"
                          ? "Please log in to submit your proposal..."
                          : "Explain why you're the best fit for this task..."
                      }
                      disabled={userRole === "guest"}
                      className="w-full px-4 py-2 bg-current/5 border border-current/10 rounded-lg text-sm text-inherit focus:outline-none focus:border-cyan-500 transition placeholder:opacity-30 resize-none disabled:opacity-50"
                    />
                  </div>

                  {/* Submit Action Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || userRole === "guest"}
                    className="w-full py-2 px-4 bg-cyan-600 text-white font-semibold text-sm rounded-lg hover:bg-cyan-700 transition shadow-sm disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : userRole === "guest" ? (
                      "Login to Submit Proposal"
                    ) : (
                      "Submit Proposal"
                    )}
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Fallback/Client/Admin View */
            <div className="border border-current/10 bg-current/5 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                Proposals
                <span className="bg-current/10 px-2 py-0.5 rounded-full text-xs font-semibold opacity-70">
                  {task.proposals?.length || 0}
                </span>
              </h3>
              <p className="opacity-50 text-sm italic">
                No proposals yet. Freelancers will apply soon!
              </p>
            </div>
          )}
        </div>

        {/* ডান দিকের সেকশন: মেটাডেটা ওভারভিউ কার্ড */}
        <div className="border border-current/10 bg-current/5 rounded-xl p-6 space-y-5 sticky top-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-2">
            Task Overview
          </h2>

          {/* Budget Row */}
          <div className="flex items-start gap-4">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 text-cyan-500">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs opacity-60">Budget</p>
              <p className="text-2xl font-bold tracking-tight text-cyan-500">
                ${task.budget || "0"}
              </p>
            </div>
          </div>

          {/* Deadline Row */}
          <div className="flex items-start gap-4">
            <div className="p-2 bg-current/5 rounded-lg border border-current/10 text-inherit opacity-80">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs opacity-60">Deadline</p>
              <p className="text-base font-semibold">
                {formatDate(task.deadline)}
              </p>
            </div>
          </div>

          {/* Posted Date Row */}
          <div className="flex items-start gap-4">
            <div className="p-2 bg-current/5 rounded-lg border border-current/10 text-inherit opacity-80">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs opacity-60">Posted</p>
              <p className="text-base font-semibold">
                {formatDate(task.createdAt || new Date())}
              </p>
            </div>
          </div>

          {/* Client Row */}
          <div className="flex items-start gap-4 border-t border-current/10 pt-4">
            <div className="p-2 bg-current/5 rounded-lg border border-current/10 text-inherit opacity-80">
              <User className="w-5 h-5" />
            </div>
            <div className="overflow-hidden w-full">
              <p className="text-xs opacity-60">Client</p>
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
