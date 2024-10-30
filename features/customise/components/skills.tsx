"use client";

import useCustomise from "@/lib/hooks/useCustomise";
import { useState } from "react";
export default function Skills() {
  const { skills } = useCustomise();
  const [isFulSkill, setIsFulSkill] = useState<boolean>(false);

  console.log(skills);
  const skillsToRender = isFulSkill ? skills?.data : skills?.data?.slice(0, 10);
  return (
    <>
      <div className="bg-white p-4 w-fit rounded-md">
        {/* <select className="py-[10px] px-4 capitalize w-full outline-none bg-transparent min-w-[200px] max-w-[200px]"> */}
        {/* <option>Available Skills</option>
          {skills?.data?.map((item: any, index: number) => (
            <option key={index} className="capitalize">
              {item?.name}
            </option>
          ))}
        </select> */}

        <div className="mt-6">
          <h1 className="font-bold text-2xl mb-4">All Skills</h1>
          {skillsToRender?.map((skill: any, i: number) => (
            <div className="flex items-center gap-2 mb-4" key={i}>
              <span className="flex justify-center rounded-full items-center h-6 w-6 bg-white text-black text-sm">
                {i + 1}
              </span>

              <div className="grid grid-cols-[600px,100px] relative">
                <p className="text-sm ">{skill?.name}</p>
                {/* <span>
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
                </span> */}
              </div>
            </div>
          ))}
          <button
            className="border-0 bg-[#262626] text-[#fff] px-6 py-2 rounded mt-10 text-sm hover:opacity-90 hover:scale-[0.99] transition-all mb-6"
            onClick={() => setIsFulSkill((is) => !is)}
          >
            {isFulSkill ? "Show less" : "Show all"}
          </button>
        </div>
      </div>
    </>
  );
}
