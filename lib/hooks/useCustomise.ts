import { customise } from "../api/customise";
import { useMutation, useQuery } from "react-query";

const useCustomise = () => {
  const { mutateAsync: AddQuestion } = useMutation(customise.addQuestion);
  const { mutateAsync: DeleteQuestion } = useMutation(customise.deleteQuestion);
  const { mutateAsync: UpdateQuestion } = useMutation(customise.updateQuestion);
  const { mutateAsync: AddQuiz } = useMutation(customise.addQuiz);
  const { mutateAsync: AddSkill } = useMutation(customise.addSkill);
  const { mutateAsync: AddSkills } = useMutation(customise.addSkills);
  // const { mutateAsync: EditSkills } = useMutation(customise.editSkills);
  const { mutateAsync: DeleteSkills } = useMutation(customise.deleteSkills);

  // FAQs
  const { mutateAsync: updateFAQ, isLoading: isEditing } = useMutation(
    customise.updateFAQ
  );
  const { mutateAsync: deleteFAQ, isLoading: isdeleting } = useMutation(
    customise.deleteFAQ
  );
  const { mutateAsync: createFAQ, isLoading: isCreating } = useMutation(
    customise.createFAQ
  );

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

  const {
    data: faqs,
    isLoading: loadingFaqs,
    refetch: refetchFaqs,
  } = useQuery(
    ["faqs"],
    () => {
      return customise.getFAQs();
    },
    { cacheTime: 30000, staleTime: 30000, refetchOnWindowFocus: true }
  );

  // const {
  //   data: singleFaq,
  //   isLoading: loadingFaq,
  //   refetch: refetchFaq,
  // } = useQuery(
  //   ["faqs", id], // Pass the id as part of the query key
  //   ({ queryKey }) => {
  //     const [, id] = queryKey; // Extract the id from the query key
  //     return customise.getSingleFaq(id);
  //   },
  //   {
  //     cacheTime: 30000,
  //     staleTime: 30000,
  //     refetchOnWindowFocus: true,
  //     enabled: !!id, // Ensure the query only runs if id is defined
  //   }
  // );

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
    DeleteSkills,
    faqs,
    loadingFaqs,
    refetchFaqs,
    updateFAQ,
    deleteFAQ,
    createFAQ,
    isEditing,
    isdeleting,
    isCreating,
  };
};

export default useCustomise;
