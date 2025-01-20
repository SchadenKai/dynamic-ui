import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ChatFab from "@/components/chatFab";
import { ChatMessage } from "@/types/chat";

interface HomePresentationProps {
  userQuery: string;
  setUserQuery: (query: string) => void;
  handleGenerateUI: () => void;
  isLoading: boolean;
  renderedContent: React.ReactNode;
  chatHistory: ChatMessage[];
}

const HomePresentation: React.FC<HomePresentationProps> = ({
  userQuery,
  setUserQuery,
  handleGenerateUI,
  isLoading,
  renderedContent,
  chatHistory,
}) => {
  const [isChatOpen, setIsChatOpen] = useState(true);
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="w-full h-full p-6">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <p>Loading...</p>
          </div>
        ) : (
          renderedContent
        )}
      </div>
      <ChatFab
        userQuery={userQuery}
        setUserQuery={setUserQuery}
        handleGenerateUI={handleGenerateUI}
        isLoading={isLoading}
        chatHistory={chatHistory}
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
      />
    </div>
  );
};

export default HomePresentation;
