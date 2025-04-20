import { customise } from "@/lib/api/customise";
import useCustomise from "@/lib/hooks/useCustomise";
import { useState } from "react";
import toast from "react-hot-toast";

const translateSkills = [
  {
    name: "English",
    label: "en",
  },
  {
    name: "Spanish",
    label: "es",
  },
  {
    name: "French",
    label: "fr",
  },
  {
    name: "Mandarin",
    label: "zh",
  },
  {
    name: "Punjabi",
    label: "pa",
  },
];

const SingleSkillForm = ({
  isEdit,
  editData,
  closeModal,
}: {
  isEdit: boolean;
  editData?: any;
  closeModal?: any;
}) => {
  const initialState = {
    name: editData?.name || "",
    verifiable: false,
    translations: editData?.translations?.name || {
      en: "",
      es: "",
      fr: "",
      zh: "",
      pa: "",
    },
  };

  const initLanguage = {
    name: "English",
    label: "en",
  };
  const [singleSkill, setSingleSkill] = useState<any>(initialState);
  const [itsSingle, setItsSingle] = useState(true);
  // const [language, setLanguage] = useState(initLanguage);
  const { AddSkill, refetchSkills } = useCustomise();

  // console.log(editData);

  // SINGLE SKILLS
  const handleSingleSkill = (language: string, value: string) => {
    setSingleSkill((prev: any) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [language]: value,
      },
    }));
  };

  // const handleLanguageChange = (lang: { name: string; label: string }) => {
  //   if (!singleSkill.name) {
  //     toast.error("Enter a Skill to be translated");
  //   }
  //   if (singleSkill.translations[language.label] === "") {
  //     toast.error("Kindly Translate the current Language before you proceed");
  //     return;
  //   }

  //   setLanguage(lang);
  // };

  const submit = async () => {
    if (itsSingle) {
      if (!singleSkill.name) {
        toast.error("Enter a Skill to be translated");
      }
      if (
        !singleSkill.translations.es ||
        // !singleSkill.translations.en ||
        !singleSkill.translations.fr ||
        !singleSkill.translations.zh ||
        !singleSkill.translations.pa
      ) {
        toast.error("Kindly fill in all language translations");
        return;
      }
      toast.loading(`${isEdit ? "Editing" : "Processing"} skill...`);

      const payload = {
        ...singleSkill,
        translations: {
          name: {
            ...singleSkill.translations,
            en: singleSkill.name,
          },
        },
      };

      console.log(payload);

      if (isEdit) {
        await customise.editSkills(editData?._id, payload);
        closeModal("edit");
        toast.remove();

        toast.success(`${editData?.name} skills successfully updated`);
        setSingleSkill(initialState);

        // setLanguage(initLanguage);
        refetchSkills();

        return;
      }

      await AddSkill(payload);
      setSingleSkill(initialState);
      // setLanguage(initLanguage);
      toast.remove();

      toast.success(` Skill successfully created`);
      refetchSkills();
    }
  };

  return (
    <div className="flex flex-col gap-5 mt-8">
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap w-full">
          <label htmlFor="skillname">Skill Name</label>
          <input
            type="text"
            name="skill"
            autoComplete="skill"
            className={` rounded-md py-2 px-3 mt-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 capitalize ${
              isEdit ? "border border-gray-600 w-full" : "w-[60%]  border-0"
            }`}
            placeholder="Add skill name"
            value={singleSkill.name}
            onChange={(e) =>
              setSingleSkill({
                ...singleSkill,
                name: e.target.value,
              })
            }
          />
        </div>
      </div>

      <span className={` flex flex-col items-cente gap-2 w-[60%]`}>
        <label htmlFor="Verifiable">Verifiable</label>
        <select
          name="verifiable"
          id={`verifiable`}
          className={`w-1/2 p-2 rounded-md ${
            isEdit ? "border border-gray-500" : ""
          }`}
          value={singleSkill.verifiable}
          onChange={(e) =>
            setSingleSkill({
              ...singleSkill,
              verifiable: e.target.value,
            })
          }
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      </span>

      <div className="w-full flex flex-col gap-5">
        <p>Translations</p>
        <div className={`grid grid-cols-2 gap-2 ${isEdit ? "" : "pr-4"} `}>
          {translateSkills.map(
            (
              trns: {
                name: string;
                label: string;
              },
              i
            ) => (
              // <button
              //   className="flex items-center gap-2"
              //   key={i}
              //   onClick={() => handleLanguageChange(trns)}
              // >
              //   <span
              //     className={` ${
              //       trns.name === language.name
              //         ? "bg-black"
              //         : "bg-gray-300 border-black border"
              //     } h-5 w-5 rounded-full flex items-center justify-center shadow-lg`}
              //   >
              //     {trns.name === language.name ? (
              //       <span className="text-white">&#10003;</span>
              //     ) : null}
              //   </span>
              //   <p
              //     className={`text-sm ${
              //       trns.name === language.name ? "text-black" : "text-gray-400"
              //     }`}
              //   >
              //     {trns.name}
              //   </p>
              // </button>
              <div className="flex flex-col  w-full" key={i}>
                <label htmlFor="skillname">{trns?.name}</label>

                <input
                  type="text"
                  name={trns.label}
                  // autoComplete="skill"
                  className={` rounded-md py-2 px-3 mt-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 capitalize ${
                    isEdit
                      ? "border border-gray-600 w-full"
                      : "w-full  border-0"
                  }`}
                  placeholder={`translate to ${trns.name}`}
                  value={
                    trns.name === "English"
                      ? singleSkill.name
                      : singleSkill.translations[trns.label]
                  }
                  onChange={(e) =>
                    handleSingleSkill(trns.label, e.target.value)
                  }
                />
              </div>
            )
          )}
        </div>
        {/* <div className="flex flex-col gap-2 w-full">
          <label htmlFor="skillname">{language?.name}</label>
          <input
            type="text"
            name="skill"
            // autoComplete="skill"
            className={` rounded-md py-2 px-3 mt-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 capitalize ${
              isEdit ? "border border-gray-600 w-full" : "w-[60%]  border-0"
            }`}
            placeholder=""
            value={singleSkill.translations[language.label]}
            onChange={(e) => handleSingleSkill(language.label, e.target.value)}
          />
        </div> */}
      </div>

      <div className="flex mt-10 items-center gap-2">
        <button
          className="border-0 bg-[#262626] text-[#fff] px-6 py-2 rounded text-sm hover:opacity-90 hover:scale-[0.99] transition-all"
          onClick={submit}
        >
          Publish Skills
        </button>
      </div>
    </div>
  );
};

export default SingleSkillForm;
