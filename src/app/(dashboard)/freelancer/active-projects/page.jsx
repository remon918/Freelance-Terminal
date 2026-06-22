"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client"; 
import SubmitDeliverableModal from "@/components/minor/SubmitDeliverableModal";
import { Loader2, CheckCircle2, Circle } from "lucide-react";

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

  // সেশন লোড হচ্ছে অথবা ডাটা ফেচ হচ্ছে—এমন অবস্থায় লোডার দেখাবে
  const showLoading = isPending || (session?.user?.email && activeProjects.length === 0 && completedProjects.length === 0 && isFetching);

  if (showLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
      </div>
    );
  }

  

  if (!session) {
    return (
      <div className="p-8 text-center opacity-50 text-sm font-medium">
        Please log in to view your active projects.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 mt-10 md:mt-0 pb-8 space-y-12 font-sans text-inherit">
      
      {/* ---------------- SECTION 1: ACTIVE PROJECTS ---------------- */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-inherit">
          <Circle className="w-3 h-3 fill-cyan-500 text-cyan-500" />
          Active Projects ({activeProjects.length})
        </h2>
        
        {activeProjects.length === 0 ? (
          <div className="border border-dashed border-current/10 bg-current/5 rounded-2xl p-8 text-center opacity-50 text-sm">
            No active projects found. After your proposals are accepted, they will appear here.
          </div>
        ) : (
          <div className="grid gap-4">
            {activeProjects.map((task) => (
              <div key={task._id} className="border border-current/10 bg-current/5 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-current/20">
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-base text-inherit">{task.title}</h3>
                  <p className="text-xs opacity-60 line-clamp-1 max-w-xl">{task.description}</p>
                  <div className="flex items-center gap-3 text-xs pt-1">
                    <span className="bg-current/10 opacity-80 px-2.5 py-1 rounded-md font-medium">{task.category || "Development"}</span>
                    <span className="text-emerald-500 font-bold">${task.budget}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setIsModalOpen(true);
                  }}
                  className="whitespace-nowrap px-4 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 font-semibold rounded-xl text-sm transition border border-orange-500/20 text-center"
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
        <h2 className="text-xl font-bold flex items-center gap-2 text-inherit">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          Completed ({completedProjects.length})
        </h2>

        {completedProjects.length === 0 ? (
          <div className="border border-dashed border-current/10 bg-current/5 rounded-2xl p-8 text-center opacity-50 text-sm">
            No completed tasks yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {completedProjects.map((task) => (
              <div key={task._id} className="border border-current/10 bg-current/5 rounded-2xl p-6 shadow-sm relative space-y-4 transition hover:border-current/20">
                
                <span className="absolute top-6 right-6 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Completed
                </span>

                <div className="space-y-1.5">
                  <h3 className="font-semibold text-base pr-20 text-inherit">{task.title}</h3>
                  <p className="text-xs opacity-60 leading-relaxed max-w-2xl">{task.description}</p>
                  <div className="flex items-center gap-3 text-xs pt-1">
                    <span className="bg-current/10 opacity-80 px-2.5 py-1 rounded-md font-medium">{task.category || "Development"}</span>
                    <span className="text-emerald-500 font-bold">${task.budget}</span>
                  </div>
                </div>

                {task.deliverableUrl && (
                  <div className="pt-3 border-t border-current/10 flex items-center gap-2 text-xs">
                    <span className="opacity-50">Submitted Deliverable:</span>
                    {task.deliverableUrl.startsWith("http") ? (
                      <a
                        href={task.deliverableUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-500 hover:underline font-semibold break-all max-w-md"
                      >
                        {task.deliverableUrl}
                      </a>
                    ) : (
                      <span className="font-semibold break-all max-w-md text-inherit">{task.deliverableUrl}</span>
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