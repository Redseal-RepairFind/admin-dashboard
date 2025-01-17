"use client";

import { useQuiz } from "../useQuiz";
import fail from "@/public/fail.png";
import celebrate from "@/public/Celebrate.png";
import Image from "next/image";
import { SubmitBtn } from "./index";
import { useRouter, useSearchParams } from "next/navigation";

function ModalInfo({ info }: { info: any }) {
  const router = useRouter();
  const session = useSearchParams() || "";

  function handleCloseModal() {
    sessionStorage.removeItem("userAnswer");
    router.push(`/quiz/${session}`);
  }

  const handleRedirect = () => {
    const appUrl = "repairfindcontractorapp://dashboard";
    const fallbackUrl = "https://repairfind.ca/";
    window.location.href = appUrl;

    // Fallback to download page if the app isn't installed
    setTimeout(() => {
      window.location.href = fallbackUrl;
    }, 2000); // Adjust the timeout duration as needed
  };

  const passed = info?.data?.result?.passed;

  const submit = () => (passed ? handleRedirect() : handleCloseModal());

  const imageUrl = passed ? celebrate : fail;
  const status = passed ? "Congratulations!" : "Oops!!!";
  const message = passed
    ? "You have earned the 'Ready to Work' badge and can now accept jobs!"
    : "It is great that you tried. You can take the test again.";
  const btnText = info?.data?.results?.passed ? "Continue to App" : "Try Again";

  return (
    <div className="xl:max-w-[800px] px-6 py-6 flex flex-col gap-5 items-center">
      <h2 className="font-semibold">
        Score:{" "}
        {`${info?.data?.result?.totalAnswered} / ${info?.data?.result?.totalQuestions}`}
      </h2>

      <span className="relative w-[130px] h-[120px]">
        <Image src={imageUrl} alt="StatusImage" fill />
      </span>

      <h1 className="text-xl font-bold">{status}</h1>
      <p>{message}</p>

      <span className="mt-8">
        <SubmitBtn onClick={submit}>{btnText}</SubmitBtn>
      </span>
    </div>
  );
}

export default ModalInfo;
