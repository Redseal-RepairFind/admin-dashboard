import { customise } from "../api/customise";
import { useMutation, useQuery } from "react-query";

const useCustomise = () => {
  const { mutateAsync: AddQuestion } = useMutation(customise.addQuestion);
  const { mutateAsync: DeleteQuestion } = useMutation(customise.deleteQuestion);
  const { mutateAsync: UpdateQuestion } = useMutation(customise.updateQuestion);
  const { mutateAsync: AddQuiz } = useMutation(customise.addQuiz);
  const { mutateAsync: AddSkill } = useMutation(customise.addSkill);
  const { mutateAsync: AddSkills } = useMutation(customise.addSkills);

  const {
    data: quiz,
    isLoading,
    refetch: refetchQuizzes,
  } = useQuery(
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
    DeleteQuestion,
    UpdateQuestion,
    isLoading,
    refetchQuizzes,
    AddSkills,
  };
};

export default useCustomise;
