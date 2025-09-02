
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Sheet } from "lucide-react";
import Image from "next/image";
import { getCharactersByCampaign, addCharacter, updateCharacter } from "@/lib/firebase/characters";
import type { Character } from "@/lib/firebase/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";

export default function CharactersPage() {
  const { campaign, user, isLoading: isAuthLoading } = useAuth();
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

  const fetchCharacter = async () => {
    if (campaign && user) {
      setIsLoading(true);
      const userCharacters = await getCharactersByCampaign(campaign.id, user.id);
      const currentChar = userCharacters.length > 0 ? userCharacters[0] : null;
      setCharacter(currentChar);
      setEditingCharacter(currentChar ? { ...currentChar } : null);
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
      portrait: `https://picsum.photos/400/600?random=${Math.random()}`,
      aiHint: "fantasy portrait",
      campaignId: campaign.id,
      userId: user.id,
    };
    
    await addCharacter(newCharacterData);
    await fetchCharacter(); // Refetch character after creation
    event.currentTarget.reset();
  };

  const handleOpenSheet = () => {
    if (character) {
      setEditingCharacter({ ...character });
      setIsSheetOpen(true);
    }
  };

  const handleSaveChanges = async () => {
    if (!editingCharacter) return;
    
    await updateCharacter(editingCharacter.id, editingCharacter);
    await fetchCharacter(); // Refetch to get the latest data
    setIsSheetOpen(false);
  };
  
  const handleStatChange = (stat: keyof Character, value: string) => {
    if (editingCharacter) {
      const isNumeric = ['level', 'strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].includes(stat);
      setEditingCharacter({
        ...editingCharacter,
        [stat]: isNumeric ? parseInt(value, 10) || 0 : value,
      });
    }
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
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-3xl">{character.name}</CardTitle>
                        <CardDescription>Your hero for the campaign: {campaign?.title}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleOpenSheet}>
                            <Sheet /> View/Edit Sheet
                        </Button>
                        <Button variant="outline" size="icon" className="border-destructive/50 text-destructive/80 hover:bg-destructive hover:text-destructive-foreground">
                            <Trash2 />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <Image src={character.portrait} alt={character.name} width={400} height={600} className="w-full h-auto object-cover rounded-lg border-2 border-primary/20" data-ai-hint={character.aiHint} />
                </div>
                <div className="md:col-span-2 space-y-4">
                    <div>
                        <h3 className="font-headline text-xl">Character Details</h3>
                         <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Level {character.level} {character.class}</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-headline text-xl">Description</h3>
                        <p className="text-muted-foreground">{character.description}</p>
                    </div>
                    <div>
                        <h3 className="font-headline text-xl">Attributes</h3>
                        <div className="grid grid-cols-3 gap-4 pt-2">
                            <StatDisplay label="STR" value={character.strength} />
                            <StatDisplay label="DEX" value={character.dexterity} />
                            <StatDisplay label="CON" value={character.constitution} />
                            <StatDisplay label="INT" value={character.intelligence} />
                            <StatDisplay label="WIS" value={character.wisdom} />
                            <StatDisplay label="CHA" value={character.charisma} />
                        </div>
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

      <Dialog open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
                <DialogTitle className="font-headline">Edit Character Sheet</DialogTitle>
                <DialogDescription>
                    Update your character's details and attributes here. Click save when you're done.
                </DialogDescription>
            </DialogHeader>
            {editingCharacter && (
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={editingCharacter.name} onChange={(e) => handleStatChange('name', e.target.value)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="class" className="text-right">Class</Label>
                        <Input id="class" value={editingCharacter.class} onChange={(e) => handleStatChange('class', e.target.value)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="level" className="text-right">Level</Label>
                        <Input id="level" type="number" value={editingCharacter.level} onChange={(e) => handleStatChange('level', e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <Textarea id="description" value={editingCharacter.description} onChange={(e) => handleStatChange('description', e.target.value)} className="col-span-3" rows={4} />
                    </div>
                    <div className="grid grid-cols-6 gap-4 pt-4">
                        <AttributeInput label="STR" value={editingCharacter.strength} onChange={(e) => handleStatChange('strength', e.target.value)} />
                        <AttributeInput label="DEX" value={editingCharacter.dexterity} onChange={(e) => handleStatChange('dexterity', e.target.value)} />
                        <AttributeInput label="CON" value={editingCharacter.constitution} onChange={(e) => handleStatChange('constitution', e.target.value)} />
                        <AttributeInput label="INT" value={editingCharacter.intelligence} onChange={(e) => handleStatChange('intelligence', e.target.value)} />
                        <AttributeInput label="WIS" value={editingCharacter.wisdom} onChange={(e) => handleStatChange('wisdom', e.target.value)} />
                        <AttributeInput label="CHA" value={editingCharacter.charisma} onChange={(e) => handleStatChange('charisma', e.target.value)} />
                    </div>
                </div>
            )}
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="button" onClick={handleSaveChanges}>Save Changes</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const StatDisplay = ({ label, value }: { label: string; value: number }) => (
    <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50 border">
        <span className="text-xs font-bold text-muted-foreground">{label}</span>
        <span className="text-2xl font-bold font-headline">{value}</span>
    </div>
);

const AttributeInput = ({ label, value, onChange }: { label: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="space-y-2">
        <Label htmlFor={`attr-${label}`} className="text-center block">{label}</Label>
        <Input id={`attr-${label}`} type="number" value={value} onChange={onChange} className="text-center" />
    </div>
);
