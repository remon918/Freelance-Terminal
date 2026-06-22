"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { getMyTasks } from "@/lib/api/tasks";
import {
  BriefcaseBusiness,
  Clock3,
  CheckCircle2,
  Wallet,
  PlusCircle,
  ArrowUpRight,
  Orbit,
} from "lucide-react";

export default function ClientDashboard() {
  const { data: session } = authClient.useSession();
  const [tasks, setTasks] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0); // 🔥 পেমেন্ট হিস্ট্রি থেকে আসল খরচ রাখার স্টেট
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!session?.user?.id || !session?.user?.email) return;
      
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        // ⚡ ১. টাস্ক ডেটা এবং ২. পемыেন্ট হিস্ট্রি ডেটা একসাথে ফেচ করা হচ্ছে (Performance Optimization)
        const [tasksData, paymentRes] = await Promise.all([
          getMyTasks(session.user.id),
          fetch(`${apiUrl}/api/payment-history?email=${session.user.email}`).then((res) => res.json())
        ]);

        // টাস্ক সেট করা
        setTasks(tasksData || []);

        // পেমেন্ট কালেকশন থেকে আসল টোটাল স্পেন্ড সেট করা
        if (paymentRes.success) {
          const total = typeof paymentRes.totalSpend === 'object' ? paymentRes.totalSpend?.total : paymentRes.totalSpend;
          setTotalSpent(Number(total) || 0);
        }

      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [session]);

  // 🔥 বাকি ডাইনামিক কাউন্টার লজিক
  const allTasksCount = tasks.length;
  const openTasksCount = tasks.filter(t => t.status?.toLowerCase() === "open").length;
  const completedTasksCount = tasks.filter(t => t.status?.toLowerCase() === "completed").length;
  
  // সাম্প্রতিক ৫টি প্রজেক্ট টেবিলের জন্য
  const recentProjects = [...tasks]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  const statCards = [
    {
      title: "All Tasks",
      value: allTasksCount,
      description: "All created tasks",
      icon: BriefcaseBusiness,
    },
    {
      title: "Open Tasks",
      value: openTasksCount,
      description: "Tasks currently open",
      icon: Clock3,
    },
    {
      title: "Completed Tasks",
      value: completedTasksCount,
      description: "Successfully finished",
      icon: CheckCircle2,
    },
    {
      title: "Total Spent",
      value: `$${totalSpent.toLocaleString()}`, // 🔥 এখন এটি হুবহু পেমেন্ট ড্যাশবোর্ডের সাথে সিঙ্কড!
      description: "Overall spending",
      icon: Wallet,
    },
  ];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-teal-400"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-10 md:mt-0 text-gray-100 max-w-7xl mx-auto p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Client Dashboard
          </h1>
          <p className="mt-2 opacity-70 text-sm">
            Track projects and collaborate with top freelancers.
          </p>
        </div>

        <Link
          href="/client/tasks/post-task"
          className="btn border-0 bg-teal-500 text-black hover:bg-teal-400 rounded-xl flex items-center justify-center gap-2 px-5 py-3 font-bold transition-all shadow-[0_4px_15px_rgba(45,212,191,0.2)]"
        >
          <PlusCircle size={18} />
          Create Project
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
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
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

      {/* Recent Projects Table */}
      <div className="rounded-[30px] border border-neutral-800 bg-neutral-900/30 backdrop-blur-md p-6 md:p-8 transition-all duration-300 hover:border-teal-400/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">Recent Projects</h2>
            <p className="mt-1 text-sm opacity-60">
              Your latest posted tasks and active project summaries.
            </p>
          </div>
          {tasks.length > 5 && (
            <Link href="/client/tasks" className="text-xs font-bold text-teal-400 hover:underline flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </Link>
          )}
        </div>

        {recentProjects.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-neutral-800 rounded-2xl bg-neutral-950/20">
            <p className="text-sm text-gray-500">No projects created yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-neutral-800/60 bg-neutral-950/20">
            <table className="table w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-neutral-800 text-gray-400 text-xs uppercase tracking-wider bg-neutral-900/50">
                  <th className="p-4 font-semibold">Project Name</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Budget</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/40 text-sm">
                {recentProjects.map((project) => {
                  const isComp = project.status?.toLowerCase() === "completed";
                  return (
                    <tr key={project._id} className="hover:bg-neutral-900/30 transition-colors">
                      <td className="p-4 font-medium text-gray-200 max-w-[200px] truncate">
                        {project.title}
                      </td>
                      <td className="p-4 text-gray-400">
                        <span className="bg-neutral-800 px-2 py-1 rounded text-xs text-gray-300 border border-neutral-700/50">
                          {project.category}
                        </span>
                      </td>
                      <td className="p-4 text-emerald-400 font-semibold">
                        ${project.budget}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg border inline-flex items-center gap-1 ${
                            isComp
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                          }`}
                        >
                          {!isComp && <Orbit size={10} className="animate-spin" style={{ animationDuration: '3s' }} />}
                          {project.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/client/tasks/${project._id}`}
                          className="inline-flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-bold bg-teal-500/5 hover:bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-xl transition"
                        >
                          Details <ArrowUpRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}