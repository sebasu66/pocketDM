
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FlippingAvatar } from "@/components/flipping-avatar";
import { useAuth } from "@/context/auth-context";
import { Eye, Plus, Music } from "lucide-react";
import { RusticIconButton } from "@/components/ui/rustic-icon-button";
import Image from "next/image";
import { getNarrativeThreadById } from "@/lib/firebase/narrative";
import { getCommentsByThreadId, NarrativeCommentWithAuthor } from "@/lib/firebase/comments";
import { NarrativeThread, User, Character } from "@/lib/firebase/types";
import { getUserById } from "@/lib/auth";
import { getCharacter } from "@/lib/firebase/characters";

// A helper type to combine comment with author and character details
type EnrichedComment = NarrativeCommentWithAuthor & {
    character?: Character | null;
};

export default function NarrativePage() {
  const { user, campaign } = useAuth();
  const [thread, setThread] = useState<NarrativeThread | null>(null);
  const [comments, setComments] = useState<EnrichedComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const isMaster = user?.role === 'master';
  
  const fetchNarrativeData = useCallback(async () => {
    if (!campaign) return;

    setIsLoading(true);
    // For now, we'll fetch a hardcoded thread ID. Later this could be dynamic.
    const threadId = "thread-1";
    const currentThread = await getNarrativeThreadById(threadId);
    setThread(currentThread);

    if (currentThread) {
      const threadComments = await getCommentsByThreadId(currentThread.id);
      
      // Enrich comments with character data
      const enrichedComments = await Promise.all(
          threadComments.map(async (comment) => {
              let character = null;
              if (comment.characterId) {
                  character = await getCharacter(comment.characterId);
              }
              return { ...comment, character };
          })
      );
      setComments(enrichedComments);
    }
    setIsLoading(false);
  }, [campaign]);

  useEffect(() => {
    fetchNarrativeData();
  }, [fetchNarrativeData]);

  if (isLoading || !thread) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.24))]">
            <p className="text-muted-foreground">Loading narrative...</p>
        </div>
    );
  }

  const visibleComments = isMaster 
    ? comments
    : comments.filter(c => c.author.id === user?.id || !c.hiddenText);

  // Example: Player specific content check (in a real app, this would be more robust)
  const showGromsSecret = isMaster || user?.id === '2'; // User ID 2 is Alice, who plays Grom

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Main Narrative Post */}
        <div className="space-y-4">
            <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">{thread.title}</CardTitle>
                    <CardDescription>
                        Posted by Game Master - {new Date(thread.createdAt).toLocaleDateString()}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   {thread.imageUrl && (
                     <div className="relative h-64 w-full rounded-lg overflow-hidden border-2 border-primary/20">
                        <Image src={thread.imageUrl} alt={thread.title} fill className="object-cover" data-ai-hint={thread.imageAiHint} />
                     </div>
                   )}
                    <div className="prose prose-invert max-w-none space-y-4 text-foreground/90" dangerouslySetInnerHTML={{ __html: thread.content }} />

                    {thread.audioUrl && (
                      <div className="space-y-2">
                        <h4 className="flex items-center gap-2 font-headline text-lg text-foreground/80"><Music size={18}/>Ambiance</h4>
                        <audio controls className="w-full h-10">
                          <source src={thread.audioUrl} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                    
                    {showGromsSecret && (
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
                            playerImage={comment.author.avatar}
                            characterImage={comment.character?.portrait || 'https://picsum.photos/100/100?random=1'}
                            playerHint="person face"
                            characterHint="fantasy portrait"
                            className="w-16 h-16 flex-shrink-0 border-2 border-primary/20"
                        />
                        <div className="flex-1">
                            <p className="font-bold text-lg">{comment.character?.name || comment.author.name}</p>
                            <p className="text-sm text-muted-foreground">{comment.author.name}</p>
                        </div>
                        <CardDescription className="text-xs">{new Date(comment.createdAt).toLocaleDateString()}</CardDescription>
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
