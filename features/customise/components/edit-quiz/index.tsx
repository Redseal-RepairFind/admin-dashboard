"use client";
import { getAllQuestions } from "@/lib/api/api";
import { IQuestion } from "@/lib/types";
import React, { useEffect, useState } from "react";
import EditQuiz from "./edit-quiz";

const EditQuizTab = () => {
  const [questions, setQuestions] = useState<IQuestion[]>();
  const [isQuestionDeleted, setIsQuestionDeleted] = useState(false);
  console.log(isQuestionDeleted);
  useEffect(() => {
    getAllQuestions().then((res) => {
      setQuestions(res.questions);
    });
  }, [isQuestionDeleted]);
  return (
    <>
      <div className="flex flex-col gap-3 mt-6 mb-8">
        {questions?.map((item, index) => (
          <EditQuiz
            index={index + 1}
            key={index}
            question={item}
            setIsQuestionDeleted={setIsQuestionDeleted}
          />
        ))}
      </div>
    </>
  );
};

export default EditQuizTab;
