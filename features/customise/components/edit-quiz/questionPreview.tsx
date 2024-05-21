"use client";
import {
  addQuestions,
  deleteQuestions,
  editQuestions,
  getAllQuestions,
} from "@/lib/api/api";
import React, { useEffect, useState } from "react";

interface QuestionPreviewProps {
  question: string;
  oldCorrectOption: string;
  options: string[];
  isUpdating: boolean;
  questionId: string;
  setIsQuestionDeleted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}

const QuestionPreview: React.FC<QuestionPreviewProps> = ({
  question,
  options,
  oldCorrectOption,
  isUpdating,
  questionId,
  setIsDropdown,
  setIsQuestionDeleted,
}) => {
  const handleFormSubmit = () => {
    setIsLoading(true);
    editQuestions({
      question: question,
      options: options,
      answer: [correctOption],
      questionId: questionId,
    }).then((res) => {
      if (res?.success) {
        setIsLoading(false);
        setIsDropdown(false);
      }
    });
  };

  const handleDeleteQuestion = () => {
    setIsDeleting(true);
    deleteQuestions({ questionId: questionId }).then((res) => {
      if (res) {
        if (res.success) {
          setIsDropdown(false);
          setIsQuestionDeleted(true);
        }
      }
    });
  };

  const [correctOption, setCorrectOption] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    if (isUpdating) {
      setCorrectOption("");
    }
  }, [isUpdating]);

  useEffect(() => {
    setCorrectOption(oldCorrectOption);
  }, []);

  return (
    <div className="max-w-md mx-auto mt-2 bg-white px-8 py-4 min-w-[500px] rounded-md">
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
            <li>{option}</li>
          </div>
        ))}
      </ul>

      {correctOption === "" && (
        <p className="text-danger mt-2 text-xs">
          Please select the correct answer
        </p>
      )}
      <div className="flex gap-x-2">
        {options.map((_, index) => (
          <button
            key={index}
            onClick={() =>
              setCorrectOption(
                index === 0 ? "A" : index === 1 ? "B" : index === 2 ? "C" : ""
              )
            }
            type="button"
            className={`border-2 font-[500] ${
              correctOption ===
              (index === 0 ? "A" : index === 1 ? "B" : index === 2 ? "C" : "")
                ? "border-[#222]"
                : "border-[#585858]/20"
            } 
          text px-6 py-1.5 rounded-[30px] mt-3 hover:scale-[0.99]
          text-xs hover:opacity-90 transition-all`}
          >
            Option{index + 1}
          </button>
        ))}
      </div>

      <div className="flex gap-x-8">
        <button
          type="submit"
          onClick={handleDeleteQuestion}
          disabled={false}
          className={`${isDeleting ? "border-danger/50" : "border-danger"}
         px-6 py-2 rounded-md mt-5 border-2 transition-all 
         text-sm hover:opacity-90 hover:scale-[0.99]`}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>

        <button
          type="button"
          onClick={handleFormSubmit}
          disabled={isUpdating || correctOption === ""}
          className={`${
            isUpdating || correctOption === ""
              ? "bg-[#262626]/60"
              : "bg-[#262626]"
          }
      text-[#fff] px-6 py-2 rounded mt-5 border-0 
      text-sm hover:opacity-90 hover:scale-[0.99] transition-all`}
        >
          {isLoading ? "Loading..." : "Proceed to Submit"}
        </button>
      </div>
    </div>
  );
};

export default QuestionPreview;
