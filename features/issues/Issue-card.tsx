"use client";
import { useEffect, useState } from "react";
import Heading from "../shared/table/components/table-heading";
import iconR from "@/public/Group.png";
import Image from "next/image";
import { useForm } from "react-hook-form";

const sanctionList = [
  {
    sanction: "High",
    message:
      "When the issue Level is High defendant is automatically Suspended from using the app",
    level: 3,
  },
  {
    sanction: "Medium",
    message: "When the issue Level is Medium defendant is Issued a strike",
    level: 2,
  },
  {
    sanction: "Low",
    message: "When the issue Level is Low defendant is Issued a strike",
    level: 1,
  },
  {
    sanction: "None",
    message: "No sanction will be issued",
    level: 0,
  },
];

function IssueCard({
  title,
  offender,
  setIssueData,
  handleOpenSanction,
  type = "issue",
}: {
  title: string;
  offender: "Customer" | "Contractor";
  setIssueData: any;
  handleOpenSanction: any;
  type?: "issue" | "dispute";
}) {
  const [sanction, setSanction] = useState({
    sanction: "Select",
    message: "",
    level: 0,
  });
  const [openSanctionList, setOpenSanctionList] = useState(false);
  // const [openSanctionList, setOpenSanctionList] = useState(false);

  const { register, handleSubmit, formState } = useForm();

  const { errors } = formState;

  const toggleSanctionList = () => setOpenSanctionList((open) => !open);

  function handleSaction(sanction: any) {
    setSanction(sanction); // Update sanction
    setOpenSanctionList(false); // Close the dropdown
  }

  useEffect(() => {
    setTimeout(() => setOpenSanctionList(false), 100);
  }, [sanction]);

  function handleSanction(data: any) {
    if (sanction.level < 1) alert("Please select an Issue Level ");
    setIssueData({
      reason: data.reason,
      level: sanction.level,
    });
    handleOpenSanction();
  }

  return (
    <div className="bg-[#f8f8f8] w-[800px] min-h-[400px] p-5">
      <Heading name={title} />

      <div className="rounded-md py-8 bg-white p-4">
        <h2>Issue Level</h2>
        <span
          className="h-12 w-full bg-[#f8f8f8] cursor-pointer relative flex justify-between items-center px-4 py-2 mb-4"
          onClick={toggleSanctionList}
        >
          <p>{sanction.sanction}</p>
          <div className="relative h-3 w-3">
            <Image src={iconR} fill alt="Icon" />
          </div>

          {openSanctionList ? (
            <div className="absolute right-0 -bottom-[200px] shadow-md bg-white rounded-lg w-32 p-2 flex flex-col gap-2">
              {sanctionList.map((level) => (
                <button
                  key={level.sanction}
                  onClick={() => handleSaction(level)}
                  className={` w-full text-left py-2 px-4 ${
                    sanction.sanction === level.sanction
                      ? "bg-black text-white"
                      : "text-black"
                  } hover:bg-gray-300 transition-all duration-300`}
                >
                  {level.sanction}
                </button>
              ))}
            </div>
          ) : null}
        </span>
        {sanction.message ? (
          <span className="bg-[#fff2f2] text-[12px] w-full h-12 mt-3 rounded-sm px-2 py-1">
            {sanction.message}
          </span>
        ) : null}
        {sanction.message ? (
          <form
            className="w-full border-t border-t-gray-300 mt-16"
            onSubmit={handleSubmit(handleSanction)}
          >
            <h2 className="py-4">Reason</h2>

            <textarea
              placeholder="Say Something"
              className="w-full bg-[#f8f8f8] p-4 rounded-md"
              rows={6}
              {...register("reason", {
                required: "Enter a good reason for this sanction",
              })}
            />
            {errors.reason && (
              <p className="text-red-500 text-sm">
                {errors?.reason?.message?.toString()}
              </p>
            )}

            <button
              className={`px-8 py-3 ${
                sanction.sanction === "None"
                  ? "bg-black"
                  : "bg-[#dd0a0a] hover:text-[#dd0404] hover:border hover:bg-white hover:border-[#dd0404] "
              } text-white rounded-md duration-500 transition-all`}
            >
              {sanction.sanction === "High"
                ? "Suspend"
                : sanction.sanction === "None"
                ? "Resolve"
                : "Strike"}
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}

export default IssueCard;
