"use client";

import { useParams, useRouter } from "next/navigation";
import Heading from "../shared/table/components/table-heading";
import { FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import cusImage from "@/public/user-one.png";
import conImage from "@/public/user-two.png";
import { dispute } from "@/lib/api/dispute";
import { useQuery } from "react-query";

const cus = {
  name: "Alex moore",
  image: cusImage,
  type: "customer",
};

const con = {
  name: "Alex Pjils",
  image: conImage,
  type: "Contractor",
};

function Chat() {
  const router = useRouter();

  const { chatId } = useParams();

  const handleBack = () => {
    router.back();
    sessionStorage.removeItem("chatId");
  };

  const { data: contractorChat, refetch: refetchContractor } = useQuery(
    ["Contractor Arbitrator Conversation"],
    () => dispute.getSingleConversation(chatId),
    {
      cacheTime: 100,
      staleTime: 100,
      refetchOnWindowFocus: true,
      // refetchInterval: 3000,
      // enabled: Boolean(singleDispute),
      select: (data) => data?.data,
    }
  );

  console.log(contractorChat);
  return (
    <section>
      <div className="p-3 mb-8 bg-white flex items-center w-full min-h-20">
        <Heading name="Chat" />
      </div>
      <div className="p-6">
        <button
          onClick={handleBack}
          className="flex items-center
        gap-3 mb-6"
        >
          <FaArrowLeft /> <span className="font-semibold ">View Chat</span>
        </button>
        <div className="py-3 px-8 rounded-md bg-white flex  w-full min-h-28 gap-3 items-center">
          <h2>Chat between</h2>
          <div className="border border-[#dadada] bg-[#fafafa] w-[400px] h-24  flex  rounded-md justify-between p-4">
            <Profile profile={cus} />
            <span className="border h-full w-[2px]"></span>
            <Profile profile={con} />
          </div>
        </div>
        <div className="mt-8 flex flex-col gsp-4">
          <ChatMessage
            profile={cus}
            message="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa, temporibus!"
          />

          <ChatMessage
            profile={con}
            message="Lorem ipsum dolor ndhdhdio jmsjsu sit amet consectetur adipisicing elit. Ipsa, temporibus!"
          />
        </div>
      </div>
    </section>
  );
}

export default Chat;

function Profile({ profile }: { profile: any }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <div className="relative h-6 w-6 rounded-full">
        <Image
          src={profile?.image}
          fill
          alt="Profile"
          className="rounded-full"
        />
      </div>
      <div className="">
        <h2>{profile.name}</h2>
        <p className="text-[#757575] text-[12px]">{profile?.type}</p>
      </div>
    </div>
  );
}

function ChatMessage({ message, profile }: { message: string; profile: any }) {
  return (
    <article className="w-1/2 flex gap-3 items-start mb-4 relative">
      <div className="relative h-8 w-8  rounded-full">
        <Image
          src={profile?.image}
          fill
          alt="Profile"
          className="rounded-full"
        />
      </div>
      <div className="bg-white rounded--md p-5 w-full mb-4 relative">
        <h2>{profile.name}</h2>
        <p className="text-[#757575] text-[12px] w-[80%]">{message}</p>
        <p className="absolute bottom-2 right-5 text-[10px]">16:44</p>
      </div>
    </article>
  );
}
