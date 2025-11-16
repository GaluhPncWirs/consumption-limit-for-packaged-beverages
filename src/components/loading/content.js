import Image from "next/image";

export default function LoadingCompenent() {
  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="flex justify-center items-center flex-col h-full gap-y-2">
        <div className="text-2xl font-semibold tracking-wider text-slate-200">
          Loading...
        </div>
        <Image
          src="/images/global/loading.png"
          alt="Loading"
          width={200}
          height={200}
          className="animate-[spin_1s_linear_infinite] size-20"
        />
      </div>
    </div>
  );
}
