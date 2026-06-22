"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Loader2,
  DollarSign,
  Briefcase,
  TrendingUp,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";

const AdminPaymentsPage = () => {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  // States
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalVolume: 0, // Total budget of completed/paid tasks
    escrowAmount: 0, // Budget tied in in-progress tasks
    platformFees: 0, // 10% Platform revenue cut (Example metric)
    completedCount: 0,
  });

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  // Fetch Tasks Data from `/api/admin/tasks`
  const loadAdminTasks = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    fetch(`${apiUrl}/api/admin/tasks`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          const allTasks = resData.tasks || [];
          setTasks(allTasks);

          // 📊 আপনার টাস্ক কালেকশন থেকে ফাইন্যান্সিয়াল ক্যালকুলেশন
          let totalVol = 0;
          let escrowVol = 0;
          let completed = 0;

          allTasks.forEach((task) => {
            const budgetNum = Number(task.budget) || 0;
            const currentStatus = task.status?.toLowerCase();

            if (currentStatus === "paid" || currentStatus === "completed") {
              totalVol += budgetNum;
              completed += 1;
            } else if (
              currentStatus === "in-progress" ||
              currentStatus === "ongoing"
            ) {
              escrowVol += budgetNum;
            }
          });

          setStats({
            totalVolume: totalVol,
            escrowAmount: escrowVol,
            platformFees: totalVol * 0.1, // ধরুন প্ল্যাটফর্ম ১০% ফি কাটে, সেই ডাইনামিক হিসাব
            completedCount: completed,
          });
        }
      })
      .catch((err) => {
        console.error("Error loading tasks for admin payments:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAdminTasks();
  }, []);

  // 🗑️ টাস্ক ডিলিট করার হ্যান্ডলার (আপনার ২ নম্বর API: DELETE `/api/admin/tasks/:id`)
  const handleDeleteTask = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this transaction task record?",
      )
    )
      return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      const res = await fetch(`${apiUrl}/api/admin/tasks/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        // রিয়েল-টাইম স্টেট আপডেট
        loadAdminTasks();
      } else {
        alert(data.message || "Failed to delete");
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // Session handling safe guard
  useEffect(() => {
    if (!isSessionPending && !session) {
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [session, isSessionPending]);

  // Client-side Filter Logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task._id?.toLowerCase().includes(searchTerm.toLowerCase());

    const currentStatus = task.status?.toLowerCase();
    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "paid")
      return (
        matchesSearch &&
        (currentStatus === "paid" || currentStatus === "completed")
      );
    if (statusFilter === "escrow")
      return (
        matchesSearch &&
        (currentStatus === "in-progress" || currentStatus === "ongoing")
      );
    return matchesSearch;
  });

  // চার্টের জন্য ক্যাটাগরি ওয়াইজ বাজেট ডিস্ট্রিবিউশন ডেটা রেডি করা
  const generateChartData = () => {
    const categories = {};
    tasks.forEach((t) => {
      if (
        t.status?.toLowerCase() === "paid" ||
        t.status?.toLowerCase() === "completed"
      ) {
        categories[t.category] =
          (categories[t.category] || 0) + (Number(t.budget) || 0);
      }
    });
    return Object.keys(categories).map((cat) => ({
      category: cat,
      volume: categories[cat],
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 mt-10 md:mt-0 pb-10 space-y-8 font-sans selection:bg-indigo-500/20 selection:text-indigo-500">
      {/* হেডার */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Financial Master Ledger
        </h1>
        <p className="text-gray-500 text-sm">
          Track escrow volumes, platform revenues, and financial transactions
          via active task pipelines.
        </p>
      </div>

      {/* ১. ফাইন্যান্সিয়াল কার্ডস সামারি */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Settled Volume */}
        <div className="bg-current/5 border border-current/10 hover:border-indigo-500/30 rounded-2xl p-6 shadow-sm transition-all duration-300 flex justify-between items-center group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.75 bg-linear-to-r from-indigo-500 to-cyan-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          <div className="space-y-1">
            <span className="text-xs font-bold opacity-50 uppercase tracking-wider">
              Settled Volume (Paid)
            </span>
            <h2 className="text-3xl font-black tracking-tight">
              ${stats.totalVolume.toLocaleString()}
            </h2>
            <p className="text-xs text-emerald-500">
              From {stats.completedCount} processed tasks
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Funds In Escrow */}
        <div className="bg-current/5 border border-current/10 hover:border-amber-500/30 rounded-2xl p-6 shadow-sm transition-all duration-300 flex justify-between items-center group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.75 bg-linear-to-r from-amber-500 to-orange-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          <div className="space-y-1">
            <span className="text-xs font-bold opacity-50 uppercase tracking-wider">
              Funds In Escrow
            </span>
            <h2 className="text-3xl font-black tracking-tight text-amber-600 dark:text-amber-400">
              ${stats.escrowAmount.toLocaleString()}
            </h2>
            <p className="text-xs opacity-50">Locked in ongoing milestones</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        {/* Estimated Platform Cut */}
        <div className="bg-current/5 border border-current/10 hover:border-purple-500/30 rounded-2xl p-6 shadow-sm transition-all duration-300 flex justify-between items-center group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.75 bg-linear-to-r from-purple-500 to-pink-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          <div className="space-y-1">
            <span className="text-xs font-bold opacity-50 uppercase tracking-wider">
              Platform Cut (10%)
            </span>
            <h2 className="text-3xl font-black tracking-tight text-purple-500">
              ${stats.platformFees.toLocaleString()}
            </h2>
            <p className="text-xs text-purple-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Net system generated revenue
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ২. চার্ট সেকশন (Category Wise Revenue Bar Chart) */}
      <div className="bg-current/5 border border-current/10 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold mb-6">
          Volume Distribution By Category
        </h3>
        <div className="w-full h-72">
          {mounted && tasks.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={generateChartData()}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="currentColor"
                  opacity={0.06}
                />
                <XAxis
                  dataKey="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "currentColor", opacity: 0.5, fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "currentColor", opacity: 0.5, fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "currentColor", opacity: 0.02 }}
                  contentStyle={{
                    backgroundColor: "#18181b",
                    borderRadius: "12px",
                    border: "none",
                    fontSize: "12px",
                  }}
                  itemStyle={{ color: "#6366f1" }}
                />
                <Bar
                  dataKey="volume"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ৩. ট্রানজেকশন অ্যান্ড টাস্ক কন্ট্রোল টেবিল (Ultra-Premium Dark UI) */}
      <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/20">
        {/* টেবিল ফিল্টার বার */}
        <div className="p-6 border-b border-zinc-800/80 flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-950/40">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search Client Email, Task Title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-900/50 text-zinc-100 placeholder-zinc-500 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all duration-300"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-zinc-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm bg-zinc-900/50 text-zinc-200 border border-zinc-800 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
            >
              <option value="all" className="bg-zinc-900">
                All Task Pipelines
              </option>
              <option value="paid" className="bg-zinc-900">
                Paid / Settled
              </option>
              <option value="escrow" className="bg-zinc-900">
                In Escrow (Ongoing)
              </option>
            </select>
          </div>
        </div>

        {/* টেবিল লেজার */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/20 text-[11px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-800/50">
                <th className="py-4 px-6">Task Description</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Client Identity</th>
                <th className="py-4 px-6">Budget Ledger</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-sm">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-16 text-center text-zinc-500 italic bg-zinc-900/10"
                  >
                    No active transactional logs found.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const statusLower = task.status?.toLowerCase();
                  const isPaid =
                    statusLower === "paid" || statusLower === "completed";

                  return (
                    <tr
                      key={task._id}
                      className="hover:bg-zinc-800/30 transition-colors duration-200 group"
                    >
                      <td className="py-4 px-6">
                        <div className="font-semibold max-w-xs truncate text-zinc-200 group-hover:text-zinc-100 transition-colors">
                          {task.title || "Untitled Task"}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full animate-pulse ${isPaid ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"}`}
                          />
                          <span className="text-[11px] font-medium uppercase text-zinc-500 tracking-wider">
                            {task.status || "Open"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-0.5 bg-zinc-800/80 text-zinc-400 border border-zinc-700/30 rounded-md text-xs font-medium">
                          {task.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-zinc-400 opacity-80">
                        {task.clientEmail}
                      </td>
                      <td className="py-4 px-6 font-bold tracking-tight">
                        <span
                          className={
                            isPaid ? "text-emerald-400" : "text-amber-400"
                          }
                        >
                          ${Number(task.budget).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="p-2 text-zinc-500 hover:text-red-400 rounded-xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentsPage;
