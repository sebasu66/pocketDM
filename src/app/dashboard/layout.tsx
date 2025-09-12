

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
} from "lucide-react";

import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import {
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

const worldNavItems = [
  { href: "/dashboard/characters", icon: Users, label: "Characters" },
  { href: "/dashboard/places", icon: Map, label: "Places" },
  { href: "/dashboard/items", icon: Shield, label: "Items" },
  { href: "/dashboard/monsters", icon: Skull, label: "Monsters" },
];

const narrativeNavItems = [
   { href: "/dashboard/narrative", icon: ScrollText, label: "Threads" },
   { href: "/dashboard/chat", icon: MessagesSquare, label: "Player Chat" },
];

const designNavItems = [
  { href: "/dashboard/design-test", icon: Brush, label: "Design Test" },
  { href: "/dashboard/design-test-3d", icon: Layers, label: "Design Test 3D" },
];

const pageTitles: { [key: string]: string } = {
  "/dashboard": "Campaign Dashboard",
  "/dashboard/characters": "Characters",
  "/dashboard/places": "Places",
  "/dashboard/items": "Items",
  "/dashboard/monsters": "Monsters",
  "/dashboard/narrative": "Narrative Threads",
  "/dashboard/chat": "Player Chat",
  "/dashboard/settings": "Settings",
  "/dashboard/settings/apikeys": "AI Settings",
  "/dashboard/integrations": "Integrations",
  "/dashboard/design-test": "Design Test",
  "/dashboard/design-test-3d": "3D Design Test",
  "/dashboard/ai-log": "AI Log",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/dashboard";
  const { user, campaign, isLoading } = useAuth();
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const isMaster = user?.role === 'master';

  // --- DEMO ONLY: SEED DATABASE ---
  // This is a temporary solution to seed the database for the demo.
  // In a real application, this would be handled by a proper backend process.
  React.useEffect(() => {
    runSeed();
  }, []);
  // --- END DEMO ONLY ---

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user || !campaign) {
    return (
       <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" className="w-8 h-8 animate-spin"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 1 }} /><stop offset="100%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} /></linearGradient></defs><path d="M20 80 C20 40, 40 20, 50 20 S80 40, 80 80 L60 80 C60 50, 50 40, 50 40 C50 40, 40 50, 40 80 Z" stroke="url(#grad1)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d="M30 70 L70 70 M40 60 L60 60 M45 50 L55 50" stroke="hsl(var(--border))" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
            <p className="text-muted-foreground">Loading your campaign...</p>
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
           <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/dashboard'} tooltip={{ children: 'Dashboard' }} onClick={handleLinkClick}>
                    <Link href="/dashboard">
                        <Home />
                        <span>Dashboard</span>
                    </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

          <SidebarGroup>
            <SidebarGroupLabel>World</SidebarGroupLabel>
            <SidebarMenu>
                {worldNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={{ children: item.label }} onClick={handleLinkClick}>
                        <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Narrative</SidebarGroupLabel>
             <SidebarMenu>
                {narrativeNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                     <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={{ children: item.label }} onClick={handleLinkClick}>
                        <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                ))}
                {isMaster && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/ai-log')} tooltip={{ children: 'AI Log' }} onClick={handleLinkClick}>
                      <Link href="/dashboard/ai-log">
                        <BrainCircuit />
                        <span>AI Log</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Design Sandbox</SidebarGroupLabel>
             <SidebarMenu>
                {designNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                     <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={{ children: item.label }} onClick={handleLinkClick}>
                        <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Separator className="my-2 bg-border/20" />
          <SidebarMenu>
             {isMaster && (
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/integrations')} tooltip={{ children: 'Integrations' }} onClick={handleLinkClick}>
                    <Link href="/dashboard/integrations">
                        <Workflow />
                        <span>Integrations</span>
                    </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/settings')} tooltip={{ children: 'Settings' }} onClick={handleLinkClick}>
                  <Link href="/dashboard/settings">
                    <Settings />
                    <span>Settings</span>
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
                  <BookOpen />
                  <h2 className="text-2xl font-semibold font-headline">{pageTitles[pathname] || "Dashboard"}</h2>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                <Input placeholder="Search entities..." className="hidden md:block w-64 bg-background" />
                <UserNav />
              </div>
            </header>

            <main 
              className="p-4 md:p-6 bg-cover bg-fixed bg-center"
              style={{backgroundImage: "url('/ui/backgrounds/wood2.jpg')"}}
              data-ai-hint="dark wood"
            >
              {children}
            </main>
            
            <RusticIconButton
                variant="incomplete"
                tooltip="Toggle Menu"
                onClick={() => setIsSheetOpen(true)}
                className="fixed bottom-6 right-6 h-16 w-16 text-white/90 hover:text-white z-30"
            >
                <Menu size={28} />
            </RusticIconButton>

            <SheetContent side="right" className="p-0 w-80 bg-sidebar-gradient border-l-0 text-sidebar-foreground">
               {sidebarContent}
            </SheetContent>
          </Sheet>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}

    