// pages/index.js
"use client";
import { useEffect, useRef, useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import QuestionPreview from "./questionPreview";
import QuestionForm from "./questionForm";
import { IQuestion } from "@/lib/types";
import { trimString } from "@/lib/utils/trim-string";
import { useOnClickOutside } from "@/lib/hooks/use-on-click-outside";

export interface PreviewData {
  question: string;
  options: string[];
}

interface IProps {
  question: IQuestion;
  index: number;
  setIsQuestionDeleted: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditQuiz: React.FC<IProps> = ({
  question,
  index,
  setIsQuestionDeleted,
}) => {
  const [preview, setPreview] = useState<PreviewData>({
    question: "",
    options: ["", "", ""],
  });
  const [isUpdating, setIsUpdating] = useState<boolean>(true);
  const [isDropdown, setIsDropdown] = useState<boolean>(false);

  const handleFormPreview = (data: PreviewData) => {
    setPreview(data);
  };

  const ref = useRef<HTMLDivElement>(null);

  const handleSetIsDropdown = () => {
    setIsDropdown(false);
  };
  useOnClickOutside(ref, handleSetIsDropdown);

  useEffect(() => {
    setPreview({
      question: question.question,
      options: question.options,
    });
  }, []);

  return (
    <>
      <div ref={ref}>
        <div
          className="bg-white px-6 py-2.5 flex rounded-md max-w-[700px] items-center justify-between"
          onClick={() => setIsDropdown(!isDropdown)}
        >
          <div className="flex">
            <p className="font-[500] pr-4">{index}</p>
            <p className="capitalize">{trimString(question.question, 65)}</p>
          </div>
          {
            <div>
              {isDropdown ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
            </div>
          }
        </div>

        {isDropdown && (
          <div className="mx-auto my-8 w-full overflow-x-auto border-b border-b-[#555]/20 pb-8">
            <div className="flex gap-8">
              <div>
                <QuestionPreview
                  oldCorrectOption={question.answer[0]}
                  question={preview.question}
                  options={preview.options}
                  isUpdating={isUpdating}
                  questionId={question._id || ""}
                  setIsQuestionDeleted={setIsQuestionDeleted}
                  setIsDropdown={setIsDropdown}
                />
              </div>
              <div>
                <h1 className="text-2xl font-[500] mb-4 mt-3 text-[#333]">
                  Edit Questions
                </h1>
                <QuestionForm
                  onSubmit={handleFormPreview}
                  setIsUpdating={setIsUpdating}
                  oldQuestion={question}
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
