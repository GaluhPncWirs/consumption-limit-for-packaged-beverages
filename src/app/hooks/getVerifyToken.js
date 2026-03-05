import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useGetVerifyToken() {
  const [loadingSession, setLoadingSesion] = useState(true);
  const [statusToken, setStatusToken] = useState(false);
  const { push } = useRouter();
  useEffect(() => {
    async function verifyTokenJWT() {
      const request = await fetch("/api/tokenJWT/verifyToken");
      const response = await request.json();
      if (!response.status) {
        toast("❌ Gagal", {
          description: "Token Sudah Expired",
        });
        setStatusToken(false);
        setTimeout(() => {
          push("/calculateCalories");
        }, 3000);
      }
      setStatusToken(true);
      setLoadingSesion(false);
    }
    verifyTokenJWT();
  }, [push]);
  return { loadingSession, statusToken };
}
