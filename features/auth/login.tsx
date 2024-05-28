"use client";

import { useForm } from "react-hook-form";
import logo from "@/public/logo.svg";
import Image from "next/image";
import SubmitBtn from "@/components/ui/submit-btn";
import useAuth from "@/lib/hooks/useAuth";
import PasswordField from "@/components/ui/password-input";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const { handleLogin } = useAuth();

  return (
    <main className="flex bg-white h-screen items-center justify-center px-6 py-12 lg:px-8">
      <div className="p-5 max-w-[600px] w-full">
        <div className="py-5 mb-8 flex items-center justify-center">
          <Image src={logo} alt="Logo" className="w-[80px] object-contain" />
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(handleLogin)}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                {...register("email", {
                  required: true,
                })}
                placeholder="Enter your email address"
                className="block w-full border border-gray-200 focus:ring-0 focus:border-black duration-200 rounded-md py-3 px-4 sm:text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="/auth/forget-password"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-1">
              <PasswordField
                {...register("password", {
                  required: true,
                })}
              />
            </div>
          </div>
          <SubmitBtn isSubmitting={isSubmitting}>Sign in</SubmitBtn>
        </form>
        <p className="mt-3 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <a
            href="/auth/signup"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Create an account
          </a>
        </p>
      </div>
    </main>
  );
}
