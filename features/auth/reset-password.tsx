"use client";
import { resetPassword } from "@/lib/api/api";
import { IResetPasswordData } from "@/lib/types";
import logo from "@/public/logo.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import PinInput from "./pin-input";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";

export default function ResetPassword() {
  const router = useRouter();

  const { signUpMail } = useAppSelector((state: RootState) => state.auth);

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
    if (confirmPassword === formField.password) {
      setPasswordMismatch(false);
      resetPassword(formField).then((response) => {
        if (response?.success) {
          // console.log(response.success);
          router.push("/auth/login");
        }
      });
    } else {
      setPasswordMismatch(true);
    }
  };

  const [formField, setFormField] = useState<IResetPasswordData>({
    email: signUpMail,
    password: "",
    otp: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordMismatch, setPasswordMismatch] = useState(false);

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
            Create new password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* ======================= OTP =============== */}

            <PinInput label="Enter OTP" setPinArr={setPinArr} pinArr={pinArr} />

            {/* ==================== New password ================  */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  New Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formField.password}
                  onChange={(e) =>
                    setFormField({ ...formField, password: e.target.value })
                  }
                  required
                  className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo/10 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* ========================= Confirm Password ========================= */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo/10 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              {passwordMismatch && (
                <p className="text-sm text-red-600 font-[500]">
                  You passwords don't match
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Continue
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Remember your password?{" "}
            <a
              href="/auth/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Back to login
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
