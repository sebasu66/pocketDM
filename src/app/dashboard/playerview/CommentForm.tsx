
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text || isSubmitting) return;
        setIsSubmitting(true);
        await onSubmit(text);
        setText("");
        setIsSubmitting(false);
    };

    const handleQuickOptionClick = async (option: QuickOption) => {
        if (isSubmitting) return;
        const commentText = `${option.action} (${option.skill})`;
        setIsSubmitting(true);
        await onSubmit(commentText);
        setIsSubmitting(false);
    }

    return (
        <Card className="bg-stone-gradient border-0">
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
                            {quickOptions.map((option, index) => (
                                <Button 
                                    key={index} 
                                    variant="outline" 
                                    className="h-auto whitespace-normal text-left justify-start"
                                    onClick={() => handleQuickOptionClick(option)}
                                    disabled={isSubmitting}
                                >
                                    <div className="flex flex-col">
                                        <span>{option.action}</span>
                                        <span className="text-xs text-muted-foreground">Habilidad: {option.skill} | Probabilidad: {option.successChance}</span>
                                    </div>
                                </Button>
                            ))}
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
                    <div className="flex justify-end">
                        <RusticIconButton tooltip={isSubmitting ? t('narrativePosting') : t('narrativePostResponse')} disabled={isSubmitting || !text} type="submit" className="text-foreground">
                            <Send />
                        </RusticIconButton>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
