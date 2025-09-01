
"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
} from "@/components/ui/dialog"

const initialMonsters = [
  {
    id: "1",
    name: "Goblin Sneak",
    description: "A small, wiry creature with green skin and beady eyes. Known for cunning and group attacks.",
    stats: "AC: 13, HP: 7, Speed: 30ft",
    image: "https://picsum.photos/200/300?random=20",
    aiHint: "fantasy goblin portrait"
  },
  {
    id: "2",
    name: "Owlbear",
    description: "A monstrous beast with the body of a bear and the head of an owl. A formidable predator.",
    stats: "AC: 13, HP: 59, Speed: 40ft",
    image: "https://picsum.photos/200/300?random=21",
    aiHint: "fantasy owlbear"
  },
  {
    id: "3",
    name: "Gelatinous Cube",
    description: "A ten-foot cube of transparent ooze that silently patrols dungeon corridors.",
    stats: "AC: 6, HP: 84, Speed: 15ft",
    image: "https://picsum.photos/200/300?random=22",
    aiHint: "gelatinous cube fantasy"
  },
   {
    id: "4",
    name: "Beholder",
    description: "A floating orb of flesh with a large central eye and many smaller eye stalks.",
    stats: "AC: 18, HP: 180, Speed: 0ft, fly 20ft",
    image: "https://picsum.photos/200/300?random=23",
    aiHint: "fantasy beholder monster"
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

  const filteredMonsters = monsters.filter((monster) =>
    monster.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        image: editingMonster.image || `https://picsum.photos/200/300?random=${Math.random()}`,
        aiHint: "fantasy monster"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMonsters.map((monster) => (
          <Card key={monster.id} className="overflow-hidden flex flex-col">
            <CardHeader className="p-0">
               <Image src={monster.image} alt={monster.name} width={200} height={300} className="w-full h-48 object-cover object-top" data-ai-hint={monster.aiHint} />
            </CardHeader>
            <CardContent className="p-4 flex-grow">
               <CardTitle className="font-headline text-xl mb-2">{monster.name}</CardTitle>
              <p className="text-muted-foreground text-sm flex-grow">{monster.description}</p>
            </CardContent>
            {isMaster && (
                <CardFooter className="p-4 pt-0 flex gap-2">
                   <Button variant="outline" className="w-full" onClick={() => handleEditMonster(monster)}>
                      <Edit /> Edit
                    </Button>
                    <Button variant="destructive" size="icon">
                      <Trash2 />
                       <span className="sr-only">Delete</span>
                    </Button>
                </CardFooter>
            )}
          </Card>
        ))}
      </div>
       {filteredMonsters.length === 0 && (
          <div className="text-center col-span-full py-12">
            <p className="text-muted-foreground">No monsters found matching your search.</p>
          </div>
        )}

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[825px]">
          <DialogHeader>
            <DialogTitle>{editingMonster && 'id' in editingMonster && editingMonster.id ? 'Edit Monster' : 'Create New Monster'}</DialogTitle>
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
