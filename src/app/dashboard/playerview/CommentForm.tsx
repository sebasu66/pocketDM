
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareQuote, Send } from "lucide-react";
import type { Character } from "@/lib/firebase/types";
import { RusticIconButton } from "@/components/ui/rustic-icon-button";

interface CommentFormProps {
    onSubmit: (text: string) => Promise<void>;
    character: Character | null;
    t: (key: string) => string;
}

export function CommentForm({ onSubmit, character, t }: CommentFormProps) {
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

    return (
        <Card className="bg-stone-gradient border-0">
            <CardHeader>
                <CardTitle className="font-headline text-3xl uppercase tracking-widest text-center">
                    {t('narrativeYourTurn').replace('{characterName}', character?.name || 'Adventurer')}
                </CardTitle>
                <CardDescription className="text-center">{t('narrativeYourTurnDesc')}</CardDescription>
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
                            className="bg-background/50"
                        />
                    </div>
                    <div className="flex justify-end">
                        <RusticIconButton tooltip={isSubmitting ? t('narrativePosting') : t('narrativePostResponse')} disabled={isSubmitting} type="submit" className="text-foreground">
                            <Send />
                        </RusticIconButton>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
