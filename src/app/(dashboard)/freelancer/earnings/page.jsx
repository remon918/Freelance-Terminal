"use client";

import { authClient } from "@/lib/auth-client";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Loader2, DollarSign, TrendingUp } from "lucide-react";

const FreelancerEarningsPage = () => {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const freelancerEmail = session?.user?.email;

  const [data, setData] = useState({
    totalEarned: 0,
    avgEarned: 0,
    paymentCount: 0,
    monthlyChartData: [],
    history: [],
  });

  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // 🔥 ফিক্স ১: requestAnimationFrame ব্যবহার করে সিনক্রোনাস রেন্ডার ক্যাসকেড এড়ানো হলো
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  useEffect(() => {
    if (!freelancerEmail) {
      return;
    }

    const loadEarnings = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      try {
        // Better Auth থেকে টোকেন নেওয়া হচ্ছে
        const { data: tokenData } = await authClient.token();

        const res = await fetch(
          `${apiUrl}/api/freelancer-earnings?email=${freelancerEmail}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // Authorization হেডারে Bearer টোকেন পাস করা হলো
              authorization: `Bearer ${tokenData?.token}`,
            },
          },
        );
        const resData = await res.json();

        if (resData.success) {
          setData(resData);
        }
      } catch (err) {
        console.error("Error loading earnings:", err);
      } finally {
        setLoading(false); // এটি async ব্লকের ভেতরে শেষে রান হবে, তাই কোনো এরর আসবে না
      }
    };

    // ক্যাসকেডিং রেন্ডার ওয়ার্নিং এড়াতে setLoading(true) এবং ফাংশন কল টাইমাউটে রাখা হলো
    const timeoutId = setTimeout(() => {
      setLoading(true);
      loadEarnings();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [freelancerEmail]);

  // 🔥 ফিক্স ২: সেশন পেন্ডিং বা সেশন নাল হওয়ার কন্ডিশনটি অ্যাসিনক্রোনাসলি শিডিউল করা হলো
  useEffect(() => {
    if (!isSessionPending && !session) {
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [session, isSessionPending]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 mt-10 md:mt-0 pb-10 space-y-8 font-sans text-inherit selection:bg-cyan-500/20 selection:text-cyan-500">
      {/* হেডিং সেকশন */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-inherit">
          My Earning History
        </h1>
        <p className="opacity-60 text-sm">
          Monitor your payouts, track average milestone metrics, and view
          analytics.
        </p>
      </div>

      {/* ১. টপ কার্ডস: অ্যানালিটিক্স সামারি */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* টোটাল আর্নড কার্ড */}
        <div className="bg-current/5 border border-current/10 hover:border-cyan-500/30 rounded-2xl p-6 shadow-sm transition-all duration-300 flex justify-between items-center group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.75 bg-linear-to-r from-cyan-500 to-emerald-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          <div className="space-y-1">
            <span className="text-xs font-bold opacity-50 uppercase tracking-wider">
              Total Earned
            </span>
            <h2 className="text-4xl font-black text-inherit tracking-tight">
              ${(data.totalEarned || 0).toLocaleString()}
            </h2>
            <p className="text-xs opacity-40">
              From {data.paymentCount || 0} payments
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 font-bold text-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* অ্যাভারেজ পার টাস্ক কার্ড */}
        <div className="bg-current/5 border border-current/10 hover:border-cyan-500/30 rounded-2xl p-6 shadow-sm transition-all duration-300 flex justify-between items-center group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.75 bg-linear-to-r from-cyan-500 to-emerald-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          <div className="space-y-1">
            <span className="text-xs font-bold opacity-50 uppercase tracking-wider">
              Average Per Task
            </span>
            <h2 className="text-4xl font-black text-inherit tracking-tight">
              ${(data.avgEarned || 0).toLocaleString()}
            </h2>
            <p className="text-xs opacity-40">
              Average earning per completed task
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ২. মান্থলি আর্নিংস চার্ট */}
      <div className="bg-current/5 border border-current/10 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-inherit mb-6">
          Monthly Earnings
        </h3>
        <div className="w-full h-80">
          {mounted && data.monthlyChartData?.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.monthlyChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                {/* স্ট্রোক কালার কারেন্ট টেক্সট অপাসিটি অনুযায়ী ডাইনামিক করা হলো */}
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="currentColor"
                  opacity={0.06}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "currentColor",
                    opacity: 0.4,
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "currentColor",
                    opacity: 0.4,
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                />
                {/* টুলটিপ কনটেইনার ব্যাকগ্রাউন্ড ডাইনামিক করা হলো */}
                <Tooltip
                  cursor={{ fill: "currentColor", opacity: 0.03 }}
                  contentStyle={{
                    backgroundColor: "var(--tw-content-bg, #18181b)",
                    border: "1px solid currentColor",
                    opacity: 0.9,
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                  itemStyle={{ color: "#06b6d4" }}
                  labelStyle={{ color: "currentColor", opacity: 0.6 }}
                  formatter={(value) => [`$${value}`, "Earnings"]}
                />
                <Bar
                  dataKey="earnings"
                  fill="#06b6d4"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={45}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ৩. ট্রানজেকশন হিস্ট্রি টেবিল */}
      <div className="bg-current/5 border border-current/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-current/10">
          <h3 className="text-base font-bold text-inherit">
            Recent Transactions
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-current/5 opacity-60 text-[11px] font-bold uppercase tracking-wider border-b border-current/10">
                <th className="py-4 px-6">Task</th>
                <th className="py-4 px-6">Client</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Transaction ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-current/5 text-sm">
              {!data.history || data.history.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-12 text-center opacity-40 font-medium italic text-sm"
                  >
                    No transactions found.
                  </td>
                </tr>
              ) : (
                data.history.map((tx, index) => (
                  <tr
                    key={`${tx._id}-${index}`}
                    className="hover:bg-current/5 transition"
                  >
                    <td className="py-4 px-6 font-bold text-inherit max-w-xs truncate">
                      {tx.taskTitle || "Untitled Task"}
                    </td>
                    <td className="py-4 px-6 opacity-60">
                      {tx.clientEmail || "N/A"}
                    </td>
                    <td className="py-4 px-6 font-bold text-emerald-500">
                      +${tx.amount || 0}
                    </td>
                    <td className="py-4 px-6 opacity-60">
                      {tx.createdAt
                        ? new Date(tx.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td
                      className="py-4 px-6 font-mono opacity-40 max-w-37.5 truncate"
                      title={tx.sessionId}
                    >
                      {tx.sessionId || "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FreelancerEarningsPage;
