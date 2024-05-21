import React, { useState, ChangeEvent, FormEvent } from "react";

import { PreviewData } from "./quiz";

interface QuestionFormProps {
  onSubmit: (data: { question: string; options: string[] }) => void;
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
  setPreview: React.Dispatch<React.SetStateAction<PreviewData>>;
  preview: PreviewData;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  onSubmit,
  setIsUpdating,
  preview,
  setPreview,
}) => {
  const handleOptionChange = (index: number, value: string) => {
    setIsUpdating(true);
    setPreview((prevPreview) => {
      const newPreview = { ...prevPreview };
      newPreview.options[index] = value;
      return newPreview;
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(false);
    onSubmit(preview);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md min-w-md">
      <label className="block font-medium text-gray-700">Question:</label>
      <textarea
        value={preview.question}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          setPreview({ ...preview, question: e.target.value })
        }
        className="mt-2 py-2 px-4 border rounded-md w-full outline-none max-h-[100px] resize-y
        focus:border-[#333]/30 focus:border transition-all duration-300 bg-white/90"
        required
      />

      <label className="block font-medium text-gray-700 mt-2">Options:</label>
      {preview.options.map((option, index) => (
        <input
          key={index}
          type="text"
          value={option}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleOptionChange(index, e.target.value)
          }
          className="mt-2 py-2 px-4 border rounded-md w-full outline-none 
          focus:border-[#333]/30 focus:border transition-all duration-300 bg-white/90"
          required
        />
      ))}

      <button
        type="submit"
        className="border-0 bg-[#262626] text-[#fff] px-6 py-2 rounded mt-5
        text-sm hover:opacity-90 hover:scale-[0.99] transition-all"
      >
        See Preview
      </button>
    </form>
  );
};

export default QuestionForm;
