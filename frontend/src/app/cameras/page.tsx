"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Edit, Trash2, Video, MapPin, Activity } from "lucide-react";

import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageTitle from "../../components/PageTitle";
import CameraModal from "../../components/CameraModal";
import DeleteModal from "../../components/DeleteModal";

import {
  getCameras,
  addCamera,
  updateCamera,
  deleteCamera,
} from "../../api/cameraApi";
import { Camera } from "../../types";

export default function CamerasPage() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);

  const loadCameras = async () => {
    try {
      const res = await getCameras();
      setCameras(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Unable to load cameras");
    }
  };

  useEffect(() => {
    loadCameras();
  }, []);

  const handleSaveCamera = async (camera: Partial<Camera>) => {
    try {
      if (camera.id) {
        await updateCamera(camera.id, {
          camera_name: camera.camera_name,
          camera_url: camera.camera_url,
          location: camera.location,
          status: camera.status,
        });
      } else {
        await addCamera({
          camera_name: camera.camera_name,
          camera_url: camera.camera_url,
          location: camera.location,
          status: camera.status,
        });
      }
      await loadCameras();
      setOpenModal(false);
      setEditingCamera(null);
    } catch (err: any) {
      alert("Failed to save camera: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleDelete = async () => {
    if (!selectedCamera) return;
    try {
      await deleteCamera(selectedCamera.id);
      setDeleteOpen(false);
      setSelectedCamera(null);
      loadCameras();
    } catch (err: any) {
      alert("Failed to delete camera: " + (err.response?.data?.detail || err.message));
    }
  };

  const filteredCameras = cameras.filter(
    (c) =>
      c.camera_name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <PageTitle
          title="Surveillance Cameras"
          subtitle="Configure multi-camera telemetry, RTSP streams, and location monitoring points"
        >
          <button
            onClick={() => {
              setEditingCamera(null);
              setOpenModal(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 active:scale-95"
          >
            <Plus size={16} />
            Register Camera
          </button>
        </PageTitle>

        {/* Filter bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search cameras by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-blue-600"
            />
          </div>

          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Active Nodes: <strong>{cameras.filter((c) => c.status === "Active").length}</strong> / {cameras.length}
          </span>
        </div>

        {/* Grid cards of cameras */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCameras.map((camera) => (
            <div
              key={camera.id}
              className="group rounded-3xl glass-card border border-white/40 dark:border-slate-800/80 p-6 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20">
                  <Video size={22} />
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold border ${
                    camera.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      camera.status === "Active" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                    }`}
                  />
                  {camera.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {camera.camera_name}
              </h3>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <MapPin size={15} className="text-slate-400 shrink-0" />
                  <span>{camera.location}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate">
                  {camera.camera_url}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setEditingCamera(camera);
                    setOpenModal(true);
                  }}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Edit Camera"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => {
                    setSelectedCamera(camera);
                    setDeleteOpen(true);
                  }}
                  className="rounded-xl border border-rose-200 dark:border-rose-900/40 p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  title="Delete Camera"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {filteredCameras.length === 0 && (
            <div className="col-span-full rounded-3xl glass-card p-12 text-center text-slate-400">
              <Video size={40} className="mx-auto mb-2 opacity-30" />
              <p className="font-semibold">No cameras configured yet</p>
            </div>
          )}
        </div>

        <CameraModal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setEditingCamera(null);
          }}
          onSave={handleSaveCamera}
          camera={editingCamera}
        />

        <DeleteModal
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDelete}
          title="Delete Camera"
          message={`Are you sure you want to delete ${selectedCamera?.camera_name}?`}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
