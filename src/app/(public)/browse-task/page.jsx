"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getAllTasks } from '@/lib/api/tasks';
import TaskCard from '@/components/mejor/TaskCard';
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const TasksPage = () => {
    // ফিল্টার এবং পেজিনেশন স্টেটস
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [minBudget, setMinBudget] = useState("");
    const [maxBudget, setMaxBudget] = useState("");
    const [page, setPage] = useState(1);
    const limit = 12; // 🔥 প্রতি পেজে টাস্কের সংখ্যা ৬ থেকে বাড়িয়ে ১২ করা হলো

    // ডাটা এবং লোডিং স্টেটস
    const [tasks, setTasks] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(true);

    // useCallback দিয়ে ফাংশনটি ডিফাইন করা হলো যাতে ডিপেন্ডেন্সি লুপ না তৈরি হয়
    const fetchTasksData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAllTasks({
                search,
                category,
                minBudget,
                maxBudget,
                page,
                limit,
                status: "open"
            });

            if (response?.success) {
                setTasks(response.tasks || []);
                setTotalPages(response.totalPages || 1);
                setTotalResults(response.totalResults || 0);
            }
        } catch (error) {
            console.error("Error loading tasks:", error);
        } finally {
            setLoading(false);
        }
    }, [search, category, minBudget, maxBudget, page, limit]);

    // ইফেক্টের ভেতর সরাসরি স্টেট চেঞ্চ না করে অ্যাসিনক্রোনাস ট্রিপল-ডট হ্যান্ডেলিং করা হলো
    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (isMounted) {
                await fetchTasksData();
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, [category, page, fetchTasksData]);

    // সার্চ বা বাজেট রেঞ্জ লিখে এন্টার দিলে বা বাটনে চাপ দিলে ফিল্টার অ্যাপ্লাই হবে
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setPage(1); // ফিল্টার করলে সবসময় ১ম পেজ থেকে শুরু হবে
        fetchTasksData();
    };

    // স্ক্রিনশটের মতো "Showing X-Y of Z results" ক্যালকুলেশন
    const startResult = totalResults === 0 ? 0 : (page - 1) * limit + 1;
    const endResult = Math.min(page * limit, totalResults);

    // ডাইনামিক পেজিনেশন নাম্বারের অ্যারে তৈরি করার লজিক (যেমন: 1, 2, ..., 12)
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
        <div className="max-w-6xl mx-auto px-4 md:px-6 mt-9 font-sans text-neutral-200">
            
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Browse All Tasks</h2>
                <p className="text-sm text-neutral-400">Find work and projects based on your preferences.</p>
            </div>

            {/* ------------------------------------------- */}
            {/* ১. সার্চ, ক্যাটাগরি ও বাজেট ফিল্টার বার           */}
            {/* ------------------------------------------- */}
            <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 mb-8">
                {/* টাস্ক নাম বা সার্চ ইনপুট */}
                <div className="relative flex items-center">
                    <Search className="absolute left-3 w-4 h-4 text-neutral-500" />
                    <input
                        type="text"
                        placeholder="Search task name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-black border border-zinc-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 transition"
                    />
                </div>

                {/* ক্যাটাগরি ড্রপডাউন */}
                <select
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                    className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-lg text-sm text-neutral-300 focus:outline-none focus:border-amber-500/50 cursor-pointer"
                >
                    <option value="">All Categories</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Graphics Design">Graphics Design</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Content Writing">Content Writing</option>
                </select>

                {/* বাজেট রেঞ্জ ইনপুট */}
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min ($)"
                        value={minBudget}
                        onChange={(e) => setMinBudget(e.target.value)}
                        className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none"
                    />
                    <span className="text-neutral-600">-</span>
                    <input
                        type="number"
                        placeholder="Max ($)"
                        value={maxBudget}
                        onChange={(e) => setMaxBudget(e.target.value)}
                        className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none"
                    />
                </div>

                {/* ফিল্টার সাবমিট বাটন */}
                <button
                    type="submit"
                    className="w-full py-2 bg-amber-500 text-black font-semibold text-sm rounded-lg hover:bg-amber-600 transition"
                >
                    Apply Filters
                </button>
            </form>

            {/* ------------------------------------------- */}
            {/* ২. টাস্ক গ্রিড / লোডার ডিসপ্লে                   */}
            {/* ------------------------------------------- */}
            {loading ? (
                <div className="flex justify-center items-center min-h-75">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                </div>
            ) : tasks.length === 0 ? (
                <div className="text-center py-20 text-neutral-500 border border-dashed border-zinc-800 rounded-xl">
                    No tasks found matching your filters.
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map((task) => (
                        <Link key={task._id} href={`/browse-task/${task._id}`}>
                            <TaskCard task={task} />
                        </Link>
                    ))}
                </div>
            )}

            {/* ------------------------------------------- */}
            {/* ৩. পেজিনেশন বার                                */}
            {/* ------------------------------------------- */}
            {!loading && totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-6 border-t border-zinc-900">
                    
                    {/* Showing X-Y of Z results */}
                    <div className="text-sm text-neutral-400">
                        Showing <span className="font-medium text-white">{startResult}-{endResult}</span> of <span className="font-medium text-white">{totalResults}</span> results
                    </div>

                    {/* বাটন্স এবং পেজ নাম্বারস */}
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

                        {/* পেজ নাম্বার জেনারেশন */}
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

export default TasksPage;