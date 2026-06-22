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
  Loader2,
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

        // ৩টি সোর্স থেকে প্যারালাল ডাটা ফেচিং
        const [proposalsData, projectsRes, earningsRes] = await Promise.all([
          getFreelancerProposals(freelancerEmail),
          fetch(`${apiUrl}/api/freelancer-projects?email=${freelancerEmail}`).then((res) => res.json()),
          fetch(`${apiUrl}/api/freelancer-earnings?email=${freelancerEmail}`).then((res) => res.json()),
        ]);

        setProposals(proposalsData || []);

        if (projectsRes.success) {
          setActiveProjects(projectsRes.activeProjects || []);
          setCompletedProjects(projectsRes.completedProjects || []);
        }

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

  // ডাইনামিক স্ট্যাটস ক্যালকুলেশন লজিক
  const totalProposalsCount = proposals.length;
  const acceptedCount = activeProjects.length; 
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

  const pendingProposals = proposals
    .filter((p) => p.status?.toLowerCase() === "pending")
    .slice(0, 3);

  const recentActiveProjects = [...activeProjects].slice(0, 3);

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="animate-spin text-cyan-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-10 mt-10 md:mt-0 max-w-6xl mx-auto p-4 md:px-6 md:py-0 font-sans text-inherit">
      
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-inherit">Freelancer Dashboard</h1>
          <p className="mt-2 opacity-60 text-sm">
            Track your proposals, work status, and real-time earnings.
          </p>
        </div>

        <Link
          href="/browse-task"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-cyan-400 hover:bg-cyan-500 font-semibold text-sm text-white rounded-lg transition-all shadow-sm"
        >
          <Search size={16} />
          Browse Tasks
        </Link>
      </div>

      {/* Stats Grid (ম্যানেজমেন্ট পেজের বক্স স্টাইলের সাথে এলাইন্ড) */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-xl border border-current/10 bg-current/5 p-6 transition-all duration-300 hover:border-cyan-500/40"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider opacity-60">
                    {item.title}
                  </h3>
                  <h2 className="mt-2 text-3xl font-bold text-inherit">
                    {item.value}
                  </h2>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-cyan-500">
                  <Icon size={18} />
                </div>
              </div>
              <p className="mt-4 text-xs opacity-50">{item.description}</p>
            </div>
          );
        })}
      </div>

      {/* ---------------- TABLES SECTION ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Table 1: Active Projects */}
        <div className="rounded-xl border border-current/10 bg-current/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-inherit">In Progress Tasks</h2>
              <p className="text-xs opacity-60 mt-0.5">Currently active projects you are working on.</p>
            </div>
            {activeProjects.length > 3 && (
              <Link href="/freelancer/active-projects" className="text-xs font-semibold text-cyan-500 hover:underline flex items-center gap-1">
                View All <ArrowUpRight size={14} />
              </Link>
            )}
          </div>

          {recentActiveProjects.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-current/10 rounded-xl opacity-40 text-sm">
              No active projects right now.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-current/10 bg-current/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-current/10 bg-current/5 text-xs font-semibold uppercase opacity-70">
                      <th className="px-4 py-3">Project</th>
                      <th className="px-4 py-3">Budget</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-current/5">
                    {recentActiveProjects.map((project) => (
                      <tr key={project._id} className="hover:bg-current/5 transition-colors">
                        <td className="px-4 py-3 font-medium text-inherit max-w-[180px] truncate">{project.title}</td>
                        <td className="px-4 py-3 font-semibold text-inherit">${project.budget}</td>
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full border bg-cyan-500/10 text-cyan-500 border-cyan-500/20 inline-flex items-center gap-1">
                            <Orbit size={10} className="animate-spin" style={{ animationDuration: '3s' }} prefix="false" />
                            Running
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Table 2: Pending Proposals */}
        <div className="rounded-xl border border-current/10 bg-current/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-inherit">Recent Bids (Pending)</h2>
              <p className="text-xs opacity-60 mt-0.5">Awaiting responses from clients.</p>
            </div>
            {proposals.filter(p => p.status?.toLowerCase() === "pending").length > 3 && (
              <Link href="/freelancer/my-proposals" className="text-xs font-semibold text-cyan-500 hover:underline flex items-center gap-1">
                View All <ArrowUpRight size={14} />
              </Link>
            )}
          </div>

          {pendingProposals.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-current/10 rounded-xl opacity-40 text-sm">
              No pending bids at the moment.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-current/10 bg-current/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-current/10 bg-current/5 text-xs font-semibold uppercase opacity-70">
                      <th className="px-4 py-3">Task Title</th>
                      <th className="px-4 py-3">Your Bid</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-current/5">
                    {pendingProposals.map((item) => (
                      <tr key={item.proposalId} className="hover:bg-current/5 transition-colors">
                        <td className="px-4 py-3 font-medium text-inherit max-w-[180px] truncate">{item.taskTitle}</td>
                        <td className="px-4 py-3 font-semibold text-inherit">${item.proposedBudget}</td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/freelancer/my-proposals/${item.proposalId}`}
                            className="inline-flex items-center gap-1 text-xs text-cyan-500 hover:opacity-80 font-semibold bg-current/5 border border-current/10 px-2.5 py-1 rounded-lg transition"
                          >
                            Review <ArrowUpRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}