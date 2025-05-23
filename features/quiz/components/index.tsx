"use client";

import { useQuiz } from "../useQuiz";
import VideoPlayer from "./Videos";
import LoadingTemplate from "@/features/layout/loading";
import Quiz from "./Quiz";
import { ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Index() {
  const { questions: quizes, isLoadingQuestions: isLoadingQuizzes } = useQuiz();
  const router = useRouter();
  const params = useSearchParams();

  const session = params.get("session") || "";

  // console.log();

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
              router.push(
                `/quiz/overview?session=${encodeURIComponent(session)}`
              );
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
  href,
  shade,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string;
  shade?: "danger" | "";
}) {
  if (href)
    return (
      <Link
        href={href}
        className={`py-2 px-16 ${className} rounded-md text-white ${
          shade === "danger" ? "bg-red-600" : "bg-black"
        } flex items-center gap-2 hover:bg-gray-700 transition duration-300 ease-in-out`}
      >
        {children}
      </Link>
    );
  return (
    <button
      className={`py-2 px-16 ${className} rounded-md text-white ${
        shade === "danger"
          ? "bg-red-600  hover:bg-red-400 "
          : "bg-black  hover:bg-gray-700 "
      } flex items-center gap-2transition duration-300 ease-in-out`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function Header({
  title,
  className,
  size = "medium",
}: {
  title: string;
  className?: string;
  size?: "small" | "medium" | "large";
}) {
  return (
    <h1
      className={`text-xl ${
        size === "small" ? "text-xl" : "md:text-2xl xl:text-4xl"
      } font-bold ${className}`}
    >
      {title}
    </h1>
  );
}
