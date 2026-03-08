import { useLocationPage } from "@/store/usePathname/state";
import HamburgerMenu from "@/components/hamburgerMenu/hamburgerMenu";
import PathNavbar from "@/components/pathSidebar/content";
import { useEffect } from "react";
import { useGetVerifyToken } from "@/app/hooks/getVerifyToken";
import LoadingCompenent from "@/components/loading/content";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDeleteToken } from "@/store/useDeleteToken/state";
import { useShallow } from "zustand/shallow";

export default function MainContentLayout({ children, path }) {
  const currentPathname = useLocationPage((func) => func.setCurrrentLocation);
  const { loadingSession, statusToken } = useGetVerifyToken();
  const { push } = useRouter();

  const { setDeleteToken, isDeleteToken } = useDeleteToken(
    useShallow((state) => ({
      setDeleteToken: state.setDeleteToken,
      isDeleteToken: state.isDeleteSuccess,
    })),
  );

  console.log(isDeleteToken);

  useEffect(() => {
    setDeleteToken(statusToken);
    if (statusToken) {
      toast("Token sudah expired", {
        description: "Silahkan input kembali untuk melanjutkan",
      });
      setTimeout(() => {
        push("/calculateCalories");
      }, 3000);
    }
  }, [setDeleteToken, statusToken, isDeleteToken, push]);

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
      {loadingSession && <LoadingCompenent />}
    </div>
  );
}
