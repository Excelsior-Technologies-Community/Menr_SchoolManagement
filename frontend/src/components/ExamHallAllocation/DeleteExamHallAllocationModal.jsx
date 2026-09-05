function DeleteExamHallAllocationModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/50
        flex
        items-center
        justify-center
        z-50
        px-4
      "
    >
      <div
        className="
          bg-white
          rounded-xl
          shadow-xl
          w-full
          max-w-md
          p-6
        "
      >
        <h2 className="
          text-2xl
          font-bold
          text-slate-800
        ">
          Delete Exam Hall Allocation
        </h2>

        <p className="
          text-slate-500
          mt-3
        ">
          Are you sure you want to delete
          this Exam Hall Allocation?

          <br />

          This action cannot be undone.
        </p>

        <div className="
          flex
          justify-end
          gap-4
          mt-8
        ">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              px-6
              py-3
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
              px-6
              py-3
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

export default DeleteExamHallAllocationModal;