"use client";

import { useEffect, useState } from "react";
import { getAllTasks, getAllFreelancers } from "@/lib/api/tasks"; // আপনার পাথ অনুযায়ী
import { FaTasks, FaUsers, FaHandHoldingUsd } from "react-icons/fa";

const PlatformStatistics = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    totalFreelancers: 0,
    totalPayout: 5580, // পে-আউট একদম হার্ডকোড করা থাকলো
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        setLoading(true);
        
        // সব ডেটা একসাথে কাউন্ট করার জন্য ফিল্টারে বড় লিমিট পাঠানো হচ্ছে
        const [tasksRes, freelancersRes] = await Promise.all([
          getAllTasks({ limit: 1000, status: "open" }), // status 'open' বা প্রয়োজনমতো পরিবর্তন করতে পারেন
          getAllFreelancers({ limit: 1000 })
        ]);

        // এপিআই রেসপন্সের ভেতর যদি কোনো অ্যারে প্রোপার্টি (যেমন tasksRes.tasks) থাকে 
        // অথবা ডিরেক্ট অ্যারে আসলে তার লেন্থ কাউন্ট করবে
        const tasksArray = Array.isArray(tasksRes) ? tasksRes : (tasksRes?.tasks || []);
        const freelancersArray = Array.isArray(freelancersRes) ? freelancersRes : (freelancersRes?.freelancers || []);

        setStats((prev) => ({
          ...prev,
          totalTasks: tasksArray.length,
          totalFreelancers: freelancersArray.length,
        }));

        setError(false);
      } catch (err) {
        console.error("Error calculating metrics:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStatsData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-teal-600"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-error font-medium">
        Failed to dynamically generate updated structural statistics. Please refresh runtime instance.
      </div>
    );
  }

  return (
    <section className="py-16 bg-base-100 relative overflow-hidden">
      <div className="mx-auto w-[95%] lg:w-[76%] text-center">
        
        {/* Header Layout */}
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold md:text-5xl text-base-content tracking-tight">
            Platform Ecosystem Metric Overview
          </h2>
          <p className="mt-4 text-base text-base-content/70 max-w-2xl mx-auto">
            Live evaluation insights map representing core volume assets across our interactive application space.
          </p>
        </div>

        {/* Grid Wrapper */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          
          {/* Node 1: Dynamic Tasks Count */}
          <div className="flex flex-col items-center justify-center p-8 bg-base-100 border border-base-300 rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="p-4 bg-teal-50 text-teal-600 dark:bg-teal-950/40 rounded-xl mb-4">
              <FaTasks className="text-4xl" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-base-content/50">
              Total Tasks Counted
            </p>
            <h3 className="mt-3 text-4xl font-black text-base-content tracking-tight">
              {stats.totalTasks.toLocaleString()}
            </h3>
          </div>

          {/* Node 2: Dynamic Freelancers Count */}
          <div className="flex flex-col items-center justify-center p-8 bg-base-100 border border-base-300 rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="p-4 bg-blue-50 text-blue-600 dark:bg-blue-950/40 rounded-xl mb-4">
              <FaUsers className="text-4xl" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-base-content/50">
              Total Freelancers
            </p>
            <h3 className="mt-3 text-4xl font-black text-base-content tracking-tight">
              {stats.totalFreelancers.toLocaleString()}
            </h3>
          </div>

          {/* Node 3: Hardcoded Payout */}
          <div className="flex flex-col items-center justify-center p-8 bg-base-100 border border-base-300 rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="p-4 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 rounded-xl mb-4">
              <FaHandHoldingUsd className="text-4xl" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-base-content/50">
              Total Payout Finalized
            </p>
            <h3 className="mt-3 text-4xl font-black text-base-content tracking-tight">
              ${stats.totalPayout.toLocaleString()}
            </h3>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PlatformStatistics;