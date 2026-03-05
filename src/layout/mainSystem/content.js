import { useLocationPage } from "@/store/usePathname/state";
import HamburgerMenu from "@/components/hamburgerMenu/hamburgerMenu";
import PathNavbar from "@/components/pathSidebar/content";
import { useEffect } from "react";
import { useGetVerifyToken } from "@/app/hooks/getVerifyToken";
import { Loader2 } from "lucide-react";

export default function MainContentLayout({ children, path }) {
  const currentPathname = useLocationPage((func) => func.setCurrrentLocation);
  const { loadingSession, statusToken } = useGetVerifyToken();
  useEffect(() => {
    currentPathname(path);
  }, [path, currentPathname]);
  return (
    <div className="flex relative">
      <div className="md:w-1/4 xl:w-80">
        <div className="bg-green-400 h-screen shadow-lg shadow-slate-700 fixed hidden md:w-1/4 md:block xl:w-80">
          <PathNavbar />
        </div>
        <HamburgerMenu />
      </div>
      <div className="w-11/12 mx-auto md:w-2/3 xl:w-[57rem]">{children}</div>
      <div
        className={`${
          loadingSession && `bg-black/50 animate-pulse absolute z-50 size-full`
        }`}
      >
        <h1>loading</h1>
        <Loader2 />
      </div>
    </div>
  );
}
