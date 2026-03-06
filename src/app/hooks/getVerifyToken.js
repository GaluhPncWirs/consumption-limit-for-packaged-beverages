import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useGetVerifyToken() {
  const [loadingSession, setLoadingSesion] = useState(true);
  const [statusToken, setStatusToken] = useState(false);
  const { push } = useRouter();
  useEffect(() => {
    async function verifyTokenJWT() {
      try {
        const request = await fetch("/api/tokenJWT/verifyToken");
        const response = await request.json();
        const dateNow = Math.floor(Date.now() / 1000);
        if (response.status) {
          setStatusToken(false);
          if (response.data.exp < dateNow) {
            setStatusToken(true);
          }
        }
      } catch (error) {
        console.error("Error occurred while verifying token:", error);
      } finally {
        setLoadingSesion(false);
      }
    }
    verifyTokenJWT();
  }, [push]);
  return { loadingSession, statusToken };
}
