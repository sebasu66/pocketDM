
"use client";

import type { EnrichedComment } from '@/lib/firebase/types';
import { FlippingAvatar } from '@/components/flipping-avatar';

interface ThreadCommentsProps {
    comments: EnrichedComment[];
    t: (key: string) => string;
}

export function ThreadComments({ comments, t }: ThreadCommentsProps) {
    if (!comments || comments.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            {comments.map(comment => (
                <div key={comment.id} className="flex gap-4 items-start">
                    <FlippingAvatar
                        playerImage={comment.author?.avatar || 'https://picsum.photos/100/100?random=1'}
                        characterImage={comment.character ? `/characters/VisualPreset/${comment.character.visualPreset}/portrait` : 'https://picsum.photos/100/100?random=1'}
                        characterFaceImage={comment.character ? `/characters/VisualPreset/${comment.character.visualPreset}/face` : undefined}
                        playerHint="person face"
                        characterHint={"fantasy portrait"}
                        className="w-24 h-24 flex-shrink-0"
                    />
                    <div className="flex-1 pt-1">
                        <p className="font-bold text-lg leading-tight">{comment.character?.name || comment.author?.name || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</p>
                        <p className="prose prose-invert max-w-none text-foreground/90 mt-2">{comment.text}</p>
                        {comment.hiddenText && (
                             <div className="border-l-2 border-destructive bg-destructive/10 p-3 rounded-r-md mt-2">
                                <p className="flex items-center gap-2 text-xs font-semibold text-destructive-foreground/80">{t('narrativeHiddenMessage')}</p>
                                <div className="prose prose-sm prose-invert text-destructive-foreground/70">
                                    <p>"{comment.hiddenText}"</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
