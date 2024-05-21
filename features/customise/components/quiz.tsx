// pages/index.js
import { useState } from "react";
import QuestionForm from "./questionForm";
import QuestionPreview from "./questionPreview";

export interface PreviewData {
  question: string;
  options: string[];
}

const Quiz: React.FC = () => {
  const [preview, setPreview] = useState<PreviewData>({
    question: "",
    options: ["", "", ""],
  });
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  return (
    <div className="mx-auto mt-8 w-full overflow-x-auto">
      <div className="flex gap-8">
        <div>
          <h1 className="text-2xl font-[500] mb-4 text-[#333]">
            Create Questions
          </h1>
          <QuestionForm
            onSubmit={() => setShowPreview(true)}
            setIsUpdating={setIsUpdating}
            preview={preview}
            setPreview={setPreview}
          />
        </div>
        <div>
          {showPreview && (
            <QuestionPreview
              question={preview.question}
              options={preview.options}
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
