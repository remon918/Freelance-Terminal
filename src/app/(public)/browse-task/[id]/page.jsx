"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTaskDetails } from "@/lib/api/tasks";
import { Calendar, DollarSign, Briefcase, Edit3, Trash2 } from "lucide-react";

const TaskDetailsPage = () => {
  const { id } = useParams(); // URL থেকে টাস্ক ID নেওয়ার জন্য
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getTaskDetails(id);
        setTask(data);
      } catch (error) {
        console.error("Error fetching task details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading task details...</div>;
  }

  if (!task) {
    return <div className="text-center mt-10 text-red-500">Task not found!</div>;
  }

  // ডেট ফরম্যাটিং (যেমন: Jul 1, 2026)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 font-sans  mt-10 md:mt-0">
      
      {/* ১. মেইন টাস্ক কার্ড */}
      <div className=" border border-gray-500 rounded-2xl p-6 shadow-sm">

        <div className="space-y-2 mb-6">
          <h1 className="text-xl md:text-2xl font-bold ">
            {task.title}
          </h1>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            {task.description}
          </p>
        </div>
        
        {/* ব্যাজ এবং ইনফো রো */}
        <div className="flex flex-wrap items-center gap-3 mb-4 text-sm font-medium">
          {/* Status Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
            task.status === "open" ? "bg-blue-50 text-blue-600 border border-blue-200" : "bg-gray-500 text-gray-600"
          }`}>
            {task.status}
          </span>

          {/* Category Badge */}
          <span className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs">
            <Briefcase className="w-3.5 h-3.5" />
            {task.category || "Development"}
          </span>

          {/* Budget */}
          <span className="flex items-center text-gray-500 gap-0.5">
            <DollarSign className="w-4 h-4 shrink-0 -mr-0.5" />
            {task.budget}
          </span>

          {/* Deadline */}
          <span className="flex items-center gap-1.5 text-gray-500">
            <Calendar className="w-4 h-4 shrink-0" />
            {formatDate(task.deadline)}
          </span>
        </div>

        {/* টাস্কের টাইটেল ও ডেসক্রিপশন */}
        

        {/* ডিভাইডার লাইন */}
        <div className="border-t border-gray-500 my-4"></div>

        {/* অ্যাকশন বাটনসমূহ (Edit & Delete) */}
        <div className="flex items-center gap-3 pt-2">
          <button 
            onClick={() => router.push(`/client/tasks/${id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-500 hover:bg-gray-50/10 font-medium text-sm rounded-xl transition shadow-sm"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
          <button 
            onClick={() => alert("Delete functionality here")}
            className="flex items-center gap-2 px-4 py-2 border border-rose-100/30 bg-rose-50/10 hover:bg-rose-50/20 text-rose-600 font-medium text-sm rounded-xl transition shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* ২. প্রপোজাল সেকশন কার্ড */}
      <div className=" border border-gray-500 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold  mb-4">
          Proposals ({task.proposals?.length || 0})
        </h3>
        
        <p className="text-gray-400 text-sm">
          No proposals yet. Freelancers will apply soon!
        </p>
      </div>

    </div>
  );
};

export default TaskDetailsPage;