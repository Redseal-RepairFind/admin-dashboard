import React from "react";
import ContractorCard from "./contractor-card";

const TopContractors = () => {
  return (
    <>
      <div className="bg-white rounded-md px-8 py-10 mt-8 overflow-x-auto">
        <p className="text-lg text-[#7b7b7b] font-[600] mb-10">
          Top-travelling contractors
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-10">
          <ContractorCard
            name="Allen’s coaster services"
            skill="Furniture Assembler"
            number={3}
          />

          <ContractorCard
            name="Ade's Plumbing services"
            skill="Plumbing"
            number={2}
          />

          <ContractorCard
            name="Ola and sons ltd."
            skill="Real estate marketing"
            number={4}
          />
          <ContractorCard
            name="Muhsin’s telecommunications"
            skill="Telecom retails"
            number={5}
          />
          <ContractorCard
            name="Ade's Plumbing services"
            skill="Plumbing"
            number={2}
          />

          <ContractorCard
            name="Yusuf's properties ltd."
            skill="Real estate marketing"
            number={3}
          />
        </div>
      </div>
    </>
  );
};

export default TopContractors;
