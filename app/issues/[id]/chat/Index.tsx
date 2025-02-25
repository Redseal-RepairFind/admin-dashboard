"use client";

import { useLoader } from "@/context/LoaderContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

function Index() {
  const router = useRouter();

  const { id } = useParams();
  const chatId = sessionStorage?.getItem("chaiId");
  const { handleNavigation } = useLoader();
  useEffect(() => {
    router.push(`/issues/${id}/chat/${chatId}`);
  }, [chatId, id, router]);
  return <div></div>;
}

export default Index;
