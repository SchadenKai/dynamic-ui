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
    <div>
      <Card>
        <CardContent>
          {isLoading ? <p>Loading...</p> : renderedContent}
        </CardContent>
      </Card>
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
