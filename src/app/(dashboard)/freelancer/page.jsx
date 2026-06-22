"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { getFreelancerProposals } from "@/lib/actions/actions";
import {
  FileText,
  Clock3,
  CheckCircle2,
  DollarSign,
  Search,
  ArrowUpRight,
  Orbit,
} from "lucide-react";

export default function FreelancerDashboard() {
  const { data: session } = authClient.useSession();
  const freelancerEmail = session?.user?.email;

  // স্টেটসসমূহ
  const [proposals, setProposals] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [earningsData, setEarningsData] = useState({ totalEarned: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!freelancerEmail) return;

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        // ⚡ ৩টি সোর্স থেকে প্যারালাল ডাটা ফেচিং (Performance Optimization)
        const [proposalsData, projectsRes, earningsRes] = await Promise.all([
          getFreelancerProposals(freelancerEmail),
          fetch(`${apiUrl}/api/freelancer-projects?email=${freelancerEmail}`).then((res) => res.json()),
          fetch(`${apiUrl}/api/freelancer-earnings?email=${freelancerEmail}`).then((res) => res.json()),
        ]);

        // ১. প্রপোজাল সেট করা
        setProposals(proposalsData || []);

        // ২. অ্যাক্টিভ ও কমপ্লিটেড প্রজেক্ট সেট করা
        if (projectsRes.success) {
          setActiveProjects(projectsRes.activeProjects || []);
          setCompletedProjects(projectsRes.completedProjects || []);
        }

        // ৩. আর্নিং ডাটা সেট করা
        if (earningsRes.success) {
          setEarningsData(earningsRes);
        }
      } catch (error) {
        console.error("Error loading freelancer dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [freelancerEmail]);

  // 🔥 ডাইনামিক স্ট্যাটস ক্যালকুলেশন লজিক
  const totalProposalsCount = proposals.length;
  const acceptedCount = activeProjects.length; // ইন-প্রোগ্রেস বা এক্সেপ্টেড টাস্ক
  const completedCount = completedProjects.length;
  const totalEarned = earningsData.totalEarned || 0;

  const statCards = [
    {
      title: "Total Proposals",
      value: totalProposalsCount,
      description: "Proposals submitted so far",
      icon: FileText,
    },
    {
      title: "Accepted / In Progress",
      value: acceptedCount,
      description: "Tasks currently running",
      icon: Clock3,
    },
    {
      title: "Completed",
      value: completedCount,
      description: "Proposals fully completed",
      icon: CheckCircle2,
    },
    {
      title: "Total Earned",
      value: `$${totalEarned.toLocaleString()}`,
      description: "From completed investments",
      icon: DollarSign,
    },
  ];

  // টেবিলের জন্য রিসেন্ট ফিল্টারিং (সর্বোচ্চ ৩-৫টি দেখানো হবে)
  const pendingProposals = proposals
    .filter((p) => p.status?.toLowerCase() === "pending")
    .slice(0, 3);

  const recentActiveProjects = [...activeProjects].slice(0, 3);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-teal-400"></span>
      </div>
    );
  }

  return (
    <div className="space-y-10 mt-10 md:mt-0 max-w-7xl mx-auto p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold ">
            Freelancer Dashboard
          </h1>
          <p className="mt-2 opacity-70 text-sm">
            Track your proposals, work status, and real-time earnings.
          </p>
        </div>

        <Link
          href="/browse-task"
          className="btn border-0 bg-teal-500 hover:bg-teal-400 rounded-xl flex items-center justify-center gap-2 px-5 py-3 font-bold text-white transition-all shadow-[0_4px_15px_rgba(45,212,191,0.2)]"
        >
          <Search size={18} />
          Browse Tasks
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-[30px] border border-neutral-800 bg-neutral-900/40 backdrop-blur-md p-7 transition-all duration-300 hover:border-teal-400/40 hover:shadow-[0_0_35px_rgba(45,212,191,0.1)]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                    {item.title}
                  </h3>
                  <h2 className="mt-3 text-4xl font-extrabold text-white">
                    {item.value}
                  </h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-500/5 text-teal-400">
                  <Icon size={22} />
                </div>
              </div>
              <p className="mt-4 text-xs opacity-60">{item.description}</p>
            </div>
          );
        })}
      </div>

      {/* ---------------- TABLES SECTION ---------------- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Table 1: Active Projects */}
        <div className="rounded-[30px] border border-neutral-800 bg-neutral-900/30 backdrop-blur-md p-6 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">In Progress Tasks</h2>
              <p className="text-xs opacity-60 mt-0.5">Currently active projects you are working on.</p>
            </div>
            {activeProjects.length > 3 && (
              <Link href="/freelancer/active-projects" className="text-xs font-bold text-teal-400 hover:underline flex items-center gap-1">
                View All <ArrowUpRight size={14} />
              </Link>
            )}
          </div>

          {recentActiveProjects.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-neutral-800 rounded-2xl bg-neutral-950/20 text-sm text-gray-500">
              No active projects right now.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-neutral-800/60 bg-neutral-950/20">
              <table className="table w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-gray-400 text-xs uppercase tracking-wider bg-neutral-900/50">
                    <th className="p-4 font-semibold">Project</th>
                    <th className="p-4 font-semibold">Budget</th>
                    <th className="p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/40">
                  {recentActiveProjects.map((project) => (
                    <tr key={project._id} className="hover:bg-neutral-900/30 transition-colors">
                      <td className="p-4 font-medium text-gray-200 max-w-[180px] truncate">{project.title}</td>
                      <td className="p-4 text-emerald-400 font-semibold">${project.budget}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg border bg-cyan-500/10 text-cyan-400 border-cyan-500/20 inline-flex items-center gap-1">
                          <Orbit size={10} className="animate-spin" style={{ animationDuration: '3s' }} />
                          Running
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Table 2: Pending Proposals */}
        <div className="rounded-[30px] border border-neutral-800 bg-neutral-900/30 backdrop-blur-md p-6 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Recent Bids (Pending)</h2>
              <p className="text-xs opacity-60 mt-0.5">Awaiting responses from clients.</p>
            </div>
            {proposals.filter(p => p.status?.toLowerCase() === "pending").length > 3 && (
              <Link href="/freelancer/my-proposals" className="text-xs font-bold text-teal-400 hover:underline flex items-center gap-1">
                View All <ArrowUpRight size={14} />
              </Link>
            )}
          </div>

          {pendingProposals.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-neutral-800 rounded-2xl bg-neutral-950/20 text-sm text-gray-500">
              No pending bids at the moment.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-neutral-800/60 bg-neutral-950/20">
              <table className="table w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-gray-400 text-xs uppercase tracking-wider bg-neutral-900/50">
                    <th className="p-4 font-semibold">Task Title</th>
                    <th className="p-4 font-semibold">Your Bid</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/40">
                  {pendingProposals.map((item) => (
                    <tr key={item.proposalId} className="hover:bg-neutral-900/30 transition-colors">
                      <td className="p-4 font-medium text-gray-200 max-w-[180px] truncate">{item.taskTitle}</td>
                      <td className="p-4 text-amber-400 font-semibold">${item.proposedBudget}</td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/freelancer/my-proposals/${item.proposalId}`}
                          className="inline-flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-bold bg-teal-500/5 border border-teal-500/20 px-2.5 py-1.5 rounded-xl transition"
                        >
                          Review <ArrowUpRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}