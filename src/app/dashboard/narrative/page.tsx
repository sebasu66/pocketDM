
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlippingAvatar } from "@/components/flipping-avatar";
import { useAuth } from "@/context/auth-context";
import { Eye, ArrowLeft, ArrowRight, Plus, MessageSquare } from "lucide-react";
import { StackedCard } from "@/components/ui/stacked-card";
import { RusticIconButton } from "@/components/ui/rustic-icon-button";
import { cn } from "@/lib/utils";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const isMaster = user?.role === 'master';

  const visibleComments = isMaster 
    ? comments
    : comments.filter(c => c.playerId === user?.id);

  const activeComment = visibleComments.length > 0 ? visibleComments[activeIndex] : null;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? visibleComments.length - 1 : prev - 1));
  }
  
  const handleNext = () => {
    setActiveIndex((prev) => (prev === visibleComments.length - 1 ? 0 : prev + 1));
  }

  return (
    <div className="min-h-[calc(100vh-theme(spacing.24))]">
        <div className="grid h-[80vh] items-center md:grid-cols-10 gap-8">
           <div className="md:col-span-4 h-full flex flex-col justify-center">
             <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-lg text-foreground/90 space-y-4">
                <div>
                    <CardTitle className="font-headline text-2xl">The Arrival at Silverwood</CardTitle>
                    <CardDescription>Posted by Game Master - 2 days ago</CardDescription>
                </div>
                <div className="prose prose-invert max-w-none space-y-4">
                <p>
                    The party, weary from their travels, finally saw the shimmering rooftops of Silverwood. 
                    As they approached the main gate, they were greeted by Captain <a href="/dashboard/characters/elara" className="text-accent hover:underline">Elara</a>, 
                    a stern-looking guard with a noticeable scar above her left eye. She held the legendary{' '}
                    <a href="/dashboard/items/moonshard-blade" className="text-accent hover:underline">Moonshard Blade</a>, its faint glow pulsing in the twilight.
                </p>
                <p>
                    "State your business in Silverwood," she commanded, her voice firm but not unkind. The air was thick with the scent of pine and distant magic.
                </p>
                
                {(isMaster || user?.id === '2') && (
                    <div className="border-l-4 border-primary bg-primary/10 p-4 rounded-r-lg">
                        <p className="flex items-center gap-2 text-sm font-semibold text-primary-foreground/80"><Eye size={16} /> For Grom's Eyes Only</p>
                        <div className="prose prose-sm prose-invert text-primary-foreground/70">
                            <p>You notice the captain's scar is not from a battle, but a magical sigil you recognize from your old mentor's forbidden texts. It's a ward against possession.</p>
                        </div>
                    </div>
                )}
                </div>
                <RusticIconButton tooltip="Add Comment" className="text-white/90 hover:text-white">
                    <Plus size={24} />
                </RusticIconButton>
            </div>
           </div>
           
           <div className="relative flex items-center justify-center h-full md:col-span-6">
                {visibleComments.length > 0 ? (
                    <>
                        <RusticIconButton 
                            onClick={handlePrev} 
                            className="z-10 text-white/80 opacity-70 hover:opacity-100"
                            tooltip="Previous Comment"
                        >
                            <ArrowLeft size={32} />
                        </RusticIconButton>

                        <StackedCard
                            items={visibleComments}
                            activeIndex={activeIndex}
                            setActiveIndex={setActiveIndex}
                            renderItem={(comment, isActive) => (
                                <Card key={comment.id} className="w-full h-full bg-card/80 backdrop-blur-sm">
                                <div className="flex flex-col gap-4 p-4 h-full">
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
                                    <CardContent className="p-0 flex-1">
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
                            )}
                        />
                        
                        <RusticIconButton 
                            onClick={handleNext} 
                            className="z-10 text-white/80 opacity-70 hover:opacity-100"
                            tooltip="Next Comment"
                        >
                            <ArrowRight size={32} />
                        </RusticIconButton>
                    </>
                ) : (
                    <div className="text-center text-muted-foreground">
                        <MessageSquare className="mx-auto h-12 w-12" />
                        <p>No comments yet.</p>
                        <p className="text-sm">Be the first to reply!</p>
                    </div>
                )}
           </div>
        </div>
    </div>
  );
}
