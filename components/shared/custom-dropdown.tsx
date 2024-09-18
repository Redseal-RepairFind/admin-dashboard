import React from "react";
import Select from "react-select";
import "./dropdown.css";

const customStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    padding: 10,
    backgroundColor: state.isFocused ? "#023047" : "white",
    color: state.isFocused ? "white" : "black",
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    outline: "none", // Apply custom border style
    boxShadow: state.isFocused && "0 0 0 transparent",
  }),
};

const CustomDropdown = ({
  width,
  value,
  onChange,
  options,
  isMulti,
  defaultValue,
  placeholder = null,
}: {
  width: any;
  value: any;
  onChange: any;
  options: any;
  isMulti: any;
  defaultValue: any;
  placeholder: any;
}) => {
  return (
    <div className={width ? width : "w-[200px]"}>
      <Select
        options={options}
        className=" border border-gray-200 py-1 rounded-md text-sm focus:ring-0 focus:outline-none" // Apply custom CSS class
        classNamePrefix="dropdown"
        styles={customStyles}
        defaultValue={defaultValue}
        placeholder={placeholder ? placeholder : "Add Permissions"}
        value={value}
        onChange={onChange}
        isMulti={isMulti}
        isClearable={false}
        closeMenuOnSelect={false}
      />
    </div>
  );
};

export default CustomDropdown;
