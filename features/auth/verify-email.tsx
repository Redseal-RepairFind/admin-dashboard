"use client";
import { resetPassword, verifyEmail } from "@/lib/api/api";
import { useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { IResetPasswordData, IVerifyEmailData } from "@/lib/types";
import logo from "@/public/logo.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import PinInput from "./pin-input";
import { useRouter } from "next/navigation";

export default function VerifyEmail() {
  const { signUpMail } = useAppSelector((state: RootState) => state.auth);
  const router = useRouter();

  // create array filled with 4 items
  const filledArray = new Array(4).fill("");
  // state for pin code splitted as individual items in an array
  const [pinArr, setPinArr] = useState<string[]>(filledArray);

  useEffect(() => {
    setFormField({ ...formField, otp: pinArr.join("") });
  }, [pinArr]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    // console.log(formField);
    verifyEmail(formField).then((response) => {
      if (response?.success) {
        // console.log(response.success);
        router.push("/auth/login");
      }
    });
  };

  const [formField, setFormField] = useState<IVerifyEmailData>({
    email: signUpMail,
    otp: "",
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
            Verify Your Email
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* ======================= Email =============== */}
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
                  className="block w-full rounded-md border-0 py-2 px-4 text-gray-900/60 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo/10 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* ======================= OTP =============== */}
            <PinInput label="Enter OTP" setPinArr={setPinArr} pinArr={pinArr} />
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#262626] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#444] outline-none "
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
