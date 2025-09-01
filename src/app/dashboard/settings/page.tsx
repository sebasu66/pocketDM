
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">My Profile</CardTitle>
          <CardDescription>Manage your personal account details and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-24 w-24">
                <AvatarImage src="https://picsum.photos/100/100" alt="User Avatar" data-ai-hint="person portrait" />
                <AvatarFallback>GM</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">Change Picture</Button>
            </div>
            <div className="grid gap-4 flex-1">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="Game Master" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="gm@example.com" disabled />
                <p className="text-xs text-muted-foreground">You cannot change your email address.</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Update Profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
