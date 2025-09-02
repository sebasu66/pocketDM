
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FlippingAvatar } from "@/components/flipping-avatar";
import { useAuth } from "@/context/auth-context";
import { Eye, Plus, Music } from "lucide-react";
import { RusticIconButton } from "@/components/ui/rustic-icon-button";
import Image from "next/image";

const comments = [
    {
        id: "comment-1",
        playerId: "2", // Alice's user ID
        characterName: "Grom",
        playerName: "Alice",
        playerImage: "https://picsum.photos/100/100?random=5",
        characterImage: "https://picsum.photos/200/300?random=10",
        timestamp: "1 day ago",
        text: "Grom steps forward, his hand resting on the pommel of his axe. 'We seek refuge and supplies, Captain. And perhaps a worthy tale or two.'",
        hiddenText: "I'm keeping an eye on the captain. She seems too calm."
    },
    {
        id: "comment-2",
        playerId: "3", // Bob's user ID (hypothetical)
        characterName: "Lyra",
        playerName: "Bob",
        playerImage: "https://picsum.photos/100/100?random=7",
        characterImage: "https://picsum.photos/200/300?random=11",
        timestamp: "1 day ago",
        text: "Lyra scans the guards, her eyes trying to gauge their intentions. She subtly readies a minor illusion spell, just in case."
    }
]

export default function NarrativePage() {
  const { user } = useAuth();
  const isMaster = user?.role === 'master';

  const visibleComments = isMaster 
    ? comments
    : comments.filter(c => c.playerId === user?.id || !c.hiddenText);

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Main Narrative Post */}
        <div className="space-y-4">
            <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">The Arrival at Silverwood</CardTitle>
                    <CardDescription>Posted by Game Master - 2 days ago</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="relative h-64 w-full rounded-lg overflow-hidden border-2 border-primary/20">
                      <Image src="https://picsum.photos/800/400?random=55" alt="The gates of Silverwood" fill className="object-cover" data-ai-hint="fantasy city gate" />
                   </div>
                    <div className="prose prose-invert max-w-none space-y-4 text-foreground/90">
                        <p>
                            The party, weary from their travels, finally saw the shimmering rooftops of Silverwood. 
                            As they approached the main gate, they were greeted by Captain <a href="/dashboard/characters/elara" className="text-accent hover:underline">Elara</a>, 
                            a stern-looking guard with a noticeable scar above her left eye. She held the legendary{' '}
                            <a href="/dashboard/items/moonshard-blade" className="text-accent hover:underline">Moonshard Blade</a>, its faint glow pulsing in the twilight.
                        </p>
                        <p>
                            "State your business in Silverwood," she commanded, her voice firm but not unkind. The air was thick with the scent of pine and distant magic.
                        </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="flex items-center gap-2 font-headline text-lg text-foreground/80"><Music size={18}/>Ambiance</h4>
                      <audio controls className="w-full h-10">
                        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                    
                    {(isMaster || user?.id === '2') && (
                        <div className="border-l-4 border-primary bg-primary/10 p-4 rounded-r-lg">
                            <p className="flex items-center gap-2 text-sm font-semibold text-primary-foreground/80"><Eye size={16} /> For Grom's Eyes Only</p>
                            <div className="prose prose-sm prose-invert text-primary-foreground/70">
                                <p>You notice the captain's scar is not from a battle, but a magical sigil you recognize from your old mentor's forbidden texts. It's a ward against possession.</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            <RusticIconButton tooltip="Add to this Thread" className="text-white/90 hover:text-white">
                <Plus size={24} />
            </RusticIconButton>
        </div>

        {/* Right Column: Comments */}
        <div className="space-y-6">
            <h3 className="text-2xl font-headline text-white drop-shadow-md">Comments</h3>
            {visibleComments.map(comment => (
                 <Card key={comment.id} className="bg-card/80 backdrop-blur-sm">
                    <div className="flex flex-col gap-4 p-4">
                        <div className="flex items-center gap-4">
                        <FlippingAvatar
                            playerImage={comment.playerImage}
                            characterImage={comment.characterImage}
                            playerHint="person face"
                            characterHint="fantasy portrait"
                            className="w-16 h-16 flex-shrink-0 border-2 border-primary/20"
                        />
                        <div className="flex-1">
                            <p className="font-bold text-lg">{comment.characterName}</p>
                            <p className="text-sm text-muted-foreground">{comment.playerName}</p>
                        </div>
                        <CardDescription className="text-xs">{comment.timestamp}</CardDescription>
                        </div>
                        <CardContent className="p-0">
                            <div className="prose prose-invert max-w-none text-foreground/90">
                                <p>{comment.text}</p>
                                {isMaster && comment.hiddenText && (
                                    <div className="border-l-2 border-destructive bg-destructive/10 p-3 rounded-r-md mt-2">
                                        <p className="flex items-center gap-2 text-xs font-semibold text-destructive-foreground/80">Hidden Message</p>
                                        <div className="prose prose-sm prose-invert text-destructive-foreground/70">
                                            <p>"{comment.hiddenText}"</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </div>
                </Card>
            ))}
        </div>
    </div>
  );
}
