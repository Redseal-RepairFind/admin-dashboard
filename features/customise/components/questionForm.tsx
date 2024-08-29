import React, { useState, ChangeEvent, FormEvent } from "react";

import { PreviewData } from "./quiz";
import {
  FaCaretLeft,
  FaCaretRight,
  FaCheck,
  FaTrash,
  FaTrashAlt,
} from "react-icons/fa";
import VerticalMenu from "@/components/shared/vertical-menu";
import toast from "react-hot-toast";

interface OptionAnswer {
  id: number;
  text: string;
}
interface QuestionFormProps {
  onSubmit: (data: { question: string; options: OptionAnswer[] }) => void;
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
  setPreview: React.Dispatch<React.SetStateAction<PreviewData>>;
  preview: PreviewData;
  currentQuestionIDx: number;
  setCurrentQuestionIDx: React.Dispatch<React.SetStateAction<number>>;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  onSubmit,
  setIsUpdating,
  preview,
  setPreview,
  currentQuestionIDx,
  setCurrentQuestionIDx,
}) => {
  const handleOptionChange = (index: number, value: string) => {
    setIsUpdating(true);

    setPreview((prevState) => {
      const updatedQuestions = [...prevState.questions];
      const currentAnswers = updatedQuestions[currentQuestionIDx].answer;
      const currentOption = updatedQuestions[currentQuestionIDx].options[index];

      // Check if the current option is in the answer array and remove it
      if (currentAnswers.some((answer) => answer.id === currentOption.id)) {
        updatedQuestions[currentQuestionIDx].answer = currentAnswers.filter(
          (answer) => answer.id !== currentOption.id
        );
      }

      // Update the option text with the new value
      updatedQuestions[currentQuestionIDx].options[index] = {
        ...currentOption,
        text: value,
      };

      return { ...prevState, questions: updatedQuestions };
    });
  };

  const addAnswer = (option: OptionAnswer) => {
    if (option.text === "") {
      toast.remove();
      return toast.error("Please type your option first...");
    }
    setPreview((prevState) => {
      const updatedQuestions = [...prevState.questions];
      const currentQuestion = updatedQuestions[currentQuestionIDx];

      // Check if the option is already in the answer array
      const existingAnswer = currentQuestion.answer.find(
        (answer) => answer.id === option.id
      );

      if (!existingAnswer) {
        // Add the option to the answer array if it's not already present
        currentQuestion.answer = [...currentQuestion.answer, option];
      }

      // Update the question with the modified answer array
      updatedQuestions[currentQuestionIDx] = { ...currentQuestion };

      return {
        ...prevState,
        questions: updatedQuestions,
      };
    });
  };

  const removeAnswer = (option: OptionAnswer) => {
    setPreview((prevState) => {
      const updatedQuestions = [...prevState.questions];
      const currentQuestion = updatedQuestions[currentQuestionIDx];

      // Check if the option is in the answer array
      const existingAnswer = currentQuestion.answer.find(
        (answer) => answer.id === option.id
      );

      if (existingAnswer) {
        // Remove the option from the answer array if it exists
        currentQuestion.answer = currentQuestion.answer.filter(
          (answer) => answer.id !== option.id
        );
      }

      // Update the question with the modified answer array
      updatedQuestions[currentQuestionIDx] = { ...currentQuestion };

      return {
        ...prevState,
        questions: updatedQuestions,
      };
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(false);
    onSubmit(preview.questions[currentQuestionIDx]);
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      question: "",
      options: [
        { id: 1, text: "" },
        { id: 2, text: "" },
        { id: 3, text: "" },
        { id: 4, text: "" },
      ],
      answer: [],
    };

    setPreview((prevState) => ({
      ...prevState,
      questions: [...prevState.questions, newQuestion], // Add the new question to the existing array
    }));
    setCurrentQuestionIDx(preview.questions.length);
    console.log(preview.questions.length);
  };

  const removeQuestion = () => {
    if (preview.questions.length === 1) {
      toast.remove();
      return toast.error(`Unable to delete last question`);
    }
    setPreview((prevState) => {
      // Copy the existing questions array
      const updatedQuestions = [...prevState.questions];

      // Remove the question at the current index
      updatedQuestions.splice(currentQuestionIDx, 1);

      // Return the updated state with the modified questions array
      return {
        ...prevState,
        questions: updatedQuestions,
      };
    });
    setCurrentQuestionIDx((prevState) => {
      if (prevState === 0) return 0;
      return prevState - 1;
    });
  };

  // console.log(preview);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-2 w-full flex items-center justify-between">
        <label className="block font-medium text-gray-700">Question:</label>
        <button
          type="button"
          onClick={removeQuestion}
          className="border border-red-500 py-2 px-4 rounded-md bg-red-500 text-white"
        >
          <FaTrashAlt />
        </button>
      </div>
      <textarea
        value={preview.questions[currentQuestionIDx].question}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
          const updatedQuestions = [...preview.questions]; // Create a copy of the current questions array
          updatedQuestions[currentQuestionIDx] = {
            ...updatedQuestions[currentQuestionIDx],
            question: e.target.value, // Update the question property at the specific index
          };
          setPreview({ ...preview, questions: updatedQuestions }); // Update the state with the modified questions array
        }}
        className="mt-2 py-2 px-4 border rounded-md w-full outline-none max-h-[100px] resize-y
  focus:border-[#333]/30 focus:border transition-all duration-300 bg-white/90"
        required
      />

      <label className="block font-medium text-gray-700 mt-2">Options:</label>
      {preview.questions[currentQuestionIDx].options.map((option, index) => {
        const isSelected = preview.questions[currentQuestionIDx].answer.some(
          (answer) => answer.id === option.id
        );

        return (
          <div
            key={index}
            className="flex mt-2 items-center justify-between gap-2"
          >
            <input
              type="text"
              value={option.text}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleOptionChange(index, e.target.value)
              }
              className={`flex-1 py-2 px-4 border ${
                isSelected ? "border-green-500" : ""
              } rounded-md w-full outline-none 
      focus:border-[#333]/30 focus:border transition-all duration-300 bg-white/90`}
              required
            />
            <VerticalMenu
              className="bg-white/90 py-[12.5px] px-4 border border-gray-200 rounded-md"
              isBackground
            >
              <div className="w-full">
                <button
                  onClick={() => addAnswer(option)}
                  type="button"
                  className="w-full hover:bg-gray-100 border-b gray-200 flex items-center justify-center text-sm py-2 gap-2"
                >
                  Set as correct
                </button>
                <button
                  onClick={() => removeAnswer(option)}
                  type="button"
                  className="w-full hover:bg-gray-100 flex items-center justify-center text-sm py-2 gap-2"
                >
                  Remove from correct
                </button>
              </div>
            </VerticalMenu>
          </div>
        );
      })}
      <p className="text-sm mt-3">
        <b>NOTE:</b> Click the action bar to to set an option as correct.
      </p>
      <div className="flex items-center justify-start gap-4 mt-4">
        <button
          type="button"
          onClick={handleAddQuestion}
          className="border-0 bg-[#262626] text-[#fff] px-6 py-2 rounded
        text-sm hover:opacity-90 hover:scale-[0.99] transition-all"
        >
          Add Question
        </button>
        <button
          className="border border-[#262626] text-[##262626] px-6 py-2 rounded
        text-sm hover:opacity-90 hover:scale-[0.99] transition-all"
        >
          Preview
        </button>
        <div className="flex items-center justify-end gap-2 border border-[#262626] rounded px-4 py-2 text-sm">
          Question No.:
          <button
            type="button"
            onClick={() => setCurrentQuestionIDx(currentQuestionIDx - 1)}
            disabled={currentQuestionIDx === 0}
            className={currentQuestionIDx === 0 ? "text-gray-300" : ""}
          >
            <FaCaretLeft />
          </button>
          <span className="text-red-500 font-medium">
            {currentQuestionIDx + 1}
          </span>
          <button
            type="button"
            onClick={() => setCurrentQuestionIDx(currentQuestionIDx + 1)}
            disabled={currentQuestionIDx + 1 === preview.questions.length}
            className={
              currentQuestionIDx + 1 === preview.questions.length
                ? "text-gray-300"
                : ""
            }
          >
            <FaCaretRight />
          </button>
        </div>
      </div>
    </form>
  );
};

export default QuestionForm;
