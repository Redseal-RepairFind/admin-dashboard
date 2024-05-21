"use client";
import { forgotPassword } from "@/lib/api/api";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setSignUpMail } from "@/lib/redux/slices/auth";
import { IForgotPasswordData } from "@/lib/types";
import logo from "@/public/logo.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function ForgotPassword() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    forgotPassword(formField).then((response) => {
      if (response?.success) {
        dispatch(setSignUpMail(formField.email));
        router.push("/auth/reset-password");
      }
    });
  };

  const [formField, setFormField] = useState<IForgotPasswordData>({
    email: "",
  });

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex flex-col items-center py-10">
            <Image
              src={logo}
              alt="Logo"
              width={110}
              height={110}
              className="w-[110px] h-[110px]"
            />
          </div>

          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Reset your password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formField.email}
                  onChange={(e) =>
                    setFormField({ ...formField, email: e.target.value })
                  }
                  required
                  className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo/10 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#262626] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#444] outline-none "
              >
                Continue
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Remember your password?{" "}
            <a
              href="/auth/login"
              className="font-semibold leading-6 text-indigo-1100 hover:text-indigo-500"
            >
              Back to login
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
