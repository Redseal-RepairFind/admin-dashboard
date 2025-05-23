// pages/index.js
"use client";
import { useEffect, useRef, useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import QuestionPreview from "./questionPreview";
import QuestionForm from "./questionForm";
import { IQuestion } from "@/lib/types";
import { trimString } from "@/lib/utils/trim-string";
import { useOnClickOutside } from "@/lib/hooks/use-on-click-outside";
import LoadingTemplate from "@/features/layout/loading";
import useCustomise from "@/lib/hooks/useCustomise";

export interface PreviewData {
  question: string;
  options: string[];
}

interface IProps {
  question: IQuestion;
  index: number;
  setIsQuestionDeleted: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditQuiz = ({
  question,
  index,
  setIsQuestionDeleted,
}: {
  question: any;
  index: number;
  setIsQuestionDeleted: any;
}) => {
  const [preview, setPreview] = useState<PreviewData>({
    question: "",
    options: ["", "", ""],
  });
  const [isUpdating, setIsUpdating] = useState<boolean>(true);
  const [isDropdown, setIsDropdown] = useState<boolean>(true);

  const handleFormPreview = (data: PreviewData) => {
    setPreview(data);
  };

  const { isLoading } = useCustomise();

  const ref = useRef<HTMLDivElement>(null);

  const handleSetIsDropdown = () => {
    setIsDropdown(false);
  };
  useOnClickOutside(ref, handleSetIsDropdown);

  useEffect(() => {
    setPreview({
      question: question?.question,
      options: question?.options,
    });
  }, []);

  // console.log(question);

  return (
    <>
      {isLoading && <LoadingTemplate />}
      <div ref={ref}>
        <button
          className="bg-white px-6 py-2.5 flex rounded-md max-w-[700px] items-center justify-between"
          onClick={() => setIsDropdown((is) => !is)}
        >
          <div className="flex">
            <p className="font-[500] pr-4">{index}</p>
            <p className="capitalize text-sm w-full">{question?.video_url}</p>
          </div>
          {
            <div>
              {isDropdown ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
            </div>
          }
        </button>

        {isDropdown && (
          <div className="mx-auto my-8 w-full overflow-x-auto border-b border-b-[#555]/20 pb-8">
            <div className="flex gap-8">
              <div>
                {/* <QuestionPreview
                  oldCorrectOption={question?.answer[0]}
                  question={preview.question}
                  options={preview.options}
                  isUpdating={isUpdating}
                  questionId={question._id || ""}
                  setIsQuestionDeleted={setIsQuestionDeleted}
                  setIsDropdown={setIsDropdown}
                /> */}
              </div>
              <div>
                <h1 className="text-2xl font-[500] mb-4 mt-3 text-[#333]">
                  Edit Questions
                </h1>
                <QuestionForm
                  quizId={question?._id}
                  onSubmit={handleFormPreview}
                  setIsUpdating={setIsUpdating}
                  oldQuestion={question?.questions}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EditQuiz;
