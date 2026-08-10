import { ChartNoAxesColumnIncreasing } from "lucide-react";

type SugarLimitStatusProps = {
  consumed: number;
  limit: number;
};

const statusConfig = {
  safe: {
    container: "bg-emerald-50 border-emerald-100",
    icon: "bg-emerald-100 text-emerald-600",
    progress: "bg-emerald-500",
    text: "text-emerald-700",
    label: "Masih aman",
  },

  warning: {
    container: "bg-amber-50 border-amber-100",
    icon: "bg-amber-100 text-amber-600",
    progress: "bg-amber-500",
    text: "Mulai mendekati batas",
    label: "Perhatikan konsumsi",
  },

  danger: {
    container: "bg-red-50 border-red-100",
    icon: "bg-red-100 text-red-600",
    progress: "bg-red-500",
    text: "Sudah melewati batas",
    label: "Batasi konsumsi gula",
  },
};

export function SugarLimitStatus({ consumed, limit }: SugarLimitStatusProps) {
  const percentage = Math.min((consumed / limit) * 100, 100);

  const remaining = Math.max(limit - consumed, 0);

  const status =
    percentage >= 100 ? "danger" : percentage >= 80 ? "warning" : "safe";

  const config = statusConfig[status];

  return (
    <div
      className={`w-full max-w-xs rounded-2xl border p-4 ${config.container}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${config.icon}`}
          >
            <ChartNoAxesColumnIncreasing className="size-5" />
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500">
              Batas gula harian
            </p>

            <p className="mt-0.5 text-base font-bold text-slate-900">
              {consumed}
              <span className="font-medium text-slate-400"> / {limit} g</span>
            </p>
          </div>
        </div>

        <span
          className={`whitespace-nowrap text-[11px] font-semibold ${config.text}`}
        >
          {Math.round(percentage)}%
        </span>
      </div>

      {/* Progress */}
      <div className="mt-3">
        <div className="h-2 overflow-hidden rounded-full bg-white/80">
          <div
            className={`h-full rounded-full transition-all duration-500 ${config.progress}`}
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>

      {/* Status */}
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className={`text-xs font-medium ${config.text}`}>{config.label}</p>

        <p className="text-xs text-slate-500">
          {remaining > 0 ? `${remaining} g tersisa` : "Tidak ada sisa"}
        </p>
      </div>
    </div>
  );
}
