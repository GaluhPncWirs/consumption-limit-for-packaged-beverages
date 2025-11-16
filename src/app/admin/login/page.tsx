"use client";
import { subscribeToLoginAdmin } from "@/lib/firebase/services";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
    <div className="h-screen flex justify-center items-center">
      <div className="bg-[#f9fff9] rounded-lg py-7 shadow-lg shadow-slate-700 max-[640px]:w-11/12 sm:w-[30rem]">
        <h1 className="text-center mb-7 text-3xl font-bold tracking-wide">
          Login Admin
        </h1>
        <form
          className="flex justify-center flex-col w-3/4 gap-3 mx-auto"
          onSubmit={(e) => handleLogin(e)}
        >
          <label htmlFor="email" className="text-xl font-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full rounded-md p-3 bg-slate-100"
          />
          <label htmlFor="password" className="text-xl font-semibold">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full rounded-md p-3 bg-slate-100"
          />
          <button
            className="bg-green-400 rounded-md w-full py-2 mt-3 hover:bg-green-500 disabled:cursor-not-allowed cursor-pointer text-xl shadow-md shadow-slate-700 font-semibold"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
