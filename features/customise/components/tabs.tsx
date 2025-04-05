"use client";
import React, { useState } from "react";
import Skills from "./skills";
import Quiz from "./quiz";
import EditQuizTab from "./edit-quiz/index";
import useCustomise from "@/lib/hooks/useCustomise";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import Promotion from "./promotions/Promotion";
import SkillsTab from "./skills-tab";
import Faqs from "./faqs";
import Tips from "./tips";

const Tabs: React.FC = () => {
  const currentSessionTab =
    typeof window !== "undefined"
      ? sessionStorage.getItem("current_customise_tab")
      : "1";

  const sessionTab = currentSessionTab ? JSON.parse(currentSessionTab) : 1;

  const [activeTab, setActiveTab] = useState<number>(sessionTab);

  const handleTabChange = (tabNumber: number) => {
    sessionStorage.setItem("current_customise_tab", JSON.stringify(tabNumber));
    setActiveTab(tabNumber);
  };

  // const tabs = [
  //   {
  //     name: "Set Quiz",
  //     path: "/customise/quiz",
  //   },
  //   {
  //     name: "Edit Quiz",
  //     path: "/customise/quiz/edit_quiz",
  //   },
  //   {
  //     name: "Add new Skill",
  //     path: "/customise/new_skill",
  //   },
  //   {
  //     name: "Promotion",
  //     path: "/customise/promotion",
  //   },
  // ];

  // const skillsToRender = isFulSkill ? skills?.data : skills?.data?.slice(0, 10);

  return (
    <div className="flex flex-col">
      <div className="flex justify-start gap-5">
        <button
          className={`px-6 py-2 text-sm rounded transition-all duration-300 ${
            activeTab === 1
              ? "bg-white border border-[#262626] text-[#262626]"
              : "bg-white"
          }`}
          onClick={() => handleTabChange(1)}
        >
          Set Quiz
        </button>

        <button
          className={`px-6 py-2 text-sm rounded transition-all duration-300 ${
            activeTab === 2
              ? "bg-white border border-[#262626] text-[#262626]"
              : "bg-white"
          }`}
          onClick={() => handleTabChange(2)}
        >
          Edit Quiz
        </button>

        <button
          className={`px-6 py-2 text-sm rounded transition-all duration-300 ${
            activeTab === 3
              ? "bg-white border border-[#262626] text-[#262626]"
              : "bg-white"
          }`}
          onClick={() => handleTabChange(3)}
        >
          Manage skills
        </button>

        <button
          className={`px-6 py-2 text-sm rounded transition-all duration-300 ${
            activeTab === 4
              ? "bg-white border border-[#262626] text-[#262626]"
              : "bg-white"
          }`}
          onClick={() => handleTabChange(4)}
        >
          FAQs
        </button>

        <button
          className={`px-6 py-2 text-sm rounded transition-all duration-300 ${
            activeTab === 5
              ? "bg-white border border-[#262626] text-[#262626]"
              : "bg-white"
          }`}
          onClick={() => handleTabChange(5)}
        >
          Tips
        </button>

        {/* <button
          className={`px-6 py-2 text-sm rounded transition-all duration-300 ${
            activeTab === 4
            ? "bg-white border border-[#262626] text-[#262626]"
              : "bg-white"
          }`}
          onClick={() => handleTabChange(4)}
        >
          Promotion
          </button> */}
      </div>
      <div className="mt-2">
        {activeTab === 1 && <Quiz />}
        {activeTab === 2 && <EditQuizTab />}
        {activeTab === 3 && <SkillsTab />}
        {activeTab === 4 && <Faqs />}
        {activeTab === 5 && <Tips />}

        {/* {activeTab === 4 && <Promotion />} */}
      </div>
    </div>
  );
};

export default Tabs;
