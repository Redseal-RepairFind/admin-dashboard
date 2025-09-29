"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import QuestionForm from "./questionForm";
import QuestionPreview from "./questionPreview";

export interface OptionAnswer {
  id: number;
  text: string;
}
interface Question {
  question: string;
  options: OptionAnswer[];
  answer: OptionAnswer[];
}
export interface PreviewData {
  questions: Question[];
  video_url: string;
}

const Quiz: React.FC = () => {
  const session_preview = sessionStorage.getItem("session_preview_data");
  const session_preview_data = session_preview
    ? JSON.parse(session_preview)
    : null;

  const [preview, setPreview] = useState<PreviewData>(
    session_preview_data || {
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
    }
  );
  const [currentQuestionIDx, setCurrentQuestionIDx] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  useEffect(() => {
    typeof window !== "undefined" &&
      sessionStorage.setItem("session_preview_data", JSON.stringify(preview));
  }, [preview]);

  return (
    <div className="mx-auto mt-8 w-full overflow-x-auto">
      <div className="grid grid-cols-2 gap-8">
        <div className="">
          <label className="block font-medium text-gray-700 mt-2">
            Video Url:
          </label>
          <input
            type="text"
            value={preview.video_url}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPreview({ ...preview, video_url: e.target.value })
            }
            className="mt-2 py-2 px-4 border rounded-md w-full outline-none 
          focus:border-[#333]/30 focus:border mb-5 transition-all duration-300 bg-white/90"
            required
          />

          <h1 className="text-2xl font-[500] mb-4 text-[#333]">
            Create Questions{" "}
            {preview.questions.length > 1
              ? `(${preview.questions.length})`
              : ""}
          </h1>
          <QuestionForm
            currentQuestionIDx={currentQuestionIDx}
            setCurrentQuestionIDx={setCurrentQuestionIDx}
            onSubmit={() => setShowPreview(true)}
            setIsUpdating={setIsUpdating}
            preview={preview}
            setPreview={setPreview}
          />
        </div>
        <div>
          {showPreview && (
            <QuestionPreview
              payload={preview}
              questionsLength={preview.questions.length}
              setCurrentQuestionIDx={setCurrentQuestionIDx}
              currentQuestionIDx={currentQuestionIDx}
              question={preview.questions[currentQuestionIDx].question}
              options={preview.questions[currentQuestionIDx].options}
              answers={preview.questions[currentQuestionIDx].answer}
              setPreview={setPreview}
              isUpdating={isUpdating}
              setShowPreview={setShowPreview}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
