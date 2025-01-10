"use client";

import ChatFab from "@/components/chatFab";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGenerateUI } from "@/hooks/use-generate-ui";
import useLocalStorage from "@/hooks/use-local-storage";
import React from "react";


export default function Home() {
  const [userQuery, setUserQuery] = useLocalStorage("userQuery", "");
  const {
    dynamicElement,
    handleGenerateUI,
    isLoading,
    rawOutput,
    errorAIMessage,
  } = useGenerateUI(userQuery);

  return (
    <div className="flex items-start justify-center min-h-screen min-w-full p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="w-full flex flex-col row-start-2 items-center sm:items-start">
        <ChatFab
          userQuery={userQuery}
          setUserQuery={setUserQuery}
          handleGenerateUI={handleGenerateUI}
          isLoading={isLoading}
        />
        {errorAIMessage && (
          <div className="w-full bg-red-100 border border-red-200 text-red-800 p-4 rounded-md">
            {errorAIMessage}
          </div>
        )}
        <div className="w-full flex gap-8">
          <Card className="max-w-2xl w-full">
            <CardHeader>Raw Output</CardHeader>
            <CardContent className="border border-gray-200 p-4 w-full max-h-96 overflow-y-auto">
              {rawOutput && (
                <pre>
                  <code className="">{JSON.stringify(rawOutput, null, 2)}</code>
                </pre>
              )}
            </CardContent>
          </Card>

          <Card className="max-w-1/2 w-full">
            <CardHeader>Component Rendered</CardHeader>
            <CardContent className="border border-gray-200 p-4 w-full">
              {dynamicElement}
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
