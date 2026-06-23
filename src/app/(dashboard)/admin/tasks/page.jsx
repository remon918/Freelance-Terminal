"use client";

import { useState, useEffect } from "react";
import { Trash2, Loader2, AlertTriangle, Search } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ফিল্টারিং স্টেটসমূহ
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // কাস্টম ডিলিট মডাল স্টেট
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // ১. ডাটা লোড করা (GET Request)
  useEffect(() => {
    let isMounted = true;

    async function loadTasks() {
      try {
        // Better Auth থেকে টোকেন নেওয়া হচ্ছে
        const { data: tokenData } = await authClient.token();

        const res = await fetch(`${API_URL}/api/admin/tasks`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Authorization হেডারে Bearer টোকেন পাস করা হলো
            authorization: `Bearer ${tokenData?.token}`,
          },
        });
        const data = await res.json();
        if (data.success && isMounted) {
          setTasks(data.tasks);
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTasks();
    return () => {
      isMounted = false;
    };
  }, [API_URL]);

  // ২. ডিলিট মডাল ওপেন করা
  const openDeleteModal = (task) => {
    setTaskToDelete(task);
    setIsModalOpen(true);
  };

  // ৩. মডাল থেকে ডিলিট কনফার্ম করা (DELETE Request)
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      // Better Auth থেকে টোকেন নেওয়া হচ্ছে
      const { data: tokenData } = await authClient.token();

      const res = await fetch(
        `${API_URL}/api/admin/tasks/${taskToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // Authorization হেডারে Bearer টোকেন পাস করা হলো
            authorization: `Bearer ${tokenData?.token}`,
          },
        },
      );
      const data = await res.json();

      if (data.success) {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskToDelete._id),
        );
        setIsModalOpen(false);
        setTaskToDelete(null);
      } else {
        alert(data.message || "Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // ৪. রিয়েল-টাইম কম্বাইন্ড ফিল্টারিং লজিক (Search + Category + Status)
  const filteredTasks = tasks.filter((task) => {
    const taskTitle = task?.title?.toLowerCase() || "";
    const taskCategory = task?.category?.toLowerCase() || "";
    const taskStatus = task?.status?.toLowerCase() || "open";

    // সার্চ কুয়েরি ম্যাচিং
    const matchesSearch = taskTitle.includes(searchQuery.toLowerCase());

    // ক্যাটাগরি ম্যাচিং
    const matchesCategory =
      categoryFilter === "all"
        ? true
        : taskCategory === categoryFilter.toLowerCase();

    // স্ট্যাটাস ম্যাচিং
    const matchesStatus =
      statusFilter === "all" ? true : taskStatus === statusFilter.toLowerCase();

    // ৩টি কন্ডিশনই সত্য হতে হবে
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="animate-spin text-cyan-500" size={40} />
      </div>
    );
  }

  return (
    <div className="px-6 mt-12 md:mt-0 min-h-screen text-inherit relative">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-inherit">Task Management</h1>
        <p className="text-sm opacity-60">
          {filteredTasks.length} tasks matching
        </p>
      </div>

      {/* Search and Filters Row */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* টাস্কের নাম দিয়ে সার্চ করার ইনপুট ফিল্ড */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
          <input
            type="text"
            placeholder="Search tasks by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-current/10 bg-current/5 py-1.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-inherit placeholder:opacity-40"
          />
        </div>

        <div className="flex gap-3">
          {/* Category Selector */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-current/10 bg-current/5 px-4 py-1.5 text-sm outline-none transition-all focus:border-cyan-500 text-inherit dark:bg-[#0f172a]"
          >
            <option
              value="all"
              className="text-inherit dark:text-white dark:bg-[#0f172a]"
            >
              All Categories
            </option>
            <option
              value="design"
              className="text-inherit dark:text-white dark:bg-[#0f172a]"
            >
              Design
            </option>
            <option
              value="writing"
              className="text-inherit dark:text-white dark:bg-[#0f172a]"
            >
              Writing
            </option>
            <option
              value="development"
              className="text-inherit dark:text-white dark:bg-[#0f172a]"
            >
              Development
            </option>
            <option
              value="marketing"
              className="text-inherit dark:text-white dark:bg-[#0f172a]"
            >
              Marketing
            </option>
            <option
              value="other"
              className="text-inherit dark:text-white dark:bg-[#0f172a]"
            >
              Other
            </option>
          </select>

          {/* Status Selector */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-current/10 bg-current/5 px-4 py-1.5 text-sm outline-none transition-all focus:border-cyan-500 text-inherit dark:bg-[#0f172a]"
          >
            <option
              value="all"
              className="text-inherit dark:text-white dark:bg-[#0f172a]"
            >
              All Status
            </option>
            <option
              value="open"
              className="text-inherit dark:text-white dark:bg-[#0f172a]"
            >
              Open
            </option>
            <option
              value="in progress"
              className="text-inherit dark:text-white dark:bg-[#0f172a]"
            >
              In Progress
            </option>
            <option
              value="completed"
              className="text-inherit dark:text-white dark:bg-[#0f172a]"
            >
              Completed
            </option>
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="overflow-hidden rounded-xl border border-current/10 bg-current/5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-current/10 bg-current/5 text-xs font-semibold uppercase opacity-70">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Proposals</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-current/5 text-sm">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center opacity-40">
                    No tasks found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const currentStatus = task.status?.toLowerCase() || "open";

                  let statusStyles =
                    "bg-sky-500/10 text-sky-500 border-sky-500/20";
                  if (currentStatus === "in progress") {
                    statusStyles =
                      "bg-amber-500/10 text-amber-500 border-amber-500/20";
                  } else if (currentStatus === "completed") {
                    statusStyles =
                      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                  }

                  const createdDate = task.createdAt
                    ? new Date(task.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Jun 22, 2026";

                  return (
                    <tr
                      key={task._id}
                      className="hover:bg-current/5 transition-colors"
                    >
                      {/* Title */}
                      <td className="px-6 py-4 font-medium text-inherit max-w-50 truncate">
                        {task.title || "Untitled Task"}
                      </td>

                      {/* Category Badge */}
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full border border-current/10 bg-current/5 px-2.5 py-0.5 text-xs font-medium capitalize opacity-90">
                          {task.category || "Other"}
                        </span>
                      </td>

                      {/* Client Email */}
                      <td className="px-6 py-4 opacity-70">
                        {task.clientEmail || "N/A"}
                      </td>

                      {/* Budget */}
                      <td className="px-6 py-4 font-semibold text-inherit">
                        $
                        {task.budget
                          ? Number(task.budget).toLocaleString()
                          : "0"}
                      </td>

                      {/* Status Tag */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold border ${statusStyles}`}
                        >
                          {task.status || "Open"}
                        </span>
                      </td>

                      {/* Proposals Count */}
                      <td className="px-6 py-4 opacity-80">
                        {Array.isArray(task.proposals)
                          ? task.proposals.length
                          : typeof task.proposals === "object" &&
                              task.proposals !== null
                            ? 1
                            : (task.proposalsCount ?? 0)}
                      </td>

                      {/* Created Date */}
                      <td className="px-6 py-4 opacity-70">{createdDate}</td>

                      {/* Delete Trigger Button */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openDeleteModal(task)}
                          className="text-rose-500 hover:text-rose-600 dark:text-rose-400 hover:opacity-80 transition-colors"
                          title="Delete Task"
                        >
                          <Trash2 size={16} />
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

      {/* কাস্টম ডিলিট কনফার্মেশন মডাল */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-current/10 bg-slate-900 text-white p-6 shadow-xl dark:bg-[#0f172a]">
            <div className="flex items-center gap-3 text-rose-400 mb-4">
              <AlertTriangle size={24} />
              <h3 className="text-lg font-bold">Confirm Delete</h3>
            </div>

            <p className="text-sm opacity-80 mb-6">
              Are you sure you want to delete the task{" "}
              <span className="font-semibold text-rose-300">
                {taskToDelete?.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 text-sm font-semibold">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setTaskToDelete(null);
                }}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
