import { useEffect, useRef, useState } from "react";
import PathNavbar from "../pathSidebar/content";

export default function HamburgerMenu() {
  const [isCheked, setIsCheked] = useState(false);
  const clickOutsidePath = useRef(null);

  useEffect(() => {
    function handleOutsideNavbar(event) {
      if (
        clickOutsidePath.current &&
        !clickOutsidePath.current.contains(event.target)
      ) {
        setIsCheked(false);
      }
    }
    window.addEventListener("click", handleOutsideNavbar);
    return () => {
      window.removeEventListener("click", handleOutsideNavbar);
    };
  }, []);

  return (
    <div className="md:hidden" ref={clickOutsidePath}>
      <div className="menu flex flex-col items-center h-5 justify-between top-4 left-5 fixed z-50">
        <input
          type="checkbox"
          checked={isCheked}
          onChange={() => setIsCheked((prev) => !prev)}
          className="size-6 absolute z-20 cursor-pointer opacity-0"
        />
        <span className="block w-6 h-1 bg-black rounded-md transition-all"></span>
        <span className="block w-6 h-1 bg-black rounded-md transition-all"></span>
        <span className="block w-6 h-1 bg-black rounded-md transition-all"></span>
      </div>
      <div
        className={`flex justify-evenly flex-col bg-green-400 transition-all duration-300 text-xl font-semibold rounded-br-lg shadow-lg shadow-slate-800 p-5 pb-10 z-30 fixed h-screen
      ${isCheked ? `translate-x-0` : `-translate-x-full`}`}
      >
        <PathNavbar />
      </div>
    </div>
  );
}
