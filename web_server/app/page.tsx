"use client";

import ChatFab from "@/components/chatFab";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { renderElement, useGenerateUI } from "@/hooks/use-generate-ui";
import { parseGenerateUIFuncArgs } from "@/lib/parseGenerateUIFuncArgs";
import { ChatMessage } from "@/types/chat";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [userQuery, setUserQuery] = useState("");
  const { handleGenerateUI, isLoading, rawOutput, errorAIMessage } =
    useGenerateUI(userQuery);

  const [initialChatHistory, setInitialChatHistory] = useState(
    {} as ChatMessage
  );
  const [initialRawOutput, setInitialRawOutput] = useState("");

  useEffect(() => {
    fetch(
      "http://localhost:8000/chat/latest-message?token=4671d4f17ff09c755d9fd9438745f2c4",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setInitialRawOutput(data.message);
        setInitialChatHistory(data);
      });
  }, []);

  let renderedContent;
  if (rawOutput) {
    renderedContent = renderElement(rawOutput);
  } else if (initialChatHistory?.message) {
    renderedContent = renderElement(
      parseGenerateUIFuncArgs(initialChatHistory.message)
    );
  } else {
    renderedContent = null;
  }

  return (
    <div className="flex items-start justify-center min-h-screen min-w-full p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="w-full flex flex-col row-start-2 items-center sm:items-start">
        {/* <ChatFab
          userQuery={userQuery}
          setUserQuery={setUserQuery}
          handleGenerateUI={handleGenerateUI}
          isLoading={isLoading}
        /> */}
        {errorAIMessage && (
          <div className="w-full bg-red-100 border border-red-200 text-red-800 p-4 rounded-md">
            {errorAIMessage}
          </div>
        )}
        <div className="w-full flex gap-8">
          <Card className="max-w-2xl w-full">
            <CardHeader>Raw Output</CardHeader>
            <CardContent className="border border-gray-200 p-4 w-full max-h-96 overflow-y-auto">
              {rawOutput ? (
                <p>{renderedContent}</p>
              ) : (
                <p>{initialRawOutput}</p>
              )}
            </CardContent>
          </Card>

          <Card className="max-w-1/2 w-full">
            <CardHeader>Component Rendered</CardHeader>
            <CardContent className="border border-gray-200 p-4 w-full">
              {renderedContent}
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
