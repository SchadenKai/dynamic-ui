import { LucideBot } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Textarea } from "./ui/textarea";

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
  return (
    <Card className="absolute bottom-4 right-4 px-4 py-6">
      <CardHeader className="flex flex-row justify-center items-center gap-2">
        <LucideBot />
        <h1>Dynamic UI Bot</h1>
      </CardHeader>
      <CardContent className="w-full h-full flex flex-col justify-end">
        <Textarea
          placeholder="Generate a forms..."
          rows={10}
          value={userQuery}
          onChange={(e) => {
            setUserQuery(e.target.value);
          }}
        />
        <Button disabled={isLoading} onClick={handleGenerateUI}>
          {isLoading ? "Generating UI..." : "Send"}
        </Button>
      </CardContent>
    </Card>
  );
}
