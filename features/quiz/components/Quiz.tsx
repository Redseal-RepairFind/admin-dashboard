import React, { useEffect, useState } from "react";
import { FaCheckSquare } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { useQuiz } from "../useQuiz";

import { Header } from "./index";

import { GrFormPreviousLink, GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import { BackBtn } from "./overview-index";
import { String } from "aws-sdk/clients/codebuild";
import Modal from "react-responsive-modal";
import ModalInfo from "./modalInfo";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

function Quiz({
  curQuiz,
  handleCurQuiz,
  isLastQuestion,
  setIsLastQuestion,
}: {
  handleCurQuiz: (next: "next" | "prev", id: string) => void;
  curQuiz: any;
  isLastQuestion: boolean;
  setIsLastQuestion: any;
}) {
  return (
    <div className="w-full  md:p-6 ">
      {/* <h2 className="font-bold text-2xl">Question {curQuiz.quizIndex + 1}</h2> */}

      <QuizItem
        quiz={curQuiz?.currentQuiz}
        onHandleNextQuestion={handleCurQuiz}
        index={curQuiz.quizIndex + 1}
        isLastQuestion={isLastQuestion}
        setIsLastQuestion={setIsLastQuestion}
      />
    </div>
  );
}

export default Quiz;
function QuizItem({
  quiz,
  onHandleNextQuestion,
  index,
  isLastQuestion,
  setIsLastQuestion,
}: // submitted,
// ,
{
  quiz: any;
  onHandleNextQuestion: (next: "next" | "prev", id: string) => void;
  index: number;
  isLastQuestion: boolean;
  setIsLastQuestion: any;
}) {
  const [openModal, setOpenModal] = useState(false);

  const { seconds } = useQuiz();

  const {
    submitAnswer,
    selectedAnswer,
    handleSelectOption,
    submitted,
    handleUserAnswers,
    userAnswers,
  } = useQuiz();
  const options = ["A", "B", "C", "D"];

  const answerObject = {
    id: quiz?._id,
    answerGiven: selectedAnswer,
    point: selectedAnswer === quiz?.answer[0] ? 1 : 0,
  };

  const answerSession = JSON?.parse(sessionStorage.getItem("userAnswer") || "");

  const answered = answerSession.some((answer: any) => answer.id === quiz._id);
  // console.log(userAnswers);

  function handleNextQuestion() {
    if (isLastQuestion) {
      setOpenModal(true);
      handleUserAnswers(answerObject);
    } else {
      if (answered) {
        onHandleNextQuestion("next", quiz?._id);
        handleUserAnswers(answerObject);
      } else {
        toast.error("Please select an answer before proceeding");
        return;
      }
    }
  }
  useEffect(() => {
    if (seconds === 0) {
      setIsLastQuestion(true);
      setOpenModal(true);
    }
  }, [seconds, setIsLastQuestion]);

  return (
    <div className="flex flex-col gap-2">
      <Modal onClose={() => setOpenModal(true)} open={openModal} center>
        <ModalInfo />
      </Modal>
      <div className="flex items-start mb-5">
        <Header title={`${index?.toLocaleString()}.`} className="mr-1 " />
        <Header
          title={quiz?.question}
          className="md:text-center leading-tight text-xl md:text-2xl"
        />
      </div>
      {quiz?.options.map((option: string, idx: number) => (
        <Option
          key={idx}
          option={option}
          index={options[idx]}
          correctAnswer={quiz?.answer[0]}
          selectedAnswer={selectedAnswer} // Pass selectedAnswer as a prop
          handleSelectOption={handleSelectOption} // Pass the handler
          id={quiz?._id}
        />
      ))}
      <div className="w-full md:flex  grid grid-cols-2 gap-2 md:justify-end mt-8">
        {index > 1 ? (
          <BackBtn
            onClick={() => {
              onHandleNextQuestion("prev", quiz?._id);
            }}
            className="px-4"
          >
            <GrLinkPrevious color="#000" size={24} />
            <p>Back</p>
          </BackBtn>
        ) : null}
        <button
          className={`py-2 px-4  rounded-md justify-center text-white bg-black flex items-center gap-2 ${
            !submitted ? "cursor-not-allowed" : ""
          } hover:bg-gray-700 transition duration-300 ease-in-out`}
          onClick={handleNextQuestion}
          // disabled={answered}
        >
          {isLastQuestion ? (
            "Submit"
          ) : (
            <>
              <p>Next</p>
              <GrLinkNext color="#fffff" size={24} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Option({
  option,
  index,
  correctAnswer,
  selectedAnswer,
  handleSelectOption,
  id,
}: // ,
// submitted,
{
  option: string;
  index: String;
  correctAnswer: string;
  selectedAnswer: string | null;
  handleSelectOption: (
    option: string,
    id: string,
    correctAnswer: string
  ) => void;
  id: string;
  // submitted: boolean;
}) {
  // const {
  //   setSubmitted,
  //   setSelectedAnswer,
  //   selectedAnswer,
  //   handleSelectOption,
  // } = useQuiz();

  const answerSession = JSON.parse(sessionStorage.getItem("userAnswer") || "");

  const answered = answerSession.find((answer: any) => answer.id === id);
  const isSelected =
    selectedAnswer === option || answered?.answerGiven === option; // Ensure only one option is selected
  const isCorrectAnswer = correctAnswer === option;

  // console.log(answered);

  return (
    <button
      className={`md:flex md:items-center md:justify-between px-2 py-3 md:px-4 rounded-md  ${
        isSelected ? "bg-[#f8f8f8] shadow-md" : "bg-white shadow-sm"
      }  border border-[#f2f2f2]`}
      onClick={() => {
        handleSelectOption(option, id, correctAnswer);
      }}
    >
      <div className="grid grid-cols-[16px,1fr] items-center gap-3">
        <span className="h-4 w-4 rounded-full border   border-[#757575] p-[2px] flex items-center justify-center ">
          {isSelected ? (
            <div className="h-full w-full rounded-full bg-black" />
          ) : null}
        </span>
        <span className="flex items-center gap-2">
          <p className="hidden md:flex">{index}.</p>
          <p className="text-[14px] md:text-base text-start">{option}</p>
        </span>
      </div>
      {/* {submitted && isCorrectAnswer ? (
        <FaCheckSquare size={24} color="#0D8012" />
      ) : submitted && isSelected && !isCorrectAnswer ? (
        <GiCancel size={24} color="#ef4444" />
      ) : null} */}
    </button>
  );
}
