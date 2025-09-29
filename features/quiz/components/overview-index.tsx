"use client";

import { Header, SubmitBtn } from "./index";
import question from "@/public/Vector.png";
import timer from "@/public/Union.png";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import badge from "public/barger.png";
import { ReactNode } from "react";
function OverviewIndex() {
  const router = useRouter();
  const params = useSearchParams();

  const session = params.get("session") || "";

  // console.log(encodeURIComponent(session));

  function navigate(route: string) {
    router.push(route);
  }
  const info = [
    {
      head: "10 Questions",
      detail:
        "You have to score eight correct points to earn your certificate and 'ready to work' badge ",
      img: question,
    },
    {
      head: "20 Minutes",
      detail: "You have a total of 20 minutes to answer all questions",
      img: timer,
    },
    {
      head: "Gets a certificate and Badge",
      detail: "You get a digital certificate and 'ready to work' badge",
      img: badge,
    },
  ];
  return (
    <div className="2xl:max-w-[1300px] px-3 xl:px-6 py-8">
      <span className="flex items-center flex-col gap-8 mb-8">
        <Header title="Quiz Questions" />

        <p className="text-[#757575] text-lg">
          Please complete this short quiz to complete your onboarding to
          RepairFind.
        </p>
      </span>

      <div className="w-full rounded-xl bg-[#f8f8f8] md:p-6 py-8 flex flex-col gap-12 md:mb-10">
        {info.map((item, i) => (
          <InfoItem key={i} info={item} />
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-2 md:gap-6 w-full">
        <BackBtn className="justify-center" onClick={() => navigate("/quiz")}>
          Watch Video Again
        </BackBtn>
        <SubmitBtn
          className="justify-center"
          onClick={() =>
            navigate(`/quiz/questions?session=${encodeURIComponent(session)}`)
          }
        >
          Start Quiz
        </SubmitBtn>
      </div>
    </div>
  );
}

export default OverviewIndex;

type InfoItem = {
  head: string;
  detail: string;
  img: any;
};

type Info = {
  info: InfoItem;
};

function InfoItem({ info }: Info) {
  return (
    <div className=" grid grid-cols-[24px,1fr] md:grid-cols-[40px,1fr] items-center md:px-4 gap-4">
      <span className="relative w-6 h-6 md:w-10 md:h-10  rounded-full">
        <Image src={info.img} alt="Icon" fill className="z-50" />
      </span>

      <div className="flex  flex-col gap-[2px] md:gap-1">
        <h2 className="text-lg font-semibold">{info.head}</h2>
        <p className="text-[#757575] text-[12px] md:text-base">{info.detail}</p>
      </div>
    </div>
  );
}

export function BackBtn({
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
      className={`py-2  ${className}  rounded-md text-black bg-[#e9e6e6] flex items-center gap-2 hover:bg-gray-200 transition duration-300 ease-in-out`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
