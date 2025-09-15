

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FlippingAvatar } from "@/components/flipping-avatar";
import { useAuth } from "@/context/auth-context";
import { Plus, Music, Bot, Send, MessageSquareQuote, Lock, RotateCcw, Trash2, FileText } from "lucide-react";
import { RusticIconButton } from "@/components/ui/rustic-icon-button";
import Image from "next/image";
import type { EnrichedThread, Character, NarrativeThread, EnrichedComment } from "@/lib/firebase/types";
import { generateStory, StoryInput } from "@/ai/flows/narrative-orchestrator";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { getCommentsByThreadId, addNarrativeComment } from "@/lib/firebase/comments";
import { getCharactersByCampaign } from "@/lib/firebase/characters";
import { addNarrativeThread, deleteNarrativeThread, restartCampaignNarrative } from "@/lib/firebase/narrative";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getUserById } from "@/lib/auth";
import { useI18n } from "@/context/i18n-context";

export default function NarrativePage() {
  const { user, campaign } = useAuth();
  const { toast } = useToast();
  const { t } = useI18n();
  const isMaster = user?.role === 'master';

  const [threads, setThreads] = useState<NarrativeThread[]>([]);
  const [commentsByThread, setCommentsByThread] = useState<Record<string, EnrichedComment[]>>({});
  const [enrichedThreads, setEnrichedThreads] = useState<EnrichedThread[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePlayers, setActivePlayers] = useState<Character[]>([]);
  const [playerCharacter, setPlayerCharacter] = useState<Character | null>(null);
  const [lastPrompt, setLastPrompt] = useState<any | null>(null); // Storing for logging purposes

  // Effect to fetch threads
  useEffect(() => {
    if (!campaign) return;
    setIsLoading(true);

    const q = query(
      collection(db, "narrativeThreads"),
      where("campaignId", "==", campaign.id),
      orderBy("createdAt", "desc") // Fetch newest first
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const threadsFromDb = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NarrativeThread));
      setThreads(threadsFromDb);

      try {
        const allCharacters = await getCharactersByCampaign(campaign.id);
        setActivePlayers(allCharacters.filter(c => c.isActive));

        if (user && !isMaster) {
          const userCharacter = allCharacters.find(c => c.userId === user.id);
          setPlayerCharacter(userCharacter || null);
        }
      } catch(error) {
        console.error("Error fetching characters:", error);
      }

      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching narrative threads:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [campaign, user, isMaster]);
  
  // Effect to fetch comments for all visible threads
  useEffect(() => {
    if (threads.length === 0) return;

    const threadIds = threads.map(t => t.id);
    const q = query(
      collection(db, "narrativeComments"),
      where("threadId", "in", threadIds),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
        const allComments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EnrichedComment));
        const commentsGrouped: Record<string, EnrichedComment[]> = {};
        
        const characterPromises = allComments.map(c => getCharactersByCampaign(c.campaignId, c.authorId));
        const allCharactersLists = await Promise.all(characterPromises);
        const allCharacters = allCharactersLists.flat();

        for (const comment of allComments) {
            if (!commentsGrouped[comment.threadId]) {
                commentsGrouped[comment.threadId] = [];
            }
            const author = await getUserById(comment.authorId);
            const character = allCharacters.find(c => c.id === comment.characterId);
            commentsGrouped[comment.threadId].push({ ...comment, author: author!, character: character || null });
        }
        setCommentsByThread(commentsGrouped);
    });

    return () => unsubscribe();
  }, [threads]);

  // Effect to merge threads and comments
  useEffect(() => {
    const merged = threads.map(thread => ({
      ...thread,
      comments: commentsByThread[thread.id] || [],
    }));
    setEnrichedThreads(merged);
  }, [threads, commentsByThread]);


  const handleGenerateNextPost = async () => {
      if (!campaign || !user || user.role !== 'master') return;

      setIsGenerating(true);
      toast({ title: t('narrativeThinking'), description: t('narrativeThinkingDesc') });

      try {
        const apiKey = localStorage.getItem('gemini_api_key');
        const systemPrompt = campaign.systemPrompt;

        if (!apiKey) {
            toast({ variant: "destructive", title: t('narrativeApiKeyNotFound'), description: t('narrativeApiKeyNotFoundDesc') });
            setIsGenerating(false);
            return;
        }
        
        const storyInput: StoryInput = {
            campaignId: campaign.id,
            systemPrompt: systemPrompt || "You are a master storyteller.",
            apiKey: apiKey,
        };

        setLastPrompt(storyInput); // For logging/debugging on the client

        const result = await generateStory(storyInput);

        const newThreadData = {
            campaignId: campaign.id,
            authorId: user.id, // GM
            title: "The Story Continues...", // The AI could generate a title in the future
            createdAt: Date.now(),
            content: `<p>${result.nextPost.replace(/\n/g, '</p><p>')}</p>`,
        };

        await addNarrativeThread(newThreadData);

        toast({ title: t('narrativeStoryUpdated'), description: t('narrativeStoryUpdatedDesc') });

      } catch (error: any) {
        console.error("Error generating story:", error);
        toast({ 
            variant: "destructive", 
            title: t('narrativeGenerationFailed'), 
            description: `An error occurred: ${error.message || String(error)}`
        });
      } finally {
        setIsGenerating(false);
      }
  }

   const handleRedo = async () => {
    if (!mainThread) return;
    setIsGenerating(true);
    try {
        await deleteNarrativeThread(mainThread.id);
        // The onSnapshot listener will update the state, which will trigger a re-render.
        // We need a slight delay before generating the next post to ensure the state is updated.
        setTimeout(() => {
            handleGenerateNextPost();
        }, 500);
    } catch (error) {
        console.error("Error redoing generation:", error);
        toast({ variant: "destructive", title: "Error", description: t('narrativeErrorRedo')});
        setIsGenerating(false);
    }
  }

  const handleRestart = async () => {
    if (!campaign) return;
    setIsGenerating(true);
    toast({ title: t('narrativeRestarting'), description: t('narrativeRestartingDesc')});
    try {
        await restartCampaignNarrative(campaign.id);
        // onSnapshot will handle the update
    } catch (error) {
        console.error("Error restarting campaign:", error);
        toast({ variant: "destructive", title: "Error", description: t('narrativeErrorRestart')});
    } finally {
        setIsGenerating(false);
    }
  }
  
  const handleAddComment = async (text: string, hiddenText: string) => {
    if (!user || !playerCharacter || !mainThread) return;
    
    const commentData = {
        threadId: mainThread.id,
        authorId: user.id,
        characterId: playerCharacter.id,
        text,
        hiddenText,
        createdAt: Date.now(),
    };

    try {
      await addNarrativeComment(commentData);
      toast({ title: t('narrativeResponsePosted'), description: t('narrativeResponsePostedDesc')});
      // No need to fetch, onSnapshot will handle it.
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: t('narrativeErrorPost')});
    }
  };


  const mainThread = useMemo(() => enrichedThreads.length > 0 ? enrichedThreads[0] : null, [enrichedThreads]);
  const olderThreads = useMemo(() => enrichedThreads.length > 1 ? enrichedThreads.slice(1) : [], [enrichedThreads]);
  
  const playersWhoHaveCommented = useMemo(() => new Set(mainThread?.comments.map(c => c.authorId) || []), [mainThread]);
  
  const allActivePlayersResponded = useMemo(() => {
      if (!mainThread || activePlayers.length === 0) return false;
      return activePlayers.every(p => playersWhoHaveCommented.has(p.userId));
  }, [activePlayers, playersWhoHaveCommented, mainThread]);

  const isAITurn = useMemo(() => {
      if (!isMaster) return false;
      if (enrichedThreads.length === 0) return true;
      return allActivePlayersResponded;
  }, [isMaster, enrichedThreads.length, allActivePlayersResponded]);
  
  const hasPlayerResponded = user ? playersWhoHaveCommented.has(user.id) : false;

  const canPlayerRespond = !isMaster && playerCharacter?.isActive && mainThread && !hasPlayerResponded;

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.24))]">
            <p className="text-muted-foreground">{t('narrativeLoading')}</p>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Main Column */}
      <div className="space-y-4">
        {mainThread ? (
          <>
            <ThreadCard thread={mainThread} isMain={true} />
            {isMaster && (
              <GmControls
                isAITurn={isAITurn}
                isGenerating={isGenerating}
                onGenerate={handleGenerateNextPost}
                onRedo={handleRedo}
                onRestart={handleRestart}
                lastPrompt={lastPrompt}
                activePlayers={activePlayers}
                commentingPlayers={playersWhoHaveCommented}
                hasThreads={enrichedThreads.length > 0}
                t={t}
              />
            )}
            {canPlayerRespond && (
              <CommentForm onSubmit={handleAddComment} character={playerCharacter} t={t} />
            )}
            <div className="space-y-6">
                <h3 className="text-2xl font-headline text-white drop-shadow-md">{t('narrativePlayerResponses')}</h3>
                {mainThread.comments.map(comment => (
                    <CommentCard key={comment.id} comment={comment} isMaster={isMaster} t={t} />
                ))}
                {mainThread.comments.length === 0 && <p className="text-white/70">{t('narrativeNoResponses')}</p>}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/70">{t('narrativeNotStarted')}</p>
            {isMaster && (
               <GmControls
                isAITurn={true}
                isGenerating={isGenerating}
                onGenerate={handleGenerateNextPost}
                onRedo={handleRedo}
                onRestart={handleRestart}
                lastPrompt={lastPrompt}
                activePlayers={activePlayers}
                commentingPlayers={playersWhoHaveCommented}
                hasThreads={enrichedThreads.length > 0}
                t={t}
              />
            )}
          </div>
        )}
      </div>

      {/* Older Threads */}
      {olderThreads.length > 0 && (
        <div className="space-y-4 pt-8 border-t-2 border-dashed border-white/10">
          <h3 className="text-2xl font-headline text-white/70 drop-shadow-md">Older Posts</h3>
          {olderThreads.map(thread => (
            <details key={thread.id} className="bg-card/50 backdrop-blur-sm rounded-lg overflow-hidden">
              <summary className="p-4 cursor-pointer hover:bg-white/10">
                <p className="font-headline text-lg">{thread.title}</p>
                <p className="text-xs text-muted-foreground">{new Date(thread.createdAt).toLocaleDateString()}</p>
              </summary>
              <div className="p-4 border-t border-white/10">
                <ThreadCard thread={thread} isMain={false} />
                 <div className="space-y-4 mt-4">
                    <h4 className="text-lg font-headline text-white drop-shadow-md">{t('narrativePlayerResponses')}</h4>
                    {thread.comments.map(comment => (
                        <CommentCard key={comment.id} comment={comment} isMaster={isMaster} t={t}/>
                    ))}
                    {thread.comments.length === 0 && <p className="text-white/70 text-sm">{t('narrativeNoResponses')}</p>}
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}


const ThreadCard = ({ thread, isMain }: { thread: EnrichedThread; isMain: boolean }) => (
    <Card className="bg-transparent border-0 shadow-none">
        <CardHeader>
            <CardTitle className={`font-headline ${isMain ? 'text-4xl' : 'text-2xl'}`}>{thread.title}</CardTitle>
            <CardDescription>
                Posted by Game Master - {new Date(thread.createdAt).toLocaleDateString()}
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
        {thread.imageUrl && (
            <div className="relative h-64 w-full rounded-lg overflow-hidden border-2 border-primary/20">
                <Image src={thread.imageUrl} alt={thread.title} fill className="object-cover" data-ai-hint={thread.imageAiHint || 'fantasy scene'} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
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
);

const CommentCard = ({ comment, isMaster, t }: { comment: EnrichedComment, isMaster: boolean, t: (key: string) => string}) => (
    <Card key={comment.id} className="bg-card/80 backdrop-blur-sm">
        <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center gap-4">
            <FlippingAvatar
                playerImage={comment.author?.avatar || 'https://picsum.photos/100/100?random=1'}
                characterImage={comment.character?.portrait || 'https://picsum.photos/100/100?random=1'}
                characterFaceImage={comment.character?.face}
                playerHint="person face"
                characterHint={comment.character?.aiHint || "fantasy portrait"}
                className="w-16 h-16 flex-shrink-0 border-2 border-primary/20"
            />
            <div className="flex-1">
                <p className="font-bold text-lg">{comment.character?.name || comment.author?.name || 'Unknown'}</p>
                <p className="text-sm text-muted-foreground">
                    {comment.character ? (comment.author?.name || 'Unknown User') : '(Deleted Character)'}
                </p>
            </div>
            <CardDescription className="text-xs">{new Date(comment.createdAt).toLocaleDateString()}</CardDescription>
            </div>
            <CardContent className="p-0">
                <div className="prose prose-invert max-w-none text-foreground/90">
                    <p>{comment.text}</p>
                    {isMaster && comment.hiddenText && (
                        <div className="border-l-2 border-destructive bg-destructive/10 p-3 rounded-r-md mt-2">
                            <p className="flex items-center gap-2 text-xs font-semibold text-destructive-foreground/80">{t('narrativeHiddenMessage')}</p>
                            <div className="prose prose-sm prose-invert text-destructive-foreground/70">
                                <p>"{comment.hiddenText}"</p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </div>
    </Card>
);

const GmControls = ({ isAITurn, isGenerating, onGenerate, onRedo, onRestart, lastPrompt, activePlayers, commentingPlayers, hasThreads, t }: { 
    isAITurn: boolean;
    isGenerating: boolean;
    onGenerate: () => void;
    onRedo: () => void;
    onRestart: () => void;
    lastPrompt: any;
    activePlayers: Character[];
    commentingPlayers: Set<string>;
    hasThreads: boolean;
    t: (key: string) => string
}) => (
    <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm sticky bottom-4 space-y-4">
        <div className="flex gap-2">
            <Button onClick={onGenerate} disabled={!isAITurn || isGenerating} className="flex-1">
                <Bot className="mr-2"/>
                {isGenerating ? t('narrativeGenerating') : t('narrativeGenerateNext')}
            </Button>
            <Dialog>
                <DialogTrigger asChild>
                    <RusticIconButton tooltip={t('narrativeAddManually')} className="text-white/90 hover:text-white">
                        <Plus size={24} />
                    </RusticIconButton>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('narrativeNotImplemented')}</DialogTitle>
                        <DialogDescription>
                            {t('narrativeNotImplementedDesc')}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
        <div className="flex justify-between items-center">
            {!isAITurn && hasThreads && (
                <p className="text-sm text-white/60 self-center">
                    {t('narrativeWaitingFor', { players: activePlayers.filter(p => !commentingPlayers.has(p.userId)).map(p => p.name).join(', ') })}
                </p>
            )}
            <div className="flex gap-2 ml-auto">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" disabled={!lastPrompt}>
                            <FileText className="mr-2"/> {t('narrativeViewPrompt')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-3xl">
                        <DialogHeader>
                            <DialogTitle className="font-headline">{t('narrativeLastPrompt')}</DialogTitle>
                            <DialogDescription>{t('narrativeLastPromptDesc')}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto p-4 bg-muted/50 rounded-md">
                            <div>
                                <h4 className="font-bold text-lg">{t('narrativeSystemPrompt')}</h4>
                                <pre className="text-xs whitespace-pre-wrap font-mono bg-background/50 p-2 rounded">{lastPrompt?.systemPrompt}</pre>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">{t('narrativeCampaignId')}</h4>
                                <pre className="text-xs whitespace-pre-wrap font-mono bg-background/50 p-2 rounded">{lastPrompt?.campaignId}</pre>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" onClick={onRedo} disabled={isGenerating || !hasThreads}>
                    <RotateCcw className="mr-2"/> {t('narrativeRedo')}
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={isGenerating || !hasThreads}>
                            <Trash2 className="mr-2"/> {t('narrativeRestart')}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t('narrativeRestartConfirm')}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('narrativeRestartConfirmDesc')}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t('charactersCancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={onRestart}>{t('narrativeRestart')}</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    </div>
);


function CommentForm({ onSubmit, character, t }: { onSubmit: (text: string, hiddenText: string) => Promise<void>, character: Character | null, t: (key:string) => string }) {
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
        <Card className="bg-card/80 backdrop-blur-sm sticky bottom-4">
            <CardHeader>
                <CardTitle className="font-headline">{t('narrativeYourTurn', {characterName: character?.name})}</CardTitle>
                <CardDescription>{t('narrativeYourTurnDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="comment-text" className="flex items-center gap-2">
                            <MessageSquareQuote />
                            {t('narrativePublicResponse')}
                        </Label>
                        <Textarea
                            id="comment-text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={t('narrativePublicResponsePlaceholder')}
                            required
                            rows={5}
                        />
                    </div>
                    <div className="space-y-2">
                         <Label htmlFor="hidden-text" className="flex items-center gap-2">
                            <Lock />
                           {t('narrativeHiddenThoughts')}
                        </Label>
                        <Textarea
                            id="hidden-text"
                            value={hiddenText}
                            onChange={(e) => setHiddenText(e.target.value)}
                            placeholder={t('narrativeHiddenThoughtsPlaceholder')}
                             rows={3}
                        />
                    </div>
                    <div className="flex justify-end">
                        <RusticIconButton tooltip={isSubmitting ? t('narrativePosting') : t('narrativePostResponse')} disabled={isSubmitting} type="submit">
                            <Send />
                        </RusticIconButton>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

    
