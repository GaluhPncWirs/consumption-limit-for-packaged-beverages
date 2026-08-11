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
  const { loadingSession, statusToken } = useGetVerifyToken();
  const { push } = useRouter();

  const { setDeleteToken, isDeleteToken } = useDeleteToken(
    useShallow((state) => ({
      setDeleteToken: state.setDeleteToken,
      isDeleteToken: state.isDeleteSuccess,
    })),
  );

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

  return (
    <div className="relative flex min-h-screen">
      <aside className="hidden md:block md:w-64 xl:w-72">
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col border-r border-emerald-500/20 bg-emerald-400 xl:w-72">
          <PathNavbar pathName={path} />
        </div>
      </aside>

      {/* Mobile */}
      <HamburgerMenu />

      {/* Main Content */}
      <div className="min-w-0 flex-1">
        <div className="mx-auto w-11/12 max-w-7xl py-6">{children}</div>
      </div>

      {loadingSession && <LoadingCompenent />}
    </div>
  );
}
