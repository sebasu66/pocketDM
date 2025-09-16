
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, ScrollText, Skull, Map, Copy, RefreshCw, Link as LinkIcon, User as UserIcon, Crown } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/context/i18n-context";
import { useState, useEffect } from "react";
import { generateNewSecretCode } from "@/lib/firebase/campaigns";

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
  const { user, campaign, setCampaign, isLoading, setActiveRole, activeRole } = useAuth();
  const { toast } = useToast();
  const { t } = useI18n();
  const [inviteLink, setInviteLink] = useState("");

  useEffect(() => {
    if (campaign) {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      setInviteLink(`${origin}/login?secretCode=${campaign.secretCode}`);
    }
  }, [campaign]);

  if (isLoading || !user) {
    return null; // Or a loading state
  }
  
  // If user has dual roles but hasn't selected one yet, show role selection screen.
  if (user.role.isGm && user.role.isPlayer && !activeRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Choose Your Role</CardTitle>
            <CardDescription>You have both Game Master and Player privileges. How would you like to enter?</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => setActiveRole('gm')}>
              <Crown className="w-8 h-8 text-amber-400" />
              <span>Game Master</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => setActiveRole('player')}>
               <UserIcon className="w-8 h-8" />
              <span>Player</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  if (!campaign) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-headline">No Campaign Found</h2>
        <p>There was an issue loading your campaign data.</p>
      </div>
    );
  }
  
  const isMaster = activeRole === 'gm';

  const handleCopyToClipboard = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: t('dashboardCopied'),
      description: "The text has been copied to your clipboard.",
    });
  }

  const handleGenerateNewCode = async () => {
    if (campaign) {
      const newCode = await generateNewSecretCode(campaign.id);
      setCampaign({ ...campaign, secretCode: newCode });
      toast({
        title: "New Secret Code Generated",
        description: "The invitation link has been updated.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <div className="relative h-64 w-full">
           <Image src={campaign.bannerUrl} alt="Campaign hero image" fill sizes="100vw" className="object-cover" data-ai-hint={campaign.bannerAiHint} />
           <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        <CardHeader className="relative -mt-24 z-10 p-6">
           <div className="flex justify-between items-start">
             <div>
              <CardTitle className="text-4xl text-white font-headline">{campaign.title}</CardTitle>
              <CardDescription className="text-white/80 max-w-3xl mt-2">
                {campaign.description}
              </CardDescription>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-mono bg-black/50 text-white/70 px-2 py-1 rounded">{t('dashboardCampaignId')}: {campaign.id}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-white/70 hover:text-white hover:bg-white/20" onClick={() => handleCopyToClipboard(campaign.id)}>
                  <Copy size={14}/>
                </Button>
              </div>
            </div>
             {!isMaster && (
                <Button variant="outline" className="bg-background/50 border-white/50 text-white backdrop-blur-sm hover:bg-white hover:text-black">
                    <Star />
                    {t('dashboardFollow')}
                </Button>
             )}
           </div>
        </CardHeader>
      </Card>
      
      {isMaster && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><LinkIcon /> Invite Players</CardTitle>
            <CardDescription>Share this link with your players to have them join your campaign. The secret code will expire automatically in 2 hours for security.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 items-center p-2 rounded-md bg-muted">
              <Input value={inviteLink} readOnly className="bg-transparent border-0" />
              <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(inviteLink)}>
                <Copy />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleGenerateNewCode}>
                <RefreshCw />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-2xl font-headline">{t('dashboardLatestDevelopments')}</h3>
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
    </div>
  );
}
