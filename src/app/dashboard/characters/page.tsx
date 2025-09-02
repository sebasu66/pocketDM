
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import Image from "next/image";
import { getCharactersByCampaign, addCharacter } from "@/lib/firebase/characters";
import type { Character } from "@/lib/firebase/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function CharactersPage() {
  const { campaign, user, isLoading: isAuthLoading } = useAuth();
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCharacter = async () => {
    if (campaign && user) {
      setIsLoading(true);
      const userCharacters = await getCharactersByCampaign(campaign.id, user.id);
      setCharacter(userCharacters.length > 0 ? userCharacters[0] : null);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading) {
      fetchCharacter();
    }
  }, [campaign, user, isAuthLoading]);

  const handleCreateCharacter = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!campaign || !user) return;

    const formData = new FormData(event.currentTarget);
    const newCharacterData = {
      name: formData.get("char-name") as string,
      description: formData.get("char-background") as string,
      // concept: formData.get("char-concept") as string, // This field doesn't exist on Character type
      portrait: `https://picsum.photos/400/600?random=${Math.random()}`,
      aiHint: "fantasy portrait",
      campaignId: campaign.id,
      userId: user.id,
    };
    
    await addCharacter(newCharacterData);
    await fetchCharacter(); // Refetch character after creation
    event.currentTarget.reset();
  };

  if (isLoading || isAuthLoading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="flex flex-col items-center justify-center bg-muted/50 rounded-lg p-4">
                    <Skeleton className="w-48 h-72 rounded" />
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="space-y-8">
      {character ? (
        <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">{character.name}</CardTitle>
                <CardDescription>Your hero for the campaign: {campaign?.title}</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <Image src={character.portrait} alt={character.name} width={400} height={600} className="w-full h-auto object-cover rounded-lg border-2 border-primary/20" data-ai-hint={character.aiHint} />
                </div>
                <div className="md:col-span-2 space-y-4">
                    <div>
                        <h3 className="font-headline text-xl">Description</h3>
                        <p className="text-muted-foreground">{character.description}</p>
                    </div>
                     <div className="flex gap-2 pt-4">
                        <Button className="w-full">
                            <Edit /> View/Edit Sheet
                        </Button>
                        <Button variant="outline" size="icon" className="border-destructive/50 text-destructive/80 hover:bg-destructive hover:text-destructive-foreground">
                            <Trash2 />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
      ) : (
        <Card>
            <CardHeader>
            <CardTitle className="font-headline">Create Your Character</CardTitle>
            <CardDescription>You don't have a character in this campaign yet. Define your new hero to join the adventure.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
            <form onSubmit={handleCreateCharacter} className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="char-name">Character Name</Label>
                <Input id="char-name" name="char-name" placeholder="e.g., Alistair Ironhand" required/>
                </div>
                <div className="space-y-2">
                <Label htmlFor="char-concept">Character Concept</Label>
                <Textarea id="char-concept" name="char-concept" placeholder="A brief summary of the character's core idea, e.g., 'Exiled sorcerer seeking forbidden knowledge.'" />
                </div>
                <div className="space-y-2">
                <Label htmlFor="char-background">Background</Label>
                <Textarea id="char-background" name="char-background" rows={5} placeholder="The detailed backstory of your character." required/>
                </div>
                <Button type="submit">
                <PlusCircle />
                Create Character
                </Button>
            </form>
            <div className="flex flex-col items-center justify-center bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-muted-foreground mb-2">Character Portrait</p>
                <div className="w-48 h-72 bg-background rounded overflow-hidden mb-4 flex items-center justify-center">
                    <p className="text-xs text-muted-foreground p-2">A portrait will be generated for you upon creation.</p>
                </div>
                <Button variant="outline" disabled>Upload Image</Button>
            </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
