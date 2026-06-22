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
    const limit = 12; 

    // ডাটা এবং লোডিং স্টেটস
    const [tasks, setTasks] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(true);

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

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setPage(1); 
        fetchTasksData();
    };

    const startResult = totalResults === 0 ? 0 : (page - 1) * limit + 1;
    const endResult = Math.min(page * limit, totalResults);

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
        <div className="max-w-6xl mx-auto px-4 md:px-6 mt-9 font-sans text-inherit">
            
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2 text-inherit">Browse All Tasks</h2>
                <p className="text-sm opacity-60">Find work and projects based on your preferences.</p>
            </div>

            {/* ১. সার্চ, ক্যাটাগরি ও বাজেট ফিল্টার বার (ম্যানেজমেন্ট পেজের সাথে ১০০% এলাইনড) */}
            <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-current/5 p-4 rounded-xl border border-current/10 mb-8">
                
                {/* সার্চ ইনপুট */}
                <div className="relative flex items-center">
                    <Search className="absolute left-3 w-4 h-4 opacity-50" />
                    <input
                        type="text"
                        placeholder="Search task name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-1.5 bg-current/5 border border-current/10 rounded-lg text-sm text-inherit placeholder:opacity-40 focus:outline-none focus:border-cyan-500 transition"
                    />
                </div>

                {/* ক্যাটাগরি ড্রপডাউন (ডার্ক মোড সেফ অপশনসহ) */}
                <select
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                    className="w-full px-3 py-1.5 bg-current/5 border border-current/10 rounded-lg text-sm text-inherit focus:outline-none focus:border-cyan-500 cursor-pointer dark:bg-[#0f172a]"
                >
                    <option value="" className="text-inherit dark:text-white dark:bg-[#0f172a]">All Categories</option>
                    <option value="Web Development" className="text-inherit dark:text-white dark:bg-[#0f172a]">Web Development</option>
                    <option value="Graphics Design" className="text-inherit dark:text-white dark:bg-[#0f172a]">Graphics Design</option>
                    <option value="Digital Marketing" className="text-inherit dark:text-white dark:bg-[#0f172a]">Digital Marketing</option>
                    <option value="Content Writing" className="text-inherit dark:text-white dark:bg-[#0f172a]">Content Writing</option>
                </select>

                {/* বাজেট রেঞ্জ ইনপুট */}
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min ($)"
                        value={minBudget}
                        onChange={(e) => setMinBudget(e.target.value)}
                        className="w-full px-3 py-1.5 bg-current/5 border border-current/10 rounded-lg text-sm text-inherit placeholder:opacity-40 focus:outline-none focus:border-cyan-500"
                    />
                    <span className="opacity-40">-</span>
                    <input
                        type="number"
                        placeholder="Max ($)"
                        value={maxBudget}
                        onChange={(e) => setMaxBudget(e.target.value)}
                        className="w-full px-3 py-1.5 bg-current/5 border border-current/10 rounded-lg text-sm text-inherit placeholder:opacity-40 focus:outline-none focus:border-cyan-500"
                    />
                </div>

                {/* ফিল্টার সাবমিট বাটন */}
                <button
                    type="submit"
                    className="w-full py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm rounded-lg shadow-sm transition"
                >
                    Apply Filters
                </button>
            </form>

            {/* ২. টাস্ক গ্রিড / লোডার ডিসপ্লে */}
            {loading ? (
                <div className="flex justify-center items-center min-h-75">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                </div>
            ) : tasks.length === 0 ? (
                <div className="text-center py-20 opacity-40 border border-dashed border-current/20 rounded-xl">
                    No tasks found matching your filters.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map((task) => (
                        <Link key={task._id} href={`/browse-task/${task._id}`}>
                            <TaskCard task={task} />
                        </Link>
                    ))}
                </div>
            )}

            {/* ৩. পেজিনেশন বার */}
            {!loading && totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-6 border-t border-current/10">
                    
                    {/* Showing X-Y of Z results */}
                    <div className="text-sm opacity-60">
                        Showing <span className="font-medium text-inherit">{startResult}-{endResult}</span> of <span className="font-medium text-inherit">{totalResults}</span> results
                    </div>

                    {/* বাটন্স এবং পেজ নাম্বারস */}
                    <div className="flex items-center gap-1">
                        {/* Previous Button */}
                        <button
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={page === 1}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm opacity-60 hover:opacity-100 disabled:opacity-20 disabled:pointer-events-none transition text-inherit"
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
                                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                                    item === page
                                        ? "bg-cyan-600 text-white"
                                        : "text-inherit opacity-60 hover:opacity-100 disabled:opacity-40"
                                }`}
                            >
                                {item}
                            </button>
                        ))}

                        {/* Next Button */}
                        <button
                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                            disabled={page === totalPages}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm opacity-60 hover:opacity-100 disabled:opacity-20 disabled:pointer-events-none transition text-inherit"
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