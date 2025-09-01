
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlippingAvatar } from "@/components/flipping-avatar";
import { useAuth } from "@/context/auth-context";
import { Eye } from "lucide-react";

const comments = [
    {
        id: "comment-1",
        playerId: "2", // Alice's user ID
        characterName: "Grom",
        playerName: "Alice",
        playerImage: "https://picsum.photos/100/100?random=5",
        characterImage: "https://picsum.photos/100/100?random=6",
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
        characterImage: "https://picsum.photos/100/100?random=8",
        timestamp: "1 day ago",
        text: "Lyra scans the guards, her eyes trying to gauge their intentions. She subtly readies a minor illusion spell, just in case."
    }
]

export default function NarrativePage() {
  const { user } = useAuth();
  const isMaster = user?.role === 'master';

  // For players, only show their own comments until the DM replies (simulated)
  const visibleComments = isMaster 
    ? comments
    : comments.filter(c => c.playerId === user?.id);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Arrival at Silverwood</CardTitle>
          <CardDescription>Posted by Game Master - 2 days ago</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none text-foreground/90 space-y-4">
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

        </CardContent>
      </Card>
      <div className="space-y-4">
        <h3 className="font-headline text-xl">Comments ({visibleComments.length})</h3>
        
        {visibleComments.map((comment) => (
            <Card key={comment.id}>
              <div className="flex gap-4 p-4">
                <div className="flex flex-col items-center w-24 flex-shrink-0">
                  <FlippingAvatar
                    playerImage={comment.playerImage}
                    characterImage={comment.characterImage}
                    playerHint="person face"
                    characterHint="fantasy portrait"
                    className="w-16 h-16 mb-2 border-2 border-primary/20"
                  />
                  <p className="font-bold text-sm text-center">{comment.characterName}</p>
                  <p className="text-xs text-muted-foreground text-center">{comment.playerName}</p>
                </div>
                <div className="flex-1 relative">
                    <CardDescription className="absolute top-0 right-0 text-xs">{comment.timestamp}</CardDescription>
                    <div className="mt-8 prose prose-invert max-w-none text-foreground/90">
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
                </div>
              </div>
            </Card>
        ))}

        <Button>Add Comment</Button>
      </div>
    </div>
  );
}
