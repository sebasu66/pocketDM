
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareQuote, Send, Zap } from "lucide-react";
import type { Character, QuickOption } from "@/lib/firebase/types";
import { RusticIconButton } from "@/components/ui/rustic-icon-button";
import { Separator } from "@/components/ui/separator";

interface CommentFormProps {
    onSubmit: (text: string) => Promise<void>;
    character: Character | null;
    quickOptions: QuickOption[];
    t: (key: string) => string;
}

export function CommentForm({ onSubmit, character, quickOptions, t }: CommentFormProps) {
    const [text, setText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Debug log
    console.log('[CommentForm] quickOptions:', quickOptions);

    const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
        e?.preventDefault();
        console.log('[CommentForm] handleSubmit called, text:', text, 'isSubmitting:', isSubmitting);
        if (!text || isSubmitting) {
            console.log('[CommentForm] Submit blocked - text empty or already submitting');
            return;
        }
        setIsSubmitting(true);
        console.log('[CommentForm] Calling onSubmit...');
        try {
            await onSubmit(text);
            console.log('[CommentForm] onSubmit completed successfully');
            setText("");
        } catch (error) {
            console.error('[CommentForm] onSubmit failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleQuickOptionClick = (action: string, skill?: string) => {
        console.log('[CommentForm] Quick option clicked:', { action, skill });
        const commentText = skill && skill !== '-' ? `${action} (${skill})` : action;
        console.log('[CommentForm] Setting text to:', commentText);
        setText(commentText);
    }
    
    const canSubmit = text.length >= 5;

    return (
        <Card className="bg-stone-gradient border-0 relative">
            <CardHeader>
                <CardTitle className="font-headline text-3xl uppercase tracking-widest text-center">
                    {t('narrativeYourTurn').replace('{characterName}', character?.name || 'Adventurer')}
                </CardTitle>
                <CardDescription className="text-center">{t('narrativeYourTurnDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {quickOptions && quickOptions.length > 0 && (
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Zap size={16} /> Opciones Rápidas</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {quickOptions.map((option, index) => {
                                // Bulletproof: handle undefined/null/string options
                                if (!option) return null;

                                const action = typeof option === 'string' ? option : (option.action || '');
                                const skill = typeof option === 'object' ? (option.skill || '') : '';
                                const successChance = typeof option === 'object' ? (option.success_chance || option.successChance || '') : '';

                                // Skip if action is empty
                                if (!action) return null;

                                // Only show skill/chance if they exist and aren't "-"
                                const hasSkill = skill && skill !== '-';
                                const hasChance = successChance && successChance !== '-';

                                return (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        className="h-auto whitespace-normal text-left justify-start"
                                        onClick={() => handleQuickOptionClick(action, skill)}
                                        disabled={isSubmitting}
                                    >
                                        <div className="flex flex-col">
                                            <span>{action}</span>
                                            {(hasSkill || hasChance) && (
                                                <span className="text-xs text-muted-foreground">
                                                    {hasSkill && `${skill}`}
                                                    {hasSkill && hasChance && ' • '}
                                                    {hasChance && `${successChance}`}
                                                </span>
                                            )}
                                        </div>
                                    </Button>
                                );
                            })}
                        </div>
                         <Separator className="my-4" />
                    </div>
                )}

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
                            rows={5}
                            className="bg-background/50"
                        />
                    </div>
                </form>
            </CardContent>
            
            {canSubmit && (
                 <div className="absolute -right-8 bottom-1/2 translate-y-1/2">
                    <RusticIconButton 
                        tooltip={isSubmitting ? t('narrativePosting') : t('narrativePostResponse')} 
                        disabled={isSubmitting} 
                        onClick={handleSubmit} 
                        className="text-foreground w-24 h-24"
                    >
                        <Send size={32} />
                    </RusticIconButton>
                </div>
            )}
        </Card>
    );
}
