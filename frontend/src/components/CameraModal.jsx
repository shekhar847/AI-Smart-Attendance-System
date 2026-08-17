import { useEffect, useState } from "react";

function CameraModal({ open, onClose, onSave, camera }) {
    const [form, setForm] = useState({
        camera_name: "",
        camera_url: "",
        location: "",
        status: "Active",
    });

    useEffect(() => {
        if (camera) {
            setForm(camera);
        } else {
            setForm({
                camera_name: "",
                camera_url: "",
                location: "",
                status: "Active",
            });
        }
    }, [camera, open]);

    if (!open) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        onSave({
            ...(camera || {}),
            ...form,
        });
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <div className="w-full max-w-md rounded-3xl glass-card border border-white/40 dark:border-slate-800 p-6 md:p-7 shadow-2xl">

                <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {camera ? "Edit Camera" : "Add Camera"}
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <input
                        type="text"
                        placeholder="Camera Name"
                        value={form.camera_name}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                camera_name: e.target.value,
                            })
                        }
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 p-3 outline-none focus:border-blue-500"
                        required
                    />

                    <input
                        type="text"
                        placeholder="Camera URL"
                        value={form.camera_url}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                camera_url: e.target.value,
                            })
                        }
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 p-3 outline-none focus:border-blue-500"
                        required
                    />

                    <input
                        type="text"
                        placeholder="Location"
                        value={form.location}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                location: e.target.value,
                            })
                        }
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 p-3 outline-none focus:border-blue-500"
                        required
                    />

                    <select
                        value={form.status}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                status: e.target.value,
                            })
                        }
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-3 outline-none focus:border-blue-500"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>

                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-5 py-2"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                        >
                            Save
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default CameraModal;