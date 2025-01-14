"use client";

import { useQuiz } from "../useQuiz";
import fail from "@/public/fail.png";
import celebrate from "@/public/celebrate.png";
import Image from "next/image";
import { SubmitBtn } from "./index";
import { useRouter } from "next/navigation";

function ModalInfo() {
  const { questions } = useQuiz();
  const router = useRouter();
  const totalQuestions = questions?.data?.questions?.length;
  const scores = JSON.parse(sessionStorage.getItem("userAnswer") || "[]")
    .map((score: any) => score.point)
    .reduce((acc: number, score: number) => acc + score, 0);

  function handleCloseModal() {
    sessionStorage.removeItem("userAnswer");
    router.push("/quiz");
  }

  const imageUrl = scores >= 8 ? celebrate : fail;
  const status = scores >= 8 ? "Congratulations!" : "Oops!!!";
  const message =
    scores >= 8
      ? "You have earned the 'Ready to Work' badge and can now accept jobs!"
      : "It is great that you tried. You can take the test again.";
  const btnText = scores >= 8 ? "Continue to App" : "Try Again";

  return (
    <div className="xl:max-w-[800px] px-6 py-6 flex flex-col gap-5 items-center">
      <h2 className="font-semibold">
        Score: {`${scores} / ${totalQuestions}`}
      </h2>

      <span className="relative w-[130px] h-[120px]">
        <Image src={imageUrl} alt="StatusImage" fill />
      </span>

      <h1 className="text-xl font-bold">{status}</h1>
      <p>{message}</p>

      <span className="mt-8">
        <SubmitBtn onClick={handleCloseModal}>{btnText}</SubmitBtn>
      </span>
    </div>
  );
}

export default ModalInfo;
