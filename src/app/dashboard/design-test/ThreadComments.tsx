
"use client";

import React, { useMemo, useState } from 'react';
import type { EnrichedComment, Character, User } from '@/lib/firebase/types';
import { FlippingAvatar } from '@/components/flipping-avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Lock, MessageSquareQuote, Send } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ThreadCommentsProps {
    comments: EnrichedComment[];
    activePlayers: Character[];
    character: Character | null;
    user: User | null;
    canRespond: boolean;
    allActivePlayersResponded: boolean;
    onAddComment: (text: string, hiddenText: string) => Promise<void>;
    t: (key: string) => string;
}

export function ThreadComments({ 
    comments, 
    activePlayers, 
    character,
    user,
    canRespond, 
    allActivePlayersResponded,
    onAddComment,
    t
}: ThreadCommentsProps) {
    const { user: authUser } = useAuth();
    const isMaster = authUser?.role === 'master';
    
    const visibleComments = useMemo(() => {
        if (isMaster || allActivePlayersResponded) {
            return comments;
        }
        if (user) {
            return comments.filter(c => c.authorId === user.id);
        }
        return [];
    }, [comments, user, allActivePlayersResponded, isMaster]);


    if (!comments) return <p className="text-black/70">{t('designTestLoadingComments')}</p>;

    return (
        <div className="space-y-4 text-black/80 max-w-2xl mx-auto">
             <ScrollArea className="h-96 w-full pr-4">
                <div className="space-y-4">
                    {visibleComments.length === 0 && !canRespond && (
                        <p className="text-black/70 italic p-4 text-center">{t('designTestNoResponses')}</p>
                    )}

                    {visibleComments.map(comment => (
                        <div key={comment.id} className="p-3 rounded-md bg-black/5 border border-black/10">
                            <div className="flex items-center gap-3">
                                <FlippingAvatar
                                    playerImage={comment.author.avatar}
                                    characterImage={comment.character ? `/characters/VisualPreset/${comment.character.visualPreset}/portrait` : 'https://picsum.photos/100/100?random=1'}
                                    characterFaceImage={comment.character ? `/characters/VisualPreset/${comment.character.visualPreset}/face` : undefined}
                                    playerHint="person face"
                                    characterHint="fantasy portrait"
                                    className="w-12 h-12 flex-shrink-0 border-2 border-primary/20"
                                />
                                <div className="flex-1">
                                    <p className="font-bold text-base text-black">{comment.character?.name || comment.author.name}</p>
                                    <p className="text-xs text-black/60">{new Date(comment.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="mt-2 pl-2">
                                <p className="text-sm text-black/90 whitespace-pre-wrap">{comment.text}</p>
                                {isMaster && comment.hiddenText && (
                                    <div className="border-l-2 border-red-800/50 bg-red-900/10 p-2 rounded-r-sm mt-2">
                                        <p className="flex items-center gap-1 text-xs font-semibold text-red-900/80"><Lock size={12}/> {t('designTestHidden')}</p>
                                        <p className="text-xs text-red-900/70 italic">"{comment.hiddenText}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {!allActivePlayersResponded && !isMaster && (
                        <div className="p-3 rounded-md bg-black/5 border-dashed border-black/20 text-center">
                            <p className="text-xs text-black/60">{t('designTestWaitingForPlayers')}</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
            
            {canRespond && character && <CommentForm onSubmit={onAddComment} t={t} />}
        </div>
    );
}


function CommentForm({ onSubmit, t }: { onSubmit: (text: string, hiddenText: string) => Promise<void>, t: (key: string) => string }) {
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
        <div className="p-4 rounded-lg bg-black/10 border border-black/20 mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <h4 className="font-bold font-headline text-black">{t('narrativePublicResponse')}</h4>
                <div className="space-y-2">
                    <Label htmlFor="comment-text" className="flex items-center gap-2 text-sm text-black/80">
                        <MessageSquareQuote size={16} />
                        {t('narrativePublicResponse')}
                    </Label>
                    <Textarea
                        id="comment-text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={t('narrativePublicResponsePlaceholder')}
                        required
                        rows={4}
                        className="bg-white/50"
                    />
                </div>
                <div className="space-y-2">
                     <Label htmlFor="hidden-text" className="flex items-center gap-2 text-sm text-black/80">
                        <Lock size={16} />
                       {t('narrativeHiddenThoughts')}
                    </Label>
                    <Textarea
                        id="hidden-text"
                        value={hiddenText}
                        onChange={(e) => setHiddenText(e.target.value)}
                        placeholder={t('narrativeHiddenThoughtsPlaceholder')}
                         rows={2}
                         className="bg-white/50"

                    />
                </div>
                <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting} className="bg-stone-800 text-white hover:bg-stone-700">
                        {isSubmitting ? t('narrativePosting') : t('narrativePostResponse')}
                        <Send className="ml-2" size={16}/>
                    </Button>
                </div>
            </form>
        </div>
    );
}
