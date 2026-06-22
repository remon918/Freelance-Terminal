"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client"; 
import SubmitDeliverableModal from "@/components/minor/SubmitDeliverableModal";

export default function ActiveProjectsPage() {
  const { data: session, isPending } = authClient.useSession();
  const [activeProjects, setActiveProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [isFetching, setIsFetching] = useState(false); // শুধু ডাটা ফেচিং ট্র্যাক করার জন্য
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchProjects = async () => {
      setIsFetching(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      try {
        const res = await fetch(`${apiUrl}/api/freelancer-projects?email=${session.user.email}`);
        const data = await res.json();
        if (data.success) {
          setActiveProjects(data.activeProjects);
          setCompletedProjects(data.completedProjects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProjects();
  }, [session, refreshTrigger]);

  // সেশন লোড হচ্ছে অথবা ডাটা ফেচ হচ্ছে—এমন অবস্থায় লোডার দেখাবে
  const showLoading = isPending || (session?.user?.email && activeProjects.length === 0 && completedProjects.length === 0 && isFetching);

  if (showLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-8 text-center text-gray-500">
        Please log in to view your active projects.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      
      {/* ---------------- SECTION 1: ACTIVE PROJECTS ---------------- */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          Active Projects ({activeProjects.length})
        </h2>
        
        {activeProjects.length === 0 ? (
          <div className="border border-dashed border-gray-200 bg-gray-50/50 rounded-2xl p-8 text-center text-gray-400 text-sm">
            No active projects found. After your proposals are accepted, they will appear here.
          </div>
        ) : (
          <div className="grid gap-4">
            {activeProjects.map((task) => (
              <div key={task._id} className="border border-gray-100 bg-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-gray-800 text-base">{task.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-1 max-w-xl">{task.description}</p>
                  <div className="flex items-center gap-3 text-xs pt-1">
                    <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-medium">{task.category || "Development"}</span>
                    <span className="text-emerald-600 font-semibold">${task.budget}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setIsModalOpen(true);
                  }}
                  className="whitespace-nowrap px-4 py-2.5 bg-orange-50 hover:bg-orange-100/80 text-orange-600 font-medium rounded-xl text-sm transition-colors border border-orange-100 text-center"
                >
                  Submit Deliverable Link
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ---------------- SECTION 2: COMPLETED PROJECTS ---------------- */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs border border-emerald-100">
            ✓
          </div>
          Completed ({completedProjects.length})
        </h2>

        {completedProjects.length === 0 ? (
          <div className="border border-dashed border-gray-200 bg-gray-50/50 rounded-2xl p-8 text-center text-gray-400 text-sm">
            No completed tasks yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {completedProjects.map((task) => (
              <div key={task._id} className="border border-gray-100 bg-white rounded-2xl p-6 shadow-sm relative space-y-4">
                
                <span className="absolute top-6 right-6 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                  Completed
                </span>

                <div className="space-y-1.5">
                  <h3 className="font-semibold text-gray-800 text-base pr-20">{task.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">{task.description}</p>
                  <div className="flex items-center gap-3 text-xs pt-1">
                    <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-medium">{task.category || "Development"}</span>
                    <span className="text-emerald-500 font-semibold">${task.budget}</span>
                  </div>
                </div>

                {task.deliverableUrl && (
                  <div className="pt-3 border-t border-gray-50 flex items-center gap-2 text-xs">
                    <span className="text-gray-400">Submitted Deliverable:</span>
                    {task.deliverableUrl.startsWith("http") ? (
                      <a
                        href={task.deliverableUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline font-medium break-all max-w-md"
                      >
                        {task.deliverableUrl}
                      </a>
                    ) : (
                      <span className="text-gray-700 font-medium break-all max-w-md">{task.deliverableUrl}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Submission Modal */}
      <SubmitDeliverableModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSubmissionSuccess={() => setRefreshTrigger(prev => prev + 1)} 
      />
    </div>
  );
}