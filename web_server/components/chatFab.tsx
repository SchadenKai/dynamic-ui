import {
  LucideBot,
  LucideMinimize,
  LucideMinimize2,
  LucidePanelRightClose,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { ChatMessage } from "@/types/chat";
import { useEffect, useRef } from "react";

interface ChatFabProps {
  readonly userQuery: string;
  readonly setUserQuery: (query: string) => void;
  readonly handleGenerateUI: () => void;
  readonly isLoading: boolean;
  readonly chatHistory: ChatMessage[];
  readonly isOpen: boolean;
  readonly setIsOpen: (isOpen: boolean) => void;
}

export default function ChatFab({
  userQuery,
  setUserQuery,
  handleGenerateUI,
  isLoading,
  chatHistory,
  isOpen,
  setIsOpen,
}: ChatFabProps) {
  const latestMessageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);
  return (
    <>
      {isOpen ? (
        <Card className="max-w-[600px] max-h-screen absolute bottom-4 right-4 px-4 py-6">
          <CardHeader className="flex flex-row justify-between  items-center gap-2">
            <p className="flex flex-row items-center justify-center gap-2 m-0">
              <LucideBot size={32} />
              <span>Dynamic UI Bot</span>
            </p>
            <Button className="!mt-0" onClick={() => setIsOpen(false)}>
              <LucideMinimize2 />
            </Button>
          </CardHeader>
          <CardContent className="overflow-y-auto w-full max-h-96 flex flex-col gap-2">
            {chatHistory.map((chat: ChatMessage, index: number) => (
              <div
                key={chat.chat_id}
                ref={index === chatHistory.length - 1 ? latestMessageRef : null}
                className="bg-slate-200 border-black-500 rounded-md py-4 px-4 h-auto w-full grid grid-cols-2 gap-2"
              >
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
      ) : (
        <Button
          className="absolute bottom-4 right-4 rounded-full"
          onClick={() => setIsOpen(true)}
        >
          <LucideBot />
        </Button>
      )}
    </>
  );
}
