/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/navigation";
import React from "react";
import Img from "../../dispute/components/Img";

const Notification = ({ data }: { data: any }) => {
  const router = useRouter();

  // console.log(data);

  return (
    <div className="border flex items-center justify-between border-gray-100 mb-2 shadow-sm rounded-md p-3">
      <div className="flex items-center justify-center flex-col">
        <h1 className="font-medium text-sm">{data?.heading?.name}</h1>
        <div className="w-[60px] h-[60px] overflow-hidden border border-gray-200 shadow-md rounded-full flex items-center justify-center">
          <img
            src={`${data?.heading?.image}`}
            alt="gg"
            className="object-cover"
          />
        </div>
      </div>
      <p className="max-w-[300px]">{data?.message}</p>
      {(data?.message?.includes("dispute") ||
        data?.message?.includes("emerg")) && (
        <button
          onClick={() => {
            if (data?.message?.includes("dispute"))
              return router.push(`/dispute/${data?.entity}`);

            if (data?.message?.includes("emerg"))
              return router.push(`/emergency/${data?.entity}`);
          }}
          className="bg-black text-sm text-white py-2 px-3 rounded-md"
        >
          {data?.message?.includes("dispute")
            ? "Go to Dispute"
            : "Go to Emergency"}
        </button>
      )}
    </div>
  );
};

export default Notification;
