"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Camera as CameraIcon } from "lucide-react";
import { Camera } from "../types";

interface CameraModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (camera: Partial<Camera>) => void;
  camera: Camera | null;
}

export default function CameraModal({
  open,
  onClose,
  onSave,
  camera,
}: CameraModalProps) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<{
    camera_name: string;
    camera_url: string;
    location: string;
    status: "Active" | "Inactive";
  }>({
    camera_name: "",
    camera_url: "",
    location: "",
    status: "Active",
  });

  useEffect(() => {
    setMounted(true);
    if (camera) {
      setForm({
        camera_name: camera.camera_name || "",
        camera_url: camera.camera_url || "",
        location: camera.location || "",
        status: camera.status || "Active",
      });
    } else {
      setForm({
        camera_name: "",
        camera_url: "",
        location: "",
        status: "Active",
      });
    }
  }, [camera, open]);

  if (!open || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(camera || {}),
      ...form,
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-slate-800 p-6 md:p-7 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c8f135] text-slate-950 font-bold shadow-md shadow-[#c8f135]/25">
              <CameraIcon size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {camera ? "Edit Surveillance Camera" : "Register New Camera"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Camera Name
            </label>
            <input
              type="text"
              placeholder="e.g. Main Entrance Gate 1"
              value={form.camera_name}
              onChange={(e) =>
                setForm({ ...form, camera_name: e.target.value })
              }
              required
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Stream / RTSP / Web URL
            </label>
            <input
              type="text"
              placeholder="rtsp://192.168.1.100:554/stream or 0"
              value={form.camera_url}
              onChange={(e) =>
                setForm({ ...form, camera_url: e.target.value })
              }
              required
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-600 font-mono"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Physical Location
            </label>
            <input
              type="text"
              placeholder="e.g. Block A, 2nd Floor Corridor"
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
              required
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Operational Status
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as "Active" | "Inactive",
                })
              }
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-600"
            >
              <option value="Active">Active / Online</option>
              <option value="Inactive">Inactive / Maintenance</option>
            </select>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 dark:border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#c8f135] px-6 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-[#c8f135]/25 transition hover:bg-[#b5e028] active:scale-95"
            >
              Save Camera
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
