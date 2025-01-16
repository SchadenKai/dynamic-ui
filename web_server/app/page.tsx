"use client";

import React, { useEffect, useState } from "react";
import { useGenerateUI } from "@/hooks/use-generate-ui";
import HomePresentation from "./HomePresentation";
import useChatHistory from "@/hooks/use-chat-histort";

export default function Home() {
  const [userQuery, setUserQuery] = useState("");
  const { handleGenerateUI, isLoading } = useGenerateUI(userQuery);
  const { chatHistory, refreshChatHistory, renderedContent } = useChatHistory();
  

  useEffect(() => {
    refreshChatHistory();
  }, []);

  return (
    <HomePresentation
      userQuery={userQuery}
      setUserQuery={setUserQuery}
      handleGenerateUI={handleGenerateUI}
      isLoading={isLoading}
      renderedContent={renderedContent}
      chatHistory={chatHistory}
    />
  );
}
