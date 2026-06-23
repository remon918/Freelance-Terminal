"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast, { Toaster } from "react-hot-toast"; 
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
  AlertTriangle,
} from "lucide-react";

const AdminPaymentsPage = () => {
  const { data: session, isPending: isSessionPending } = authClient.useSession();

  // States
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalVolume: 0,
    escrowAmount: 0,
    platformFees: 0,
    completedCount: 0,
  });

  // সার্চ, ফিল্টার এবং মোডাল স্টেট
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  // Fetch Tasks Data
  const loadAdminTasks = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    fetch(`${apiUrl}/api/admin/tasks`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          const allTasks = resData.tasks || [];
          setTasks(allTasks);

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
            platformFees: totalVol * 0.1,
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

  // 🗑️ কনফার্মড ডিলিট অ্যাকশন হ্যান্ডলার
  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    const toastId = toast.loading("Deleting transaction record...");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
      const res = await fetch(`${apiUrl}/api/admin/tasks/${taskToDelete._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Transaction log removed successfully!", { id: toastId });
        loadAdminTasks();
      } else {
        toast.error(data.message || "Failed to delete record", { id: toastId });
      }
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error("Network error, please try again.", { id: toastId });
    } finally {
      setTaskToDelete(null);
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
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-2 text-inherit opacity-60 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
        <p className="text-sm font-bold tracking-wider uppercase">Loading Ledger Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 mt-10 md:mt-0 pb-10 space-y-8 font-sans selection:bg-cyan-500/20 selection:text-cyan-500 text-inherit relative">
      <Toaster position="top-center" reverseOrder={false} />

      {/* হেডার */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-inherit">
          Financial Master Ledger
        </h1>
        <p className="opacity-50 text-xs font-bold mt-0.5">
          Track escrow volumes, platform revenues, and financial transactions via active task pipelines.
        </p>
      </div>

      {/* ১. ফাইন্যান্সিয়াল কার্ডস সামারি */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Settled Volume */}
        <div className="border border-current/10 bg-current/5 hover:border-cyan-500/30 rounded-2xl p-6 shadow-sm transition-all duration-300 flex justify-between items-center group relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 left-0 w-full h-0.75 bg-linear-to-r from-cyan-400 to-teal-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          <div className="space-y-1">
            <span className="text-xs font-black opacity-50 uppercase tracking-widest block">
              Settled Volume (Paid)
            </span>
            <h2 className="text-3xl font-black tracking-tight text-inherit">
              ${stats.totalVolume.toLocaleString()}
            </h2>
            <p className="text-xs text-emerald-500 font-bold">
              From {stats.completedCount} processed tasks
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.1)]">
            <DollarSign className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        {/* Funds In Escrow */}
        <div className="border border-current/10 bg-current/5 hover:border-amber-500/30 rounded-2xl p-6 shadow-sm transition-all duration-300 flex justify-between items-center group relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 left-0 w-full h-0.75 bg-linear-to-r from-amber-400 to-orange-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          <div className="space-y-1">
            <span className="text-xs font-black opacity-50 uppercase tracking-widest block">
              Funds In Escrow
            </span>
            <h2 className="text-3xl font-black tracking-tight text-amber-500">
              ${stats.escrowAmount.toLocaleString()}
            </h2>
            <p className="text-xs opacity-40 font-bold">Locked in ongoing milestones</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.1)]">
            <Briefcase className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        {/* Platform Cut */}
        <div className="border border-current/10 bg-current/5 hover:border-teal-500/30 rounded-2xl p-6 shadow-sm transition-all duration-300 flex justify-between items-center group relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 left-0 w-full h-0.75 bg-linear-to-r from-teal-400 to-emerald-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          <div className="space-y-1">
            <span className="text-xs font-black opacity-50 uppercase tracking-widest block">
              Platform Cut (10%)
            </span>
            <h2 className="text-3xl font-black tracking-tight text-teal-400">
              ${stats.platformFees.toLocaleString()}
            </h2>
            <p className="text-xs text-teal-500 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Net system revenue
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.1)]">
            <TrendingUp className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* ২. চার্ট সেকশন */}
      <div className="border border-current/10 bg-current/5 rounded-2xl p-6 shadow-sm backdrop-blur-md">
        <h3 className="text-sm font-black uppercase tracking-widest mb-6 opacity-70">
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
                  tick={{ fill: "currentColor", opacity: 0.5, fontSize: 11, fontWeight: 700 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "currentColor", opacity: 0.5, fontSize: 11, fontWeight: 700 }}
                />
                <Tooltip
                  cursor={{ fill: "currentColor", opacity: 0.03 }}
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.85)",
                    backdropFilter: "blur(12px)",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    fontSize: "12px",
                    color: "#fff",
                    fontWeight: 700
                  }}
                  itemStyle={{ color: "#06b6d4" }}
                />
                <Bar
                  dataKey="volume"
                  fill="url(#chartGradient)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                >
                  {/* সুন্দর গ্রেডিয়েন্ট ফিল ইফেক্ট */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.85} />
                      <stop offset="100%" stopColor="#20r8a6" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ৩. ট্রানজেকশন টেবিল লেজার */}
      <div className="border border-current/10 bg-current/5 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
        <div className="p-6 border-b border-current/10 flex flex-col sm:flex-row gap-4 justify-between items-center bg-current/2">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 opacity-40" />
            <input
              type="text"
              placeholder="Search Client Email, Task Title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-current/5 text-inherit placeholder:opacity-40 border border-current/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all font-bold"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 opacity-50" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-current/5 text-inherit border border-current/10 px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-bold cursor-pointer"
            >
              <option value="all" className="bg-zinc-950 text-white">All Task Pipelines</option>
              <option value="paid" className="bg-zinc-950 text-white">Paid / Settled</option>
              <option value="escrow" className="bg-zinc-950 text-white">In Escrow (Ongoing)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-current/2 text-[10px] font-black uppercase tracking-widest opacity-50 border-b border-current/10">
                <th className="py-4 px-6">Task Description</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Client Identity</th>
                <th className="py-4 px-6">Budget Ledger</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-current/5 text-xs font-bold">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center opacity-40 italic">
                    No active transactional logs found.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const statusLower = task.status?.toLowerCase();
                  const isPaid = statusLower === "paid" || statusLower === "completed";

                  return (
                    <tr key={task._id} className="hover:bg-current/2 transition-colors duration-200 group">
                      <td className="py-4 px-6">
                        <div className="font-extrabold max-w-xs truncate text-inherit">
                          {task.title || "Untitled Task"}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"}`} />
                          <span className="text-[10px] font-black uppercase tracking-wider opacity-50">
                            {task.status || "Open"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 bg-current/5 border border-current/10 rounded-md text-[11px] font-bold opacity-80">
                          {task.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-[11px] opacity-60">
                        {task.clientEmail}
                      </td>
                      <td className="py-4 px-6 text-sm font-black tracking-tight">
                        <span className={isPaid ? "text-emerald-400" : "text-amber-400"}>
                          ${Number(task.budget).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => setTaskToDelete(task)}
                          className="p-2 text-rose-500 hover:text-rose-400 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/20 transition-all cursor-pointer"
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

      {/* ⚠️ কাস্টম ডিলিট কনফার্মেশন মোডাল ওভারলে */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 text-white">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 shrink-0">
                <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h3 className="text-lg font-extrabold tracking-tight">Confirm Deletion</h3>
                <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                  Are you sure you want to remove the record for <span className="text-zinc-200 font-bold">{taskToDelete.title}</span>? This financial action is permanent and cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-2 pt-2 text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2.5 border border-zinc-800 hover:bg-zinc-900 text-zinc-300 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTask}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition shadow-md shadow-rose-600/10 font-black cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentsPage;