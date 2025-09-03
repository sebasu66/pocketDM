
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FlippingAvatar } from "@/components/flipping-avatar";
import { useAuth } from "@/context/auth-context";
import { Eye, Plus, Music, Bot, Send, MessageSquareQuote, Lock } from "lucide-react";
import { RusticIconButton } from "@/components/ui/rustic-icon-button";
import Image from "next/image";
import type { NarrativeCommentWithAuthor, EnrichedThread, Character } from "@/lib/firebase/types";
import { generateStory, StoryInput } from "@/ai/flows/story";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { getCommentsByThreadId, addNarrativeComment } from "@/lib/firebase/comments";
import { getCharactersByCampaign } from "@/lib/firebase/characters";
import { addNarrativeThread } from "@/lib/firebase/narrative";
import { NarrativeThread } from "@/lib/firebase/types";

export default function NarrativePage() {
  const { user, campaign } = useAuth();
  const { toast } = useToast();
  const [threads, setThreads] = useState<EnrichedThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePlayers, setActivePlayers] = useState<Character[]>([]);
  const [playerCharacter, setPlayerCharacter] = useState<Character | null>(null);

  const isMaster = user?.role === 'master';

  const enrichThreads = useCallback(async (threadsFromDb: NarrativeThread[], charactersFromDb: Character[]) => {
      const enrichedThreads = await Promise.all(
        threadsFromDb.map(async (thread) => {
          const threadComments = await getCommentsByThreadId(thread.id);
          const enrichedComments = await Promise.all(
            threadComments.map(async (comment) => {
              const character = charactersFromDb.find(c => c.id === comment.characterId);
              return { ...comment, character: character || null };
            })
          );
          return { ...thread, comments: enrichedComments };
        })
      );
      return enrichedThreads;
  }, []);

  useEffect(() => {
    if (!campaign) return;

    setIsLoading(true);

    const q = query(
        collection(db, "narrativeThreads"),
        where("campaignId", "==", campaign.id),
        orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        try {
            const allCharacters = await getCharactersByCampaign(campaign.id);
            setActivePlayers(allCharacters.filter(c => c.isActive));

            if (user && !isMaster) {
                const userCharacter = allCharacters.find(c => c.userId === user.id);
                setPlayerCharacter(userCharacter || null);
            }

            const threadsFromDb = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NarrativeThread));
            const enriched = await enrichThreads(threadsFromDb, allCharacters);
            setThreads(enriched);
        } catch(error) {
            console.error("Error processing narrative update:", error);
            toast({ variant: "destructive", title: "Error", description: "Could not process narrative updates." });
        } finally {
            setIsLoading(false);
        }
    }, (error) => {
        console.error("Error fetching narrative threads in real-time:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not fetch narrative data." });
        setIsLoading(false);
    });

    return () => unsubscribe();

  }, [campaign, user, isMaster, toast, enrichThreads]);


  const handleGenerateNextPost = async () => {
      if (!campaign || !user || user.role !== 'master') return;

      setIsGenerating(true);
      toast({ title: "AI is thinking...", description: "The Dungeon Master is crafting the next part of your story." });

      try {
        const apiKey = localStorage.getItem('gemini_api_key');
        const systemPrompt = localStorage.getItem('ai_system_prompt');

        if (!apiKey) {
            toast({ variant: "destructive", title: "API Key Not Found", description: "Please set your Gemini API key in the AI settings." });
            setIsGenerating(false);
            return;
        }

        const narrativeHistory = threads.map(t => {
            const gmPost = `GM: ${t.title}\n${t.content.replace(/<[^>]*>?/gm, '')}`;
            const playerPosts = t.comments.map(c => `${c.character?.name || c.author.name}: ${c.text}`).join('\n');
            return `${gmPost}\n${playerPosts}`;
        }).join('\n\n---\n\n');

        const storyInput: StoryInput = {
            campaignId: campaign.id,
            systemPrompt: systemPrompt || "You are a master storyteller.",
            narrativeHistory: narrativeHistory || "This is the beginning of the story. Please write an engaging introduction.",
            apiKey: apiKey,
        };
        
        const result = await generateStory(storyInput);

        const newThreadData = {
            campaignId: campaign.id,
            authorId: user.id, // GM
            title: "The Story Continues...",
            createdAt: Date.now(),
            content: `<p>${result.nextPost.replace(/\n/g, '</p><p>')}</p>`,
        };

        await addNarrativeThread(newThreadData);
        // No need to fetch, onSnapshot will handle it.

      } catch (error) {
        console.error("Error generating story:", error);
        toast({ variant: "destructive", title: "AI Generation Failed", description: "Something went wrong. Check the console for details." });
      } finally {
        setIsGenerating(false);
      }
  }
  
  const handleAddComment = async (text: string, hiddenText: string) => {
    if (!user || !playerCharacter || !lastThread) return;
    
    const commentData = {
        threadId: lastThread.id,
        authorId: user.id,
        characterId: playerCharacter.id,
        text,
        hiddenText,
        createdAt: Date.now(),
    };

    try {
      await addNarrativeComment(commentData);
      toast({ title: "Response Posted!", description: "Your actions have been recorded in the annals of history."});
      // No need to fetch, onSnapshot will handle it.
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not post your response."});
    }
  };


  const lastThread = useMemo(() => threads.length > 0 ? threads[threads.length - 1] : null, [threads]);
  
  const playersWhoHaveCommented = useMemo(() => new Set(lastThread?.comments.map(c => c.authorId) || []), [lastThread]);
  
  const allActivePlayersResponded = useMemo(() => activePlayers.every(p => playersWhoHaveCommented.has(p.userId)), [activePlayers, playersWhoHaveCommented]);

  const isAITurn = lastThread ? (isMaster && allActivePlayersResponded) : isMaster;
  
  const hasPlayerResponded = user ? playersWhoHaveCommented.has(user.id) : false;

  const canPlayerRespond = !isMaster && playerCharacter?.isActive && lastThread && !hasPlayerResponded;

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.24))]">
            <p className="text-muted-foreground">Loading narrative...</p>
        </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Narrative Post */}
        <div className="space-y-4">
            {threads.map(thread => (
                <Card key={thread.id} className="bg-card/80 backdrop-blur-sm">
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
                    </CardContent>
                </Card>
            ))}
             {isMaster && (
                <div className="flex gap-4">
                     <Button onClick={handleGenerateNextPost} disabled={!isAITurn || isGenerating}>
                        <Bot className="mr-2"/>
                        {isGenerating ? "Generating..." : "Generate Next Post"}
                    </Button>
                    {!isAITurn && (
                        <p className="text-sm text-white/60 self-center">Waiting for {activePlayers.filter(p => !playersWhoHaveCommented.has(p.userId)).map(p => p.name).join(', ')} to respond.</p>
                    )}
                    <RusticIconButton tooltip="Add Manually" className="text-white/90 hover:text-white" disabled>
                        <Plus size={24} />
                    </RusticIconButton>
                </div>
             )}
             {canPlayerRespond && (
                <CommentForm onSubmit={handleAddComment} character={playerCharacter} />
             )}
        </div>

        {/* Right Column: Comments */}
        <div className="space-y-6">
            <h3 className="text-2xl font-headline text-white drop-shadow-md">Player Responses</h3>
            {lastThread && lastThread.comments.map(comment => (
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
            {(!lastThread || lastThread.comments.length === 0) && <p className="text-white/70">No player responses yet for the last post.</p>}
            {threads.length === 0 && <p className="text-white/70">The story hasn't begun yet. The Game Master needs to post first.</p>}
        </div>
    </div>
  );
}


function CommentForm({ onSubmit, character }: { onSubmit: (text: string, hiddenText: string) => Promise<void>, character: Character | null }) {
    const [text, setText] = useState("");
    const [hiddenText, setHiddenText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text || isSubmitting) return;
        setIsSubmitting(true);
        await onSubmit(text, hiddenText);
        setText("");
        setHiddenText("");
        setIsSubmitting(false);
    };

    return (
        <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="font-headline">Your Turn, {character?.name}</CardTitle>
                <CardDescription>Describe your character's actions, thoughts, and dialogue.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="comment-text" className="flex items-center gap-2">
                            <MessageSquareQuote />
                            Public Response
                        </Label>
                        <Textarea
                            id="comment-text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="What does your character do or say?"
                            required
                            rows={5}
                        />
                    </div>
                    <div className="space-y-2">
                         <Label htmlFor="hidden-text" className="flex items-center gap-2">
                            <Lock />
                           Hidden Thoughts (GM only)
                        </Label>
                        <Textarea
                            id="hidden-text"
                            value={hiddenText}
                            onChange={(e) => setHiddenText(e.target.value)}
                            placeholder="What is your character thinking? (optional, only visible to the GM)"
                             rows={3}
                        />
                    </div>
                    <div className="flex justify-end">
                        <RusticIconButton tooltip={isSubmitting ? "Posting..." : "Post Response"} disabled={isSubmitting}>
                            <Send />
                        </RusticIconButton>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

    