function DeleteExamMarkModal({
  open,
  loading = false,
  onConfirm,
  onCancel,
}) {

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
        rounded-xl
        shadow-xl
        w-full
        max-w-md
        p-6
      ">

        <h2 className="
          text-xl
          font-bold
          text-slate-800
        ">
          Delete Exam Mark
        </h2>

        <p className="
          text-slate-600
          mt-3
        ">
          Are you sure you want to delete this exam
          mark? This will make the mark inactive.
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
              border
              border-slate-300
              text-slate-700
              hover:bg-slate-100
              transition
              disabled:opacity-50
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
              transition
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
}

export default DeleteExamMarkModal;