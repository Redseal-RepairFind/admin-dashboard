"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

function Index() {
  const router = useRouter();

  const { id } = useParams();
  const chatId = sessionStorage?.getItem("chaiId");

  useEffect(() => {
    router.push(`/issues/${id}/chat/${chatId}`);
  }, [chatId, id, router]);
  return <div></div>;
}

export default Index;
