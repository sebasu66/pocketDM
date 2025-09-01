
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, ScrollText, Skull, Map } from "lucide-react";

const mainEntities = [
  {
    title: "Veronica Korsch",
    description: "A determined half-elf paladin on a quest to avenge her fallen order.",
    image: "https://picsum.photos/400/400?random=1",
    aiHint: "female paladin portrait",
  },
  {
    title: "The Shadow Syndicate",
    description: "A clandestine group rumored to pull the strings of power from the city's underbelly.",
    image: "https://picsum.photos/600/400?random=2",
    aiHint: "fantasy assassins group",
  },
  {
    title: "The Sunken City of Azmar",
    description: "Uncover the mysteries of a once-great civilization now lost beneath the waves.",
    image: "https://picsum.photos/600/400?random=3",
    aiHint: "underwater ruins",
  },
];

const latestDevelopments = [
  {
    icon: ScrollText,
    title: "A new clue emerges in Silverwood",
    description: "The Game Master posted a new narrative thread: 'The party discovered a cryptic message on the body of a fallen Syndicate assassin, pointing towards the old clock tower...'",
    timestamp: "2 hours ago",
  },
  {
    icon: Map,
    title: "The city of Ironhaven has been updated",
    description: "A new district, the 'Smuggler's Wharf', has been added to the city details. Be wary of the characters you might meet there.",
    timestamp: "1 day ago",
  },
  {
    icon: Skull,
    title: "A new threat appears",
    description: "The 'Crawling Horror' has been added to the bestiary. This subterranean creature is known for its ambushes.",
    timestamp: "3 days ago",
  }
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="relative h-64 w-full">
           <Image src="https://picsum.photos/1200/400?random=10" alt="Campaign hero image" fill className="object-cover" data-ai-hint="epic fantasy landscape" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        <CardHeader className="relative -mt-20 z-10 p-6">
           <div className="flex justify-between items-start">
             <div>
              <CardTitle className="text-4xl text-white font-headline">The Whispering Shadows</CardTitle>
              <CardDescription className="text-white/80 max-w-3xl mt-2">
                A realm teetering on the brink of an ancient, creeping darkness. Once a safe haven for elves, dwarves, gnomes and
                other creatures, humans started settling in thousands of years ago through war and conquest. The elves live exiles in the north.
              </CardDescription>
            </div>
             <Button variant="outline" className="bg-background/50 border-white/50 text-white backdrop-blur-sm hover:bg-white hover:text-black">
                <Star />
                Follow
             </Button>
           </div>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        <h3 className="text-2xl font-headline">Latest Developments</h3>
        <div className="space-y-4">
          {latestDevelopments.map((event, index) => (
            <Card key={index} className="bg-card/50">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="bg-primary/20 text-primary-foreground p-3 rounded-md">
                   <event.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-muted-foreground text-sm">{event.description}</p>
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap">{event.timestamp}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-headline">Main Entities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainEntities.map((entity, index) => (
            <Card key={index} className="overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
                <CardHeader className="p-0">
                <Image
                    src={entity.image}
                    alt={entity.title}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                    data-ai-hint={entity.aiHint}
                />
                </CardHeader>
                <CardContent className="p-6">
                <CardTitle className="font-headline text-xl mb-2">{entity.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{entity.description}</CardDescription>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                <Button variant="outline" className="w-full">View Details</Button>
                </CardFooter>
            </Card>
            ))}
        </div>
       </div>
    </div>
  );
}
