import React from "react";
import Header from "../shared/inner-pages/header";
import Wrapper from "../shared/inner-pages/wrapper";
import { filledArrayFromNumber } from "@/lib/utils/array-from-number";
import { RatingStar } from "@/public/svg";
import GoBack from "../shared/go-back-button/go-back";
import BorderRectangle from "../shared/inner-pages/bordered-rect";
import SingleLineColumn from "../shared/inner-pages/single-line-column";
import JobsHistory from "./components/job-history";
import DownloadButton from "../shared/page-body/download-button";

const SingleRep = () => {
  return (
    <>
      <Header>
        <Wrapper>
          <div className="flex gap-x-6 items-center">
            <div className="w-[86px] h-[86px] rounded-[50%] bg-[#D9D9D9] flex items-center justify-center">
              <p className="text-[30px] font-[600] text-white">RO</p>
            </div>

            <div className="-mt-2">
              <p className="text-[28px] font-[600]">Raphael Okoye</p>
              <div className="flex gap-x-1">
                {filledArrayFromNumber(5).map((item, index) => (
                  <RatingStar key={index} />
                ))}
              </div>
            </div>
          </div>
        </Wrapper>
      </Header>

      <Wrapper>
        <div className="my-8">
          <GoBack />
        </div>
        <div className="">
          <BorderRectangle>
            <table className="w-full">
              <tbody>
                <SingleLineColumn name="Email" value="raphaelokoye@gmail.com" />
                <SingleLineColumn name="Contact" value="+49 17687934521" />
                <SingleLineColumn name="Amount Spent" value="$4,000" />
                <SingleLineColumn name="Position" value="Admin" />
                <SingleLineColumn
                  name="Payment account"
                  value="1256437890876"
                />
                <SingleLineColumn
                  name="Address"
                  value="2464 Royal Ln. Mesa, New Jersey 45463"
                />
              </tbody>
            </table>
          </BorderRectangle>
        </div>

        <div className="mt-24 mb-10 flex flex-col">
          <div className="self-end mb-7">
            <DownloadButton text="Download JOB HISTORY" />
          </div>
          <JobsHistory />
        </div>
      </Wrapper>
    </>
  );
};

export default SingleRep;
