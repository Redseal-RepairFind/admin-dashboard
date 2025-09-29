import React from "react";
import Header from "../shared/inner-pages/header";
import Wrapper from "../shared/inner-pages/wrapper";
import BorderRectangle from "@/features/shared/inner-pages/bordered-rect";
import ProfileColumn from "@/features/shared/inner-pages/profile-column";

import userOne from "@/public/user-one.png";
import userTwo from "@/public/user-two.png";
import SingleLineColumn from "@/features/shared/inner-pages/single-line-column";
import StatusColumn from "@/features/shared/inner-pages/status-column";
import DescriptionColumn from "@/features/shared/inner-pages/description-column";
import { filledArrayFromNumber } from "@/lib/utils/array-from-number";
import { RatingStar } from "@/public/svg";
import GoBack from "../shared/go-back-button/go-back";

const ViewCustomer = () => {
  const text = `Lorem ipsum dolor sit amet consectetur. At leo felis etiam massa maecenas eget fermentum lacus. Lorem ipsum dolor sit amet consectetur. At leo felis etiam massa maecenas eget fermentum lacus. Lorem ipsum dolor sit amet consectetur. At leo felis etiam massa maecenas eget fermentum lacus.`;
  return (
    <>
      <div className="mb-20">
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
          <div className="mt-10">
            <BorderRectangle>
              <table className="w-full">
                <tbody>
                  <ProfileColumn
                    position="Customer’s profile"
                    name="Elizabeth Howard"
                    phoneNumber="+49 17687934521"
                    stars={1}
                    imageSrc={userOne.src}
                  />
                  <ProfileColumn
                    position="Contractor’s profile"
                    name="Abdulahi Balla"
                    phoneNumber="+49 17687934521"
                    stars={4}
                    imageSrc={userTwo.src}
                    job="Furniture assembler"
                  />
                  <SingleLineColumn name="Invoice ID" value="#342" />
                  <SingleLineColumn
                    name="Job Address"
                    value="2464 Royal Ln. Mesa, New Jersey 45463"
                  />
                  <SingleLineColumn name="Quote" value="$4,000" />
                  <DescriptionColumn name="Job Description" text={text} />
                  <StatusColumn name="Job Status" status="Paid" />
                </tbody>
              </table>
            </BorderRectangle>
          </div>
        </Wrapper>
      </div>
    </>
  );
};

export default ViewCustomer;
