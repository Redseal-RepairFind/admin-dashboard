import { customise } from "../api/customise";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

const useCustomise = () => {
  const { mutateAsync: AddQuestion } = useMutation(customise.addQuestion);
  const { mutateAsync: AddQuiz } = useMutation(customise.addQuiz);
  const { mutateAsync: AddSkill } = useMutation(customise.addSkill);

  const { data: quiz, isLoading } = useQuery(
    ["Customers"],
    () => {
      return customise.getQuizzes();
    },
    { cacheTime: 30000, staleTime: 30000, refetchOnWindowFocus: true }
  );

  const {
    data: skills,
    isLoading: loadingSkills,
    refetch: refetchSkills,
  } = useQuery(
    ["Skills"],
    () => {
      return customise.getSkills();
    },
    { cacheTime: 30000, staleTime: 30000, refetchOnWindowFocus: true }
  );

  return {
    AddQuestion,
    AddQuiz,
    quiz,
    skills,
    loadingSkills,
    refetchSkills,
    AddSkill,
  };
};

export default useCustomise;
