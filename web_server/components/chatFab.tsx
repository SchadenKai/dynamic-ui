import { LucideBot } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { useEffect, useState } from "react";
import { ChatMessage } from "@/types/chat";

interface ChatFabProps {
  readonly userQuery: string;
  readonly setUserQuery: (query: string) => void;
  readonly handleGenerateUI: () => void;
  readonly isLoading: boolean;
}

export default function ChatFab({
  userQuery,
  setUserQuery,
  handleGenerateUI,
  isLoading,
}: ChatFabProps) {
  const [chatHistory, setChatHistory] = useState([]);
  useEffect(() => {
    const chatMessages = fetch(
      "http://localhost:8000/chat/history?token=4671d4f17ff09c755d9fd9438745f2c4",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => res.json());
    chatMessages.then((data) => {
      setChatHistory(data);
    });
  }, []);
  return (
    <Card className="max-w-[600px] max-h-screen absolute bottom-4 right-4 px-4 py-6">
      <CardHeader className="flex flex-row justify-center items-center gap-2">
        <LucideBot />
        <h1>Dynamic UI Bot</h1>
      </CardHeader>
      <CardContent className="overflow-y-auto w-full max-h-96 flex flex-col gap-2">
        {chatHistory.map((chat: ChatMessage) => (
          <div key={chat.chat_id} className="bg-slate-200 border-black-500 rounded-md py-4 px-4 h-auto w-full grid grid-cols-2 gap-2">
            <span className="max-w-4">{chat.role}</span>
            <span className="col-span-1 break-words">{chat.message}</span>
          </div>
        ))}
      </CardContent>
      <CardFooter className="mt-4 flex flex-row justify-center items-center gap-2">
        <Textarea
          placeholder="Generate a forms..."
          rows={4}
          value={userQuery}
          onChange={(e) => {
            setUserQuery(e.target.value);
          }}
        />
        <Button disabled={isLoading} onClick={handleGenerateUI}>
          {isLoading ? "Generating UI..." : "Send"}
        </Button>
      </CardFooter>
    </Card>
  );
}
