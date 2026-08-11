import { useEffect, useState } from "react";

import {
    Search,
    Plus,
    Download,
    Edit,
    Trash2,
} from "lucide-react";

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

function Cameras() {

    const [cameras, setCameras] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [editingCamera, setEditingCamera] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedCamera, setSelectedCamera] = useState(null);

    // ===========================
    // Load Cameras
    // ===========================

    const loadCameras = async () => {
        try {
            const res = await getCameras();
            setCameras(res.data);
        } catch (err) {
            console.error(err);
            alert("Unable to load cameras");
        }
    };

    useEffect(() => {
        loadCameras();
    }, []);

    // ===========================
    // Save Camera
    // ===========================

    const handleSaveCamera = async (camera) => {

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

        } catch (err) {
            console.error(err);
            alert("Unable to save camera");
        }

    };

    // ===========================
    // Delete Camera
    // ===========================

    const handleDelete = async () => {

        try {

            await deleteCamera(selectedCamera.id);

            await loadCameras();

            setDeleteOpen(false);
            setSelectedCamera(null);

        } catch (err) {

            console.error(err);
            alert("Unable to delete camera");

        }

    };
    return (
        <DashboardLayout>

            <PageTitle
                title="Cameras"
                subtitle="Manage CCTV Cameras from one place."
            >
                <div className="flex flex-wrap items-center gap-3">

                    <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                            Total Cameras
                        </p>

                        <h3 className="text-xl font-bold text-slate-900">
                            {cameras.length}
                        </h3>

                    </div>

                    <button
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
                    >
                        <Download size={18} />
                        Export
                    </button>

                    <button
                        onClick={() => {
                            setEditingCamera(null);
                            setOpenModal(true);
                        }}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-medium text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                    >
                        <Plus size={18} />
                        Add Camera
                    </button>

                </div>
            </PageTitle>

            {/* Search */}

            <div className="mb-6">

                <div className="relative w-full max-w-md">

                    <Search
                        size={18}
                        className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500"
                    />

                    <input
                        type="text"
                        placeholder="Search camera..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 py-3 pl-11 pr-4 outline-none transition focus:border-blue-600"
                    />

                </div>

            </div>

            {/* Table */}

            <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">

                <table className="w-full border-separate border-spacing-y-1">

                    <thead className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/80">

                        <tr className="text-left text-slate-600 dark:text-slate-300">

                            <th className="px-6 py-4">
                                Camera
                            </th>

                            <th className="px-6 py-4">
                                URL
                            </th>

                            <th className="px-6 py-4">
                                Location
                            </th>

                            <th className="px-6 py-4">
                                Status
                            </th>

                            <th className="px-6 py-4 text-center">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {cameras
                            .filter(
                                (camera) =>
                                    camera.camera_name
                                        ?.toLowerCase()
                                        .includes(search.toLowerCase()) ||

                                    camera.location
                                        ?.toLowerCase()
                                        .includes(search.toLowerCase())
                            )

                            .map((camera) => (

                                <tr
                                    key={camera.id}
                                    className="transition border-t border-slate-100 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-slate-800/60"
                                >

                                    <td className="px-6 py-5 font-semibold text-slate-900 dark:text-slate-100">

                                        {camera.camera_name}

                                    </td>

                                    <td className="px-6 py-5 text-blue-600 dark:text-blue-400">

                                        {camera.camera_url}

                                    </td>

                                    <td className="px-6 py-5 text-slate-700 dark:text-slate-300">

                                        {camera.location}

                                    </td>

                                    <td className="px-6 py-5">

                                        <span
                                            className={`rounded-full px-3 py-1 text-sm font-medium ${camera.status === "Active"
                                                    ? "bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400"
                                                    : "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400"
                                                }`}
                                        >
                                            {camera.status}
                                        </span>

                                    </td>

                                    <td className="px-6 py-5">

                                        <div className="flex justify-center gap-3">

                                            <button
                                                onClick={() => {
                                                    setEditingCamera(camera);
                                                    setOpenModal(true);
                                                }}
                                                className="rounded-lg p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                                            >
                                                <Edit size={18} />
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setSelectedCamera(camera);
                                                    setDeleteOpen(true);
                                                }}
                                                className="rounded-lg p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                                            >
                                                <Trash2 size={18} />
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                    </tbody>

                </table>

            </div>
            {/* Camera Modal */}

            <CameraModal
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setEditingCamera(null);
                }}
                onSave={handleSaveCamera}
                camera={editingCamera}
            />

            {/* Delete Modal */}

            <DeleteModal
                open={deleteOpen}
                onClose={() => {
                    setDeleteOpen(false);
                    setSelectedCamera(null);
                }}
                onConfirm={handleDelete}
                title="Delete Camera"
                message={`Are you sure you want to delete ${selectedCamera?.camera_name || "this camera"
                    }?`}
            />

        </DashboardLayout>
    );
}

export default Cameras;