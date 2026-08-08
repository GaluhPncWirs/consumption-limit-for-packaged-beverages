import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";
import { HTMLInputTypeAttribute } from "react";

type PropsFloatingLabel = {
  type: HTMLInputTypeAttribute | undefined;
  id: string;
  value: string | number | readonly string[] | undefined;
  label: string;
  Icon?: LucideIcon | undefined;
  desc?: string;
  placeholder?: string;
  min?: number;
  max?: number;
};

export default function FloatingLabel(props: PropsFloatingLabel) {
  const { type, id, value, label, desc, placeholder, min, max, Icon } = props;
  return (
    <div className="relative">
      <Input
        type={type}
        id={id}
        min={min}
        max={max}
        value={value}
        placeholder={placeholder}
        className="peer h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-14 text-sm font-medium text-slate-800 outline-none transition-all hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute flex items-center gap-2 left-4 top-1/2 z-10 -translate-y-1/2 bg-slate-50 px-1 text-sm font-medium text-slate-400 transition-all duration-300 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:bg-white peer-focus:text-xs peer-focus:text-emerald-600 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-500"
      >
        {Icon ? <Icon className="inline size-4" /> : null} {label}
      </label>
      <span className="pointer-events-none absolute right-4 top-1/2 z-10 -translate-y-1/2 text-xs font-medium text-slate-400">
        {desc}
      </span>
    </div>
  );
}
