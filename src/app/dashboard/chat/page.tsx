import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ChatPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Player Chat</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>This is where players can communicate freely outside of the game and try to make plans.</p>
      </CardContent>
    </Card>
  );
}
