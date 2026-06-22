"use client";

import { authClient } from "@/lib/auth-client";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const FreelancerEarningsPage = () => {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const freelancerEmail = session?.user?.email;

  const [data, setData] = useState({
    totalEarned: 0,
    avgEarned: 0,
    paymentCount: 0,
    monthlyChartData: [],
    history: []
  });
  
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // 🔥 ফিক্স ১: requestAnimationFrame ব্যবহার করে সিনক্রোনাস রেন্ডার ক্যাসকেড এড়ানো হলো
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  // ডাটা ফেচিং ইফেক্ট
  useEffect(() => {
    if (!freelancerEmail) {
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    fetch(`${apiUrl}/api/freelancer-earnings?email=${freelancerEmail}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData);
        }
      })
      .catch((err) => {
        console.error("Error loading earnings:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [freelancerEmail]);

  // 🔥 ফিক্স ২: সেশন পেন্ডিং বা সেশন নাল হওয়ার কন্ডিশনটি অ্যাসিনক্রোনাসলি শিডিউল করা হলো
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      {/* Top Cards: Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Earned Card */}
        <div className="bg-white/30 border border-gray-100 hover:border-amber-100 rounded-2xl p-6 shadow-sm transition-all duration-300 flex justify-between items-center group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-500 to-orange-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          <div>
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Earned</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">${(data.totalEarned || 0).toLocaleString()}</h2>
            <p className="text-xs text-gray-400 mt-1">From {data.paymentCount || 0} payments</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-xl">$</div>
        </div>

        {/* Average Per Task Card */}
        <div className="bg-white/30 border border-gray-100 hover:border-amber-100 rounded-2xl p-6 shadow-sm transition-all duration-300 flex justify-between items-center group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-500 to-orange-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          <div>
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Average Per Task</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">${(data.avgEarned || 0).toLocaleString()}</h2>
            <p className="text-xs text-gray-400 mt-1">Average earning per completed task</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a1.125 1.125 0 0 0 1.59 0L21.75 3.75m0 0H18m3.75 0V7.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Monthly Earnings Chart */}
      <div className="bg-white/30 border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Monthly Earnings</h3>
        <div className="w-full h-80">
          {mounted && data.monthlyChartData?.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 13 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 13 }} />
                <Tooltip cursor={{ fill: '#f9fafb' }} formatter={(value) => [`$${value}`, 'Earnings']} />
                <Bar dataKey="earnings" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="bg-white/30 border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                <th className="py-4 px-6">Task</th>
                <th className="py-4 px-6">Client</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Transaction ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
              {!data.history || data.history.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-gray-400 font-medium">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                data.history.map((tx, index) => (
                  <tr key={`${tx._id}-${index}`} className="hover:bg-gray-50/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-800 max-w-xs truncate">{tx.taskTitle || "Untitled Task"}</td>
                    <td className="py-4 px-6 text-gray-500">{tx.clientEmail || "N/A"}</td>
                    <td className="py-4 px-6 font-bold text-emerald-600">+${tx.amount || 0}</td>
                    <td className="py-4 px-6 text-gray-500">
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }) : "N/A"}
                    </td>
                    <td className="py-4 px-6 font-mono text-gray-400 max-w-[150px] truncate" title={tx.sessionId}>
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