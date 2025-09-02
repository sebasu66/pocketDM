
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
  BookHeart,
  Mountain,
  Swords,
  BookOpen,
  Menu,
  Crown
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { UserNav } from "@/components/user-nav";
import { Logo } from "@/components/logo";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RusticIconButton } from "@/components/ui/rustic-icon-button";

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

const pageTitles: { [key: string]: string } = {
  "/dashboard": "Campaign Dashboard",
  "/dashboard/characters": "Characters",
  "/dashboard/places": "Places",
  "/dashboard/items": "Items",
  "/dashboard/monsters": "Monsters",
  "/dashboard/narrative": "Narrative Threads",
  "/dashboard/chat": "Player Chat",
  "/dashboard/settings": "Settings",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/dashboard";
  const { user, campaign, isLoading } = useAuth();
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user || !campaign) {
    return (
       <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-8 animate-spin" />
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
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Separator className="my-2 bg-border/20" />
          <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/dashboard/settings'} tooltip={{ children: 'Settings' }} onClick={handleLinkClick}>
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
              style={{backgroundImage: "url('/wood2.jpg')"}}
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
