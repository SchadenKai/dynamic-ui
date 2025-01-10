import { LucideBot } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";

export default function ChatFab() {
  return (
    <Card className="fixed bottom-4 right-4 px-4 py-6">
      <CardHeader>
        <LucideBot />
        <h1>Dynamic UI Bot</h1>
      </CardHeader>
      <CardContent>
        <Input type="text" />
        <Button>Send</Button>
      </CardContent>
    </Card>
  );
}
