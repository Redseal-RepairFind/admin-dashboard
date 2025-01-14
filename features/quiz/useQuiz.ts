import { quiz } from "@/lib/api/quiz";
import { useSearchParams } from "next/navigation";
import { useEffect, useReducer, useState } from "react";
import { useQuery } from "react-query";

export function useQuiz() {
  const paramsSession = useSearchParams();

  const session =
    paramsSession.get("session") ||
    "66f801fa2f33d3e40fe741a2%25668092d2c471ba08168f71cd";
  // const { data: questions, isLoading: isLoadingQuestions } = useQuery(
  //   ["questions"],
  //   () => quiz.getQuestions()
  // );

  const { data: questions, isLoading: isLoadingQuestions } = useQuery(
    ["sessionQuiz"],
    () => quiz.getQuiz(session)
  );

  // console.log(sessionQuiz);

  const initialState = {
    selectedAnswer: "",
    submitted: false,
    videoEnded: true,
    userAnswers: [],
    currentQuestion: {
      quizIndex: 0,
      currentQuiz: questions?.data?.questions?.[0], // Set as `null` initially
    },
  };

  function quizReducer(state: any, action: any) {
    switch (action.type) {
      case "SET_SELECTED_ANSWER":
        return {
          ...state,
          selectedAnswer: action.payload,
          submitted: true, // Automatically mark as submitted
        };

      case "RESET":
        return initialState;
      case "RESET_SELECTED_ANSWER":
        return { ...state, selectedAnswer: "" };

      case "NEXT_QUESTION":
        if (!questions?.data?.questions) {
          return state; // No questions available yet
        }
        const nextIndex =
          action.payload === "next"
            ? state.currentQuestion.quizIndex + 1
            : state.currentQuestion.quizIndex - 1;

        return {
          ...state,
          submitted: false,
          selectedAnswer: "",
          currentQuestion: {
            quizIndex: nextIndex,
            currentQuiz: questions.data.questions[nextIndex], // Access safely
          },
        };

      case "USER_ANSWER":
        return {
          ...state,
          userAnswers: [...state.userAnswers, action.payload],
        };
      default:
        return state;
    }
  }
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const [isNext, setIsNext] = useState(true);

  const time = 1200;

  const [seconds, setSeconds] = useState(time);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (
      questions?.data?.questions &&
      state.currentQuestion.currentQuiz === null
    ) {
      // dispatch({
      //   type: "NEXT_QUESTION",
      //   payload: "next",
      // });
    }
  }, [questions, state.currentQuestion.currentQuiz]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const initialAnswers = sessionStorage.getItem("userAnswer");
      if (!initialAnswers) {
        const stringedValue = JSON.stringify(state.userAnswers);
        sessionStorage.setItem("userAnswer", stringedValue);
      }
    }
  }, [state.userAnswers]);

  function handleResetSelectedOption() {
    dispatch({ type: "RESET_SELECTED_ANSWER" });
  }

  function handleSelectOption(
    option: string,
    id: string,
    correctAnswer: string
  ) {
    // Retrieve and parse existing answers from sessionStorage
    const answerSession = JSON.parse(
      sessionStorage.getItem("userAnswer") || "[]"
    );

    // Check if the question has already been answered
    const answeredIndex = answerSession.findIndex(
      (answer: any) => answer.id === id
    );

    // Prepare the new answer object
    const curAnswer = {
      id,
      answerGiven: option,
      point: option === correctAnswer ? 1 : 0,
    };

    // Update the session answers
    if (answeredIndex !== -1) {
      // If already answered, replace the existing answer
      answerSession[answeredIndex] = curAnswer;
    } else {
      // If not answered, add the new answer
      answerSession.push(curAnswer);
    }

    // Save the updated answers back to sessionStorage
    sessionStorage.setItem("userAnswer", JSON.stringify(answerSession));

    // Update the state with the selected answer
    dispatch({ type: "SET_SELECTED_ANSWER", payload: option });
  }

  function submitAnswer() {
    if (state.selectedAnswer) {
      dispatch({ type: "SUBMIT_ANSWER" });
    }
  }
  function handleNextOrPrev(direction: "next" | "prev") {
    dispatch({ type: "NEXT_QUESTION", payload: direction });
  }

  function handleSubmit(answerGiven: { id: string; answerGiven: string }) {
    dispatch({ type: "USER_ANSWER", payload: answerGiven });
  }
  function handleUserAnswers(answerGiven: {
    id: string;
    answerGiven: string;
    point: number;
  }) {
    dispatch({ type: "USER_ANSWER", payload: answerGiven });
  }

  // const { data: quizes, isLoading: isLoadingQuizzes } = useQuery(
  //   ["quiz"],
  //   () => quiz.getVideos(),
  //   { staleTime: 300000 } // 5 minutes
  // );

  return {
    ...state,
    handleSelectOption,
    submitAnswer,
    handleResetSelectedOption,
    handleSubmit,

    questions,
    isLoadingQuestions,
    handleNextOrPrev,
    isNext,
    setIsNext,
    handleUserAnswers,
    seconds,
  };
}
