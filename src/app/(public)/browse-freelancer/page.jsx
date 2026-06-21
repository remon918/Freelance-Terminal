"use client";

import React, { useEffect, useState, useCallback } from 'react';
import FreelancerCard from '@/components/mejor/FreelancerCard';
import { Users, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { getAllFreelancers } from '@/lib/api/tasks';

const BrowseFreelancersPage = () => {
  // ফিল্টার এবং পেজিনেশন স্টেটস
  const [search, setSearch] = useState("");
  const [minRate, setMinRate] = useState("");
  const [maxRate, setMaxRate] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12; // প্রতি পেজে ১২ জন করে ফ্রিল্যান্সার দেখাবে

  // ডাটা এবং লোডিং স্টেটস
  const [freelancers, setFreelancers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);

  // ডাটা ফেচ করার মূল ফাংশন
  const fetchFreelancersData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllFreelancers({
        search,
        minRate,
        maxRate,
        page,
        limit
      });

      // নতুন রেসপন্স ফরম্যাট অনুযায়ী স্টেট সেটআপ
      if (response?.success) {
        setFreelancers(response.freelancers || []);
        setTotalPages(response.totalPages || 1);
        setTotalResults(response.totalResults || 0);
      } else if (Array.isArray(response)) {
        // ব্যাকআপ সেফটি: যদি কোনো কারণে ব্যাকএন্ড অ্যারে পাঠায়
        setFreelancers(response);
        setTotalResults(response.length);
      }
    } catch (error) {
      console.error("Error loading freelancers:", error);
    } finally {
      setLoading(false);
    }
  }, [search, minRate, maxRate, page]);

  // পেজ নাম্বার পরিবর্তন হলে ডাটা লোড হবে
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      if (isMounted) {
        await fetchFreelancersData();
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [page, fetchFreelancersData]);

  // সার্চ বা রেট ফিল্টার সাবমিট করার হ্যান্ডলার
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1); // ফিল্টার করলে সবসময় ১ম পেজে ফিরে যাবে
    fetchFreelancersData();
  };

  // "Showing X-Y of Z results" ক্যালকুলেশন
  const startResult = totalResults === 0 ? 0 : (page - 1) * limit + 1;
  const endResult = Math.min(page * limit, totalResults);

  // ডাইনামিক পেজিনেশন নাম্বার জেনারেশন লজিক
  const renderPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", page, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 mt-9 font-sans text-neutral-200 space-y-6">
      
      {/* হেডার সেকশন */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-500" />
          Browse Top Freelancers
        </h2>
        <p className="text-neutral-400 text-sm">Find and connect with world-class experts for your projects.</p>
      </div>

      {/* ------------------------------------------- */}
      {/* ১. সার্চ এবং আওয়ার্লি রেট ফিল্টার বার            */}
      {/* ------------------------------------------- */}
      <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
        {/* সার্চ ইনপুট (নাম, টাইটেল বা স্কিল) */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search name, title, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-black border border-zinc-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 transition"
          />
        </div>

        {/* আওয়ার্লি রেট ফিল্টার ($) */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min Rate ($/hr)"
            value={minRate}
            onChange={(e) => setMinRate(e.target.value)}
            className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50"
          />
          <span className="text-neutral-600">-</span>
          <input
            type="number"
            placeholder="Max Rate ($/hr)"
            value={maxRate}
            onChange={(e) => setMaxRate(e.target.value)}
            className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        {/* ফিল্টার বাটন */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition"
        >
          Apply Filters
        </button>
      </form>

      {/* ------------------------------------------- */}
      {/* ২. ফ্রিল্যান্সার গ্রিড / লোডার ডিসপ্লে           */}
      {/* ------------------------------------------- */}
      {loading ? (
        <div className="flex justify-center items-center min-h-75">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : freelancers.length === 0 ? (
        <div className="text-center py-20 text-neutral-500 border border-dashed border-zinc-800 rounded-xl">
          No freelancers found matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancers.map((freelancer) => (
            <FreelancerCard key={freelancer._id} freelancer={freelancer} />
          ))}
        </div>
      )}

      {/* ------------------------------------------- */}
      {/* ৩. পারফেক্ট পেজিনেশন বার                         */}
      {/* ------------------------------------------- */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-6 border-t border-zinc-900">
          
          {/* Showing X-Y of Z results */}
          <div className="text-sm text-neutral-400">
            Showing <span className="font-medium text-white">{startResult}-{endResult}</span> of <span className="font-medium text-white">{totalResults}</span> results
          </div>

          {/* নেভিগেশন বাটন্স */}
          <div className="flex items-center gap-1">
            {/* Previous Button */}
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-neutral-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {/* পেজ নাম্বারসমূহ */}
            {renderPageNumbers().map((item, index) => (
              <button
                key={index}
                onClick={() => typeof item === "number" && setPage(item)}
                disabled={item === "..."}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition ${
                  item === page
                    ? "bg-zinc-800 text-white"
                    : "text-neutral-400 hover:text-white disabled:hover:text-neutral-400"
                }`}
              >
                {item}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-neutral-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default BrowseFreelancersPage;