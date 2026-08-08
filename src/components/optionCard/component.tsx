import type { LucideIcon } from "lucide-react";
import { Input } from "../ui/input";

type SelectOptionProps = {
  option: {
    value: string;
    label: string;
    description: string;
    icon: LucideIcon;
  };
  isSelected: boolean;
  onChange: (value: string) => void;
};

export function SelectOption({
  option,
  isSelected,
  onChange,
}: SelectOptionProps) {
  const Icon = option.icon;

  return (
    <label
      className={`group flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all ${
        isSelected
          ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <Input
        type="radio"
        name="gender"
        value={option.value}
        className="sr-only"
        checked={isSelected}
        onChange={() => onChange(option.value)}
      />

      {/* Icon */}
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
          isSelected
            ? "bg-emerald-500 text-white"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        <Icon className="size-5" />
      </div>

      {/* Label */}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800">{option.label}</p>

        <p className="text-xs text-slate-500">{option.description}</p>
      </div>

      {/* Indicator */}
      <div
        className={`ml-auto flex size-5 shrink-0 items-center justify-center rounded-full border ${
          isSelected ? "border-emerald-500 bg-emerald-500" : "border-slate-300"
        }`}
      >
        {isSelected && <div className="size-2 rounded-full bg-white" />}
      </div>
    </label>
  );
}
