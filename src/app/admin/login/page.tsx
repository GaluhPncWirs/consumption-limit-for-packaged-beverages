"use client";
import { subscribeToLoginAdmin } from "@/lib/firebase/services";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

export default function LoginPageAdmin() {
  const { push } = useRouter();
  const [loginAdmin, setLoginAdmin] = useState<any>([]);

  useEffect(() => {
    const unsubscribeDataProductBeverage = subscribeToLoginAdmin(
      (dataAdmin) => {
        setLoginAdmin(dataAdmin);
      }
    );
    return () => unsubscribeDataProductBeverage();
  }, []);

  function handleLogin(e: any) {
    e.preventDefault();
    const valueEmail = e.currentTarget.email.value;
    const valuePassword = e.currentTarget.password.value;

    if (
      loginAdmin[0].email === valueEmail &&
      loginAdmin[0].password === valuePassword
    ) {
      push("/admin/dashboard");
      document.cookie = "isLogin=true;";
    } else {
      toast("Gagal Login ❎", {
        description: `Mungkin Dari Salah Satu Yang Kamu Inputkan Salah`,
      });
    }
  }

  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <Toaster />
      <div className="bg-[#73EC8B] w-2/5 py-10 rounded-xl inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/10 shadow-lg shadow-slate-700">
        <h1 className="text-3xl font-bold text-center mb-5 text-green-800">
          Login Admin
        </h1>
        <form
          className="flex justify-center flex-col w-3/4 gap-3 mx-auto"
          onSubmit={(e) => handleLogin(e)}
        >
          <label
            htmlFor="email"
            className="text-xl font-semibold text-green-800"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full rounded-md p-3 bg-green-200"
          />
          <label
            htmlFor="password"
            className="text-xl font-semibold text-green-800"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full rounded-md p-3 bg-green-200"
          />
          <button
            className="bg-green-400 rounded-md w-full py-1.5 mt-3 hover:bg-green-500 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-slate-700 font-semibold"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
