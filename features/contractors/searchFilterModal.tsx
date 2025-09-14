"use client";

import CheckBox from "@/app/_components/Check-box";
import { useCheckedList } from "@/context/checked-context";
import { useEffect, useState } from "react";
import { Header } from "../quiz/components";
import { motion, AnimatePresence } from "framer-motion";
import SubmitBtn from "@/components/ui/submit-btn";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

const FilterModal = ({ skills }: { skills: any[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center justify-between border border-gray-600 px-4 py-2 bg-white w-[150px] rounded-md"
        >
          <h2 className="font-semibold">Filter by skill</h2>
          {isOpen ? <span>&#9650;</span> : <span>&#9660;</span>}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <SkillModal skills={skills} close={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterModal;

const SkillModal = ({
  skills,
  close,
}: {
  skills: any[];
  close: () => void;
}) => {
  const [filteredSkills, setFilteredSkills] = useState(skills);
  const [value, setValue] = useState("");
  const { setCheckedList, checkedList, handleCheck } = useCheckedList();

  const pathname = usePathname();
  const router = useRouter();
  const param = useSearchParams();

  // Fetch the initial 'sort' parameter from the URL (query)
  const initialString = param.get("skills");
  const initialSortValue = initialString
    ? initialString.replace(/_/g, " ")
    : "";

  // Set the selected sort value state, initialize with the value from URL
  const [sortValue, setSortValue] = useState(initialSortValue);

  // On page load, ensure the sort value in the state is in sync with URL

  // Function to update the URL params and the state
  function updateUrlParams() {
    const strings = checkedList?.map((ski: any) => ski.name).join(",");
    const formattedValue = strings.toLowerCase(); // Replace spaces with underscores

    // console.log(formattedValue);

    // Update the URL query parameters
    if (strings === "") {
      router.replace(`${pathname}`, {
        scroll: false,
      }); // Remove query params if 'All' is selected (default)
    } else {
      const params = new URLSearchParams(window.location.search);
      params.set("skills", formattedValue); // Set the selected filter in query params
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }

    // Set the selected value in the state
    setSortValue(value);
    close();
  }

  const unSelect = () => {
    setCheckedList([]);

    router.replace(`${pathname}`, {
      scroll: false,
    });
    close();
  };

  useEffect(() => {
    if (!value) {
      setFilteredSkills(skills);
    } else {
      const filtered = skills.filter((skill: any) =>
        skill?.name?.toLowerCase()?.includes(value?.toLowerCase())
      );
      setFilteredSkills(filtered);
    }

    const sortFromParam = param.get("skills");
    if (sortFromParam) {
      const updatedSortValue = sortFromParam.replace(/_/g, " ");
      setSortValue(updatedSortValue); // Update state based on URL query params
    }
  }, [value, skills, param]);

  return (
    <motion.div
      key="modal"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-[550px] absolute bg-white h-[600px] z-50 rounded-md shadow-xl flex flex-col gap-8 py-8 px-4 top-14"
    >
      <div className="flex justify-between items-center">
        <Header title="Filter by skills" size="small" />

        <div className="flex items-center gap-2">
          {checkedList && (
            <button
              className="border border-gray-700 py-2 px-4 rounded-md"
              onClick={unSelect}
            >
              clear
            </button>
          )}
          <button
            className="border border-gray-500 h-6 w-6 rounded-full flex items-center justify-center"
            onClick={close}
          >
            <span className="text-black text-lg">&times;</span>
          </button>
        </div>
      </div>

      <div className="w-full">
        <input
          type="text"
          className="w-full border border-gray-600 h-10 rounded-md px-4"
          placeholder="Search skills"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 overflow-y-auto ">
        {filteredSkills?.map((skill: any) => (
          <span
            className="flex gap-3 items-center cursor-pointer"
            key={skill._id}
            onClick={() => handleCheck(skill)}
          >
            <CheckBox
              isChecked={checkedList?.some((data: any) => data === skill)}
              onClick={() => {}}
            />
            <span
              className={`${
                checkedList?.some((data: any) => data === skill)
                  ? "text-gray-800"
                  : "text-gray-400"
              }`}
            >
              {skill?.name}
            </span>
          </span>
        ))}
      </div>

      <SubmitBtn isSubmitting={false} spaceUp="" onClick={updateUrlParams}>
        Filter
      </SubmitBtn>
      {/* <div>
      </div> */}
    </motion.div>
  );
};
