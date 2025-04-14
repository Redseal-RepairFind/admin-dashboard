"use client";

import useCustomise from "@/lib/hooks/useCustomise";
import { useRef, useState } from "react";
import Modal from "react-responsive-modal";
import DeleteModal from "./promotions/DeleteModal";
import Heading from "@/features/shared/table/components/table-heading";
import toast from "react-hot-toast";
import { customise } from "@/lib/api/customise";
import SingleSkillForm from "./skills-form";

interface Skill {
  _id: string;
  name: string;
  verifiable: any;
}

export default function Skills() {
  const { skills, DeleteSkills, refetchSkills } = useCustomise();
  const editRef = useRef(null);
  const deleteRef = useRef(null);

  const [isFulSkill, setIsFulSkill] = useState(false);
  const skillsToRender = isFulSkill ? skills?.data : skills?.data?.slice(0, 10);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState({
    edit: {
      open: false,
      skillId: "",
    },
    delete: {
      open: false,
      skillId: "",
    },
  });
  const [editValue, setEditValue] = useState("");
  const [verifiable, setVerifiable] = useState<any>();

  if (!skillsToRender) return <h1>NO SKILLS TO RENDER</h1>;

  function openModal(type: "edit" | "delete", id: string) {
    setModalOpen({
      edit: { open: type === "edit", skillId: type === "edit" ? id : "" },
      delete: { open: type === "delete", skillId: type === "delete" ? id : "" },
    });

    setOpenMenu(null);
  }

  function closeModal(type: "edit" | "delete") {
    setModalOpen((prev) => ({
      ...prev,
      [type]: { open: false, skillId: "" },
    }));
    setOpenMenu(null);
  }

  async function mutateSkill(
    skillId: string,
    type: "edit" | "delete",
    name?: string
  ) {
    toast.loading(type === "edit" ? "Updating..." : "Deleting...");
    let data;
    try {
      // await EditSkills(skillId, { name: skillId });

      if (type === "edit") {
        const payload = {
          name: editValue || name,
          verifiable: verifiable === "true",
        };

        // console.log(payload);

        if (!payload) {
          toast.error("Please enter a valid skill name");
          return;
        }
        data = await customise.editSkills(skillId, payload);
        closeModal("edit");
        toast.remove();

        toast.success(`${name} skills successfully updated`);
      } else if (type === "delete") {
        data = await DeleteSkills(skillId);
        closeModal("delete");
        toast.remove();
        toast.success(`${name} skills deleted successfully`);
      }

      setTimeout(() => {
        refetchSkills();
      }, 1000);
    } catch (error: any) {
      toast.remove();
      toast.error(error?.response?.message);
    }
  }

  // console.log(skillsToRender);
  return (
    <div className="bg-white p-4 w-fit h-[600px] overflow-y-auto rounded-md z-10">
      <div className="mt-6 h-full w-full overflow-y-auto">
        <h1 className="font-bold text-2xl mb-4">All Skills</h1>
        {skillsToRender?.map((skill: Skill, i: number) => (
          <div className="flex items-center gap-2 mb-4" key={skill._id}>
            <span className="h-6 w-6 bg-white text-black text-sm z-10">
              {i + 1}
            </span>
            <Modal
              open={modalOpen.edit.open && modalOpen.edit.skillId === skill._id}
              onClose={() => closeModal("edit")}
              container={editRef.current}
              classNames={{ modal: "customModal" }}
            >
              <Heading name={`Edit ${skill?.name} Skill?`} />

              <SingleSkillForm
                isEdit={true}
                editData={skill}
                closeModal={() => closeModal("edit")}
              />
            </Modal>

            <Modal
              open={
                modalOpen.delete.open && modalOpen.delete.skillId === skill._id
              }
              onClose={() => closeModal("delete")}
              container={deleteRef.current}
              classNames={{ modal: "customModal" }}
            >
              <DeleteModal
                name={skill?.name}
                closeModal={() => closeModal("delete")}
                onSubmit={(type: "edit" | "delete") =>
                  mutateSkill(skill?._id, type, skill?.name)
                }
                type="Skill"
                title={`Delete ${skill?.name} Skill?`}
              />
            </Modal>

            <div className="grid grid-cols-[400px,100px] relative">
              <p className="text-sm">{skill.name}</p>
              <span>
                <button onClick={() => setOpenMenu(openMenu === i ? null : i)}>
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
                {openMenu === i && (
                  <div className="absolute right-0 top-0 bg-gray-100 h-14 w-20 shadow-md">
                    <button
                      className="text-gray-500 w-full text-start pl-2 border-b-2"
                      onClick={() => openModal("edit", skill._id)}
                    >
                      Edit
                    </button>

                    <button
                      className="text-gray-500 w-full text-start pl-2"
                      onClick={() => openModal("delete", skill._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
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
      </div>
    </div>
  );
}
