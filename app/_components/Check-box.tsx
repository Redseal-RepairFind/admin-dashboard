import { Check } from "@/public/svg";

function CheckBox({
  isChecked,
  onClick,
}: {
  isChecked: boolean;
  onClick: (event: any) => void;
}) {
  return (
    <button onClick={onClick} className="" type="button">
      <span
        className={`h-4 w-4 rounded-sm border flex items-center justify-center border-black ${
          isChecked ? " bg-black " : ""
        }`}
      >
        {isChecked ? <Check /> : null}
      </span>
    </button>
  );
}

export default CheckBox;
