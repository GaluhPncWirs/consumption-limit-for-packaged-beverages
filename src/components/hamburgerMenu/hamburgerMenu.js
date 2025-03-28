import { useEffect, useRef, useState } from "react";
import PathNavbar from "../navbar/pathNavbar";

export default function HamburgerMenu({ props, path }) {
  const [isCheked, setIsCheked] = useState(false);
  const [trueOrFalse, setTrueOrFalse] = useState(false);
  const clickOutsidePath = useRef(null);
  const clickOutsideHamburgerMenu = useRef(null);

  useEffect(() => {
    function handleOutsideNavbar(event) {
      if (
        clickOutsidePath.current &&
        !clickOutsidePath.current.contains(event.target) &&
        clickOutsideHamburgerMenu.current &&
        !clickOutsideHamburgerMenu.current.contains(event.target)
      ) {
        setTrueOrFalse(true);
      }
    }

    window.addEventListener("click", handleOutsideNavbar);

    return () => {
      window.removeEventListener("click", handleOutsideNavbar);
    };
  }, []);

  useEffect(() => {
    if (trueOrFalse) {
      setIsCheked(false);
      setTrueOrFalse(false);
    }
  }, [trueOrFalse]);

  return (
    <div className="flex h-full items-center justify-center sm:hidden">
      <ul
        className={`flex justify-evenly absolute top-16 right-0 h-80 flex-col items-center w-1/2 bg-green-400 -z-10 transition-all duration-300 text-xl font-semibold rounded-bl-lg shadow-lg shadow-slate-800
      ${isCheked ? `translate-x-0` : `translate-x-full`}`}
        ref={clickOutsidePath}
      >
        <PathNavbar props={props} path={path} />
      </ul>
      <div className="menu flex flex-col h-5 justify-between">
        <input
          type="checkbox"
          checked={isCheked}
          onChange={() => {
            setIsCheked((prev) => !prev);
            setTrueOrFalse(false);
          }}
          className="size-5 absolute z-20 cursor-pointer opacity-0"
          ref={clickOutsideHamburgerMenu}
        />
        <span className="block w-5 h-1 bg-black rounded-md transition-all"></span>
        <span className="block w-5 h-1 bg-black rounded-md transition-all"></span>
        <span className="block w-5 h-1 bg-black rounded-md transition-all"></span>
      </div>
    </div>
  );
}
