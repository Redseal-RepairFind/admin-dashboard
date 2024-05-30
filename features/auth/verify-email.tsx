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
import useAuth from "@/lib/hooks/useAuth";
import toast from "react-hot-toast";
import SubmitBtn from "@/components/ui/submit-btn";

export default function VerifyEmail() {
  const { signUpMail } = useAppSelector((state: RootState) => state.auth);
  const router = useRouter();

  const { VerifyEmail } = useAuth();

  const urlParams = new URLSearchParams(window.location.search);
  const userEmail = urlParams.get("id");

  // create array filled with 4 items
  const filledArray = new Array(4).fill("");
  // state for pin code splitted as individual items in an array
  const [pinArr, setPinArr] = useState<string[]>(filledArray);

  useEffect(() => {
    setFormField({ ...formField, otp: pinArr.join("") });
  }, [pinArr]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formField, setFormField] = useState<IVerifyEmailData>({
    email: userEmail,
    otp: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    // console.log(formField);
    try {
      setIsSubmitting(true);
      const data = await VerifyEmail(formField);
      console.log(data);
      setIsSubmitting(false);
      router.push(`/auth/login`);
      toast.success(data?.message);
    } catch (e: any) {
      console.log(e);
      toast.remove();
      toast.error(e?.response?.data?.message);
      setIsSubmitting(false);
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
            Verify Your Email
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* ======================= OTP =============== */}
          <PinInput label="Enter OTP" setPinArr={setPinArr} pinArr={pinArr} />
          <SubmitBtn isSubmitting={isSubmitting}>Continue</SubmitBtn>
        </form>
      </div>
    </main>
  );
}
