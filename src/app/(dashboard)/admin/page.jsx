"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  ShieldAlert,
  Loader2,
  TrendingUp,
  Activity,
  ArrowUpRight,
  PieChart as PieIcon,
  BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { authClient } from "@/lib/auth-client";

export default function AdminDashboardOverview() {
  const [loading, setLoading] = useState(true);

  // ডাইনামিক স্টেট
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    blocked: 0,
    client: 0,
    freelancer: 0,
  });
  const [taskStats, setTaskStats] = useState({
    total: 0,
    open: 0,
    completed: 0,
    ongoing: 0,
    totalBudget: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      try {
        // Better Auth থেকে টোকেন নেওয়া হচ্ছে
        const { data: tokenData } = await authClient.token();

        // headers অবজেক্টটি রেডি করা হলো
        const requestHeaders = {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`,
        };

        // Promise.all এর ভেতরে দুটিতেই headers পাস করা হলো
        const [userRes, taskRes] = await Promise.all([
          fetch(`${apiUrl}/api/admin/users`, {
            method: "GET",
            headers: requestHeaders,
          }),
          fetch(`${apiUrl}/api/admin/tasks`, {
            method: "GET",
            headers: requestHeaders,
          }),
        ]);

        const userData = await userRes.json();
        const taskData = await taskRes.json();

        if (userData.success && taskData.success) {
          const users = userData.users || [];
          const activeUsers = users.filter(
            (u) => u.status !== "Blocked",
          ).length;
          const blockedUsers = users.filter(
            (u) => u.status === "Blocked",
          ).length;

          // Users by Role ফিল্টারিং
          const clientCount = users.filter(
            (u) => u.role?.toLowerCase() === "client",
          ).length;
          const freelancerCount = users.filter(
            (u) => u.role?.toLowerCase() === "freelancer",
          ).length;

          setUserStats({
            total: users.length,
            active: activeUsers,
            blocked: blockedUsers,
            client: clientCount,
            freelancer: freelancerCount || users.length - clientCount,
          });

          const tasks = taskData.tasks || [];
          let completed = 0;
          let open = 0;
          let ongoing = 0;
          let budgetSum = 0;

          tasks.forEach((t) => {
            const status = t.status?.toLowerCase();
            budgetSum += Number(t.budget) || 0;

            if (status === "completed" || status === "paid") completed++;
            else if (status === "open") open++;
            else ongoing++;
          });

          setTaskStats({
            total: tasks.length,
            open,
            completed,
            ongoing,
            totalBudget: budgetSum,
          });
          setRecentActivity(tasks.slice(0, 5));
        }
      } catch (err) {
        console.error("Error loading dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
      </div>
    );
  }

  // ১. Chart Data: User Moderation (Active vs Blocked)
  const moderationPieData = [
    { name: "Active Users", value: userStats.active, color: "#06b6d4" },
    { name: "Blocked", value: userStats.blocked, color: "#ef4444" },
  ];

  // ২. NEW Chart Data: Users by Role (Client vs Freelancer)
  const rolePieData = [
    { name: "Clients", value: userStats.client, color: "#22d3ee" }, // Cyan-400
    { name: "Freelancers", value: userStats.freelancer, color: "#a5f3fc" }, // Cyan-200
  ];

  // ৩. NEW Chart Data: Tasks by Status
  const taskStatusData = [
    { name: "Open", count: taskStats.open, fill: "#06b6d4" },
    { name: "Ongoing", count: taskStats.ongoing, fill: "#38bdf8" },
    { name: "Completed", count: taskStats.completed, fill: "#10b981" },
  ];

  const statCards = [
    {
      title: "Total Ecosystem Users",
      value: userStats.total,
      description: `${userStats.active} Active Profiles`,
      icon: Users,
    },
    {
      title: "Total Market Tasks",
      value: taskStats.total,
      description: `${taskStats.ongoing} Active Pipeline`,
      icon: Briefcase,
    },
    {
      title: "Gross Budget Vol.",
      value: `$${taskStats.totalBudget.toLocaleString()}`,
      description: "Across posted milestones",
      icon: TrendingUp,
    },
    {
      title: "Restricted Users",
      value: userStats.blocked,
      description: "Accounts blocked by system",
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="space-y-8 mt-10 md:mt-0 max-w-7xl mx-auto p-4 md:p-0 font-sans text-inherit selection:bg-cyan-500/20 selection:text-cyan-500">
      {/* হেডার সেকশন */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-inherit">
            Admin Control Center
          </h1>
          <p className="opacity-70 text-sm">
            Real-time platform overview, user dynamics, and project ecosystem
            metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 border border-current/10 bg-current/5 px-3 py-1.5 rounded-xl text-xs opacity-80 w-fit shadow-sm">
          <Activity className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
          Live Platform Feed
        </div>
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

      {/* প্রধান চার্ট সেকশন: মার্কেট প্রজেকশন */}
      <div className="rounded-[30px] border border-current/10 bg-current/5 backdrop-blur-md p-6 md:p-8 transition-all duration-300 hover:border-cyan-500/20">
        <h3 className="text-xs font-bold opacity-50 uppercase tracking-wider mb-6">
          Market Activity Projection
        </h3>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={recentActivity.reverse()}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                opacity={0.1}
                vertical={false}
              />
              <XAxis
                dataKey="category"
                tick={{ fill: "currentColor", opacity: 0.5, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "currentColor", opacity: 0.5, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.85)",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="budget"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#chartGlow)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📊 নতুন চার্ট গ্রিড সেকশন (৩ টি চার্ট পাশাপাশি/নিচে নিচে সুন্দর গ্রিডে সাবলীল দেখাবে) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* চার্ট ১: Tasks by Status (Bar Chart) */}
        <div className="rounded-[30px] border border-current/10 bg-current/5 backdrop-blur-md p-6 flex flex-col justify-between transition-all duration-300 hover:border-cyan-500/20">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} className="text-cyan-500" />
            <h3 className="text-xs font-bold opacity-50 uppercase tracking-wider">
              Tasks by Status
            </h3>
          </div>

          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={taskStatusData}
                margin={{ top: 10, right: 10, left: -30, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  opacity={0.05}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "currentColor", opacity: 0.6, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "currentColor", opacity: 0.6, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(6,182,212,0.05)" }}
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.85)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] opacity-40 text-center mt-2">
            Current lifecycle distribution of ecosystem tasks.
          </p>
        </div>

        {/* চার্ট ২: Users by Role (Donut Chart) */}
        <div className="rounded-[30px] border border-current/10 bg-current/5 backdrop-blur-md p-6 flex flex-col justify-between transition-all duration-300 hover:border-cyan-500/20">
          <div className="flex items-center gap-2 mb-2">
            <PieIcon size={16} className="text-cyan-500" />
            <h3 className="text-xs font-bold opacity-50 uppercase tracking-wider">
              Users by Role
            </h3>
          </div>

          <div className="w-full h-44 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rolePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {rolePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.85)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-xl font-black text-inherit tracking-tight">
                {userStats.client + userStats.freelancer}
              </span>
              <p className="text-[9px] uppercase opacity-50 tracking-wider">
                Total Roles
              </p>
            </div>
          </div>

          <div className="space-y-1.5 mt-2">
            <div className="flex justify-between text-xs border-b border-current/5 pb-1">
              <span className="opacity-60 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Clients
              </span>
              <span className="font-bold text-inherit">{userStats.client}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="opacity-60 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-200" />{" "}
                Freelancers
              </span>
              <span className="font-bold text-inherit">
                {userStats.freelancer}
              </span>
            </div>
          </div>
        </div>

        {/* চার্ট ৩: User Moderation (Pie Chart) */}
        <div className="rounded-[30px] border border-current/10 bg-current/5 backdrop-blur-md p-6 flex flex-col justify-between transition-all duration-300 hover:border-cyan-500/20">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert size={16} className="text-cyan-500" />
            <h3 className="text-xs font-bold opacity-50 uppercase tracking-wider">
              User Moderation Ratio
            </h3>
          </div>

          <div className="w-full h-44 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moderationPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {moderationPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.85)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-xl font-black text-inherit tracking-tight">
                {userStats.total}
              </span>
              <p className="text-[9px] uppercase opacity-50 tracking-wider">
                Total Users
              </p>
            </div>
          </div>

          <div className="space-y-1.5 mt-2">
            <div className="flex justify-between text-xs border-b border-current/5 pb-1">
              <span className="opacity-60 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-500" /> Active
                Status
              </span>
              <span className="font-bold text-inherit">{userStats.active}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="opacity-60 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Restricted
              </span>
              <span className="font-bold text-inherit">
                {userStats.blocked}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TABLES SECTION */}
      <div className="rounded-[30px] border border-current/10 bg-current/5 backdrop-blur-md p-6 md:p-8 transition-all duration-300 hover:border-cyan-500/20">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-bold text-inherit">
              Recent Live Deployments
            </h2>
            <p className="text-sm opacity-60">
              Real-time task creations and user activities across the board.
            </p>
          </div>
          {recentActivity.length > 5 && (
            <Link
              href="/admin/tasks"
              className="text-xs font-bold text-cyan-500 hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight size={14} />
            </Link>
          )}
        </div>

        {recentActivity.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-current/10 rounded-2xl bg-current/5">
            <p className="text-sm opacity-40 font-medium italic">
              No active transactional logs found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-current/10 bg-current/5">
            <table className="table w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-current/10 opacity-60 text-xs font-bold uppercase tracking-wider bg-current/5">
                  <th className="p-4">Task Title</th>
                  <th className="p-4">Client Email</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-right">Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-current/5 text-sm">
                {recentActivity.map((task) => (
                  <tr
                    key={task._id}
                    className="hover:bg-current/5 transition-colors"
                  >
                    <td className="p-4 font-bold text-inherit max-w-50 truncate">
                      {task.title}
                    </td>
                    <td className="p-4 font-mono text-xs opacity-60">
                      {task.clientEmail}
                    </td>
                    <td className="p-4">
                      <span className="bg-current/5 px-2.5 py-1 rounded-md text-xs font-medium opacity-80 border border-current/5">
                        {task.category}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-emerald-500">
                      ${Number(task.budget).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
