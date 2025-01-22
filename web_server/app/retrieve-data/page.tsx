"use client";

import useChatHistory from "@/hooks/use-chat-histort";
import React from "react";

const Page: React.FC = () => {
  const { chatHistory } = useChatHistory();

  return (
    <div>
      <h1>Raw Data</h1>
      <p>{JSON.stringify(chatHistory.at(chatHistory.length - 1)?.message, null, 2)}</p>
    </div>
  );
};

export default Page;
