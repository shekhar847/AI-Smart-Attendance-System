import {
  X,
  TriangleAlert,
} from "lucide-react";

function DeleteModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">

      <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-2xl text-slate-800 dark:text-slate-100">

        {/* Header */}

        <div className="flex items-start justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">

              <TriangleAlert size={28} />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {title}
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                This action cannot be undone.
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
          >
            <X size={22} />
          </button>

        </div>

        {/* Message */}

        <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4">

          <p className="leading-7 text-slate-600 dark:text-slate-300">
            {message}
          </p>

        </div>

        {/* Buttons */}

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 dark:border-slate-700 px-6 py-3 font-semibold transition hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 hover:shadow-lg"
          >
            Delete Student
          </button>

        </div>

      </div>

    </div>
  );
}

export default DeleteModal;