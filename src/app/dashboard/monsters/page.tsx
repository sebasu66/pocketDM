
"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit, Search, Upload, ArrowLeft, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image, { StaticImageData } from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { StackedCard } from "@/components/ui/stacked-card";
import { cn } from "@/lib/utils";
import { RusticIconButton } from "@/components/ui/rustic-icon-button";
import { useI18n } from "@/context/i18n-context";

export const initialMonsters = [
    {
        id: "1",
        name: "Dire Wolf",
        observations: `Larger and more ferocious than its common kin, the Dire Wolf is a cunning predator of the northern wilds.

Its eyes glow with a faint, malevolent light, and its howl can freeze the blood of the bravest warrior.

They hunt in packs, coordinating their attacks with terrifying intelligence, often outmaneuvering their prey with coordinated flanking maneuvers.`,
        thematicStats: {
          toughness: "Medium",
          hitDifficulty: "Medium",
          speed: "Fast"
        },
        image: "/monsters/dire-wolf.png",
        aiHint: "dire wolf sketch fantasy"
    },
    {
        id: "2",
        name: "Human Spawn",
        observations: "A horrifying result of dark rituals, the Human Spawn is a twisted mockery of the human form. Its limbs are elongated and its movements are unnaturally fast and jerky. It emits a low gurgling sound and is driven by an insatiable hunger for the flesh of the living. They are often found in places tainted by necromantic energy.",
        thematicStats: {
          toughness: "Low",
          hitDifficulty: "Easy",
          speed: "Slow"
        },
        image: "/monsters/human-spawn.png",
        aiHint: "zombie monster sketch"
    }
];

type Monster = {
    id: string;
    name: string;
    observations: string;
    thematicStats: {
      toughness: string;
      hitDifficulty: string;
      speed: string;
    };
    image: string;
    aiHint: string;
};


const emptyMonster: Partial<Monster> = { name: '', observations: '' };

