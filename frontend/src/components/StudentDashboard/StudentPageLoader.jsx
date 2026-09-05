function StudentPageLoader({
  text = "Loading..."
}) {
  return (
    <div className="min-h-[300px] flex items-center justify-center">
      <div className="text-center">

        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

        <p className="mt-4 text-sm text-slate-500">
          {text}
        </p>

      </div>
    </div>
  );
}

export default StudentPageLoader;