export default function Loading() {
  return (
    <div className="flex w-full h-screen items-center justify-center bg-[#F3EBF6]/30">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-500">Loading Campaign...</p>
      </div>
    </div>
  );
}