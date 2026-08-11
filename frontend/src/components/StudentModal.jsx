import { useEffect, useState } from "react";
import { X } from "lucide-react";

function StudentModal({
  open,
  onClose,
  onSave,
  student,
}) {
  const [form, setForm] = useState({
    name: "",
    roll: "",
    department: "",
    year: "",
    email: "",
    phone: "",
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  // ==========================================
  // LOAD / RESET STUDENT DATA
  // ==========================================

  useEffect(() => {
    if (!open) {
      return;
    }

    if (student) {
      setForm({
        name: student.name || "",
        roll: student.roll || "",
        department: student.department || "",
        year: student.year || "",
        email: student.email || "",
        phone: student.phone || "",
      });

      setPhoto(null);

      if (student.photo) {
        setPhotoPreview(
          `http://127.0.0.1:8000/${student.photo}`
        );
      } else {
        setPhotoPreview(null);
      }
    } else {
      setForm({
        name: "",
        roll: "",
        department: "",
        year: "",
        email: "",
        phone: "",
      });

      setPhoto(null);
      setPhotoPreview(null);
    }

    setErrors({});
  }, [student, open]);

  // ==========================================
  // PHOTO CHANGE
  // ==========================================

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Check image type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        photo: "Please select a valid image file.",
      }));

      return;
    }

    // Optional size validation: 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        photo: "Image size must be less than 5 MB.",
      }));

      return;
    }

    // Store file
    setPhoto(file);

    // Create preview
    const previewUrl = URL.createObjectURL(file);

    setPhotoPreview(previewUrl);

    // Remove photo error
    setErrors((prev) => ({
      ...prev,
      photo: "",
    }));
  };

  // ==========================================
  // SAVE
  // ==========================================

  const handleSave = () => {
    const newErrors = {};

    // Name
    if (!form.name.trim()) {
      newErrors.name = "Full Name is required";
    }

    // Roll
    if (!form.roll.trim()) {
      newErrors.roll = "Roll Number is required";
    }

    // Department
    if (!form.department.trim()) {
      newErrors.department = "Department is required";
    }

    // Year
    if (!form.year.trim()) {
      newErrors.year = "Year is required";
    }

    // Photo required only for NEW student
    if (!student && !photo) {
      newErrors.photo = "Student photo is required";
    }

    // Stop if errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Send data to Students.jsx
    onSave({
      ...form,
      id: student?.id,
      photo: photo,
    });
  };

  // ==========================================
  // CLOSE
  // ==========================================

  const handleClose = () => {
    setErrors({});
    setPhoto(null);
    setPhotoPreview(null);

    onClose();
  };

  // ==========================================
  // MODAL CLOSED
  // ==========================================

  if (!open) {
    return null;
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          max-h-[90vh]
          w-full
          max-w-4xl
          overflow-y-auto
          rounded-3xl
          bg-white
          dark:bg-slate-900
          border
          border-slate-200
          dark:border-slate-800
          text-slate-800
          dark:text-slate-100
          p-6
          shadow-2xl
          md:p-8
        "
      >
        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {student
                ? "Edit Student"
                : "Add New Student"}
            </h2>

            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Fill the student details below.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="
              rounded-xl
              p-2
              text-slate-600
              dark:text-slate-400
              transition
              hover:bg-slate-100
              dark:hover:bg-slate-800
              hover:text-slate-900
              dark:hover:text-slate-100
            "
          >
            <X size={24} />
          </button>
        </div>

        {/* ==========================================
            FORM
        ========================================== */}

        <div className="grid gap-5 md:grid-cols-2">
          {/* NAME */}

          <Input
            label="Full Name"
            placeholder="Rahul Kumar"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            error={errors.name}
          />

          {/* ROLL */}

          <Input
            label="Roll Number"
            placeholder="CS101"
            value={form.roll}
            onChange={(e) =>
              setForm({
                ...form,
                roll: e.target.value,
              })
            }
            error={errors.roll}
          />

          {/* DEPARTMENT */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Department
            </label>

            <select
              value={form.department}
              onChange={(e) =>
                setForm({
                  ...form,
                  department: e.target.value,
                })
              }
              className={`
                w-full
                rounded-xl
                border
                bg-white
                dark:bg-slate-800
                text-slate-800
                dark:text-slate-100
                px-4
                py-3
                outline-none
                transition
                ${
                  errors.department
                    ? "border-red-500"
                    : "border-slate-300 dark:border-slate-700 focus:border-blue-600"
                }
              `}
            >
              <option value="">
                Select Department
              </option>

              <option value="BCA">
                BCA
              </option>

              <option value="B.Tech">
                B.Tech
              </option>

              <option value="MCA">
                MCA
              </option>

              <option value="Computer Science">
                Computer Science
              </option>

              <option value="Information Technology">
                Information Technology
              </option>
            </select>

            {errors.department && (
              <p className="mt-2 text-sm text-red-500">
                {errors.department}
              </p>
            )}
          </div>

          {/* YEAR */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Year
            </label>

            <select
              value={form.year}
              onChange={(e) =>
                setForm({
                  ...form,
                  year: e.target.value,
                })
              }
              className={`
                w-full
                rounded-xl
                border
                bg-white
                dark:bg-slate-800
                text-slate-800
                dark:text-slate-100
                px-4
                py-3
                outline-none
                transition
                ${
                  errors.year
                    ? "border-red-500"
                    : "border-slate-300 dark:border-slate-700 focus:border-blue-600"
                }
              `}
            >
              <option value="">
                Select Year
              </option>

              <option value="1st Year">
                1st Year
              </option>

              <option value="2nd Year">
                2nd Year
              </option>

              <option value="3rd Year">
                3rd Year
              </option>

              <option value="Final Year">
                Final Year
              </option>
            </select>

            {errors.year && (
              <p className="mt-2 text-sm text-red-500">
                {errors.year}
              </p>
            )}
          </div>

          {/* EMAIL */}

          <Input
            label="Email"
            placeholder="rahul@gmail.com"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            error={errors.email}
          />

          {/* PHONE */}

          <Input
            label="Phone"
            placeholder="+91 9876543210"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
            error={errors.phone}
          />
        </div>

        {/* ==========================================
            PHOTO UPLOAD
        ========================================== */}

        <div className="mt-8">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Student Photo
          </label>

          <label
            className={`
              flex
              cursor-pointer
              flex-col
              items-center
              justify-center
              rounded-2xl
              border-2
              border-dashed
              px-6
              py-8
              transition
              ${
                errors.photo
                  ? "border-red-400 bg-red-50 dark:bg-red-950/40"
                  : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30"
              }
            `}
          >
            {/* PREVIEW */}

            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Student Preview"
                className="
                  mb-4
                  h-40
                  w-40
                  rounded-full
                  border-4
                  border-blue-500
                  object-cover
                  shadow-lg
                "
              />
            ) : (
              <div className="text-5xl">
                📷
              </div>
            )}

            {/* FILE NAME */}

            <h3 className="mt-3 text-center font-semibold text-slate-700 dark:text-slate-300">
              {photo
                ? photo.name
                : student?.photo
                ? "Current Student Photo"
                : "Upload Student Photo"}
            </h3>

            <p className="mt-1 text-center text-sm text-slate-500 dark:text-slate-400">
              Click to browse or drag & drop
            </p>

            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              JPG, JPEG, PNG — Maximum 5 MB
            </p>

            {/* FILE INPUT */}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </label>

          {/* PHOTO ERROR */}

          {errors.photo && (
            <p className="mt-2 text-sm font-medium text-red-500">
              {errors.photo}
            </p>
          )}
        </div>

        {/* ==========================================
            BUTTONS
        ========================================== */}

        <div className="mt-8 flex justify-end gap-3">
          {/* CANCEL */}

          <button
            type="button"
            onClick={handleClose}
            className="
              rounded-xl
              border
              border-slate-300
              dark:border-slate-700
              px-6
              py-3
              font-medium
              text-slate-700
              dark:text-slate-300
              transition
              hover:bg-slate-100
              dark:hover:bg-slate-800
            "
          >
            Cancel
          </button>

          {/* SAVE */}

          <button
            type="button"
            onClick={handleSave}
            className="
              rounded-xl
              bg-blue-600
              px-6
              py-3
              font-medium
              text-white
              shadow-lg
              transition
              hover:bg-blue-700
            "
          >
            {student
              ? "Update Student"
              : "Save Student"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// INPUT COMPONENT
// ==========================================

function Input({
  label,
  placeholder,
  value,
  onChange,
  error,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full
          rounded-xl
          border
          bg-white
          dark:bg-slate-800
          text-slate-900
          dark:text-slate-100
          px-4
          py-3
          outline-none
          transition
          ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-slate-300 dark:border-slate-700 focus:border-blue-600"
          }
        `}
      />

      {error && (
        <p className="mt-2 text-sm font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default StudentModal;