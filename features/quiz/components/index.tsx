"use client";

import { useQuiz } from "../useQuiz";
import VideoPlayer from "./Videos";
import LoadingTemplate from "@/features/layout/loading";
import Quiz from "./Quiz";
import { ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Index() {
  const { questions: quizes, isLoadingQuestions: isLoadingQuizzes } = useQuiz();
  const router = useRouter();
  const params = useSearchParams();

  const session =
    params.get("session") ||
    "66f801fa2f33d3e40fe741a2%25668092d2c471ba08168f71cd";

  if (isLoadingQuizzes) return <LoadingTemplate />;

  return (
    <div className="2xl:max-w-[1300px] px-6 py-8">
      {/* {quizes?.data?.map((quiz: any, i: number) => ( */}
      <div className="w-full flex flex-col gap-8">
        <div className="flex flex-col gap-5 items-center ">
          <Header title="Welcome to RepairFind." />

          <span className="flex items-center flex-col gap-3">
            <h2 className="text-xl font-semibold">Hi there,</h2>

            <p className="text-[#757575] text-sm">
              To get onboarded fully, please watch this short training video.
              Once you have watched the video you will be prompted to complete a
              short quiz.
            </p>
          </span>
        </div>
        <VideoPlayer videoSrc={quizes?.data?.video_url} />

        <div className="flex items-center justify-center w-full">
          <SubmitBtn
            onClick={() => {
              router.push(`/quiz/overview?session=${session}`);
            }}
          >
            Continue
          </SubmitBtn>
        </div>

        {/* {videoEnded ? <Quiz quiz={quiz?.questions} /> : null} */}
      </div>
      {/* // ))} */}
    </div>
  );
}

export function SubmitBtn({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      className={`py-2 px-16 ${className} rounded-md text-white bg-black flex items-center gap-2 hover:bg-gray-700 transition duration-300 ease-in-out`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function Header({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h1 className={`text-xl md:text-2xl xl:text-4xl font-bold ${className}`}>
      {title}
    </h1>
  );
}
