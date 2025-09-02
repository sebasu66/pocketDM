
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/context/theme-context";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from '@/lib/firebase/types';

export default function SettingsPage() {
  const { handwritingFont, setHandwritingFont } = useTheme();
  const { user: authUser, isLoading, updateUser: updateAuthUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);

  const handleAvatarChange = () => {
    if (user) {
      const newUser = { ...user, avatar: `https://picsum.photos/100/100?random=${Math.random()}` };
      setUser(newUser);
    }
  };

  const handleUpdateProfile = () => {
      if (user) {
          // Here you would call an API to save the user data.
          // For now, we update the context state.
          updateAuthUser(user);
      }
  }

  if (isLoading || !user) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-8 w-24" />
                </div>
                <div className="grid gap-4 flex-1">
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                </div>
             </div>
             <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
             </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">My Profile</CardTitle>
          <CardDescription>Manage your personal account details and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt="User Avatar" data-ai-hint="person portrait" />
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={handleAvatarChange}>Change Picture</Button>
            </div>
            <div className="grid gap-4 flex-1">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user.email} disabled />
                <p className="text-xs text-muted-foreground">You cannot change your email address.</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleUpdateProfile}>Update Profile</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Display Settings</CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="handwriting-font">Handwriting Font</Label>
            <Select value={handwritingFont} onValueChange={setHandwritingFont}>
              <SelectTrigger id="handwriting-font">
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grace">Covered By Your Grace</SelectItem>
                <SelectItem value="merienda">Merienda</SelectItem>
                <SelectItem value="comic">Comic Sans MS</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Choose the font used for handwritten notes and titles.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
