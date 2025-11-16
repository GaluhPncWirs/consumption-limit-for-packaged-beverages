import HamburgerMenu from "@/components/hamburgerMenu/hamburgerMenu";
import PathNavbar from "@/components/sidebar/pathNavbar";

export default function MainContentLayout({ children, path }) {
  return (
    <div className="flex">
      <div className="md:w-1/4">
        <div className="bg-green-400 h-screen shadow-lg shadow-slate-700 fixed hidden md:w-1/4 md:block">
          <PathNavbar path={path} />
        </div>
        <HamburgerMenu path={path} />
      </div>
      <div className="w-11/12 md:w-2/3 mx-auto">{children}</div>
    </div>
  );
}
