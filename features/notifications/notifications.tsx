import React from "react";
import useNotifications from "@/lib/hooks/useNotifications";

const Notifications = () => {
  const { data } = useNotifications();

  console.log(data);

  return (
    <div className="mt-[30px] rounded-md border border-[#e6e4e4] w-[700px] p-4">
      <h1 className="font-medium text-2xl ">Notifications</h1>
    </div>
  );
};

export default Notifications;
