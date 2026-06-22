import React from "react";
import { CheckCircle2, Orbit } from "lucide-react"; // আইকনগুলো ইমপোর্ট করা হলো

const TaskCard = ({ task }) => {
  const formattedDate = new Date(task.deadline).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const activeProposalsCount = task.proposals && Array.isArray(task.proposals)
    ? task.proposals.filter(p => p.status?.toLowerCase() !== "rejected").length
    : 0;

  const isCompleted = task.status?.toLowerCase() === "completed";

  return (
    <div
      className="border rounded-2xl p-6 transition-all
                duration-300
                hover:border-teal-400/40
                hover:shadow-[0_0_35px_rgba(45,212,191,0.15)] hover:text-teal-400 cursor-pointer"
    >
      <div className="flex justify-between items-center gap-4">
        <h2 className="font-bold text-xl">{task.title}</h2>
        
        <span
          className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-xl border flex items-center gap-1.5 backdrop-blur-md transition-all whitespace-nowrap ${
            isCompleted
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 size={14} />
          ) : (
            <Orbit size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
          )}
          {task.status}
        </span>
      </div>

      <p className="text-gray-500 mt-2">{task.description}</p>

      <div className="flex gap-4 mt-6 text-sm items-center">
        <span className="bg-gray-100 text-black px-2 py-1 rounded">
          {task.category}
        </span>
        <span>${task.budget}</span>
        <span>
          <p>{formattedDate}</p>
        </span>
      </div>
      <div className="text-right mt-4 text-sm text-gray-500">
        Proposals {activeProposalsCount}
      </div>
    </div>
  );
};

export default TaskCard;