
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import Image from "next/image";

const characters = [
  {
    name: "Grom the Valiant",
    description: "A stoic warrior from the northern mountains, seeking to reclaim his family's honor.",
    portrait: "https://picsum.photos/200/300?random=10",
    aiHint: "fantasy warrior portrait"
  },
  {
    name: "Lyra Whisperwind",
    description: "An nimble elf rogue with a mysterious past and a knack for getting into trouble.",
    portrait: "https://picsum.photos/200/300?random=11",
    aiHint: "fantasy elf portrait"
  }
];

export default function CharactersPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Create New Character</CardTitle>
          <CardDescription>Define a new hero to join your adventures.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="char-name">Character Name</Label>
              <Input id="char-name" placeholder="e.g., Alistair Ironhand" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="char-concept">Character Concept</Label>
              <Textarea id="char-concept" placeholder="A brief summary of the character's core idea, e.g., 'Exiled sorcerer seeking forbidden knowledge.'" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="char-background">Background</Label>
              <Textarea id="char-background" rows={5} placeholder="The detailed backstory of your character." />
            </div>
            <Button>
              <PlusCircle />
              Create Character
            </Button>
          </div>
           <div className="flex flex-col items-center justify-center bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-muted-foreground mb-2">Character Portrait</p>
              <div className="w-48 h-72 bg-background rounded overflow-hidden mb-4 flex items-center justify-center">
                 <p className="text-xs text-muted-foreground p-2">Image will appear here</p>
              </div>
              <Button variant="outline">Upload Image</Button>
            </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h3 className="text-2xl font-headline">My Characters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((char, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="p-0 relative">
                 <Image src={char.portrait} alt={char.name} width={200} height={300} className="w-full h-64 object-cover object-top" data-ai-hint={char.aiHint} />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                 <CardTitle className="absolute bottom-4 left-4 text-white font-headline">{char.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-muted-foreground text-sm h-16">{char.description}</p>
              </CardContent>
              <CardContent className="p-4 pt-0 flex gap-2">
                 <Button className="w-full">
                    <Edit /> View/Edit Sheet
                  </Button>
                  <Button variant="outline" size="icon">
                    <Trash2 />
                  </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
