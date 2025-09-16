
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Sheet, Upload, Eye, EyeOff, Sparkles, HelpCircle, Save, X, User as UserIcon, ArrowRight, BookOpen } from "lucide-react";
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
import { getUserById } from "@/lib/auth";
import { useI18n } from "@/context/i18n-context";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { archetypes as seedArchetypes } from "@/lib/firebase/data/seed-archetypes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CharacterSheet } from "../playerview/CharacterSheet";
import { GameModal, GameModalContent, GameModalHeader, GameModalTitle } from "@/components/ui/game-modal";

const archetypesList = Object.values(seedArchetypes);

export default function CharactersPage() {
  const { campaign, user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [character, setCharacter] = useState<Character | null>(null);
  const [allCharacters, setAllCharacters] = useState<(Character & { playerName: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const { t } = useI18n();
  const [creationStep, setCreationStep] = useState(0);
  const [selectedArchetype, setSelectedArchetype] = useState<any | null>(null);
  const [newCharName, setNewCharName] = useState("");
  const [newCharBackground, setNewCharBackground] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const isMaster = user?.role === 'master';

  const fetchCharacters = useCallback(async () => {
    if (campaign && user) {
      setIsLoading(true);
      try {
        if (isMaster) {
          const charactersFromDb = await getCharactersByCampaign(campaign.id);
          const charactersWithPlayers = await Promise.all(
            charactersFromDb.map(async (char) => {
              const player = await getUserById(char.userId);
              return { ...char, playerName: player?.name || t('charactersUnknownPlayer') };
            })
          );
          setAllCharacters(charactersWithPlayers);
        } else {
          const userCharacters: Character[] = await getCharactersByCampaign(campaign.id, user.id);
          const currentChar = userCharacters.length > 0 ? userCharacters[0] : null;
          setCharacter(currentChar);
          setEditingCharacter(currentChar ? { ...currentChar } : null);
        }
      } catch (error) {
        toast({ variant: "destructive", title: t('charactersError'), description: t('charactersErrorFetch') });
      } finally {
        setIsLoading(false);
      }
    }
  }, [campaign, user, toast, isMaster, t]);

  useEffect(() => {
    if (!isAuthLoading) {
      fetchCharacters();
    }
  }, [isAuthLoading, fetchCharacters]);

  const handleSelectArchetype = (archetype: any) => {
    setSelectedArchetype(archetype);
    setCreationStep(1);
    setNewCharBackground(archetype.generalBackground);
  }

  const handleCreateCharacter = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!campaign || !user || !selectedArchetype) return;
    
    setIsCreating(true);
    try {
        const newCharacterData: Partial<Character> = {
            name: newCharName,
            description: newCharBackground,
            campaignId: campaign.id,
            userId: user.id,
            archetypeId: selectedArchetype.id,
        };

        await addCharacter(newCharacterData);
        toast({ title: t('charactersCreated'), description: t('charactersCreatedDesc') });
        await fetchCharacters();
        // Reset state
        setCreationStep(0);
        setSelectedArchetype(null);
        setNewCharName("");
        setNewCharBackground("");

    } catch (error) {
        toast({ variant: "destructive", title: t('charactersError'), description: t('charactersErrorCreate')});
    } finally {
        setIsCreating(false);
    }
  };
  
  const handleDelete = async (characterId: string) => {
    if (!characterId) return;
    
    try {
        await deleteCharacter(characterId);
        toast({ title: t('charactersDeleted'), description: t('charactersDeletedDesc') });
        if (isMaster) {
          setAllCharacters(prev => prev.filter(c => c.id !== characterId));
        } else {
          setCharacter(null);
          setEditingCharacter(null);
        }
    } catch (error) {
         toast({ variant: "destructive", title: t('charactersError'), description: t('charactersErrorDelete')});
    }
  };

  const handleOpenSheet = (char: Character) => {
    const charWithDefaults = {
      ...char,
      conditionalRules: char.conditionalRules && char.conditionalRules.length > 0 ? char.conditionalRules : [{if: '', then: ''}, {if: '', then: ''}, {if: '', then: ''}]
    };
    setEditingCharacter(charWithDefaults);
    setIsSheetOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!editingCharacter) return;
    
    try {
        await updateCharacter(editingCharacter.id, editingCharacter);
        toast({ title: t('charactersSaved'), description: t('charactersSavedDesc') });
        await fetchCharacters();
        setIsSheetOpen(false);
    } catch (error) {
        toast({ variant: "destructive", title: t('charactersError'), description: t('charactersErrorSave')});
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

  if (isLoading || isAuthLoading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-48 w-full" />
            </CardContent>
        </Card>
    )
  }

  // GAME MASTER VIEW
  if (isMaster) {
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">{t('charactersRosterTitle')}</CardTitle>
            <CardDescription>{t('charactersRosterDesc', { campaignTitle: campaign?.title })}</CardDescription>
          </CardHeader>
          <CardContent>
            {allCharacters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCharacters.map(char => (
                  <Card key={char.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="font-headline text-2xl">{char.name}</CardTitle>
                        <Badge variant={char.isActive ? "default" : "secondary"} className="shrink-0">
                             {char.isActive ? <Eye className="mr-1" /> : <EyeOff className="mr-1" />}
                             {char.isActive ? t('charactersActive') : t('charactersInactive')}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-2 pt-1"><UserIcon size={14}/> {char.playerName}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-center items-center">
                       <ImageWithFallback baseSrc={`/characters/VisualPreset/${char.visualPreset}/portrait`} alt={char.name} width={200} height={300} className="w-48 h-72 object-cover rounded-lg border-2 border-primary/20" data-ai-hint="fantasy portrait" />
                    </CardContent>
                    <CardFooter className="flex justify-center gap-2">
                       <RusticIconButton tooltip={t('charactersViewEditSheet')} onClick={() => handleOpenSheet(char)}>
                            <Sheet />
                        </RusticIconButton>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <RusticIconButton tooltip={t('charactersKick')} variant="incomplete" className="text-red-500/80 hover:text-red-500">
                                    <Trash2 />
                                </RusticIconButton>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>{t('charactersKickConfirmTitle', { characterName: char.name })}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t('charactersKickConfirmDesc')}
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>{t('charactersCancel')}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(char.id)}>{t('charactersKick')}</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">{t('charactersNoCharacters')}</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // PLAYER VIEW
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
                             {character.isActive ? t('charactersActive') : t('charactersInactive')}
                           </Badge>
                        </div>
                        <CardDescription>{t('charactersYourHero')}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <RusticIconButton tooltip={t('charactersViewEditSheet')} onClick={() => handleOpenSheet(character)}>
                            <Sheet />
                        </RusticIconButton>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <RusticIconButton tooltip={t('charactersDelete')} variant="incomplete" className="text-red-500/80 hover:text-red-500">
                                    <Trash2 />
                                </RusticIconButton>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>{t('charactersDeleteConfirmTitle')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t('charactersDeleteConfirmDesc')}
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>{t('charactersCancel')}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(character.id)}>{t('charactersDelete')}</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[70vh] w-full">
                    <CharacterSheet character={character} t={t} />
                </div>
            </CardContent>
        </Card>
      ) : (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">{creationStep === 0 ? t('charactersChooseArchetype') : t('charactersFinalize')}</CardTitle>
                <CardDescription>{creationStep === 0 ? t('charactersChooseArchetypeDesc') : t('charactersFinalizeDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
                {creationStep === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {archetypesList.map(arch => (
                            <Card key={arch.id} className="hover:border-primary transition-colors flex flex-col">
                                <CardHeader>
                                    <CardTitle>{arch.name}</CardTitle>
                                    <CardDescription>{arch.race}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm text-muted-foreground">{arch.description}</p>
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={() => handleSelectArchetype(arch)} className="w-full">
                                        Choose <ArrowRight />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
                 {creationStep === 1 && selectedArchetype && (
                    <div className="grid md:grid-cols-2 gap-8">
                        <form onSubmit={handleCreateCharacter} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="char-name">{t('charactersNameLabel')}</Label>
                                <Input id="char-name" value={newCharName} onChange={(e) => setNewCharName(e.target.value)} placeholder={t('charactersNamePlaceholder')} required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="char-background">{t('charactersBackgroundLabel')}</Label>
                                <Textarea id="char-background" value={newCharBackground} onChange={(e) => setNewCharBackground(e.target.value)} rows={8} placeholder={t('charactersBackgroundPlaceholder')} required/>
                            </div>
                            <div className="flex gap-4">
                                <Button type="button" variant="outline" onClick={() => setCreationStep(0)}>Back</Button>
                                <Button type="submit" disabled={isCreating}>
                                    {isCreating ? 'Creating...' : t('charactersCreateButton')}
                                </Button>
                            </div>
                        </form>
                        <div className="space-y-4">
                           <Card>
                                <CardHeader>
                                    <CardTitle>{selectedArchetype.name}</CardTitle>
                                    <CardDescription>{selectedArchetype.race}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ImageWithFallback baseSrc={`/characters/VisualPreset/${selectedArchetype.visualPreset}/portrait`} alt={selectedArchetype.name} width={200} height={300} className="w-48 h-72 object-cover rounded-lg border-2 border-primary/20 mx-auto" data-ai-hint="fantasy portrait" />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
      )}
      <GameModal open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <GameModalContent className="max-w-4xl">
            {editingCharacter && (
              <>
              <GameModalHeader>
                <GameModalTitle>{t('charactersEditSheetTitle')}</GameModalTitle>
                <DialogDescription>
                    {t('charactersEditSheetDesc')}
                </DialogDescription>
              </GameModalHeader>
              <TooltipProvider>
                <div className="grid md:grid-cols-3 gap-x-8 gap-y-6 py-4 overflow-y-auto max-h-[70vh] pr-4">
                    {/* Column 1: Core Info & Portrait */}
                    <div className="space-y-4 text-black">
                      <div className="flex items-center space-x-2">
                        <Switch id="isActive" checked={editingCharacter.isActive} onCheckedChange={(c) => handleStatChange('isActive', c)} />
                        <Label htmlFor="isActive">{t('charactersIsActiveLabel')}</Label>
                      </div>
                      <div className="grid items-center gap-1.5">
                          <Label htmlFor="name">{t('charactersName')}</Label>
                          <Input id="name" value={editingCharacter.name} onChange={(e) => handleStatChange('name', e.target.value)} />
                      </div>
                       <div className="grid items-center gap-1.5">
                          <Label htmlFor="class">{t('charactersClass')}</Label>
                          <Input id="class" value={editingCharacter.class || ''} onChange={(e) => handleStatChange('class', e.target.value)} />
                      </div>
                       <div className="grid items-center gap-1.5">
                          <Label htmlFor="level">{t('charactersLevelLabel')}</Label>
                          <Input id="level" type="number" value={editingCharacter.level || 1} onChange={(e) => handleStatChange('level', e.target.value)} />
                      </div>
                      <div className="grid items-center gap-1.5">
                          <Label htmlFor="visualPreset">Visual Preset</Label>
                          <Input id="visualPreset" value={editingCharacter.visualPreset || ''} onChange={(e) => handleStatChange('visualPreset', e.target.value)} />
                      </div>
                      <div className="grid items-center gap-1.5">
                          <Label htmlFor="description">{t('charactersDescription')}</Label>
                          <Textarea id="description" value={editingCharacter.description} onChange={(e) => handleStatChange('description', e.target.value)} rows={5} />
                      </div>
                      <div className="flex flex-col items-center justify-start gap-4 pt-4">
                        <Label>{t('charactersPortraitLabel')}</Label>
                        <div className="relative w-48 h-72 bg-background rounded overflow-hidden">
                             <ImageWithFallback baseSrc={`/characters/VisualPreset/${editingCharacter.visualPreset}/portrait`} alt={editingCharacter.name} width={200} height={300} className="w-full h-full object-cover" data-ai-hint={'fantasy portrait'} />
                        </div>
                    </div>
                    </div>
                    
                    {/* Column 2: Attributes & Behavior Profile */}
                    <div className="space-y-6 md:col-span-2 text-black">
                        <div className="space-y-4">
                            <h3 className="font-headline text-lg">{t('charactersAttributes')}</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <AttributeInput label="AGI" value={editingCharacter.attributes?.agility} onChange={(e) => handleAttributeChange('agility', e.target.value)} />
                                <AttributeInput label="SMA" value={editingCharacter.attributes?.smarts} onChange={(e) => handleAttributeChange('smarts', e.target.value)} />
                                <AttributeInput label="SPI" value={editingCharacter.attributes?.spirit} onChange={(e) => handleAttributeChange('spirit', e.target.value)} />
                                <AttributeInput label="STR" value={editingCharacter.attributes?.strength} onChange={(e) => handleAttributeChange('strength', e.target.value)} />
                                <AttributeInput label="VIG" value={editingCharacter.attributes?.vigor} onChange={(e) => handleAttributeChange('vigor', e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                             <WithTooltip tooltip={t('charactersConditionalRulesTooltip')}>
                                <h3 className="font-headline text-lg flex items-center gap-2">{t('charactersConditionalRules')} <HelpCircle className="w-4 h-4 text-muted-foreground" /></h3>
                             </WithTooltip>
                            <div className="space-y-2">
                                {[0, 1, 2].map(index => (
                                    <ConditionalRuleInput 
                                        key={index} 
                                        index={index} 
                                        rule={(editingCharacter.conditionalRules || [])[index]}
                                        onChange={handleConditionalRuleChange}
                                        t={t}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
              </TooltipProvider>
            </>
            )}
            <DialogFooter className="bg-stone-100/50 -mx-6 -mb-6 px-6 py-4 mt-6">
                 <DialogClose asChild>
                    <RusticIconButton tooltip={t('charactersCancel')} variant="incomplete">
                        <X />
                    </RusticIconButton>
                </DialogClose>
                <RusticIconButton tooltip={t('charactersSaveChanges')} onClick={handleSaveChanges}>
                    <Save />
                </RusticIconButton>
            </DialogFooter>
        </GameModalContent>
      </GameModal>
    </div>
  );
  
  function handleAttributeChange(attr: string, value: string) {
    if (editingCharacter) {
        setEditingCharacter({
            ...editingCharacter,
            attributes: {
                ...editingCharacter.attributes,
                [attr]: value,
            } as any
        });
    }
}
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


const AttributeInput = ({ label, value, onChange }: { label: string; value: string | undefined; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="space-y-2">
        <Label htmlFor={`attr-${label}`} className="text-center block">{label}</Label>
        <Input id={`attr-${label}`} value={value || 'd4'} onChange={onChange} className="text-center" />
    </div>
);

const ConditionalRuleInput = ({ index, rule, onChange, t }: { index: number, rule: ConditionalRule, onChange: (index: number, part: 'if' | 'then', value: string) => void, t: (key: string) => string }) => {
    return (
        <div className="flex gap-2 items-center">
            <Label className="font-bold">{t('charactersRuleIf')}</Label>
            <Input 
                value={rule?.if || ''}
                onChange={(e) => onChange(index, 'if', e.target.value)}
                placeholder={t('charactersRuleIfPlaceholder')}
            />
            <Label className="font-bold">{t('charactersRuleThen')}</Label>
            <Input
                value={rule?.then || ''}
                onChange={(e) => onChange(index, 'then', e.target.value)}
                placeholder={t('charactersRuleThenPlaceholder')}
            />
        </div>
    )
}

    