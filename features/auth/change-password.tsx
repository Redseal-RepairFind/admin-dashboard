"use client";
import { IResetPasswordData } from "@/lib/types";
import logo from "@/public/logo.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import PinInput from "./pin-input";
import { useRouter, useSearchParams } from "next/navigation";
import useAuth from "@/lib/hooks/useAuth";
import toast from "react-hot-toast";
import SubmitBtn from "@/components/ui/submit-btn";
import PasswordField from "@/components/ui/password-input";

export default function ResetPassword() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  // console.log(email);

  const { ChangePassword } = useAuth();

  // create array filled with 4 items
  const filledArray = new Array(4).fill("");
  // state for pin code splitted as individual items in an array
  const [pinArr, setPinArr] = useState<string[]>(filledArray);

  useEffect(() => {
    setFormField({ ...formField, otp: pinArr.join("") });
  }, [pinArr]);

  const [formField, setFormField] = useState<any>({
    email: email,
    password: "",
    oldPassword: "",
    // otp: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    // console.log(formField);

    const payload = {
      oldPassword: formField.oldPassword,
      newPassword: formField.password,
      email,
    };

    if (confirmPassword === formField.password) {
      // console.log(formField);
      setIsSubmitting(true);
      setPasswordMismatch(false);
      try {
        const data = await ChangePassword(payload);
        // console.log(data);
        setIsSubmitting(false);
        toast.success(data?.message);
        setTimeout(() => {
          router.push(`/auth/login`);
        }, 1000);
      } catch (e: any) {
        console.log(e);
        toast.remove();
        toast.error(e?.response?.data?.message);
        setIsSubmitting(false);
      }
    } else {
      setPasswordMismatch(true);
    }
  };

  return (
    <main className="flex bg-white h-screen items-center justify-center px-6 py-12 lg:px-8">
      <div className="p-5 max-w-[600px] w-full">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex flex-col items-center py-5">
            <Image src={logo} alt="Logo" className="w-[80px] object-contain" />
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Change password
          </h2>
        </div>

        <form className="space-y-6 mt-5" onSubmit={handleSubmit}>
          {/* ======================= OTP =============== */}

          {/* <PinInput label="Enter OTP" setPinArr={setPinArr} pinArr={pinArr} /> */}

          {/* ==================== Old password ================  */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Old Password
              </label>
            </div>
            <div className="mt-2">
              <PasswordField
                placeholder="Enter your old password..."
                id="password"
                name="password"
                autoComplete="old-password"
                value={formField.oldPassword}
                onChange={(e) =>
                  setFormField({ ...formField, oldPassword: e.target.value })
                }
                required
                className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo/10 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
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
              <PasswordField
                placeholder="Enter your new password..."
                id="password"
                name="password"
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
              <PasswordField
                placeholder="Confirm your password..."
                id="password-confirm"
                name="password-confirm"
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
                You passwords do not match
              </p>
            )}
          </div>

          <SubmitBtn isSubmitting={isSubmitting}>Continue</SubmitBtn>
        </form>

        {/* <p className="mt-3 text-center text-sm text-gray-500">
          Remember your password?{" "}
          <a
            href="/auth/login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Back to login
          </a>
        </p> */}
      </div>
    </main>
  );
}
