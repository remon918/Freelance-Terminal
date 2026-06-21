import React from "react";

const TaskCard = ({ task }) => {
  const formattedDate = new Date(task.deadline).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // 🔥 শুধু "Rejected" বাদে বাকি প্রপোজালগুলো ফিল্টার করে কাউন্ট বের করা হচ্ছে
  const activeProposalsCount = task.proposals && Array.isArray(task.proposals)
    ? task.proposals.filter(p => p.status !== "Rejected").length
    : 0;

  return (
    <div
      className="border rounded-2xl p-6 transition-all
                duration-300
                hover:border-teal-400/40
                hover:shadow-[0_0_35px_rgba(45,212,191,0.15)] hover:text-teal-400 cursor-pointer"
    >
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-xl">{task.title}</h2>
        <button className="btn text-green-600 btn-sm">{task.status}</button>
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

      {/* 🔥 এখানে আমাদের নতুন ফিল্টার্ড কাউন্ট ভেরিয়েবলটি বসিয়ে দেওয়া হলো */}
      <div className="text-right mt-4 text-sm text-gray-500">
        Proposals {activeProposalsCount}
      </div>
    </div>
  );
};

export default TaskCard;