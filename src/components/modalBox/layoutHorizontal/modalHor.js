import IconWarning from "@/components/warningIcon/icon";

export default function LayoutModalHorizontal({
  children,
  description,
  modalTitle,
}) {
  return (
    <div className="h-full w-full absolute inset-0 bg-black/50">
      <div className="bg-[#4ADE80] w-1/3 rounded-xl absolute top-1/2 left-1/2 h-1/3 z-40 -translate-x-1/2 -translate-y-1/2 max-[640px]:w-9/12 sm:w-3/5 md:w-1/2 lg:w-2/5 shadow-lg shadow-slate-700">
        <div className="flex justify-center items-center h-3/4 gap-8 max-[640px]:px-5 sm:px-6 md:px-8 lg:px-10">
          <IconWarning />
          <div className="w-full">
            <h1 className="font-bold text-xl">{modalTitle}</h1>
            <p className="font-medium mt-3">{description}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
