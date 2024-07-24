import Image from "next/image";
import React from "react";
import Img from "./Img";

const ContractorInfo = ({ info, title }: { info: any; title: any }) => {
  return (
    <div className="p-3 rounded-md bg-white flex items-start justify-between gap-5">
      <div className="bg-gray-100 rounded-full overflow-hidden w-10 h-10 flex items-center justify-center">
        <Img url={info?.profilePhoto?.url} />
      </div>
      <div className="flex-1">
        <p className="text-gray-400">{title}</p>
        <p className="font-semibold mt-2">
          {info?.firstName} {info?.lastName}
        </p>
        <p className="mt-2 text-sm text-gray-500 font-medium">
          Phone Number: {info?.phoneNumber?.code}
          {info?.phoneNumber?.number}
        </p>
        <p className="mt-2 text-sm text-gray-500 font-medium">
          Email: {info?.email}
        </p>
      </div>
    </div>
  );
};

export default ContractorInfo;
