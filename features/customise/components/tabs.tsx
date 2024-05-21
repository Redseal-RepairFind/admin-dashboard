"use client";
import React from "react";
// components/Tabs.tsx
import { useState, useEffect } from "react";
import Skills from "./skills";
import Quiz from "./quiz";
import { addNewSkill } from "@/lib/api/api";
import EditQuizTab from "./edit-quiz/index";

const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [newSkill, setNewSkill] = useState<string>("");

  const handleTabChange = (tabNumber: number) => {
    setActiveTab(tabNumber);
  };

  const submitNewSkill = () => {
    addNewSkill({ name: newSkill }).then((res) => {
      console.log(res);
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-start gap-5">
        {/* ====== add a new quiz ===========  */}
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

        {/* ================= edit quiz =================  */}
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

        {/* ================ add new skill ==================  */}
        <button
          className={`px-6 py-2 text-sm rounded transition-all duration-300 ${
            activeTab === 3
              ? "bg-white border border-[#262626] text-[#262626]"
              : "bg-white"
          }`}
          onClick={() => handleTabChange(3)}
        >
          Add new skill
        </button>
      </div>
      <div className="mt-2">
        {activeTab === 1 && (
          <>
            <Quiz />
          </>
        )}
        {activeTab === 2 && <EditQuizTab />}
        {activeTab === 3 && (
          <>
            <div className="w-[50%] pt-10">
              <Skills />
              <div className="mt-4">
                <label
                  htmlFor="username"
                  className="block font-medium leading-6 text-gray-900 mb-4"
                >
                  New skill
                </label>
                <input
                  type="text"
                  name="skill"
                  id="skill"
                  autoComplete="skill"
                  className="w-[100%] border-0 py-2 px-3 mt-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 capitalize"
                  placeholder="add new skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                />
              </div>
              <button
                className="border-0 bg-[#262626] text-[#fff] px-6 py-2 rounded mt-10 text-sm hover:opacity-90 hover:scale-[0.99] transition-all"
                onClick={submitNewSkill}
              >
                Publish
              </button>
            </div>
          </>
        )}
        {/* Add more tabs and their content as needed */}
      </div>
    </div>
  );
};

export default Tabs;
