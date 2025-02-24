export default function LayoutModalHorizontal({
  children,
  description,
  modalTitle,
}) {
  return (
    <div className="bg-green-500 w-1/3 rounded-xl absolute top-1/2 left-1/2 h-1/3 z-30 -translate-x-1/2 -translate-y-1/2 max-[640px]:w-9/12 sm:w-3/5 md:w-1/2 lg:w-2/5">
      <div className="flex justify-center items-center h-3/4 gap-8 max-[640px]:px-5 sm:px-6 md:px-8 lg:px-10">
        <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-300">
          <svg
            className="size-9 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
            data-slot="icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>
        <div className="w-full">
          <h1 className="font-bold text-xl">{modalTitle}</h1>
          <p className="font-medium mt-3">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
