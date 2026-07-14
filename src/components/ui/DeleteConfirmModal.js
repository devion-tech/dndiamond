"use client";

import React from "react";
import { FaTrashAlt, FaTimes } from "react-icons/fa";

function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, message, loading }) {
  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50 transition-opacity duration-300"
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-sm p-8 shadow-2xl z-50 rounded-3xl border border-neutral-100 text-left animate-fade-in font-sans">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-4 mb-6">
          <span className="text-xs font-bold tracking-[0.25em] text-neutral-800 uppercase">
            {title || "Confirm Delete"}
          </span>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-900 transition-colors p-1 cursor-pointer bg-transparent border-0"
            aria-label="Close"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <div className="flex flex-col items-center text-center space-y-4 mb-6">
          <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center">
            <FaTrashAlt className="text-red-500 text-lg" />
          </div>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            {message || "Are you sure you want to delete this address? This action cannot be undone."}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer border-0 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer border-0 transition-all ${
              loading
                ? "bg-red-300 text-white cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {loading ? (
              <>
                <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default DeleteConfirmModal;
