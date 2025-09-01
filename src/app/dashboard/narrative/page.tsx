import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NarrativePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Arrival at Silverwood</CardTitle>
          <CardDescription>Posted by Game Master - 2 days ago</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none text-foreground/90">
          <p>
            The party, weary from their travels, finally saw the shimmering rooftops of Silverwood. 
            As they approached the main gate, they were greeted by Captain <a href="/dashboard/characters/elara" className="text-accent hover:underline">Elara</a>, 
            a stern-looking guard with a noticeable scar above her left eye. She held the legendary{' '}
            <a href="/dashboard/items/moonshard-blade" className="text-accent hover:underline">Moonshard Blade</a>, its faint glow pulsing in the twilight.
          </p>
          <p>
            "State your business in Silverwood," she commanded, her voice firm but not unkind. The air was thick with the scent of pine and distant magic.
          </p>
        </CardContent>
      </Card>
      <div className="space-y-4">
        <h3 className="font-headline text-xl">Comments (2)</h3>
        <Card>
          <CardHeader>
            <CardDescription>Alice (Player of "Grom") - 1 day ago</CardDescription>
          </CardHeader>
          <CardContent>
            <p>"Grom steps forward, his hand resting on the pommel of his axe. 'We seek refuge and supplies, Captain. And perhaps a worthy tale or two.'"</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Bob (Player of "Lyra") - 1 day ago</CardDescription>
          </CardHeader>
          <CardContent>
            <p>"Lyra scans the guards, her eyes trying to gauge their intentions. She subtly readies a minor illusion spell, just in case."</p>
          </CardContent>
        </Card>
        <Button>Add Comment</Button>
      </div>
    </div>
  );
}
