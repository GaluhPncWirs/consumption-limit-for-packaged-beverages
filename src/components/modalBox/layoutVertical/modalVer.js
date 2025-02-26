export default function LayoutModalVertical({ children }) {
  return (
    <div className="bg-green-500 w-1/3 rounded-xl absolute top-1/2 left-1/2 h-2/5 z-30 -translate-x-1/2 -translate-y-1/2 max-[640px]:w-9/12 sm:w-3/5 md:w-1/2 lg:w-1/3">
      <div className="h-full max-[640px]:px-3 sm:px-4 md:px-5 lg:px-8">
        {children}
      </div>
    </div>
  );
}
