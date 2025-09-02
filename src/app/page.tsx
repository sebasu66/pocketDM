
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { KeyRound, User, Crown } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat p-4" style={{backgroundImage: "url('https://picsum.photos/1920/1080?grayscale&blur=5&random=1')"}} data-ai-hint="fantasy landscape">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="w-full max-w-4xl z-10 text-center text-white p-8">
        <div className="flex justify-center mb-6">
            <Logo className="w-24 h-24"/>
        </div>
        <h1 className="text-6xl font-headline drop-shadow-lg">Lore Weaver</h1>
        <p className="text-xl text-white/80 mt-4 max-w-2xl mx-auto">
            Your all-in-one platform for collaborative TTRPG world-building, character management, and narrative storytelling.
        </p>
        <div className="mt-8">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6">
                <Link href="/login">Login to Your Campaign</Link>
            </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-16 text-left">
            <Card className="bg-card/50 backdrop-blur-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                        <Crown className="text-amber-400" />
                        Game Master Demo
                    </CardTitle>
                    <CardDescription>
                        Log in as the Game Master to control the world. Edit campaigns, create monsters, and guide the narrative.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 font-code text-sm">
                    <p><strong>Email:</strong> gm@example.com</p>
                    <p><strong>Password:</strong> password</p>
                </CardContent>
            </Card>
             <Card className="bg-card/50 backdrop-blur-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                       <User />
                        Player Demo (Alice)
                    </CardTitle>
                    <CardDescription>
                       Log in as a player to create your character, interact with the story, and uncover secrets. You'll be playing as Alice, controlling the valiant warrior Grom.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 font-code text-sm">
                    <p><strong>Email:</strong> player@example.com</p>
                    <p><strong>Password:</strong> password</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
