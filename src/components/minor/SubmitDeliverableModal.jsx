"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 text-inherit font-sans">
      {/* 🌟 bg-zinc-900 বদলে প্রজেক্টের থিম-অ্যাডাপ্টিভ ব্যাকগ্রাউন্ড দেওয়া হলো */}
      <div className="w-full max-w-[550px] rounded-2xl border border-current/10 bg-current/5 p-6 shadow-2xl backdrop-blur-xl relative mx-4">
        
        {/* Close Button */}
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 opacity-50 hover:opacity-100 transition duration-200 cursor-pointer text-inherit"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <h2 className="text-xl font-extrabold mb-2 text-inherit">Submit Deliverable</h2>
        <p className="text-sm opacity-80 leading-relaxed mb-6">
          Provide a link or details to your completed work for <span className="font-bold text-cyan-500">{task.title}</span>.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold opacity-90 mb-1.5 text-inherit">Deliverable Link / Text</label>
            <input
              type="text" 
              placeholder="Paste your link or submission details here..."
              value={deliverableUrl}
              onChange={(e) => setDeliverableUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-current/20 bg-current/5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm text-inherit placeholder:opacity-50"
              required
            />
            <p className="text-xs opacity-60 mt-1.5">
              You can paste Google Docs, GitHub, Figma links, or any text reference.
            </p>
          </div>

          {/* Warning Note */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <p className="text-xs text-amber-500 leading-relaxed font-normal">
              <span className="font-extrabold text-amber-500">Note:</span> Once you mark this task as completed, the status cannot be reverted. Make sure your work is ready for client review.
            </p>
          </div>

          {error && <p className="text-xs text-rose-500 font-bold">{error}</p>}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-xl border border-current/20 font-bold text-inherit hover:bg-current/10 active:bg-current/10 transition text-center text-sm cursor-pointer disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-zinc-950 font-extrabold shadow-[0_4px_14px_rgba(6,182,212,0.3)] hover:opacity-90 active:scale-[0.98] transition-all text-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                  Submitting...
                </>
              ) : (
                "Mark as Completed"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}