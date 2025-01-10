"use client";

import ChatFab from "@/components/chatFab";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGenerateUI } from "@/hooks/use-generate-ui";
import React, { useState } from "react";

export default function Home() {
  const [userQuery, setUserQuery] = useState("");
  const { dynamicElement, handleGenerateUI, isLoading, rawOutput } =
    useGenerateUI(userQuery);

  return (
    <div className="flex items-start justify-center min-h-screen min-w-full p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="w-1/2 flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ChatFab />
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="user-query">Enter user query</Label>
          <Input
            id="user-query"
            placeholder="Generate a forms..."
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
          />
          <div className="flex justify-end">
            <Button disabled={isLoading} onClick={handleGenerateUI}>
              {isLoading ? "Generating UI..." : "Generate UI"}
            </Button>
          </div>
        </div>

        <Card className="w-full">
          <CardHeader>Raw Output</CardHeader>
          <CardContent className="border border-gray-200 p-4 w-full max-h-96 overflow-y-auto">
            {rawOutput && <pre>{JSON.stringify(rawOutput, null, 2)}</pre>}
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>Component Rendered</CardHeader>
          <CardContent className="border border-gray-200 p-4 w-full">
            {dynamicElement}
          </CardContent>
        </Card>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
