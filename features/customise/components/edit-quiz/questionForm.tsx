"use client";

import React, {
  useState,
  ChangeEvent,
  FormEvent,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
import { PreviewData } from "./edit-quiz";
import useCustomise from "@/lib/hooks/useCustomise";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import VerticalMenu from "@/components/shared/vertical-menu";
import { FaEllipsisV } from "react-icons/fa";

export interface OptionAnswer {
  id: number;
  text: string;
}
interface QuestionFormProps {
  onSubmit: (data: PreviewData) => void;
  setIsUpdating: Dispatch<SetStateAction<boolean>>;
  oldQuestion: any;
  quizId: string;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  onSubmit,
  setIsUpdating,
  oldQuestion,
  quizId,
}) => {
  const [question, setQuestion] = useState<string>("");
  const [oldQuestions, setOldQuestions] = useState(oldQuestion || []);
  const [quiz, setQuiz] = useState<any>([]);
  const [options, setOptions] = useState<OptionAnswer[]>([]);
  const [answer, setAnswer] = useState<OptionAnswer[]>([]);
  const [currentQuestionIDx, setCurrentQuestionIDx] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openId, setOpend] = useState<any>();

  const { DeleteQuestion, UpdateQuestion, AddQuestion, refetchQuizzes } =
    useCustomise();

  // console.log(answer);

  useEffect(() => {
    setQuestion(oldQuestions[currentQuestionIDx]?.question);

    const reformattedOptions = oldQuestions[currentQuestionIDx]?.options.map(
      (option: OptionAnswer, index: number) => ({
        id: index + 1,
        text: option,
      })
    );

    const reformattedAnswers = oldQuestions[currentQuestionIDx]?.answer.map(
      (answer: OptionAnswer, index: number) => ({
        id: index + 1,
        text: answer,
      })
    );

    setOptions(reformattedOptions);
    setAnswer(reformattedAnswers);

    setQuiz(oldQuestions[currentQuestionIDx]);
  }, [currentQuestionIDx, oldQuestion]);

  useEffect(() => {
    setOldQuestions(oldQuestion);
  }, [oldQuestion]);

  const handleOptionChange = (index: number, value: string) => {
    setIsUpdating(true);
    setOptions((prevOptions) => {
      const newOptions = [...prevOptions];
      newOptions[index].text = value;
      return newOptions;
    });
  };

  // const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setIsUpdating(false);
  //   onSubmit({ question, options:options.map });
  // };

  const handleQuestionIDx = (value: number) => {
    // console.log(value);
    return () => setCurrentQuestionIDx(value);
  };

  const addAnswer = (option: OptionAnswer) => {
    if (option.text === "") {
      toast.remove();
      return toast.error("Please type your option first...");
    }

    setAnswer((prevAnswer) => {
      // Check if the option is already in the answer array
      const existingAnswer = prevAnswer.find(
        (answer) => answer.text === option.text
      );

      // console.log(existingAnswer);

      if (!existingAnswer?.text) {
        // Add the option to the answer array if it's not already present

        setOpend(null);
        return [option];
      }

      // If the option already exists, return the current state unchanged
      setOpend(null);
      return prevAnswer;
    });
  };

  const removeAnswer = (option: OptionAnswer) => {
    setAnswer((prevAnswer) => {
      // Check if the option is in the answer array
      const existingAnswer = prevAnswer.find(
        (answer) => answer.id === option.id
      );

      if (existingAnswer) {
        // Remove the option from the answer array if it exists
        setOpend(null);
        return prevAnswer.filter((answer) => answer.text !== option.text);
      }

      // If the option doesn't exist, return the current state unchanged
      setOpend(null);
      return prevAnswer;
    });
  };

  // console.log(options);
  // console.log(answer);

  // console.log(currentQuestionIDx);

  const updateQuestion = async () => {
    if (answer.length === 0)
      return toast.error("Please select at least one answer");

    if (oldQuestions[currentQuestionIDx]?._id.includes("new"))
      return addNewQuestion();

    setIsLoading(true);
    const payload = {
      question,
      options: options.map((option: OptionAnswer) => option.text),
      answer: answer.map((answer: OptionAnswer) => answer.text),
      questionId: oldQuestions[currentQuestionIDx]?._id,
    };

    // console.log(payload);

    try {
      const response = await UpdateQuestion({
        id: payload?.questionId,
        payload,
      });
      // console.log(response);
      toast.success(response?.message);
      setIsLoading(false);
      setTimeout(() => {
        refetchQuizzes();
      }, 1000);
    } catch (e: any) {
      setIsLoading(false);
      toast.error(e?.response?.data?.message);
    }
  };

  const deleteQuestion = async () => {
    if (oldQuestions[currentQuestionIDx]?._id.includes("new")) {
      setOldQuestions((prev: any) => {
        // Filter out the question with the matching _id
        const updatedQuestions = prev.filter(
          (question: any) =>
            question._id !== oldQuestions[currentQuestionIDx]?._id
        );

        return updatedQuestions;
      });

      // Adjust the currentQuestionIDx based on its position
      setCurrentQuestionIDx((prevIdx) =>
        prevIdx === 0 ? prevIdx + 1 : prevIdx - 1
      );

      return toast.success("Question removed successfully...");
    }

    if (!oldQuestions[currentQuestionIDx]?._id)
      return toast.error("Select an existing question...");
    if (oldQuestions.length === 1)
      return toast.error(`You can't delete the only existing question...`);

    if (confirm("Are you sure you want to delete this question?")) {
      setIsDeleting(true);

      try {
        const response = await DeleteQuestion(
          oldQuestions[currentQuestionIDx]?._id
        );
        // console.log(response);
        toast.success(response?.message);

        setIsDeleting(false);
        setTimeout(() => {
          refetchQuizzes();
          setCurrentQuestionIDx((prevIdx) =>
            prevIdx === 0 ? prevIdx + 1 : prevIdx - 1
          );
        }, 1000);
      } catch (e: any) {
        setIsDeleting(false);
        toast.error(e?.response?.data?.message);
      }
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      _id: `new${currentQuestionIDx}`,
      question: "",
      options: ["", "", ""],
      answer: [],
    };

    setOldQuestions((prevState: any) => [...prevState, newQuestion]);

    setCurrentQuestionIDx(oldQuestions.length);
  };

  const addNewQuestion = async () => {
    setIsLoading(true);

    const payload = {
      question,
      options: options.map((option: OptionAnswer) => option.text),
      answer: answer.map((answer: OptionAnswer) => answer.text),
    };

    try {
      const response = await AddQuestion({ id: quizId, payload });
      // console.log(response);
      toast.success(response?.message);
      setIsLoading(false);
      setTimeout(() => {
        refetchQuizzes();
        setCurrentQuestionIDx((prevIdx) =>
          prevIdx === 0 ? prevIdx + 1 : prevIdx - 1
        );
      }, 1000);
    } catch (e: any) {
      setIsLoading(false);
      toast.error(e?.response?.data?.message);
    }
  };

  return (
    <div className="max-w-[800px] w-full p-2 gap-2 flex items-start justify-start flex-col relative">
      <div className="bg-white rounded-md mb-5 p-2 w-full flex items-start justify-start gap-2 overflow-x-scroll">
        {[...Array(oldQuestions.length)].map((_, index) => (
          <button
            onClick={handleQuestionIDx(index)}
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
      <div className="w-full">
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
        {options?.map((option, index) => {
          const isSelected = answer.some(
            (answer) => answer.text === option.text
          );

          return (
            <div
              key={index}
              className="flex mt-2 items-center justify-between gap-2"
            >
              <input
                key={index}
                type="text"
                value={option.text}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleOptionChange(index, e.target.value)
                }
                className={`py-2 px-4 border ${
                  isSelected ? "border-green-500" : "border-gray-200"
                } rounded-md w-full outline-none 
          focus:border-[#333]/30 focus:border transition-all duration-300 bg-white/90`}
                required
              />

              <button
                className="p-3 bg-white border rounded-md"
                onClick={() =>
                  setOpend((id: any) => (id === option.id ? null : option.id))
                }
              >
                <FaEllipsisV />
              </button>
              {openId === option.id ? (
                <div className="bg-white/90 shadow-lg py-[12.5px] px-4 absolute border border-gray-200 rounded-md right-[-150px]">
                  <button className="w-full">
                    <span
                      onClick={() => addAnswer(option)}
                      // type="button"
                      className="w-full hover:bg-gray-100 border-b gray-200 flex items-center justify-center text-sm py-2 gap-2"
                    >
                      Set as correct
                    </span>
                    <button
                      onClick={() => removeAnswer(option)}
                      // type="button"
                      className="w-full hover:bg-gray-100 flex items-center justify-center text-sm py-2 gap-2"
                    >
                      Remove from correct
                    </button>
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}

        <div className="mt-5 flex items-center justify-start gap-4">
          <button
            onClick={updateQuestion}
            type="button"
            className="border border-[#262626] bg-[#262626] text-[#fff] px-6 py-2 rounded
        text-sm hover:opacity-90 hover:scale-[0.99] transition-all"
          >
            {isLoading ? (
              <ClipLoader size={15} color="#fff" />
            ) : (
              `${
                oldQuestions[currentQuestionIDx]?._id.includes("new")
                  ? "Add"
                  : "Update"
              } Question`
            )}
          </button>
          <button
            type="button"
            onClick={deleteQuestion}
            className="border border-[#262626] px-6 py-2 rounded
        text-sm hover:opacity-90 hover:scale-[0.99] transition-all"
          >
            {isDeleting ? (
              <ClipLoader size={15} color="#262626" />
            ) : (
              "Delete Question"
            )}
          </button>
          <button
            onClick={addQuestion}
            type="button"
            className="border border-[#262626] px-6 py-2 rounded
        text-sm hover:opacity-90 hover:scale-[0.99] transition-all"
          >
            Add New Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionForm;
