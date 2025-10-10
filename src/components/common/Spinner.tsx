export default function Spinner({
  label = "Loading…",
  fullScreen = false,
}: { label?: string; fullScreen?: boolean }) {
  return (
    <div className="relative min-h-[60vh] w-full">
      <div className="absolute inset-0 grid place-items-center">
        <div className="flex flex-col items-center gap-3 text-white/80">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <span className="text-sm">{label}</span>
        </div>
      </div>
    </div>
  );
}