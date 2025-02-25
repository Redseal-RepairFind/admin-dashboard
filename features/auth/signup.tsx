"use client";

import logo from "@/public/logo.svg";
import Image from "next/image";
import SubmitBtn from "@/components/ui/submit-btn";
import useAuth from "@/lib/hooks/useAuth";
import PasswordField from "@/components/ui/password-input";
import { useForm } from "react-hook-form";

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const { handleRegister } = useAuth();

  return (
    <main className="flex bg-white h-screen items-center justify-center px-6 py-12 lg:px-8">
      <div className="p-5 max-w-[600px] w-full">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="py-5 mb-8 flex items-center justify-center">
            <Image src={logo} alt="Logo" className="w-[80px] object-contain" />
          </div>

          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create an account
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(handleRegister)}>
          <div>
            <label
              htmlFor="first-name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              First Name
            </label>
            <div className="mt-1">
              <input
                {...register("firstName", {
                  required: true,
                })}
                className="block w-full border border-gray-200 focus:ring-0 focus:border-black duration-200 rounded-md py-3 px-4 sm:text-sm outline-none"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Last Name
            </label>
            <div className="mt-1">
              <input
                {...register("lastName", {
                  required: true,
                })}
                className="block w-full border border-gray-200 focus:ring-0 focus:border-black duration-200 rounded-md py-3 px-4 sm:text-sm outline-none"
              />
            </div>
          </div>
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
                type="email"
                className="block w-full border border-gray-200 focus:ring-0 focus:border-black duration-200 rounded-md py-3 px-4 sm:text-sm outline-none"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Phone Number
            </label>
            <div className="mt-1">
              <input
                {...register("phoneNumber", {
                  required: true,
                })}
                type="text"
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
            </div>
            <div className="mt-2">
              <PasswordField
                {...register("password", {
                  required: true,
                })}
              />
            </div>
          </div>
          <div>
            <SubmitBtn isSubmitting={isSubmitting}>Sign up</SubmitBtn>
          </div>
        </form>
        <p className="mt-3 text-center text-sm text-gray-500">
          Already have an account?
          <a
            href="/login"
            className="font-semibold leading-6 ml-2 text-indigo-600 hover:text-indigo-500"
          >
            Login
          </a>
        </p>
      </div>
    </main>
  );
}
