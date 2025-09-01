"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Users,
  MapPin,
  Shield,
  Skull,
  ScrollText,
  Settings,
  MessagesSquare,
} from "lucide-react";

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
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import { UserNav } from "@/components/user-nav";
import { Logo } from "@/components/logo";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const navItems = [
  { href: "/dashboard", icon: BookOpen, label: "Campaigns" },
  { href: "/dashboard/characters", icon: Users, label: "Characters" },
  { href: "/dashboard/places", icon: MapPin, label: "Places" },
  { href: "/dashboard/items", icon: Shield, label: "Items" },
  { href: "/dashboard/monsters", icon: Skull, label: "Monsters" },
  { href: "/dashboard/narrative", icon: ScrollText, label: "Narrative", badge: 3 },
  { href: "/dashboard/chat", icon: MessagesSquare, label: "Chat" },
];

const pageTitles: { [key: string]: string } = {
  "/dashboard": "Campaigns",
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
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
       <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-8 animate-spin" />
            <p className="text-muted-foreground">Loading your session...</p>
          </div>
       </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-border/20">
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <h1 className="text-xl font-headline font-semibold text-foreground">
              Lore Weaver
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                    {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Separator className="my-2 bg-border/20" />
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard/settings" legacyBehavior passHref>
                <SidebarMenuButton isActive={pathname === '/dashboard/settings'} tooltip={{ children: 'Settings' }}>
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b border-border/20 bg-background/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-2">
             <SidebarTrigger className="md:hidden" />
             <h2 className="text-2xl font-semibold font-headline">{pageTitles[pathname] || "Dashboard"}</h2>
          </div>
          <div className="flex items-center gap-4">
            <Input placeholder="Search entities..." className="hidden md:block w-64 bg-background" />
            <UserNav />
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
