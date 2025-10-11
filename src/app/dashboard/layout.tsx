
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  Map,
  Shield,
  Skull,
  ScrollText,
  Settings,
  MessagesSquare,
  BookOpen,
  Menu,
  Workflow,
  Brush,
  Layers,
  BrainCircuit,
  Newspaper,
  Library,
  Beaker,
  Activity,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader
} from "@/components/ui/sheet"
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { UserNav } from "@/components/user-nav";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RusticIconButton } from "@/components/ui/rustic-icon-button";
import { useI18n } from "@/context/i18n-context";
import { CampaignProvider, useCampaign } from "@/context/campaign-context";
import { getCampaign } from "@/lib/firebase/campaigns";
import type { Campaign } from "@/lib/firebase/types";
import { Skeleton } from "@/components/ui/skeleton";

export const GmSidebarContent = ({onClick}: {onClick?: () => void}) => {
  const pathname = usePathname() || "/dashboard";
  const { t } = useI18n();

  const worldNavItems = [
    { href: "/dashboard/characters", icon: Users, label: t('sidebarCharacters') },
    { href: "/dashboard/places", icon: Map, label: t('sidebarPlaces') },
    { href: "/dashboard/items", icon: Shield, label: t('sidebarItems') },
    { href: "/dashboard/monsters", icon: Skull, label: t('sidebarMonsters') },
  ];

  const narrativeNavItems = [
    { href: "/dashboard/playerview", icon: ScrollText, label: t('sidebarNarrative') },
    { href: "/dashboard/chat", icon: MessagesSquare, label: t('sidebarPlayerChat') },
  ];

  const designNavItems = [
    
  ];
  
  return (
    <>
      <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/dashboard'} tooltip={{ children: t('sidebarDashboard') }} onClick={onClick}>
                <Link href="/dashboard">
                    <Home />
                    <span>{t('sidebarDashboard')}</span>
                </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

      <SidebarGroup>
        <SidebarGroupLabel>{t('sidebarWorld')}</SidebarGroupLabel>
        <SidebarMenu>
            {worldNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={{ children: item.label }} onClick={onClick}>
                    <Link href={item.href}>
                        <item.icon />
                        <span>{t('sidebarCharacters')}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>{t('sidebarNarrative')}</SidebarGroupLabel>
          <SidebarMenu>
            {narrativeNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={{ children: item.label }} onClick={onClick}>
                    <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/ai-log')} tooltip={{ children: t('sidebarAiLog') }} onClick={onClick}>
                  <Link href="/dashboard/ai-log">
                    <BrainCircuit />
                    <span>{t('sidebarAiLog')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
       <SidebarGroup>
        <SidebarGroupLabel>{t('sidebarDesignSandbox')}</SidebarGroupLabel>
          <SidebarMenu>
            {designNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={{ children: item.label }} onClick={onClick}>
                    <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  )
};

export const PlayerSidebarContent = ({onClick}: {onClick?: () => void}) => {
  const pathname = usePathname() || "/dashboard/playerview";
  const { t } = useI18n();

  const navItems = [
    { href: "/dashboard/playerview", icon: ScrollText, label: t('pageTitleNarrative') },
    { href: "/dashboard/characters", icon: Users, label: t('pageTitleCharacters') },
    { href: "/dashboard/lore", icon: Library, label: t('pageTitleLore') },
  ];
  
  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={{ children: item.label }} onClick={onClick}>
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
};


const AppLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname() || "/dashboard";
  const { user, activeRole } = useAuth();
  const { campaign, setCampaign } = useCampaign();
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const isMaster = activeRole === 'gm';
  const { t } = useI18n();

  const pageTitles: { [key: string]: string } = {
    "/dashboard": t('pageTitleDashboard'),
    "/dashboard/characters": t('pageTitleCharacters'),
    "/dashboard/places": t('pageTitlePlaces'),
    "/dashboard/items": t('pageTitleItems'),
    "/dashboard/monsters": t('pageTitleMonsters'),
    "/dashboard/narrative": t('pageTitleNarrative'),
    "/dashboard/chat": t('pageTitleChat'),
    "/dashboard/system-status": "System Status",
    "/dashboard/settings": t('pageTitleSettings'),
    "/dashboard/settings/apikeys": t('pageTitleAiSettings'),
    "/dashboard/integrations": t('pageTitleIntegrations'),
    "/dashboard/playerview": t('pageTitleNarrative'),
    "/dashboard/ai-log": t('pageTitleAiLog'),
    "/dashboard/lore": t('pageTitleLore'),
    "/dashboard/dev-test": "Dev Test Page",
  };
  
  if (!campaign) {
    return (
       <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" className="w-8 h-8 animate-spin"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 1 }} /><stop offset="100%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} /></linearGradient></defs><path d="M20 80 C20 40, 40 20, 50 20 S80 40, 80 80 L60 80 C60 50, 50 40, 50 40 C50 40, 40 50, 40 80 Z" stroke="url(#grad1)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d="M30 70 L70 70 M40 60 L60 60 M45 50 L55 50" stroke="hsl(var(--border))" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
            <p className="text-muted-foreground">{t('loadingCampaign')}</p>
          </div>
       </div>
    );
  }

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  }

  const sidebarContent = (
    <>
       <SidebarHeader className="p-0">
          <div className="relative h-32 w-full">
             <Image src={campaign.bannerUrl} alt="Campaign Banner" fill sizes="100vw" className="object-cover" data-ai-hint={campaign.bannerAiHint} />
             <div className="absolute inset-0 bg-gradient-to-t from-sidebar/100 to-sidebar/20" />
             <div className="absolute bottom-4 left-4">
                <h2 className="text-2xl font-headline text-white">{campaign.title}</h2>
             </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
           {isMaster ? <GmSidebarContent onClick={handleLinkClick} /> : <PlayerSidebarContent onClick={handleLinkClick} />}
        </SidebarContent>
        <SidebarFooter>
          <Separator className="my-2 bg-border/20" />
          <SidebarMenu>
             {isMaster && (
               <>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/integrations')} tooltip={{ children: t('sidebarIntegrations') }} onClick={handleLinkClick}>
                    <Link href="/dashboard/integrations">
                        <Workflow />
                        <span>{t('sidebarIntegrations')}</span>
                    </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
               </>
              )}
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/system-status')} tooltip={{ children: 'System Status' }} onClick={handleLinkClick}>
                  <Link href="/dashboard/system-status">
                    <Activity />
                    <span>System Status</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/settings')} tooltip={{ children: t('sidebarSettings') }} onClick={handleLinkClick}>
                  <Link href="/dashboard/settings">
                    <Settings />
                    <span>{t('sidebarSettings')}</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
    </>
  );

  return (
    <SidebarProvider>
      <TooltipProvider>
        <div className="min-h-screen w-full">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <main className="bg-cover bg-fixed bg-center">
              {children}
            </main>
            
            <SheetContent side="right" className="p-0 w-80 bg-sidebar-gradient border-l-0 text-sidebar-foreground">
                <SheetHeader>
                    <SheetTitle></SheetTitle>
                </SheetHeader>
                {sidebarContent}
            </SheetContent>
          </Sheet>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isCampaignLoading, setIsCampaignLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadCampaign = async () => {
      if (user && user.campaignId) {
        if (!campaign || campaign.id !== user.campaignId) {
          console.log(`[DashboardLayout] User detected. Loading campaign ID: ${user.campaignId}`);
          setIsCampaignLoading(true);
          const campaignData = await getCampaign(user.campaignId);
          if (campaignData) {
            console.log(`[DashboardLayout] Campaign data loaded:`, campaignData.title);
            setCampaign(campaignData);
          } else {
            console.error(`[DashboardLayout] FAILED to load campaign: ${user.campaignId}`);
            // Handle failure, maybe redirect or show an error
          }
          setIsCampaignLoading(false);
        }
      } else if (user && !user.campaignId) {
        // User is valid but has no campaign, might be an error or mid-creation
        console.warn("[DashboardLayout] User has no campaignId.");
        setIsCampaignLoading(false);
      }
    };
    
    if (!isAuthLoading) {
      loadCampaign();
    }
  }, [user, isAuthLoading, campaign]);

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" className="w-8 h-8 animate-spin"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 1 }} /><stop offset="100%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} /></linearGradient></defs><path d="M20 80 C20 40, 40 20, 50 20 S80 40, 80 80 L60 80 C60 50, 50 40, 50 40 C50 40, 40 50, 40 80 Z" stroke="url(#grad1)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d="M30 70 L70 70 M40 60 L60 60 M45 50 L55 50" stroke="hsl(var(--border))" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
            <p className="text-muted-foreground">Authenticating...</p>
          </div>
       </div>
    );
  }

  if (!user) {
    // AuthProvider should handle redirection, but this is a fallback.
    return null;
  }
  
  if (isCampaignLoading && user.campaignId) {
     return (
      <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" className="w-8 h-8 animate-spin"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 1 }} /><stop offset="100%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} /></linearGradient></defs><path d="M20 80 C20 40, 40 20, 50 20 S80 40, 80 80 L60 80 C60 50, 50 40, 50 40 C50 40, 40 50, 40 80 Z" stroke="url(#grad1)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d="M30 70 L70 70 M40 60 L60 60 M45 50 L55 50" stroke="hsl(var(--border))" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
            <p className="text-muted-foreground">Loading campaign...</p>
          </div>
       </div>
    );
  }
  
  if (!campaign && user.campaignId) {
     return (
       <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-xl font-bold">Campaign Not Found</h2>
        <p className="text-muted-foreground">Could not load data for campaign ID: {user.campaignId}</p>
        <p className="mt-4">This can happen if the campaign was recently created. Please try refreshing the page.</p>
        <Button onClick={() => window.location.reload()} className="mt-4">Refresh</Button>
      </div>
    );
  }

  return (
    <CampaignProvider campaign={campaign} setCampaign={setCampaign}>
      <AppLayoutContent>{children}</AppLayoutContent>
    </CampaignProvider>
  );
}
