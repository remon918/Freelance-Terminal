"use client";

import TaskCard from "@/components/mejor/TaskCard";
import { getMyTasks } from "@/lib/api/tasks";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PlusCircle, ClipboardList, Loader2 } from "lucide-react";

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

  // 🔥 ফিল্টার লজিক প্রয়োগ (স্ট্যাটাস ছোট হাতের বা বড় হাতের যাই হোক হ্যান্ডেল করবে)
  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "All") return true;
    return task.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="mt-12 md:mt-0 max-w-6xl mx-auto p-4 md:p-0 font-sans text-inherit selection:bg-cyan-500/20 selection:text-cyan-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-extrabold text-inherit tracking-tight">My Tasks</h2>
        
        {/* টাস্ক যদি থাকে, তবেই যেন ফিল্টার ট্যাবগুলো স্ক্রিনে দেখায় */}
        {tasks.length > 0 && (
          <div className="flex gap-1.5 bg-current/5 border border-current/10 p-1.5 rounded-2xl w-fit backdrop-blur-md">
            {["All", "Open", "Completed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl transition duration-300 cursor-pointer ${
                  filterStatus === status
                    ? "bg-cyan-500 text-zinc-950 shadow-[0_4px_12px_rgba(6,182,212,0.25)]"
                    : "opacity-60 hover:opacity-100"
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
        <div className="text-center py-20 opacity-60 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          <p className="text-xs font-semibold uppercase tracking-wider opacity-60">Loading your tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        
        /* ২. কোনো টাস্ক একদমই না থাকলে (Empty State) */
        <div className="flex flex-col items-center justify-center border border-dashed border-current/10 rounded-3xl p-10 bg-current/5 max-w-2xl mx-auto text-center mt-6">
          <div className="p-4 bg-current/5 border border-current/10 rounded-full mb-4">
            <ClipboardList className="w-10 h-10 text-cyan-500" />
          </div>
          <h3 className="text-lg font-bold mb-1 text-inherit">No Tasks Found</h3>
          <p className="opacity-60 text-sm max-w-sm mb-6">
            You have not created any tasks yet. Create your first task to get started with freelancers!
          </p>
          
          <Link 
            href="/client/tasks/post-task" 
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            Create a Task
          </Link>
        </div>

      ) : filteredTasks.length === 0 ? (

        /* ৩. ফিল্টার করার পর যদি ওই স্ট্যাটাসের কোনো টাস্ক না পাওয়া যায় */
        <div className="text-center p-16 border border-dashed border-current/10 rounded-3xl bg-current/5">
          <p className="opacity-50 font-medium italic text-sm">
            No {filterStatus} tasks found.
          </p>
        </div>

      ) : (
        
        /* ৪. ফিল্টার করা টাস্কগুলো গ্রিড আকারে দেখাবে */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <Link key={task._id} href={`/client/tasks/${task._id}`} className="block group">
              <TaskCard task={task} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksPage;