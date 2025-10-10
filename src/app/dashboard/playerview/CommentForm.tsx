
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareQuote, Send, Zap, Mic, MicOff } from "lucide-react";
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
    const [isListening, setIsListening] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Check if browser supports Web Speech API
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                setSpeechSupported(true);
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'es-ES'; // Spanish for this campaign

                recognition.onresult = (event: any) => {
                    let fullTranscript = '';

                    for (let i = 0; i < event.results.length; i++) {
                        fullTranscript += event.results[i][0].transcript;
                    }

                    setText(fullTranscript);
                };

                recognition.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error);
                    setIsListening(false);
                };

                recognition.onend = () => {
                    setIsListening(false);
                };

                recognitionRef.current = recognition;
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
        e?.preventDefault();
        if (!text || isSubmitting) {
            return;
        }

        // Stop listening if active
        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }

        setIsSubmitting(true);
        try {
            await onSubmit(text);
            setText("");
        } catch (error) {
            console.error('[CommentForm] onSubmit failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleQuickOptionClick = (option: QuickOption) => {
        const actionText = option.action;
        const skillText = (option.skill && option.skill !== '-') ? ` (${option.skill})` : '';
        const fullText = `${actionText}${skillText}`;
        setText(fullText);
    }
    
    const canSubmit = text.length >= 3;

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
                                if (!option || !option.action) return null;

                                const hasSkill = option.skill && option.skill !== '-';
                                const hasChance = option.success_chance && option.success_chance !== '-';

                                return (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        className="h-auto whitespace-normal text-left justify-start"
                                        onClick={() => handleQuickOptionClick(option)}
                                        disabled={isSubmitting}
                                    >
                                        <div className="flex flex-col">
                                            <span>{option.action}</span>
                                            {(hasSkill || hasChance) && (
                                                <span className="text-xs text-muted-foreground">
                                                    {hasSkill && `${option.skill}`}
                                                    {hasSkill && hasChance && ' • '}
                                                    {hasChance && `${option.success_chance}`}
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
                        <div className="relative">
                            <Textarea
                                id="comment-text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder={t('narrativePublicResponsePlaceholder')}
                                rows={5}
                                className="bg-background/50 pr-12"
                            />
                            {speechSupported && (
                                <Button
                                    type="button"
                                    variant={isListening ? "destructive" : "outline"}
                                    size="icon"
                                    className="absolute right-2 bottom-2"
                                    onClick={toggleListening}
                                    disabled={isSubmitting}
                                    title={isListening ? "Detener grabación" : "Grabar con micrófono"}
                                >
                                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                                </Button>
                            )}
                        </div>
                        {isListening && (
                            <p className="text-xs text-muted-foreground animate-pulse">
                                🎤 Escuchando... Habla ahora
                            </p>
                        )}
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
