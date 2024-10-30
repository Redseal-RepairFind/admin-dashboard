"use client";
import React, { useState } from "react";
import Skills from "./skills";
import Quiz from "./quiz";
import EditQuizTab from "./edit-quiz/index";
import useCustomise from "@/lib/hooks/useCustomise";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import Promotion from "./promotions/Promotion";

const Tabs: React.FC = () => {
  const currentSessionTab =
    typeof window !== "undefined"
      ? sessionStorage.getItem("current_customise_tab")
      : "1";

  const sessionTab = currentSessionTab ? JSON.parse(currentSessionTab) : 1;

  const [activeTab, setActiveTab] = useState<number>(sessionTab);
  const [skillInputs, setSkillInputs] = useState<
    { id: number; value: string }[]
  >([{ id: 0, value: "" }]);
  const [isFulSkill, setIsFulSkill] = useState(false);
  const [openMenu, setOpenMenu] = useState<number | null>(null); // Track which menu is open
  const [modalOpen, setModalOpen] = useState(false);

  const handleTabChange = (tabNumber: number) => {
    sessionStorage.setItem("current_customise_tab", JSON.stringify(tabNumber));
    setActiveTab(tabNumber);
  };

  const { AddSkill, refetchSkills, AddSkills, skills } = useCustomise();

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

  const submitNewSkill = async () => {
    const newSkills = skillInputs.map((skill) => skill.value);
    if (!skillInputs) return toast.error("Please enter a skill");
    if (newSkills.includes("")) {
      return toast.error("Please fill all empty skill inputs");
    }
    toast.loading("Processing new skill(s)...");

    let data;
    try {
      if (skillInputs.length === 1) {
        data = await AddSkill({ name: skillInputs[0].value });
      } else if (skillInputs.length > 1) {
        data = await AddSkills({ skills: newSkills });
      }
      toast.remove();
      toast.success(data?.message);
      setSkillInputs([{ id: 0, value: "" }]);
      setTimeout(() => {
        refetchSkills();
      }, 1000);
    } catch (e: any) {
      toast.remove();
      toast.error(e?.response?.data?.message);
      console.log({ e });
    }
  };

  const handleSkillChange = (index: number, newValue: string) => {
    setSkillInputs((prevInputs) =>
      prevInputs.map((input, i) =>
        i === index ? { ...input, value: newValue } : input
      )
    );
  };

  const addSkillInput = () => {
    setSkillInputs((prevInputs) => [
      ...prevInputs,
      { id: prevInputs.length, value: "" },
    ]);
  };

  const removeSkillInput = (index: number) => {
    setSkillInputs((prevInputs) => prevInputs.filter((_, i) => i !== index));
  };

  // const skillsToRender = isFulSkill ? skills?.data : skills?.data?.slice(0, 10);

  // const closeModal = () => setModalOpen(false);
  // const openModal = () => setModalOpen(true);

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
          Add new skill
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
        {activeTab === 3 && (
          <div className="grid grid-cols-2">
            <div className="w-full pt-10">
              <div className="mt-4">
                <label
                  htmlFor="username"
                  className="block font-medium leading-6 text-gray-900 mb-4"
                >
                  New skill
                </label>

                {skillInputs.map((input, i) => (
                  <div className="flex items-center gap-4" key={i}>
                    <input
                      type="text"
                      name="skill"
                      id={`skill-${i}`}
                      autoComplete="skill"
                      className="w-[60%] border-0 py-2 px-3 mt-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 capitalize"
                      placeholder="Add new skill"
                      value={input.value}
                      onChange={(e) => handleSkillChange(i, e.target.value)}
                    />
                    {i !== 0 ? (
                      <button
                        onClick={() => removeSkillInput(i)}
                        className="font-bold text-3xl"
                      >
                        &times;
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="flex mt-10 items-center gap-2">
                <button
                  onClick={addSkillInput}
                  className="text-gray-600 mr-6 capitalize border border-[#262626] py-1.5 px-6 rounded-md"
                >
                  + new skill
                </button>
                <button
                  className="border-0 bg-[#262626] text-[#fff] px-6 py-2 rounded text-sm hover:opacity-90 hover:scale-[0.99] transition-all"
                  onClick={submitNewSkill}
                >
                  Publish Skills
                </button>
              </div>

              {/* <div className="mt-6">
          <h1 className="font-bold text-2xl mb-4">All Skills</h1>
          {skillsToRender?.map((skill: any, i: number) => (
            <div className="flex items-center gap-2 mb-4" key={i}>
            <span className="flex justify-center rounded-full items-center h-6 w-6 bg-white text-black text-sm">
            {i + 1}
            </span>
            
            <div className="grid grid-cols-[600px,100px] relative">
            <Modal isOpen={modalOpen} onClose={closeModal}>
            <div className="w-24">
            <input
                      type="text"
                      name="skill"
                      autoComplete="skill"
                      className="w-full border-0 py-2 px-3 mt-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 capitalize"
                      placeholder="Edit skill"
                      // value={}
                    />
                    <button>Edit </button>
                  </div>
                </Modal>
                <p className="text-sm ">{skill?.name}</p>
                <span>
                  <button
                  onClick={() => setOpenMenu(openMenu === i ? null : i)} // Toggle only the current skill's menu
                  >
                  <svg
                  xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="currentColor"
                      >
                      <circle cx="12" cy="5" r="2" />
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="12" cy="19" r="2" />
                      </svg>
                      </button>
                  {openMenu === i ? ( // Show menu only if openMenu matches the current index
                    <div className="absolute right-0 top-0 bg-gray-100 h-14 w-20 shadow-md">
                      <button
                        className="text-gray-500 w-full"
                        onClick={openModal}
                      >
                        Edit
                      </button>
                      <button className="text-gray-500 w-full">Delete</button>
                    </div>
                  ) : null}
                </span>
              </div>
            </div>
          ))}
          <button
          className="border-0 bg-[#262626] text-[#fff] px-6 py-2 rounded mt-10 text-sm hover:opacity-90 hover:scale-[0.99] transition-all mb-6"
          onClick={() => setIsFulSkill((is) => !is)}
          >
          {isFulSkill ? "Show less" : "Show all"}
          </button>
          </div> */}
            </div>
            <Skills />
          </div>
        )}
        {/* {activeTab === 4 && <Promotion />} */}
      </div>
    </div>
  );
};

export default Tabs;
