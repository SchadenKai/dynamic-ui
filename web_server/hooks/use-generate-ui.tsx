import { sendChatMessage } from "@/services/generateUISS";
import { useState } from "react";
import useChatHistory from "./use-chat-histort";

interface GenerateUIHook {
  handleGenerateUI: () => void;
  isLoading: boolean;
}

export function useGenerateUI(user_query: string): GenerateUIHook {
  const [isLoading, setIsLoading] = useState(false);
  const { refreshChatHistory } = useChatHistory()

  const handleGenerateUI = () => {
    const generateUI = async () => {
      try {
        setIsLoading(true);
        const data = {
          "message": user_query,
          "role": "user"
        }
        const response = await sendChatMessage(data);
        console.log(response);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
        refreshChatHistory()
      }
    };
    generateUI();
  };
  return {
    handleGenerateUI,
    isLoading,
  };
}
