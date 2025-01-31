"use client";

import React, { useEffect, useState } from "react";
import { useGenerateUI } from "@/hooks/use-generate-ui";
import HomePresentation from "./HomePresentation";
import useChatHistory from "@/hooks/use-chat-histort";
import { redirect } from "next/navigation";

export default function Home() {
  const [userQuery, setUserQuery] = useState("");
  const { handleGenerateUI, isLoading, renderedContent } =
    useGenerateUI(userQuery);
  const { chatHistory, refreshChatHistory, renderedContentHistory } =
    useChatHistory();

  useEffect(() => {
    refreshChatHistory();
  }, []);

  redirect("/template-json");

  return (
    <HomePresentation
      userQuery={userQuery}
      setUserQuery={setUserQuery}
      handleGenerateUI={handleGenerateUI}
      isLoading={isLoading}
      renderedContent={renderedContent || renderedContentHistory}
      chatHistory={chatHistory}
    />
  );
}
