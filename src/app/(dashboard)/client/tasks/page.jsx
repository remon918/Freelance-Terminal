"use client";

import TaskCard from "@/components/mejor/TaskCard";
import { getMyTasks } from "@/lib/api/tasks";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PlusCircle, ClipboardList } from "lucide-react";

const TasksPage = () => {
  const { data: session } = authClient.useSession();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🔥 ফিল্টারিং এর জন্য নতুন স্টেট (ডিফল্ট থাকবে "All")
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const loadTasks = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const data = await getMyTasks(session.user.id);
        setTasks(data || []);
      } catch (error) {
        console.error("Error loading tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [session]);

  // 🔥 ফিল্টার লজিক প্রয়োগ (স্ট্যাটাস ছোট হাতের বা বড় হাতের যাই হোক হ্যান্ডেল করবে)
  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "All") return true;
    return task.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="mt-12 md:mt-0 max-w-6xl mx-auto p-4 md:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-100">My Tasks</h2>
        
        {/* টাস্ক যদি থাকে, তবেই যেন ফিল্টার ট্যাবগুলো স্ক্রিনে দেখায় */}
        {tasks.length > 0 && (
          <div className="flex gap-2 bg-neutral-900/60 border border-neutral-800 p-1.5 rounded-2xl w-fit">
            {["All", "Open", "Completed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all duration-300 cursor-pointer ${
                  filterStatus === status
                    ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {status} (
                {status === "All"
                  ? tasks.length
                  : tasks.filter((t) => t.status?.toLowerCase() === status.toLowerCase()).length}
                )
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ১. ডেটা যখন লোড হচ্ছে */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">
          <span className="loading loading-spinner loading-md text-cyan-400"></span>
          <p className="mt-2 text-sm">Loading your tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        
        /* ২. কোনো টাস্ক একদমই না থাকলে (Empty State) */
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-800 rounded-3xl p-10 bg-neutral-900/40 max-w-2xl mx-auto text-center mt-6">
          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-full mb-4">
            <ClipboardList className="w-10 h-10 text-cyan-400" />
          </div>
          <h3 className="text-lg font-semibold mb-1 text-white">No Tasks Found</h3>
          <p className="text-gray-400 text-sm max-w-sm mb-6">
            You have not created any tasks yet. Create your first task to get started with freelancers!
          </p>
          
          <Link 
            href="/client/tasks/post-task" 
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Create a Task
          </Link>
        </div>

      ) : filteredTasks.length === 0 ? (

        /* ৩. ফিল্টার করার পর যদি ওই স্ট্যাটাসের কোনো টাস্ক না পাওয়া যায় */
        <div className="text-center p-12 border border-dashed border-neutral-800 rounded-3xl bg-neutral-900/30">
          <p className="text-gray-400 font-medium">
            No {filterStatus} tasks found.
          </p>
        </div>

      ) : (
        
        /* ৪. ফিল্টার করা টাস্কগুলো গ্রিড আকারে দেখাবে */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <Link key={task._id} href={`/client/tasks/${task._id}`} className="block">
              <TaskCard task={task} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksPage;