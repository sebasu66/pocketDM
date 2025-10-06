
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
import React from "react";
import Image from "next/image";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RusticIconButton } from "@/components/ui/rustic-icon-button";
import { runSeed } from "@/lib/firebase/seed";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useI18n } from "@/context/i18n-context";
import { runCampaignSeedingTest } from "@/lib/firebase/narrative";

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


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/dashboard";
  const { user, campaign, isLoading } = useAuth();
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const isMaster = user?.role === 'master';
  const { t } = useI18n();

  const pageTitles: { [key: string]: string } = {
    "/dashboard": t('pageTitleDashboard'),
    "/dashboard/characters": t('pageTitleCharacters'),
    "/dashboard/places": t('pageTitlePlaces'),
    "/dashboard/items": t('pageTitleItems'),
    "/dashboard/monsters": t('pageTitleMonsters'),
    "/dashboard/narrative": t('pageTitleNarrative'),
    "/dashboard/chat": t('pageTitleChat'),
    "/dashboard/settings": t('pageTitleSettings'),
    "/dashboard/settings/apikeys": t('pageTitleAiSettings'),
    "/dashboard/integrations": t('pageTitleIntegrations'),
    "/dashboard/playerview": t('pageTitleNarrative'),
    "/dashboard/ai-log": t('pageTitleAiLog'),
    "/dashboard/lore": t('pageTitleLore'),
    "/dashboard/dev-test": "Dev Test Page",
  };
  
  if (isLoading || !user || !campaign) {
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
            <header className="flex items-center justify-between p-4 border-b border-border/20 bg-background/80 backdrop-blur-sm sticky top-0 z-20">
              <div className="flex items-center gap-2">
                 <div className="flex items-center gap-2">
                    <RusticIconButton
                        variant="incomplete"
                        tooltip="Toggle Menu"
                        onClick={() => setIsSheetOpen(true)}
                        className="h-12 w-12 text-foreground/80 hover:text-foreground/100"
                    >
                        <Menu size={20} />
                    </RusticIconButton>
                  <h2 className="text-2xl font-semibold font-headline">{pageTitles[pathname] || "Dashboard"}</h2>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                <Input placeholder={t('searchInputPlaceholder')} className="hidden md:block w-64 bg-background" />
                <UserNav />
              </div>
            </header>

            <main 
              className="p-4 md:p-6 bg-cover bg-fixed bg-center"
            >
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
