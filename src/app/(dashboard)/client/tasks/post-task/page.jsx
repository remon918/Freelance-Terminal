"use client";

import { createTask } from "@/lib/actions/tasks";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const TaskPostingPage = () => {
  const { data: session } = authClient.useSession();
  // console.log(session);
  const router = useRouter();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const selectedDate = new Date(formData.get("deadline"));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error("Deadline cannot be in the past");
      return;
    }

    const taskData = {
      title: formData.get("title"),
      category: formData.get("category"),
      description: formData.get("description"),
      budget: Number(formData.get("budget")),
      deadline: formData.get("deadline"),
      clientId: session?.user?.id,
      client_email: session?.user?.email,
      client_name: session?.user?.name,

      status: "open",
      proposals: [],
      deliverable_url: "",
      createdAt: new Date().toISOString(),
    };

    //   console.log(taskData);

    try {
      const res = await createTask(taskData);

      if (res.success && res.insertedId) {
        toast.success("Task posted successfully!");
        e.target.reset();
        router.push("/client/tasks");
      }
    } catch (error) {
      toast.error("Task already exists or posting failed");
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Post a New Task</h1>
        <p className="mt-2 text-base-content/70">
          Post your task and set a budget with payment method to find
          freelancers
        </p>
      </div>

      <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="mb-2 block font-medium">Task Title</label>
            <input
              name="title"
              type="text"
              placeholder="e.g., Design a landing page for my startup"
              className="input input-bordered w-full border-base-300 text-accent-foreground bg-gray-500/30"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block font-medium">Category</label>
            <select
              name="category"
              className="select select-bordered w-full border-base-300 bg-gray-500/30 rounded-md md:w-40"
              required
            >
              <option value="">Select a category</option>
              <option value="Web Development">Web Development</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Graphic Design">Graphic Design</option>
              <option value="Content Writing">Content Writing</option>
              <option value="Digital Marketing">Digital Marketing</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block font-medium">Description</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Provide a detailed description of the task..."
              className="textarea textarea-bordered w-full border-base-300 text-accent-foreground bg-gray-500/30"
              required
            />
          </div>

          {/* Budget + Deadline */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium">Budget (USD)</label>
              <input
                name="budget"
                type="number"
                placeholder="500"
                className="input input-bordered w-full border-base-300 text-white bg-gray-500/30"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Deadline</label>
              <input
                name="deadline"
                type="date"
                min={tomorrow.toISOString().split("T")[0]}
                className="input input-bordered w-full border-base-300 text-accent-foreground bg-gray-500/30"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-2 md:flex-row">
            <button
              type="reset"
              className="btn btn-outline md:w-32 border rounded-lg text-center py-2 transition-all duration-300 hover:bg-gray-100/10 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn flex-1 border-0 bg-cyan-400 text-white hover:bg-cyan-600 rounded-md py-2 transition-all duration-300 cursor-pointer"
            >
              Post Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default TaskPostingPage;
