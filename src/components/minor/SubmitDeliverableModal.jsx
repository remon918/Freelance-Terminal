"use client";

import { useState } from "react";

export default function SubmitDeliverableModal({ isOpen, onClose, task, onSubmissionSuccess }) {
  const [deliverableUrl, setDeliverableUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !task) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!deliverableUrl.trim()) {
      setError("Please provide a deliverable submission.");
      return;
    }

    setLoading(true);
    setError("");

    // Environment Variable ব্যবহার করা হয়েছে
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
      const response = await fetch(`${apiUrl}/api/tasks/complete/${task._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deliverableUrl }),
      });

      const data = await response.json();

      if (data.success) {
        setDeliverableUrl("");
        onSubmissionSuccess(); 
        onClose(); 
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-[550px] rounded-2xl bg-white p-6 shadow-xl border border-gray-100 relative mx-4">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Submit Deliverable</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Provide a link or details to your completed work for <span className="font-medium text-gray-700">{task.title}</span>.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Deliverable Link / Text</label>
            <input
              type="text" 
              placeholder="Paste your link or submission details here..."
              value={deliverableUrl}
              onChange={(e) => setDeliverableUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-gray-800 placeholder-gray-400 bg-white shadow-sm transition-all"
              required
            />
            <p className="text-xs text-gray-400 mt-1.5">
              You can paste Google Docs, GitHub, Figma links, or any text reference.
            </p>
          </div>

          {/* Warning Note */}
          <div className="bg-orange-50/70 border border-orange-100 rounded-xl p-4">
            <p className="text-xs text-amber-600 leading-relaxed font-normal">
              <span className="font-semibold text-amber-700">Note:</span> Once you mark this task as completed, the status cannot be reverted. Make sure your work is ready for client review.
            </p>
          </div>

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors text-center text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-[#56C596] hover:bg-[#4bb387] text-white font-medium shadow-sm transition-all text-sm disabled:opacity-70"
            >
              {loading ? "Submitting..." : "Mark as Completed"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}