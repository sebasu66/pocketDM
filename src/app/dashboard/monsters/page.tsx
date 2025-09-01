
"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Edit, Search, Upload } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
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

const initialMonsters = [
  {
    id: "1",
    name: "Dire Wolf",
    description: "Larger and more ferocious than its common kin, the Dire Wolf is a cunning predator of the northern wilds. Its eyes glow with a faint, malevolent light, and its howl can freeze the blood of the bravest warrior. They hunt in packs, coordinating their attacks with terrifying intelligence.",
    stats: "AC: 14, HP: 37, Speed: 50ft",
    image: "https://picsum.photos/seed/direwolf/400/600",
    aiHint: "dire wolf sketch fantasy"
  },
  {
    id: "2",
    name: "Human Spawn",
    description: "A horrifying result of dark rituals, the Human Spawn is a twisted mockery of the human form. Its limbs are elongated and its movements are unnaturally fast. It emits a low gurgling sound and is driven by an insatiable hunger for the flesh of the living.",
    stats: "AC: 12, HP: 22, Speed: 30ft",
    image: "https://picsum.photos/seed/humanspawn/400/600",
    aiHint: "zombie monster sketch"
  },
];

type Monster = typeof initialMonsters[0];

const emptyMonster: Partial<Monster> = { name: '', description: '' };

export default function MonstersPage() {
  const { user } = useAuth();
  const [monsters, setMonsters] = useState(initialMonsters);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMonster, setEditingMonster] = useState<Partial<Monster> | null>(null);

  const filteredMonsters = monsters
    .filter((monster) => monster.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 8);

  const handleNewMonster = () => {
    setEditingMonster(emptyMonster);
    setIsDialogOpen(true);
  }

  const handleEditMonster = (monster: Monster) => {
    setEditingMonster(monster);
    setIsDialogOpen(true);
  }

  const handleSaveMonster = () => {
    if (!editingMonster) return;

    if ('id' in editingMonster && editingMonster.id) {
      // Update existing monster
      setMonsters(monsters.map(m => m.id === editingMonster.id ? {...m, ...editingMonster} as Monster : m));
    } else {
      // Create new monster
      const newMonster: Monster = {
        id: (monsters.length + 1).toString(),
        name: editingMonster.name || "New Monster",
        description: editingMonster.description || "",
        stats: "AC: ?, HP: ?, Speed: ?",
        image: editingMonster.image || `https://picsum.photos/400/600?random=${Math.random()}`,
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

  const isMaster = user?.role === 'master';

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
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
            <Button onClick={handleNewMonster}>
                <PlusCircle /> New Monster
            </Button>
        )}
      </div>

      <Separator />

      {filteredMonsters.length > 0 ? (
        <div className="h-[70vh]">
        <StackedCard
            items={filteredMonsters}
            renderItem={(monster, isActive) => (
                <div className="w-full h-full relative rounded-lg overflow-hidden border border-border/20 bg-card">
                    <Image 
                        src={monster.image} 
                        alt={monster.name} 
                        fill 
                        className="object-cover object-center" 
                        data-ai-hint={monster.aiHint} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
                     {isActive && (
                        <div className="relative p-6 h-full flex flex-col justify-end text-foreground/90">
                           <div className="absolute top-4 right-4 text-right">
                             <div className="text-sm text-muted-foreground font-mono bg-black/50 p-2 rounded">
                                {monster.stats}
                             </div>
                           </div>
                           
                           <div className="flex-1" />

                           <div className="font-handwriting text-lg leading-relaxed h-32 overflow-y-auto mix-blend-multiply text-black bg-white/40 p-4 rounded">
                               {monster.description}
                           </div>

                           <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                              <h2 className="text-2xl font-headline text-black drop-shadow-lg bg-white/70 px-4 py-1 rounded">{monster.name}</h2>
                           </div>
                           
                           {isMaster && (
                              <div className="absolute top-4 left-4 flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditMonster(monster)}>
                                   <Edit /> Edit
                                 </Button>
                                 <Button variant="destructive" size="sm">
                                   <Trash2 /> Delete
                                 </Button>
                              </div>
                           )}
                        </div>
                     )}
                </div>
            )}
            />
        </div>
      ) : (
         <div className="text-center col-span-full py-12">
            <p className="text-muted-foreground">No monsters found matching your search.</p>
          </div>
      )}


      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[825px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingMonster && 'id' in editingMonster && editingMonster.id ? 'Edit Monster' : 'Create New Monster'}</DialogTitle>
            <DialogDescription>
              {editingMonster && 'id' in editingMonster && editingMonster.id 
                ? "Edit the details for your creature." 
                : "Fill out the details for your new creature."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-6 py-4">
             <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="monster-name">Name</Label>
                  <Input 
                    id="monster-name" 
                    placeholder="e.g., Shadow Ghoul" 
                    value={editingMonster?.name || ''}
                    onChange={(e) => setEditingMonster({...editingMonster, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monster-description">Description</Label>
                  <Textarea
                    id="monster-description"
                    placeholder="A brief description of the monster's appearance, abilities, and lore."
                    rows={8}
                    value={editingMonster?.description || ''}
                    onChange={(e) => setEditingMonster({...editingMonster, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center justify-center bg-muted/50 rounded-lg p-4 text-center">
                  <Label className="mb-2">Monster Portrait</Label>
                  <div className="w-48 h-64 bg-background rounded overflow-hidden mb-4 flex items-center justify-center relative">
                    {editingMonster?.image ? (
                        <Image src={editingMonster.image} alt={editingMonster.name || "Monster"} layout="fill" className="object-cover" />
                    ): (
                        <p className="text-xs text-muted-foreground p-2">No image</p>
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
            <Button type="button" onClick={handleSaveMonster}>Save Monster</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
