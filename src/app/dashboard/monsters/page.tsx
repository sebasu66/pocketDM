
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
import DireWolfImage from "../../../../public/dire-wolf.png";
import HumanSpawnImage from "../../../../public/human-spawn.png";
import { cn } from "@/lib/utils";
import { RusticIconButton } from "@/components/ui/rustic-icon-button";

const initialMonsters = [
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
        image: DireWolfImage,
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
        image: HumanSpawnImage,
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
    image: StaticImageData | string;
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
    <div className="bg-stone-gradient -m-6 min-h-[calc(100vh-theme(spacing.12))] p-6">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search monsters..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {isMaster && (
          <div className="flex items-center gap-2">
            <RusticIconButton
              tooltip="New Monster"
              onClick={handleNewMonster}
              className="text-white/90 hover:text-white"
            >
              <Plus size={24} />
            </RusticIconButton>
             <RusticIconButton
              tooltip="Edit Monster"
              onClick={() => handleEditMonster(activeMonster)}
              disabled={!activeMonster}
              className="text-white/90 hover:text-white"
            >
              <Edit size={24} />
            </RusticIconButton>
             <RusticIconButton
              tooltip="Delete Monster"
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
                Observations
              </h3>
              <div className="font-handwriting mt-2 space-y-4 text-lg md:text-xl font-light leading-relaxed">
                {activeMonster?.observations.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <h3 className="font-handwriting text-3xl underline decoration-white/30 underline-offset-8">
                Abilities
              </h3>
              <div className="font-handwriting mt-2 space-y-3 text-lg md:text-xl font-light leading-relaxed">
                <p>Toughness: {activeMonster?.thematicStats.toughness}</p>
                <p>Hit Difficulty: {activeMonster?.thematicStats.hitDifficulty}</p>
                <p>Speed: {activeMonster?.thematicStats.speed}</p>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center h-full md:col-span-7">
             <RusticIconButton 
                onClick={handlePrev} 
                className="z-10 text-white/80 opacity-70 hover:opacity-100"
                tooltip="Previous"
            >
                <ArrowLeft size={32} />
             </RusticIconButton>
             <StackedCard
                items={filteredMonsters}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                renderItem={(monster, isActive) => (
                    <div className="relative h-full w-full overflow-hidden rounded-lg bg-card text-card-foreground">
                    <Image
                        src={monster.image}
                        alt={monster.name}
                        fill
                        className="h-full w-full object-cover"
                        data-ai-hint={monster.aiHint}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={isActive}
                    />
                    <h2 className="font-handwriting text-5xl text-stone-900 drop-shadow-lg absolute bottom-6 left-1/2 w-full -translate-x-1/2 text-center mix-blend-multiply">
                        {monster.name}
                    </h2>
                    </div>
                )}
                />
            <RusticIconButton 
                onClick={handleNext} 
                className="z-10 text-white/80 opacity-70 hover:opacity-100"
                tooltip="Next"
            >
                <ArrowRight size={32} />
             </RusticIconButton>
          </div>

        </div>
      ) : (
        <div className="py-12 text-center col-span-full">
          <p className="text-muted-foreground">No monsters found matching your search.</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[825px]">
          <DialogHeader>
            <DialogTitle className="font-headline">
              {editingMonster && 'id' in editingMonster && editingMonster.id ? 'Edit Monster' : 'Create New Monster'}
            </DialogTitle>
            <DialogDescription>
              {editingMonster && 'id' in editingMonster && editingMonster.id
                ? 'Edit the details for your creature.'
                : 'Fill out the details for your new creature.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="monster-name">Name</Label>
                <Input
                  id="monster-name"
                  placeholder="e.g., Shadow Ghoul"
                  value={editingMonster?.name || ''}
                  onChange={(e) => setEditingMonster({ ...editingMonster, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monster-observations">Observations</Label>
                <Textarea
                  id="monster-observations"
                  placeholder="A brief description of the monster's appearance, abilities, and lore."
                  rows={8}
                  value={editingMonster?.observations || ''}
                  onChange={(e) => setEditingMonster({ ...editingMonster, observations: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg bg-muted/50 p-4 text-center">
              <Label className="mb-2">Monster Portrait</Label>
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
                  <p className="p-2 text-xs text-muted-foreground">No image</p>
                )}
              </div>
              <Button variant="outline">
                <Upload />
                Upload Image
              </Button>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={handleDialogClose}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveMonster}>
              Save Monster
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
