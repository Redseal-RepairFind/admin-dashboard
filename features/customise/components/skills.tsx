import useCustomise from "@/lib/hooks/useCustomise";

export default function Skills() {
  const { skills } = useCustomise();

  // console.log(skills);

  return (
    <>
      <div className="bg-white pr-6 w-fit">
        <select className="py-[10px] px-4 capitalize w-full outline-none bg-transparent min-w-[200px] max-w-[200px]">
          <option>Available Skills</option>
          {skills?.data?.map((item: any, index: number) => (
            <option key={index} className="capitalize">
              {item?.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
