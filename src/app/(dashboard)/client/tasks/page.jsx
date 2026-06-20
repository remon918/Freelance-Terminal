"use client";

import TaskCard from "@/components/mejor/TaskCard";
import { getMyTasks } from "@/lib/api/tasks";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PlusCircle, ClipboardList } from "lucide-react"; // আইকনের জন্য (ঐচ্ছিক)

const TasksPage = () => {
  const { data: session } = authClient.useSession();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true); // লোডিং স্টেট যোগ করা হলো

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

  return (
    <div className="mt-12 md:mt-0">
      <h2 className="text-2xl font-bold mb-6">My Tasks</h2>

      {/* ১. ডেটা যখন লোড হচ্ছে */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading your tasks...</div>
      ) : tasks.length === 0 ? (
        
        /* ২. কোনো টাস্ক না থাকলে (Empty State) */
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-10 bg-gray-500/30 max-w-2xl mx-auto text-center mt-6">
          <div className="p-4 bg-white rounded-full shadow-sm mb-4 border border-gray-100">
            <ClipboardList className="w-10 h-10 text-black" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No Tasks Found</h3>
          <p className="text-gray-500 text-sm max-w-sm mb-6">
            You have not created any tasks yet. Create your first task to get started with freelancers!
          </p>
          
          <Link 
            href="/client/tasks/post-task" 
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white font-medium text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Create a Task
          </Link>
        </div>

      ) : (
        
        /* ৩. টাস্ক থাকলে */
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <Link key={task._id} href={`/client/tasks/${task._id}`}>
              <TaskCard task={task} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksPage;