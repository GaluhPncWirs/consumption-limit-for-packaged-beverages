export default function LayoutModalVertical({ children }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-30">
      <div
        className="bg-green-500 w-1/3 rounded-xl max-h-[80vh] pt-2
    absolute top-1/2 left-1/2 z-40 -translate-x-1/2 -translate-y-1/2 
    max-[640px]:w-9/12 sm:w-3/5 md:w-1/2 lg:w-1/3"
      >
        <div className="h-full">{children}</div>
      </div>
    </div>
  );
}
