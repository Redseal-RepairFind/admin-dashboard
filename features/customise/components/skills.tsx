import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { FiChevronDown } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { getSkills } from "@/lib/api/api";
import { ISkills } from "@/lib/types";

export default function Skills() {
  const [skills, setSkills] = useState<ISkills>();
  useEffect(() => {
    getSkills().then((response) => {
      setSkills(response);
      // console.log(response);
    });
  }, []);

  return (
    <>
      <div className="bg-white pr-6 w-fit">
        <select className="py-[10px] px-4 capitalize w-full outline-none bg-transparent min-w-[200px] max-w-[200px]">
          <option>Available Skills</option>
          {skills?.skills.map((item, index) => (
            <option key={index} className="capitalize">
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
