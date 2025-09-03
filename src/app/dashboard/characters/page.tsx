
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Sheet, Upload, Eye, EyeOff, Sparkles, HelpCircle, Save, X } from "lucide-react";
import Image from "next/image";
import type { Character, ConditionalRule } from "@/lib/firebase/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { getCharactersByCampaign, addCharacter, deleteCharacter, updateCharacter } from "@/lib/firebase/characters";
import { Slider } from "@/components/ui/slider";
import { getArchetype } from "@/lib/archetypes";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { RusticIconButton } from "@/components/ui/rustic-icon-button";

export default function CharactersPage() {
  const { campaign, user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

  const fetchCharacter = useCallback(async () => {
    if (campaign && user) {
      setIsLoading(true);
      try {
        const userCharacters: Character[] = await getCharactersByCampaign(campaign.id, user.id);
        const currentChar = userCharacters.length > 0 ? userCharacters[0] : null;
        setCharacter(currentChar);
        setEditingCharacter(currentChar ? { ...currentChar } : null);
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not fetch your character." });
      } finally {
        setIsLoading(false);
      }
    }
  }, [campaign, user, toast]);

  useEffect(() => {
    if (!isAuthLoading) {
      fetchCharacter();
    }
  }, [isAuthLoading, fetchCharacter]);

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
      isActive: true,
    };
    
    try {
        await addCharacter(newCharacterData);
        toast({ title: "Character Created!", description: "Your new hero is ready for adventure." });
        await fetchCharacter();
        event.currentTarget.reset();
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not create your character."});
    }
  };
  
  const handleDelete = async () => {
    if (!character) return;
    
    try {
        await deleteCharacter(character.id);
        toast({ title: "Character Deleted", description: "Your hero has been retired." });
        setCharacter(null);
        setEditingCharacter(null);
    } catch (error) {
         toast({ variant: "destructive", title: "Error", description: "Could not delete your character."});
    }
  };

  const handleOpenSheet = () => {
    if (character) {
      const charWithDefaults = {
        ...character,
        conditionalRules: character.conditionalRules && character.conditionalRules.length > 0 ? character.conditionalRules : [{if: '', then: ''}, {if: '', then: ''}, {if: '', then: ''}]
      };
      setEditingCharacter(charWithDefaults);
      setIsSheetOpen(true);
    }
  };

  const handleSaveChanges = async () => {
    if (!editingCharacter) return;
    
    try {
        await updateCharacter(editingCharacter.id, editingCharacter);
        toast({ title: "Character Saved", description: "Your hero's sheet has been updated." });
        await fetchCharacter();
        setIsSheetOpen(false);
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not save your changes."});
    }
  };
  
  const handleStatChange = (stat: keyof Character, value: any) => {
    if (editingCharacter) {
      const isNumeric = ['level', 'strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma', 'position', 'resolve', 'altruism', 'discipline'].includes(stat as string);
      
      const newEditingCharacter = {
        ...editingCharacter,
        [stat]: isNumeric ? (typeof value === 'number' ? value : parseInt(value as string, 10) || 0) : value,
      };

      if (['position', 'resolve', 'altruism', 'discipline'].includes(stat as string)) {
          const archetype = getArchetype(
              newEditingCharacter.position || 50,
              newEditingCharacter.resolve || 50,
              newEditingCharacter.altruism || 50,
              newEditingCharacter.discipline || 50
          );
          newEditingCharacter.archetype = archetype.archetype;
          newEditingCharacter.archetypeDescription = archetype.description;
      }
      
      setEditingCharacter(newEditingCharacter);
    }
  };

  const handleConditionalRuleChange = (index: number, part: 'if' | 'then', value: string) => {
    if (editingCharacter) {
      const newRules = [...(editingCharacter.conditionalRules || [{if: '', then: ''}, {if: '', then: ''}, {if: '', then: ''}])];
      newRules[index] = { ...newRules[index], [part]: value };
      handleStatChange('conditionalRules', newRules);
    }
  };


  const handlePortraitChange = () => {
    if (editingCharacter) {
      setEditingCharacter({
        ...editingCharacter,
        portrait: `https://picsum.photos/400/600?random=${Math.random()}`,
        aiHint: "fantasy portrait",
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
                        <div className="flex items-center gap-4">
                           <CardTitle className="font-headline text-3xl">{character.name}</CardTitle>
                           <Badge variant={character.isActive ? "default" : "secondary"}>
                             {character.isActive ? <Eye className="mr-2" /> : <EyeOff className="mr-2" />}
                             {character.isActive ? "Active" : "Inactive"}
                           </Badge>
                        </div>
                        <CardDescription>Your hero for the campaign: {campaign?.title}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <RusticIconButton tooltip="View/Edit Sheet" onClick={handleOpenSheet}>
                            <Sheet />
                        </RusticIconButton>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <RusticIconButton tooltip="Delete Character" variant="incomplete" className="text-red-500/80 hover:text-red-500">
                                    <Trash2 />
                                </RusticIconButton>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    character and remove your data from our servers.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
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
                    {character.archetype && (
                        <div>
                            <h3 className="font-headline text-xl flex items-center gap-2"><Sparkles className="w-5 h-5 text-accent" />Archetype: {character.archetype}</h3>
                            <p className="text-muted-foreground italic">"{character.archetypeDescription}"</p>
                        </div>
                    )}
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
                <RusticIconButton tooltip="Upload Image" disabled>
                    <Upload />
                </RusticIconButton>
            </div>
            </CardContent>
        </Card>
      )}
      <Dialog open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <DialogContent className="sm:max-w-4xl grid-rows-[auto,1fr,auto]">
            <DialogHeader>
                <DialogTitle className="font-headline">Edit Character Sheet</DialogTitle>
                <DialogDescription>
                    Update your character's details and attributes here. Click save when you're done.
                </DialogDescription>
            </DialogHeader>
            {editingCharacter && (
              <TooltipProvider>
                <div className="grid md:grid-cols-3 gap-x-8 gap-y-6 py-4 overflow-y-auto max-h-[70vh] pr-4">
                    {/* Column 1: Core Info & Portrait */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="isActive" checked={editingCharacter.isActive} onCheckedChange={(c) => handleStatChange('isActive', c)} />
                        <Label htmlFor="isActive">Character is Active</Label>
                      </div>
                      <div className="grid items-center gap-1.5">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" value={editingCharacter.name} onChange={(e) => handleStatChange('name', e.target.value)} />
                      </div>
                       <div className="grid items-center gap-1.5">
                          <Label htmlFor="class">Class</Label>
                          <Input id="class" value={editingCharacter.class || ''} onChange={(e) => handleStatChange('class', e.target.value)} />
                      </div>
                       <div className="grid items-center gap-1.5">
                          <Label htmlFor="level">Level</Label>
                          <Input id="level" type="number" value={editingCharacter.level || 1} onChange={(e) => handleStatChange('level', e.target.value)} />
                      </div>
                      <div className="grid items-center gap-1.5">
                          <Label htmlFor="description">Description</Label>
                          <Textarea id="description" value={editingCharacter.description} onChange={(e) => handleStatChange('description', e.target.value)} rows={5} />
                      </div>
                      <div className="flex flex-col items-center justify-start gap-4 pt-4">
                        <Label>Portrait</Label>
                        <div className="relative w-48 h-72 bg-background rounded overflow-hidden">
                            <Image src={editingCharacter.portrait} alt={editingCharacter.name} width={200} height={300} className="w-full h-full object-cover" data-ai-hint={editingCharacter.aiHint || 'fantasy portrait'} />
                        </div>
                        <RusticIconButton tooltip="Change Portrait" onClick={handlePortraitChange}>
                            <Upload />
                        </RusticIconButton>
                    </div>
                    </div>
                    
                    {/* Column 2: Attributes & Behavior Profile */}
                    <div className="space-y-6 md:col-span-2">
                        <div className="space-y-4">
                            <h3 className="font-headline text-lg">Attributes</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                                <AttributeInput label="STR" value={editingCharacter.strength} onChange={(e) => handleStatChange('strength', e.target.value)} />
                                <AttributeInput label="DEX" value={editingCharacter.dexterity} onChange={(e) => handleStatChange('dexterity', e.target.value)} />
                                <AttributeInput label="CON" value={editingCharacter.constitution} onChange={(e) => handleStatChange('constitution', e.target.value)} />
                                <AttributeInput label="INT" value={editingCharacter.intelligence} onChange={(e) => handleStatChange('intelligence', e.target.value)} />
                                <AttributeInput label="WIS" value={editingCharacter.wisdom} onChange={(e) => handleStatChange('wisdom', e.target.value)} />
                                <AttributeInput label="CHA" value={editingCharacter.charisma} onChange={(e) => handleStatChange('charisma', e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex justify-between items-center">
                                <h3 className="font-headline text-lg">Behavior Profile</h3>
                                {editingCharacter.archetype && (
                                     <div className="text-right">
                                        <p className="font-bold text-accent flex items-center gap-2"><Sparkles className="w-4 h-4" /> {editingCharacter.archetype}</p>
                                        <p className="text-xs text-muted-foreground">{editingCharacter.archetypeDescription}</p>
                                     </div>
                                )}
                            </div>
                             <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                                 <BehaviorSlider 
                                     label="Position"
                                     value={editingCharacter.position || 50}
                                     onValueChange={(v) => handleStatChange('position', v[0])}
                                     minLabel="Backline"
                                     maxLabel="Frontline"
                                     tooltip="Where does your character prefer to be in a fight? Backliners are cautious, frontliners are aggressive."
                                 />
                                <BehaviorSlider 
                                     label="Resolve"
                                     value={editingCharacter.resolve || 50}
                                     onValueChange={(v) => handleStatChange('resolve', v[0])}
                                     minLabel="Flee"
                                     maxLabel="Fight"
                                     tooltip="How courageous is your character? Will they flee from danger or stand and fight to the end?"
                                 />
                                 <BehaviorSlider 
                                     label="Altruism"
                                     value={editingCharacter.altruism || 50}
                                     onValueChange={(v) => handleStatChange('altruism', v[0])}
                                     minLabel="Selfish"
                                     maxLabel="Group First"
                                     tooltip="Is your character selfish or selfless? Will they prioritize their own gain or protect their friends first?"
                                 />
                                 <BehaviorSlider 
                                     label="Discipline"
                                     value={editingCharacter.discipline || 50}
                                     onValueChange={(v) => handleStatChange('discipline', v[0])}
                                     minLabel="Reckless"
                                     maxLabel="Tactical"
                                     tooltip="How does your character approach problems? Are they reckless and impulsive, or careful and tactical?"
                                 />
                             </div>
                        </div>
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="font-headline text-lg">Behavior Details</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <WithTooltip tooltip="What is your character's go-to move in a fight? (e.g., 'Fireball', 'Charge with axe', 'Hide and snipe')">
                                        <LabelWithInfo htmlFor="preferredAttack" label="Preferred Attack" />
                                    </WithTooltip>
                                    <Input id="preferredAttack" value={editingCharacter.preferredAttack || ''} onChange={(e) => handleStatChange('preferredAttack', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <WithTooltip tooltip="What single person, place, or thing does your character value above all else?">
                                      <LabelWithInfo htmlFor="mostPrecious" label="Most Precious" />
                                    </WithTooltip>
                                    <Input id="mostPrecious" value={editingCharacter.mostPrecious || ''} onChange={(e) => handleStatChange('mostPrecious', e.target.value)} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <WithTooltip tooltip="A short phrase your character lives by or shouts in battle.">
                                      <LabelWithInfo htmlFor="motto" label="Motto / Battle Cry" />
                                    </WithTooltip>
                                    <Input id="motto" value={editingCharacter.motto || ''} onChange={(e) => handleStatChange('motto', e.target.value)} />
                                </div>
                            </div>
                        </div>
                         <div className="space-y-4 pt-4 border-t">
                             <WithTooltip tooltip="Define specific rules for the AI to follow. These are high-priority instructions for specific situations.">
                                <h3 className="font-headline text-lg flex items-center gap-2">Conditional Rules <HelpCircle className="w-4 h-4 text-muted-foreground" /></h3>
                             </WithTooltip>
                            <div className="space-y-2">
                                {[0, 1, 2].map(index => (
                                    <ConditionalRuleInput 
                                        key={index} 
                                        index={index} 
                                        rule={(editingCharacter.conditionalRules || [])[index]}
                                        onChange={handleConditionalRuleChange}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
              </TooltipProvider>
            )}
            <DialogFooter>
                 <DialogClose asChild>
                    <RusticIconButton tooltip="Cancel" variant="incomplete">
                        <X />
                    </RusticIconButton>
                </DialogClose>
                <RusticIconButton tooltip="Save Changes" onClick={handleSaveChanges}>
                    <Save />
                </RusticIconButton>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const WithTooltip = ({ children, tooltip }: { children: React.ReactNode, tooltip: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipContent side="top" align="start" className="max-w-xs">
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
);

const LabelWithInfo = ({ label, htmlFor }: { label: string, htmlFor: string }) => (
    <div className="flex items-center gap-2">
        <Label htmlFor={htmlFor}>{label}</Label>
        <HelpCircle className="w-4 h-4 text-muted-foreground" />
    </div>
);

const StatDisplay = ({ label, value }: { label: string; value: number }) => (
    <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50 border">
        <span className="text-xs font-bold text-muted-foreground">{label}</span>
        <span className="text-2xl font-bold font-headline">{value || 0}</span>
    </div>
);

const AttributeInput = ({ label, value, onChange }: { label: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="space-y-2">
        <Label htmlFor={`attr-${label}`} className="text-center block">{label}</Label>
        <Input id={`attr-${label}`} type="number" value={value || 0} onChange={onChange} className="text-center" />
    </div>
);

const BehaviorSlider = ({ label, value, onValueChange, minLabel, maxLabel, tooltip }: { label: string; value: number, onValueChange: (value: number[]) => void, minLabel: string, maxLabel: string, tooltip: string }) => (
    <WithTooltip tooltip={tooltip}>
        <div className="space-y-2">
            <div className="flex justify-between items-baseline">
                <Label className="flex items-center gap-2">{label} <HelpCircle className="w-4 h-4 text-muted-foreground" /></Label>
                <span className="text-sm font-mono text-muted-foreground">{value}/100</span>
            </div>
            <Slider
                defaultValue={[value]}
                onValueChange={onValueChange}
                max={100}
                step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>{minLabel}</span>
                <span>{maxLabel}</span>
            </div>
        </div>
    </WithTooltip>
);


const ConditionalRuleInput = ({ index, rule, onChange }: { index: number, rule: ConditionalRule, onChange: (index: number, part: 'if' | 'then', value: string) => void }) => {
    return (
        <div className="flex gap-2 items-center">
            <Label className="font-bold">IF</Label>
            <Input 
                value={rule?.if || ''}
                onChange={(e) => onChange(index, 'if', e.target.value)}
                placeholder="character health < 10%"
            />
            <Label className="font-bold">THEN</Label>
            <Input
                value={rule?.then || ''}
                onChange={(e) => onChange(index, 'then', e.target.value)}
                placeholder="use health potion"
            />
        </div>
    )
}

    