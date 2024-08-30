import { IQuestion } from "@/lib/types";

import React, {
  useState,
  ChangeEvent,
  FormEvent,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
import { PreviewData } from "./edit-quiz";

interface QuestionFormProps {
  onSubmit: (data: PreviewData) => void;
  setIsUpdating: Dispatch<SetStateAction<boolean>>;
  oldQuestion: any;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  onSubmit,
  setIsUpdating,
  oldQuestion,
}) => {
  const [question, setQuestion] = useState<string>("");
  const [quiz, setQuiz] = useState<any>([]);
  const [options, setOptions] = useState<string[]>(["", "", ""]);
  const [answer, setAnswer] = useState<string[]>([]);
  const [currentQuestionIDx, setCurrentQuestionIDx] = useState<number>(0);

  useEffect(() => {
    setQuestion(oldQuestion[currentQuestionIDx]?.question);
    setOptions(oldQuestion[currentQuestionIDx]?.options);
    setAnswer(oldQuestion[currentQuestionIDx]?.answer);
    setQuiz(oldQuestion[currentQuestionIDx]);
  }, [currentQuestionIDx]);

  const handleOptionChange = (index: number, value: string) => {
    setIsUpdating(true);
    setOptions((prevOptions) => {
      const newOptions = [...prevOptions];
      newOptions[index] = value;
      return newOptions;
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(false);
    onSubmit({ question, options });
  };

  const handleQuestionIDx = (value: number) => {
    setCurrentQuestionIDx(value);
  };

  // console.log(options);
  // console.log(answer);

  // console.log(currentQuestionIDx);

  return (
    <div className="max-w-1/2 p-2 gap-2 flex items-start justify-start flex-col">
      <div className="bg-white rounded-md p-2 w-full flex items-start justify-start gap-2 overflow-x-scroll">
        {[...Array(oldQuestion.length)].map((_, index) => (
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
      <form onSubmit={handleSubmit} className="w-full">
        <label className="block font-medium text-gray-700">Question:</label>
        <textarea
          value={question}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setQuestion(e.target.value)
          }
          className={`mt-2 py-2 px-4 border rounded-md w-full outline-none max-h-[100px] resize-y
        focus:border-[#333]/30 focus:border transition-all duration-300 bg-white/90`}
          required
        />

        <label className="block font-medium text-gray-700 mt-2">Options:</label>
        {options?.map((option, index) => (
          <input
            key={index}
            type="text"
            value={option}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleOptionChange(index, e.target.value)
            }
            className={`mt-2 py-2 px-4 border ${
              answer.includes(option) ? "border-green-500" : "border-gray-200"
            } rounded-md w-full outline-none 
          focus:border-[#333]/30 focus:border transition-all duration-300 bg-white/90`}
            required
          />
        ))}

        <button
          type="button"
          className="border-0 bg-[#262626] text-[#fff] px-6 py-2 rounded mt-5
        text-sm hover:opacity-90 hover:scale-[0.99] transition-all"
        >
          Update Question
        </button>
      </form>
    </div>
  );
};

export default QuestionForm;
