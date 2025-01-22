import { sendChatMessage } from "@/services/generateUISS";
import { useState } from "react";
import useChatHistory from "./use-chat-histort";
import { parseGenerateUIFuncArgs } from "@/lib/parseGenerateUIFuncArgs";
import { parseElement } from "@/lib/renderElement";
import { useRouter } from "next/navigation";

interface GenerateUIHook {
  handleGenerateUI: () => void;
  isLoading: boolean;
  renderedContent: React.ReactNode | null;
}

export function useGenerateUI(user_query: string): GenerateUIHook {
  const [isLoading, setIsLoading] = useState(false);
  const { refreshChatHistory } = useChatHistory()
  const [renderedContent, setRenderedContent] =
    useState<React.ReactNode | null>(null);
  const router = useRouter()

  const handleGenerateUI = () => {
    const generateUI = async () => {
      try {
        setIsLoading(true);
        const data = {
          "message": user_query,
          "role": "user"
        }
        const response = await sendChatMessage(data);
        if (response) {
          if (response.toString().includes("[")) {
            const args = parseGenerateUIFuncArgs(response.toString());
            setRenderedContent(parseElement(args));
          } else {
            setRenderedContent(<p>{JSON.stringify(response)}</p>);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
        refreshChatHistory()
        router.refresh()
      }
    };
    generateUI();
  };
  return {
    handleGenerateUI,
    isLoading,
    renderedContent
  };
}
