"use client";

import React from "react";
import { X, Trash2, Loader2 } from "lucide-react";

const DeleteTaskModal = ({ task, onClose, onDelete, loading }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      
      <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-[#0f172a] shadow-2xl p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-red-500">
            Delete Task
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4">
          
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-gray-300">
              This action cannot be undone.
            </p>

            <p className="mt-2 font-semibold text-white">
              {task?.title}
            </p>
          </div>

          <p className="text-sm text-gray-400">
            Are you sure you want to permanently delete this task?
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Delete
          </button>

        </div>

      </div>
    </div>
  );
};

export default DeleteTaskModal;