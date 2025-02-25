"use client";

import logo from "@/public/logo.svg";
import Image from "next/image";
import { useForm } from "react-hook-form";
import SubmitBtn from "@/components/ui/submit-btn";
import Link from "next/link";
import useAuth from "@/lib/hooks/useAuth";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const { handleForgotPassword } = useAuth();

  return (
    <main className="flex bg-white h-screen items-center justify-center px-6 py-12 lg:px-8">
      <div className="p-5 max-w-[600px] w-full">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="py-5 mb-8 flex items-center justify-center">
            <Image src={logo} alt="Logo" className="w-[80px] object-contain" />
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Reset your password
          </h2>
        </div>
        <form
          className="space-y-6 mt-5"
          onSubmit={handleSubmit(handleForgotPassword)}
        >
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
          <SubmitBtn isSubmitting={isSubmitting}>Continue</SubmitBtn>
        </form>
        <p className="mt-3 text-center text-sm text-gray-500">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Back to login
          </Link>
        </p>
      </div>
    </main>
  );
}
