import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

const campaigns = [
  {
    title: "The Whispering Shadows",
    description: "A realm teetering on the brink of an ancient, creeping darkness.",
    image: "https://picsum.photos/600/400?random=1",
    aiHint: "dark fantasy forest",
  },
  {
    title: "Spires of Aerthos",
    description: "Explore the floating cities and forgotten technologies of a sky-bound civilization.",
    image: "https://picsum.photos/600/400?random=2",
    aiHint: "sky city",
  },
  {
    title: "The Sunken Kingdom of Azmar",
    description: "Uncover the mysteries of a once-great civilization now lost beneath the waves.",
    image: "https://picsum.photos/600/400?random=3",
    aiHint: "underwater ruins",
  },
  {
    title: "Chronicles of the Crimson Dust",
    description: "Survive the harsh, magical deserts and carve a new destiny in a land of scarcity and wonder.",
    image: "https://picsum.photos/600/400?random=4",
    aiHint: "magic desert",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Welcome back, Game Master. Here are your active campaigns.
        </p>
        <Button>
          <PlusCircle className="mr-2" />
          New Campaign
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign, index) => (
          <Card key={index} className="overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
            <CardHeader className="p-0">
              <Image
                src={campaign.image}
                alt={campaign.title}
                width={600}
                height={400}
                className="w-full h-48 object-cover"
                data-ai-hint={campaign.aiHint}
              />
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle className="font-headline text-xl mb-2">{campaign.title}</CardTitle>
              <CardDescription className="text-muted-foreground">{campaign.description}</CardDescription>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button variant="outline" className="w-full">View Campaign</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
