import { Loader2 } from "lucide-react";

export default function LoadingCompenent() {
  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="flex justify-center items-center flex-col h-full gap-y-2">
        <div className="text-2xl font-semibold tracking-wider text-slate-200">
          Loading
        </div>
        <Loader2 className="animate-spin" size={48} color="#e5e7eb" />
      </div>
    </div>
  );
}