export default function MonstersPage() {
  const { user } = useAuth();
  const [monsters, setMonsters] = useState<Monster[]>(initialMonsters);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMonster, setEditingMonster] = useState<Partial<Monster> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useI18n();

  const filteredMonsters = monsters
    .filter((monster) => monster.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 8);

  const activeMonster = filteredMonsters.length > 0 ? filteredMonsters[activeIndex] : null;

  const handleNewMonster = () => {
    setEditingMonster(emptyMonster);
    setIsDialogOpen(true);
  }

  const handleEditMonster = (monster: Monster | null) => {
    if (!monster) return;
    setEditingMonster(monster);
    setIsDialogOpen(true);
  }
  
  const handleDeleteMonster = (monsterId: string | undefined) => {
      if (!monsterId) return;
      // Note: Add confirmation dialog in a real app
      setMonsters(monsters.filter(m => m.id !== monsterId));
      setActiveIndex(0);
  }


  const handleSaveMonster = () => {
    if (!editingMonster) return;

    if ('id' in editingMonster && editingMonster.id) {
      // Update existing monster
      setMonsters(monsters.map(m => m.id === editingMonster.id ? {...m, ...editingMonster} as Monster : m));
    } else {
      // Create new monster
      const newMonster: any = {
        id: (monsters.length + 1).toString(),
        name: editingMonster.name || "New Monster",
        observations: editingMonster.observations || "",
        thematicStats: {
          toughness: "N/A",
          hitDifficulty: "N/A",
          speed: "N/A"
        },
        image: `https://picsum.photos/400/600?random=${Math.random()}`,
        aiHint: "fantasy monster sketch"
      };
      setMonsters([...monsters, newMonster]);
    }
    setIsDialogOpen(false);
    setEditingMonster(null);
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingMonster(null);
  }
  
  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? filteredMonsters.length - 1 : prev - 1));
  }
  
  const handleNext = () => {
    setActiveIndex((prev) => (prev === filteredMonsters.length - 1 ? 0 : prev + 1));
  }

  const isMaster = user?.role === 'master';

  return (
    <div className="min-h-[calc(100vh-theme(spacing.24))]">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('monstersSearchPlaceholder')}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {isMaster && (
          <div className="flex items-center gap-2">
            <RusticIconButton
              tooltip={t('monstersNew')}
              onClick={handleNewMonster}
              className="text-white/90 hover:text-white"
            >
              <Plus size={24} />
            </RusticIconButton>
             <RusticIconButton
              tooltip={t('monstersEdit')}
              onClick={() => handleEditMonster(activeMonster)}
              disabled={!activeMonster}
              className="text-white/90 hover:text-white"
            >
              <Edit size={24} />
            </RusticIconButton>
             <RusticIconButton
              tooltip={t('monstersDelete')}
              onClick={() => handleDeleteMonster(activeMonster?.id)}
              disabled={!activeMonster}
              className="text-red-500/80 hover:text-red-500"
            >
              <Trash2 size={24} />
            </RusticIconButton>
          </div>
        )}
      </div>

      <Separator />

      {filteredMonsters.length > 0 && activeMonster ? (
        <div className="grid h-[75vh] items-center md:grid-cols-10">
          <div
            className={cn(
              'px-4 text-white/90 transition-opacity duration-500 md:px-8 h-full md:col-span-3 flex flex-col justify-center'
            )}
          >
            <div>
              <h3 className="font-handwriting text-3xl underline decoration-white/30 underline-offset-8">
                {t('monstersObservations')}
              </h3>
              <div className="font-handwriting mt-2 space-y-4 text-lg md:text-xl font-light leading-relaxed">
                {activeMonster?.observations.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <h3 className="font-handwriting text-3xl underline decoration-white/30 underline-offset-8">
                {t('monstersAbilities')}
              </h3>
              <div className="font-handwriting mt-2 space-y-3 text-lg md:text-xl font-light leading-relaxed">
                <p>{t('monstersToughness')}: {activeMonster?.thematicStats.toughness}</p>
                <p>{t('monstersHitDifficulty')}: {activeMonster?.thematicStats.hitDifficulty}</p>
                <p>{t('monstersSpeed')}: {activeMonster?.thematicStats.speed}</p>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center h-full md:col-span-7">
             <RusticIconButton 
                onClick={handlePrev} 
                className="z-10 text-white/80 opacity-70 hover:opacity-100"
                tooltip={t('monstersPrevious')}
            >
                <ArrowLeft size={32} />
             </RusticIconButton>
             <StackedCard
                items={filteredMonsters}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                renderItem={(monster, isActive) => (
                    <div className="relative h-full w-full overflow-hidden rounded-lg text-card-foreground bg-stone-900">
                    <Image
                        src={monster.image}
                        alt={monster.name}
                        fill
                        className="h-full w-full object-contain"
                        data-ai-hint={monster.aiHint}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={isActive}
                    />
                    <h2 className="font-handwriting text-5xl text-stone-200/90 drop-shadow-lg absolute bottom-6 left-1/2 w-full -translate-x-1/2 text-center mix-blend-plus-lighter">
                        {monster.name}
                    </h2>
                    </div>
                )}
                />
            <RusticIconButton 
                onClick={handleNext} 
                className="z-10 text-white/80 opacity-70 hover:opacity-100"
                tooltip={t('monstersNext')}
            >
                <ArrowRight size={32} />
             </RusticIconButton>
          </div>

        </div>
      ) : (
        <div className="py-12 text-center col-span-full">
          <p className="text-muted-foreground">{t('monstersNoMatch')}</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[825px]">
          <DialogHeader>
            <DialogTitle className="font-headline">
              {editingMonster && 'id' in editingMonster && editingMonster.id ? t('monstersEditTitle') : t('monstersCreateTitle')}
            </DialogTitle>
            <DialogDescription>
              {editingMonster && 'id' in editingMonster && editingMonster.id
                ? t('monstersEditDesc')
                : t('monstersCreateDesc')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="monster-name">{t('charactersName')}</Label>
                <Input
                  id="monster-name"
                  placeholder={t('monstersNamePlaceholder')}
                  value={editingMonster?.name || ''}
                  onChange={(e) => setEditingMonster({ ...editingMonster, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monster-observations">{t('monstersObservations')}</Label>
                <Textarea
                  id="monster-observations"
                  placeholder={t('monstersObservationsPlaceholder')}
                  rows={8}
                  value={editingMonster?.observations || ''}
                  onChange={(e) => setEditingMonster({ ...editingMonster, observations: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg bg-muted/50 p-4 text-center">
              <Label className="mb-2">{t('monstersPortrait')}</Label>
              <div className="relative mb-4 flex h-64 w-48 items-center justify-center overflow-hidden rounded bg-background">
                {editingMonster?.image ? (
                  <Image
                    src={editingMonster.image}
                    alt={editingMonster.name || 'Monster'}
                    sizes="200px"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <p className="p-2 text-xs text-muted-foreground">{t('monstersNoImage')}</p>
                )}
              </div>
              <Button variant="outline">
                <Upload />
                {t('charactersUploadImage')}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={handleDialogClose}>
                {t('charactersCancel')}
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveMonster}>
              {t('monstersSave')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    