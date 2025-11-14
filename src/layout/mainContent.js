import HamburgerMenu from "@/components/hamburgerMenu/hamburgerMenu";
import PathNavbar from "@/components/navbar/pathNavbar";

export default function MainContentLayout({ children, path }) {
  return (
    <div className="flex">
      <div className="md:w-1/4">
        <div className="bg-green-400 h-screen shadow-lg shadow-slate-700 fixed w-1/4 hidden md:block">
          <PathNavbar path={path} />
        </div>
        <HamburgerMenu path={path} />
      </div>
      <div className="w-11/12 md:w-2/3 mx-auto">{children}</div>
    </div>
  );
}
