import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";

export default function ButtonBack({ path }) {
  const { push } = useRouter();
  async function backToCalculateCalories() {
    const req = await fetch("/api/delCookies", {
      method: "DELETE",
      credentials: "include",
    });
    const res = await req.json();
    if (res.status) {
      localStorage.removeItem("maxSugarUser");
      toast("✅ Berhasil", {
        description: "Kembali ke Perhitungan Kalori",
      });
      push("/");
    }
  }
  return (
    <>
      {path === "/mainContent/addProduct" || path === "/mainContent/about" ? (
        <button
          className="py-2 px-5 hover:bg-yellow-400 bg-yellow-300 rounded-xl flex flex-row-reverse justify-center items-center gap-x-2 cursor-pointer"
          onClick={() => push("/mainContent/calculate")}
        >
          <span>Kembali</span>
          <Image
            src="/images/global/arrow_left.png"
            alt="arrow_left"
            className="size-9"
            width={200}
            height={200}
          />
        </button>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <button className="py-2 px-5 hover:bg-yellow-400 bg-yellow-300 rounded-xl flex flex-row-reverse justify-center items-center gap-x-2 cursor-pointer">
              <span>Kembali</span>
              <Image
                src="/images/global/arrow_left.png"
                alt="arrow_left"
                className="size-9"
                width={200}
                height={200}
              />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Keluar</DialogTitle>
              <DialogDescription>
                Apakah kamu ingin kembali ke halaman awal ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Batal</Button>
              </DialogClose>
              <Button
                onClick={backToCalculateCalories}
                className="bg-[#54C392] hover:bg-green-500 text-black"
              >
                Oke
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
