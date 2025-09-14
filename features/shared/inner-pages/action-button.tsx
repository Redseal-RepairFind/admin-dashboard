import React from "react";

interface IProps {
  actionName: string;
  onClick: (status?: string) => void;
  color: string;
}

const ActionButton: React.FC<IProps> = ({ onClick, actionName, color }) => {
  return (
    <>
      <button
        onClick={() => onClick()}
        type="button"
        className={`text-xs border ${color} font-[600] px-6 py-1 rounded-[20px] outline-none hover:opacity-80`}
      >
        {actionName}
      </button>
    </>
  );
};

export default ActionButton;
