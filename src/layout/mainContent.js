import PathNavbar from "@/components/navbar/pathNavbar";
import Image from "next/image";

export default function MainContentLayout({ children, path }) {
  return (
    <div className="flex">
      <div className="w-1/4">
        <div className="bg-green-400 h-screen shadow-lg shadow-slate-700 fixed w-1/4">
          <div className="flex flex-col items-center mt-10">
            <Image
              src="/images/global/logo.png"
              alt="logo"
              width={300}
              height={300}
              className="w-60 bg-[#f9fff9] rounded-lg p-3 shadow-lg shadow-slate-600"
            />

            <div className="mt-14 flex flex-col text-2xl font-semibold gap-y-10">
              <PathNavbar path={path} />
            </div>
          </div>
        </div>
      </div>
      <div className="w-11/12 md:w-2/3 mx-auto">{children}</div>
    </div>
  );
}
