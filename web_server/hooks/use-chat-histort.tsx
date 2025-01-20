import { parseGenerateUIFuncArgs } from "@/lib/parseGenerateUIFuncArgs";
import { parseElement } from "@/lib/renderElement";
import { ChatMessage } from "@/types/chat";
import { useEffect, useState } from "react";

interface ChatHistoryHook {
  chatHistory: ChatMessage[];
  refreshChatHistory: () => void;
  renderedContent: React.ReactNode | null;
}

export default function useChatHistory(): ChatHistoryHook {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [renderedContent, setRenderedContent] =
    useState<React.ReactNode | null>(null);

  useEffect(() => {
    refreshChatHistory();
  }, []);

  const refreshChatHistory = () => {
    const chatMessages = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/chat/history?token=b5574de824784a23cbd04bdce7e01481",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setChatHistory(data);
        if (data.length > 0) {
          const lastMessage = data[data.length - 1].message;
          if (lastMessage.includes("[")) {
            console.info("lastMessage", lastMessage);
            const args = parseGenerateUIFuncArgs(lastMessage);
            setRenderedContent(parseElement(args));
          } else {
            setRenderedContent(<p>{JSON.stringify(lastMessage)}</p>);
          }
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };
    chatMessages();
  };

  return {
    chatHistory,
    refreshChatHistory,
    renderedContent,
  };
}
