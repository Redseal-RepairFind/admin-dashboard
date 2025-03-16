"use client";
import { addQuestions, getAllQuestions } from "@/lib/api/api";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import useCustomise from "@/lib/hooks/useCustomise";
import toast from "react-hot-toast";
import { PreviewData, OptionAnswer } from "./quiz";

interface QuestionPreviewProps {
  payload: PreviewData;
  question: string;
  options: OptionAnswer[];
  answers: OptionAnswer[];
  isUpdating: boolean;
  questionsLength: number;
  setPreview: React.Dispatch<React.SetStateAction<PreviewData>>;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
  currentQuestionIDx: number;
  setCurrentQuestionIDx: React.Dispatch<React.SetStateAction<number>>;
}

const QuestionPreview: React.FC<QuestionPreviewProps> = ({
  question,
  options,
  answers,
  setPreview,
  setShowPreview,
  currentQuestionIDx,
  setCurrentQuestionIDx,
  questionsLength,
  isUpdating,
  payload,
}) => {
  const { AddQuiz } = useCustomise();

  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async () => {
    setIsLoading(true);

    // console.log(payload);

    const values = {
      ...payload,
      questions: payload.questions.map((item) => {
        return {
          ...item,
          options: item.options.map((option) => option.text),
          answer: item.answer.map((option) => option.text),
        };
      }),
    };

    // console.log(values);
    try {
      const response = await AddQuiz(values);
      // console.log(response);
      toast.success(response?.message);
      setIsLoading(false);
      setTimeout(() => {
        setPreview({
          questions: [
            {
              question: "",
              options: [
                { id: 1, text: "" },
                { id: 2, text: "" },
                { id: 3, text: "" },
                { id: 4, text: "" },
              ],
              answer: [],
            },
          ],
          video_url: "",
        });
        setShowPreview(false);
      }, 1000);
    } catch (e: any) {
      toast.error(e?.response?.data?.message);
      setIsLoading(false);
    }
  };

  // console.log(currentQuestionIDx);

  return (
    <div className="max-w-md mx-auto mt-2 bg-white px-8 py-4 min-w-[500px] rounded-md">
      <div className="border-2 overflow-x-scroll flex items-center justify-start gap-2 w-full rounded-md p-3 my-2">
        {[...Array(questionsLength)].map((_, index) => (
          <button
            onClick={() => setCurrentQuestionIDx(index)}
            className={`${
              currentQuestionIDx === index
                ? "bg-[#262626] text-white"
                : "bg-gray-200 text-[#262626]"
            } p-2 min-w-[40px] rounded-md`}
            key={index + 1}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <h2 className="text-2xl font-[500] mb-4">Preview</h2>
      <div className="">
        <p className="text-sm text-[#999] font-[600] pb-2">Question</p>
        <p className="mb-2">{question}</p>
      </div>
      <ul className="flex flex-col gap-y-4 mt-4">
        {options.map((option, index) => (
          <div className="" key={index}>
            <p className="text-sm text-[#999] font-[600] pb-2">
              Option {index + 1}
            </p>
            <li>{option.text}</li>
          </div>
        ))}
      </ul>
      <p className="text-green-500 mt-4">Correct Answers:</p>
      <div className="flex gap-x-2">
        {answers.map((item, index) => (
          <div
            key={index}
            className={`border-2 font-[500]
          text px-6 py-1.5 rounded-[30px] mt-3 hover:scale-[0.99]
          text-xs hover:opacity-90 transition-all`}
          >
            {item.text}
          </div>
        ))}
      </div>

      <button
        onClick={handleFormSubmit}
        disabled={isLoading}
        className={`bg-[#262626] text-[#fff] w-full px-6 py-2 rounded mt-5 border-0 
      text-sm hover:opacity-90 hover:scale-[0.99] transition-all`}
      >
        {isLoading ? (
          <ClipLoader size={15} color="#fff" />
        ) : (
          "Proceed to Submit"
        )}
      </button>
    </div>
  );
};

export default QuestionPreview;
