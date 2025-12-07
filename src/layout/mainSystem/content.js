import { useLocationPage } from "@/app/stateManagement/pathname/state";
import HamburgerMenu from "@/components/hamburgerMenu/hamburgerMenu";
import PathNavbar from "@/components/pathSidebar/content";
import { useEffect } from "react";

export default function MainContentLayout({ children, path }) {
  const curPathname = useLocationPage((func) => func.executefunc);
  useEffect(() => {
    curPathname(path);
  }, [path, curPathname]);
  return (
    <div className="flex">
      <div className="md:w-1/4 xl:w-80">
        <div className="bg-green-400 h-screen shadow-lg shadow-slate-700 fixed hidden md:w-1/4 md:block xl:w-80">
          <PathNavbar />
        </div>
        <HamburgerMenu />
      </div>
      <div className="w-11/12 mx-auto md:w-2/3 xl:w-[57rem]">{children}</div>
    </div>
  );
}
