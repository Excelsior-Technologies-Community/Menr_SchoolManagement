import React from "react";

const DeleteExamResultModal = ({
  open,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) {
    return null;
  }

  return (
    <div className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/50
      px-4
    ">
      <div className="
        bg-white
        w-full
        max-w-md
        rounded-2xl
        shadow-2xl
        p-6
      ">
        <div className="
          w-12
          h-12
          rounded-full
          bg-red-100
          flex
          items-center
          justify-center
          mb-4
        ">
          <span className="
            text-red-600
            text-xl
            font-bold
          ">
            !
          </span>
        </div>

        <h2 className="
          text-xl
          font-bold
          text-slate-800
        ">
          Delete Exam Result?
        </h2>

        <p className="
          text-slate-500
          mt-2
          leading-6
        ">
          Are you sure you want to delete this
          exam result? The result will be marked
          inactive.
        </p>

        <div className="
          flex
          justify-end
          gap-3
          mt-6
        ">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="
              px-5
              py-2.5
              rounded-lg
              bg-slate-200
              hover:bg-slate-300
              text-slate-700
              font-semibold
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="
              px-5
              py-2.5
              rounded-lg
              bg-red-600
              hover:bg-red-700
              text-white
              font-semibold
              disabled:opacity-50
            "
          >
            {loading
              ? "Deleting..."
              : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteExamResultModal;