"use client";

import Image from "next/image";
import timer from "@/public/timer.png";
import { useQuiz } from "../useQuiz";
import LoadingTemplate from "@/features/layout/loading";
import Quiz from "./Quiz";
import { useEffect, useState, useCallback, useMemo } from "react";

function OverviewQuestions() {
  const [isLastQuestion, setIsLastQuestion] = useState(false); // Track if the answer is submitted

  const {
    questions,
    isLoadingQuestions,
    currentQuestion,
    handleNextOrPrev,
    submitting,
  } = useQuiz();
  // const [curQuiz, setCurQuiz] = useState({
  //   quizIndex: 0,
  //   currentQuiz: questions?.data?.questions[0],
  // });

  const quizArray = useMemo(
    () => questions?.data?.questions || [],
    [questions]
  );

  const quizLength = quizArray?.length - 1;

  useEffect(() => {
    if (currentQuestion.quizIndex === quizLength) {
      setIsLastQuestion(true);
    }
    return () => {
      setIsLastQuestion(false);
    };
  }, [currentQuestion, quizLength]);

  const handleCurQuiz = (next: "next" | "prev", id: string) => {
    if (next === "next" && currentQuestion.quizIndex < quizLength) {
      handleNextOrPrev("next");
    } else if (next === "prev" && currentQuestion.quizIndex > 0) {
      handleNextOrPrev("prev");
    } else if (currentQuestion.quizIndex === quizLength) {
      setIsLastQuestion(true);
    }
  };

  if (isLoadingQuestions || !currentQuestion.currentQuiz || submitting) {
    return <LoadingTemplate />;
  }

  return (
    <div className="xl:max-w-[1000px] px-2 md:px-6 py-8 flex flex-col gap-6">
      <Timer />
      <div className="flex items-center justify-center w-full">
        <span className="bg-[#f8f8f8] text-[#747474] rounded-md md:px-5 py-3">
          Question {currentQuestion.quizIndex + 1} of {quizArray?.length}
        </span>
      </div>

      <Quiz
        curQuiz={currentQuestion}
        handleCurQuiz={handleCurQuiz}
        isLastQuestion={isLastQuestion}
        setIsLastQuestion={setIsLastQuestion}
      />
    </div>
  );
}

export default OverviewQuestions;

function Timer({}: {}) {
  const { seconds } = useQuiz();

  return (
    <div className="w-full flex  justify-end items-center gap-2">
      <div className="flex items-center gap-1">
        <div className="relative h-6 w-6">
          <Image src={timer} alt="Timer icon" fill />
        </div>
        <p className="text-base text-[#747474] ">Remaining time</p>
      </div>

      <span className="bg-[#eef5f9] py-3 px-6 rounded-md">
        {
          <>
            {Math.floor(seconds / 60)}:
            {seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60}
          </>
        }
      </span>
    </div>
  );
}
