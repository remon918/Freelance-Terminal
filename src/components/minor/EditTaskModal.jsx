"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { X, Loader2 } from "lucide-react";
import { updateTask } from "@/lib/actions/actions";

const EditTaskModal = ({ task, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    budget: task?.budget || "",
    deadline: task?.deadline ? task.deadline.split("T")[0] : "",
    category: task?.category || "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    console.log("Task ID:", task._id);
    console.log("Form Data:", formData);

    const result = await updateTask(task._id, formData);

    console.log("Update Result:", result);

    if (result.success) {
      toast.success("Task updated");

      onSuccess({
        ...task,
        ...formData,
      });
    } else {
      toast.error(result.message || "Update failed");
    }
  } catch (error) {
    console.error("Update Error:", error);
    toast.error("Failed to update task");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-700 bg-[#0f172a] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Edit Task</h2>

          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm block mb-2">Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-700 rounded-xl px-4 py-3 bg-transparent"
              required
            />
          </div>

          <div>
            <label className="text-sm block mb-2">Description</label>

            <textarea
              rows={5}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-700 rounded-xl px-4 py-3 bg-transparent resize-none"
              required
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm block mb-2">Budget</label>

              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full border border-gray-700 rounded-xl px-4 py-3 bg-transparent"
                required
              />
            </div>

            <div>
              <label className="text-sm block mb-2">Deadline</label>

              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full border border-gray-700 rounded-xl px-4 py-3 bg-transparent"
                required
              />
            </div>

            <div>
              <label className="text-sm block mb-2">Category</label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-700 rounded-xl px-4 py-3 bg-transparent"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl border border-gray-700"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
