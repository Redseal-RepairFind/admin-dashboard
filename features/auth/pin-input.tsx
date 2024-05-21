"use client";
import React, { useEffect, useRef, useState } from "react";
// This a fix for the refiring of the change and keydown events
let currentIndex: number = 0;

interface IProps {
  label: string;
  setPinArr: React.Dispatch<React.SetStateAction<string[]>>;
  pinArr: string[];
}

const PinInput: React.FC<IProps> = ({ label, pinArr, setPinArr }) => {
  const [activeBoxIndex, setActiveBoxIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // control focus on an input box whenever the active index changes
    const input = inputRef?.current;
    input?.focus();
  }, [activeBoxIndex]);

  // Prevent the on scroll functionality set
  // by default on an input box of type number
  const stopScrollIncrement = (): void => {
    const input = inputRef?.current;
    document.addEventListener("wheel", () => {
      input?.setAttribute("type", "text");
    });
  };

  const handleChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = target;

    // Get only the last value of the target input
    const lastValue = value.substring(value.length - 1);
    // Re-create pinArr for immutability
    const newpinArr: string[] = [...pinArr];
    //set the value of each index on the pin array of five
    newpinArr[currentIndex] = lastValue;
    !value
      ? setActiveBoxIndex(currentIndex - 1)
      : setActiveBoxIndex(currentIndex + 1);
    setPinArr(newpinArr);
  };

  const handleKeyDown = (
    { key }: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ): void => {
    currentIndex = index;

    if (key === "Backspace") setActiveBoxIndex(currentIndex - 1);
  };

  return (
    <>
      <div>
        <label className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </label>
        <div className="flex gap-1 sm:gap-3">
          {pinArr.map((item, index) => (
            <input
              key={index}
              ref={index === activeBoxIndex ? inputRef : null}
              type="number"
              placeholder="-"
              name="pin"
              min={0}
              max={9}
              id="index"
              onFocus={stopScrollIncrement}
              onChange={handleChange}
              onKeyDown={(event) => handleKeyDown(event, index)}
              value={pinArr[index]}
              className="w-14 h-14 flex flex-col items-center justify-center 
              text-center px-4 outline-none rounded-xl border 
            border-gray-200 text-lg bg-white focus:bg-gray-50 
              focus:ring-1 ring-[#444]"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default PinInput;
