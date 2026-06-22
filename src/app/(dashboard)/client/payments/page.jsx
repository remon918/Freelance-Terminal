"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client"; 


const PaymentHistoryPage = () => {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const userEmail = session?.user?.email;

  const [payments, setPayments] = useState([]);
  const [totalSpend, setTotalSpend] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) {
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    fetch(`${apiUrl}/api/payment-history?email=${userEmail}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPayments(data.history || []);
          const total = typeof data.totalSpend === 'object' ? data.totalSpend?.total : data.totalSpend;
          setTotalSpend(Number(total) || 0);
        }
      })
      .catch((err) => {
        console.error("Error loading payments:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userEmail]);

  // 🔥 ফিক্স ২: ক্যাসকেডিং রেন্ডার এড়াতে অ্যাসিনক্রোনাসলি লোডিং ফলস করা হলো
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-12 md:mt-0 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Payment Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and track all your talent investments
          </p>
        </div>

        {/* Total Spend Premium Badge */}
        {payments.length > 0 && (
          <div className="mt-4 md:mt-0 bg-linear-to-r from-cyan-600 to-teal-600 text-white px-6 py-4 rounded-2xl shadow-xl shadow-indigo-100 flex flex-col items-end">
            <span className="text-xs uppercase tracking-wider text-indigo-100 font-semibold">
              Total Funds Spent
            </span>
            <span className="text-3xl font-black mt-1">
              ${totalSpend.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Conditional Rendering */}
      {payments.length === 0 ? (
        /* Empty State Card */
        <div className="bg-cyan-200/30 border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center max-w-xl mx-auto mt-10">
          <div className="w-16 h-16 bg-gray-50/20 rounded-2xl flex items-center justify-center mx-auto mb-5 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            No payment history yet
          </h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Once you hire a freelancer and successfully complete a payment
            session, your premium invoices and history will appear here.
          </p>
        </div>
      ) : (
        /* Premium Cards Grid */
        <div className="w-full grid grid-cols-1 gap-6 md:gap-10">
          {payments.map((payment) => (
            <div
              key={payment._id}
              className="bg-white/30 border border-gray-100 hover:border-indigo-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-0.75 bg-linear-to-r from-indigo-500 to-violet-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />

              <div>
                {/* Card Top Row */}
                <div className="flex justify-between items-start gap-2 mb-4">
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Paid Successfully
                  </span>
                  <span className="text-2xl font-bold line-clamp-2 group-hover:text-cyan-400 transition-colors">
                    ${payment.amount || 0}
                  </span>
                </div>

                {/* Task Title */}
                <h4 className="font-bold text-lg line-clamp-2 group-hover:text-cyan-400 transition-colors mb-2">
                  {payment.taskTitle || "Untitled Task"}
                </h4>
              </div>

              {/* Card Footer / Metadata */}
              <div className="mt-6 pt-4 border-t border-gray-50 text-xs text-gray-400 space-y-1.5">
                <div className="flex justify-between">
                  <span>Session ID:</span>
                  <span
                    className="font-mono text-gray-600 max-w-30 truncate"
                    title={payment.sessionId}
                  >
                    {payment.sessionId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span className="text-gray-600">
                    {payment.createdAt
                      ? new Date(payment.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryPage;