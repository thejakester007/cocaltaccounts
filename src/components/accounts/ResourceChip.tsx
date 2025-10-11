// ResourceChip.tsx
import clsx from "clsx";

export interface ResourceChipProps {
  label: string;
  value: number | string;
  className?: string;
}

const ResourceChip: React.FC<ResourceChipProps> = ({
  label, 
  value, 
  className
}) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full",
        "px-2.5 py-1 text-xs font-medium",
        "border border-white/10 bg-white/5 text-white/80",
        "ring-1 ring-inset ring-white/5"
        , className)}
    >
      <span className="text-white/60">{label}</span>
      <span className="tabular-nums">{value}</span>
    </span>
  );
};

export default ResourceChip;