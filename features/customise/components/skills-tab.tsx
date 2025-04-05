"use client";

import useCustomise from "@/lib/hooks/useCustomise";
import { useState } from "react";
import toast from "react-hot-toast";
import Skills from "./skills";

function SkillsTab() {
  const [skillInputs, setSkillInputs] = useState<
    { id: number; value: string; verifiable: any }[]
  >([{ id: 0, value: "", verifiable: false }]);
  const [isFulSkill, setIsFulSkill] = useState(false);

  const { AddSkill, refetchSkills, AddSkills, skills } = useCustomise();

  const submitNewSkill = async () => {
    const newSkills = skillInputs.map((skill) => skill.value);
    if (!skillInputs) return toast.error("Please enter a skill");
    if (newSkills.includes("")) {
      return toast.error("Please fill all empty skill inputs");
    }
    toast.loading("Processing new skill(s)...");

    let data;
    // console.log(skillInputs);
    try {
      if (skillInputs.length === 1) {
        data = await AddSkill({
          name: skillInputs[0].value,
          verifiable: skillInputs[0].verifiable,
        });
      } else if (skillInputs.length > 1) {
        data = await AddSkills({ skills: newSkills });
      }
      toast.remove();
      // toast.success(data?.message);
      // console.log(data);
      setSkillInputs([{ id: 0, value: "", verifiable: false }]);
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

  const handleVerifiable = (index: number, newValue: string) => {
    setSkillInputs((prevInputs) =>
      prevInputs.map((input, i) =>
        i === index
          ? { ...input, verifiable: newValue === "true" } // Converts string to boolean
          : input
      )
    );
  };

  const addSkillInput = () => {
    setSkillInputs((prevInputs) => [
      ...prevInputs,
      { id: prevInputs.length, value: "", verifiable: false },
    ]);
  };

  const removeSkillInput = (index: number) => {
    setSkillInputs((prevInputs) => prevInputs.filter((_, i) => i !== index));
  };
  return (
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
            <div key={i}>
              <div className="flex items-center gap-4">
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

              <span className="mt-4 mb-6 flex items-center gap-4 w-[60%]">
                <label htmlFor="Verifiable">Verifiable</label>
                <select
                  name="verifiable"
                  id={`verifiable-${i}`}
                  className="w-1/2 p-2"
                  value={input.verifiable}
                  onChange={(e) => handleVerifiable(i, e.target.value)}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </span>
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
      </div>
      <Skills />
    </div>
  );
}

export default SkillsTab;
