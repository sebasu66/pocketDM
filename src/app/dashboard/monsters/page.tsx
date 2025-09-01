
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Search, BookOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const initialMonsters = [
  {
    id: "1",
    name: "Goblin Sneak",
    description: "A small, wiry creature with green skin and beady eyes. Goblins are known for their cunning and their tendency to attack in groups. This one seems particularly stealthy.",
    stats: "AC: 13, HP: 7, Speed: 30ft",
  },
  {
    id: "2",
    name: "Owlbear",
    description: "A monstrous beast with the body of a bear and the head of an owl. Its screech can paralyze with fear, and its claws can shred armor. A formidable predator of the deep woods.",
    stats: "AC: 13, HP: 59, Speed: 40ft",
  },
  {
    id: "3",
    name: "Gelatinous Cube",
    description: "A ten-foot cube of transparent ooze that silently patrols dungeon corridors, consuming everything in its path. It is nearly invisible until it's too late.",
    stats: "AC: 6, HP: 84, Speed: 15ft",
  },
];

export default function MonstersPage() {
  const [monsters, setMonsters] = useState(initialMonsters);
  const [selectedMonster, setSelectedMonster] = useState(monsters[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMonsters = monsters.filter((monster) =>
    monster.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleNewMonster = () => {
    const newMonster = {
      id: (monsters.length + 1).toString(),
      name: "New Monster",
      description: "A new creature waiting to be defined.",
      stats: "",
    };
    setMonsters([newMonster, ...monsters]);
    setSelectedMonster(newMonster);
  }
  
  const handleDeleteMonster = (id: string) => {
    const newMonsters = monsters.filter(m => m.id !== id);
    setMonsters(newMonsters);
    setSelectedMonster(newMonsters.length > 0 ? newMonsters[0] : null);
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      <Card className="md:col-span-1 flex flex-col">
        <CardHeader>
          <CardTitle>Bestiary</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search monsters..." 
              className="pl-8" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto">
          <div className="space-y-2">
            {filteredMonsters.map((monster) => (
              <Button
                key={monster.id}
                variant={selectedMonster?.id === monster.id ? "secondary" : "ghost"}
                className="w-full justify-start h-auto py-2"
                onClick={() => setSelectedMonster(monster)}
              >
                <div className="flex items-center">
                  <BookOpen className="mr-3" />
                  <div className="text-left">
                    <p>{monster.name}</p>
                    <p className="text-xs text-muted-foreground font-normal truncate max-w-48">{monster.description}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
        <CardContent className="border-t pt-4">
           <Button className="w-full" onClick={handleNewMonster}>
            <PlusCircle /> New Monster
          </Button>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        {selectedMonster ? (
          <>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline text-3xl">{selectedMonster.name}</CardTitle>
              <Button variant="destructive" size="icon" onClick={() => handleDeleteMonster(selectedMonster.id)}>
                <Trash2 />
                 <span className="sr-only">Delete Monster</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="monster-name">Name</Label>
                <Input id="monster-name" value={selectedMonster.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monster-description">Description</Label>
                <Textarea
                  id="monster-description"
                  value={selectedMonster.description}
                  rows={10}
                  className="text-base"
                />
              </div>
               <div className="space-y-2">
                <Label>Stats</Label>
                <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-md font-mono">{selectedMonster.stats || "No stats defined."}</p>
                 <p className="text-xs text-muted-foreground">Stats can only be edited by the Game Master.</p>
              </div>

               <Button>Save Changes</Button>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex flex-col items-center justify-center h-full text-center">
            <BookOpen className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold">No Monster Selected</h3>
            <p className="text-muted-foreground">Select a monster from the list or create a new one.</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
