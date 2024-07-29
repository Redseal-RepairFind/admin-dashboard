import React from "react";
import Img from "./Img";

const CustomerMedia = ({ data }: { data: any }) => {
  return (
    <div className="p-2">
      <h1 className="underline">Pictures before job started</h1>
      <div className="mt-2 mb-5 grid md:grid-cols-4 grid-cols-1">
        {data?.preMedia?.map((url: any, index: number) => (
          <div className="flex items-start justify-start" key={index}>
            <Img url={url} />
          </div>
        ))}
      </div>
      <h1 className="underline">Pictures after job ended</h1>
      <div className="mt-2 mb-5 grid md:grid-cols-4 grid-cols-1">
        {data?.postMedia?.map((url: any, index: number) => (
          <div className="flex items-start justify-start" key={index}>
            <Img url={url} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerMedia;
