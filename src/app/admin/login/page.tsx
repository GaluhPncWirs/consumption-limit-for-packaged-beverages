"use client";
import { useRouter } from "next/navigation";

export default function LoginPageAdmin() {
  const { push } = useRouter();

  function handleLogin(e: any) {
    e.preventDefault();
    const valueEmail = e.currentTarget.email.value;
    const valuePassword = e.currentTarget.password.value;
    push("/admin/dashboard");
  }
  return (
    <div className="h-screen flex justify-center items-center flex-col">
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
