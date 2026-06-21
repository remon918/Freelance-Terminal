import React from "react";

const RejectTaskModal = ({ isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-neutral-950 border border-gray-500/30 rounded-2xl p-6 max-w-sm w-full mx-4 space-y-4 shadow-xl">
        <h3 className="text-lg font-bold text-gray-100">Reject Proposal?</h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          Are you sure you want to reject this proposal? This action will remove the proposal from your list and update the total count.
        </p>
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold bg-neutral-800 border border-gray-500/20 rounded-xl hover:bg-neutral-700 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Rejecting...
              </>
            ) : (
              "Yes, Reject"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectTaskModal;