"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useCampaign } from "@/context/campaign-context";
import { useI18n } from "@/context/i18n-context";
import { getCharactersByCampaign } from "@/lib/firebase/characters";
import { AnimatedPanel } from "./components/AnimatedPanel";
import { MessagesSquare, Settings, Copy, Check, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { RusticIconButton } from "@/components/ui/rustic-icon-button";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { campaign } = useCampaign();
  const { t } = useI18n();
  const [hasCharacter, setHasCharacter] = useState(false);
  const [isCheckingCharacter, setIsCheckingCharacter] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Check if user has a character
  useEffect(() => {
    const checkCharacter = async () => {
      if (!campaign || !user) return;

      setIsCheckingCharacter(true);
      try {
        const characters = await getCharactersByCampaign(campaign.id, user.id);
        const hasChar = characters.length > 0;
        console.log("[Dashboard] Characters found:", characters.length, characters);
        console.log("[Dashboard] User ID:", user.id);
        console.log("[Dashboard] Campaign ID:", campaign.id);
        console.log("[Dashboard] Setting hasCharacter to:", hasChar);
        setHasCharacter(hasChar);
      } catch (error) {
        console.error("[Dashboard] Error checking character:", error);
      } finally {
        setIsCheckingCharacter(false);
      }
    };

    checkCharacter();
  }, [campaign?.id, user?.id]);

  // Check if current user is GM
  const isGM = user && campaign && user.id === campaign.ownerId;

  // Generate invitation link
  const invitationLink = typeof window !== 'undefined'
    ? `${window.location.origin}/join?code=${campaign?.secretCode}`
    : '';

  // Copy functions
  const copySecretCode = async () => {
    if (campaign?.secretCode) {
      await navigator.clipboard.writeText(campaign.secretCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const copyInvitationLink = async () => {
    await navigator.clipboard.writeText(invitationLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!campaign) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-headline">No Campaign Found</h2>
        <p>There was an issue loading your campaign data.</p>
      </div>
    );
  }

  if (isCheckingCharacter) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <Skeleton className="h-[200px] w-full rounded-lg" />
      </div>
    );
  }

  console.log("[Dashboard] RENDER - hasCharacter:", hasCharacter, "isCheckingCharacter:", isCheckingCharacter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Campaign Title Header */}
      <div className="text-center py-8 px-4">
        <h1 className="text-5xl md:text-6xl font-headline uppercase tracking-widest text-foreground/90 drop-shadow-lg">
          {campaign.title}
        </h1>
        <p className="mt-2 text-lg text-foreground/60 font-light">
          {campaign.description}
        </p>
      </div>

      {/* GM-Only Invitation Section */}
      {isGM && (
        <div className="max-w-4xl mx-auto px-4 mb-8">
          <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-headline text-amber-400">Game Master Panel</h2>
            </div>

            <div className="space-y-4">
              {/* Secret Code */}
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">
                  Campaign Secret Code
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={campaign.secretCode}
                    className="flex-1 bg-black/30 border border-foreground/20 rounded px-3 py-2 text-foreground/90 font-mono"
                  />
                  <button
                    onClick={copySecretCode}
                    className="p-2 bg-amber-700/30 hover:bg-amber-700/50 border border-amber-600/50 rounded transition-colors"
                    title="Copy secret code"
                  >
                    {copiedCode ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-amber-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Invitation Link */}
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">
                  Invitation Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={invitationLink}
                    className="flex-1 bg-black/30 border border-foreground/20 rounded px-3 py-2 text-foreground/90 text-sm"
                  />
                  <button
                    onClick={copyInvitationLink}
                    className="p-2 bg-amber-700/30 hover:bg-amber-700/50 border border-amber-600/50 rounded transition-colors"
                    title="Copy invitation link"
                  >
                    {copiedLink ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-amber-400" />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-foreground/50">
                  Share this link with players to invite them to your campaign
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Panels Grid */}
      <div className="max-w-4xl mx-auto px-4 pb-12 space-y-6">
        {/* Panel 1: My Character */}
        <AnimatedPanel
          title="My Character"
          subtitle={hasCharacter ? "View your character sheet" : "Create your hero"}
          contextLabel={hasCharacter ? "Active" : "Start Here"}
          images={[
            "/locations/character1.jpg",
            "/locations/character2.jpg",
            "/locations/character3.jpg"
          ]}
          onClick={() => router.push("/dashboard/characters")}
          panelStyle="character"
          className="animate-fade-in"
        />

        {/* Panel 2: Adventure (Narrative) */}
        {console.log("[Dashboard] Rendering Adventure panel. hasCharacter:", hasCharacter, "disabled:", !hasCharacter)}
        <AnimatedPanel
          title="Adventure"
          subtitle="Continue your epic journey"
          contextLabel={
            !hasCharacter
              ? "Requires Character"
              : campaign.status === 'generating_narrative'
              ? "Preparing Story..."
              : "New Chapter Awaits"
          }
          images={[
            "/locations/adventure1.jpg",
            "/locations/adventure2.jpg",
            "/locations/adventure3.jpg"
          ]}
          onClick={() => {
            console.log("[Dashboard] Adventure panel clicked. hasCharacter:", hasCharacter);
            router.push("/dashboard/playerview");
          }}
          disabled={!hasCharacter}
          panelStyle="adventure"
          className="animate-fade-in animation-delay-100"
        />

        {/* Panel 3: Manual (Wiki) */}
        <AnimatedPanel
          title="Manual"
          subtitle="Explore the world lore"
          contextLabel="Knowledge Base"
          images={[
            "/locations/manual1.jpg",
            "/locations/manual2.jpg",
            "/locations/manual3.jpg"
          ]}
          onClick={() => router.push("/dashboard/lore")}
          panelStyle="manual"
          className="animate-fade-in animation-delay-200"
        />
      </div>

      {/* Footer Info */}
      <div className="text-center text-sm text-foreground/40 pb-8">
        <p>Campaign ID: {campaign.id}</p>
      </div>

      {/* Floating Button Strip */}
      <div className="fixed bottom-6 right-6 z-30 flex h-14 items-center gap-2 rounded-full bg-black/20 p-2 backdrop-blur-sm">
        <RusticIconButton
          tooltip="Chat"
          onClick={() => router.push('/dashboard/chat')}
          className="text-white/90 hover:text-white"
        >
          <MessagesSquare />
        </RusticIconButton>

        <RusticIconButton
          tooltip="Settings"
          onClick={() => router.push('/dashboard/settings')}
          className="text-white/90 hover:text-white"
        >
          <Settings />
        </RusticIconButton>
      </div>
    </div>
  );
}
