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
  Loader2,
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

        // ⚡ ১. টাস্ক ডেটা এবং ২. পেমেন্ট হিস্ট্রি ডেটা একসাথে ফেচ করা হচ্ছে (Performance Optimization)
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
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-10 md:mt-0 text-inherit max-w-7xl mx-auto p-4 md:p-0 font-sans selection:bg-cyan-500/20 selection:text-cyan-500">
      
      {/* হেডার সেকশন */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-inherit">
            Client Dashboard
          </h1>
          <p className="opacity-70 text-sm">
            Track projects and collaborate with top freelancers.
          </p>
        </div>

        <Link
          href="/client/tasks/post-task"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 font-bold text-sm text-white bg-cyan-400 hover:bg-cyan-500 rounded-xl transition duration-300 shadow-[0_4px_20px_rgba(6,182,212,0.25)]"
        >
          <PlusCircle size={16} />
          Create Project
        </Link>
      </div>

      {/* স্ট্যাটস গ্রিড */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-[30px] border border-current/10 bg-current/5 backdrop-blur-md p-6 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.05)]"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold opacity-50 uppercase tracking-wider">
                    {item.title}
                  </h3>
                  <h2 className="text-3xl font-black text-inherit tracking-tight">
                    {item.value}
                  </h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-500">
                  <Icon size={20} />
                </div>
              </div>
              <p className="mt-4 text-xs opacity-50">{item.description}</p>
            </div>
          );
        })}
      </div>

      {/* রিসেন্ট প্রজেক্টস টেবিল */}
      <div className="rounded-[30px] border border-current/10 bg-current/5 backdrop-blur-md p-6 md:p-8 transition-all duration-300 hover:border-cyan-500/20">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-bold text-inherit">Recent Projects</h2>
            <p className="text-sm opacity-60">
              Your latest posted tasks and active project summaries.
            </p>
          </div>
          {tasks.length > 5 && (
            <Link href="/client/tasks" className="text-xs font-bold text-cyan-500 hover:underline flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </Link>
          )}
        </div>

        {recentProjects.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-current/10 rounded-2xl bg-current/5">
            <p className="text-sm opacity-40 font-medium italic">No projects created yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-current/10 bg-current/5">
            <table className="table w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-current/10 opacity-60 text-xs font-bold uppercase tracking-wider bg-current/5">
                  <th className="p-4">Project Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Budget</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-current/5 text-sm">
                {recentProjects.map((project) => {
                  const isComp = project.status?.toLowerCase() === "completed";
                  return (
                    <tr key={project._id} className="hover:bg-current/5 transition-colors">
                      <td className="p-4 font-bold text-inherit max-w-50 truncate">
                        {project.title}
                      </td>
                      <td className="p-4">
                        <span className="bg-current/5 px-2.5 py-1 rounded-md text-xs font-medium opacity-80 border border-current/5">
                          {project.category}
                        </span>
                      </td>
                      <td className="p-4 text-emerald-500 font-bold">
                        ${project.budget}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg border inline-flex items-center gap-1 ${
                            isComp
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
                          }`}
                        >
                          {!isComp && <Orbit size={10} className="animate-spin" style={{ animationDuration: '3s' }} />}
                          {project.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/client/tasks/${project._id}`}
                          className="inline-flex items-center gap-1 text-xs text-cyan-500 hover:bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-xl font-bold transition-all"
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