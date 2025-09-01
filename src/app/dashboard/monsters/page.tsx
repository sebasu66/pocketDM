
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Edit, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

export default function MonstersPage() {
  const [monsters, setMonsters] = useState(initialMonsters);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMonsters = monsters.filter((monster) =>
    monster.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle /> New Monster
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Create New Monster</DialogTitle>
              <DialogDescription>
                Fill out the details for your new creature. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="monster-name">Name</Label>
                <Input id="monster-name" placeholder="e.g., Shadow Ghoul" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monster-description">Description</Label>
                <Textarea
                  id="monster-description"
                  placeholder="A brief description of the monster's appearance, abilities, and lore."
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save Monster</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
            <CardFooter className="p-4 pt-0 flex gap-2">
               <Button variant="outline" className="w-full">
                  <Edit /> Edit
                </Button>
                <Button variant="destructive" size="icon">
                  <Trash2 />
                   <span className="sr-only">Delete</span>
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
       {filteredMonsters.length === 0 && (
          <div className="text-center col-span-full py-12">
            <p className="text-muted-foreground">No monsters found matching your search.</p>
          </div>
        )}
    </div>
  );
}
