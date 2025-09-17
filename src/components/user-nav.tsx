
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogOut, User, Settings, KeyRound, Crown, Home, Globe, Trash2 } from "lucide-react"
import { Skeleton } from "./ui/skeleton";
import { useI18n } from "@/context/i18n-context";
import { deleteUserAndAssociatedData } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export function UserNav() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { locale, setLocale, t } = useI18n();
  const isMaster = user?.role.isGm;

  const handleLogout = () => {
    logout();
    router.push("/");
  };
  
  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
        await deleteUserAndAssociatedData(user);
        toast({ title: "Cuenta eliminada", description: "Tu cuenta y todos tus datos han sido eliminados." });
        logout(); // This will clear session and redirect
    } catch (error) {
        console.error("Error deleting account:", error);
        toast({ variant: "destructive", title: "Error", description: "No se pudo eliminar la cuenta." });
    }
  };

  if (isLoading) {
    return <Skeleton className="h-9 w-9 rounded-full" />;
  }

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person portrait" />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
           {isMaster && (
            <DropdownMenuItem>
                <Crown className="mr-2 h-4 w-4 text-amber-400" />
                <span>Game Master</span>
            </DropdownMenuItem>
           )}
           {user.role.isPlayer && (
             <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Player</span>
            </DropdownMenuItem>
           )}
          <DropdownMenuItem asChild>
             <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              <span>Home</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
             <Link href="/dashboard/settings">
              <User className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
             <Link href="/dashboard/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Display Settings</span>
            </Link>
          </DropdownMenuItem>
         {isMaster && (
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings/apikeys">
                <KeyRound className="mr-2 h-4 w-4" />
                <span>AI Settings</span>
              </Link>
            </DropdownMenuItem>
         )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Globe className="mr-2 h-4 w-4" />
            <span>Language</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={locale} onValueChange={(value) => setLocale(value as 'en' | 'es')}>
                <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="es">Español</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Eliminar Cuenta</span>
                </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción es irreversible. {isMaster ? 
                        "Como Game Master, esto eliminará permanentemente tu cuenta y todas las campañas de las que eres propietario, incluyendo todos los personajes (incluso los de otros jugadores), hilos narrativos y comentarios asociados." : 
                        "Esto eliminará permanentemente tu cuenta. Tu personaje permanecerá en la campaña por consistencia histórica, pero tu acceso será revocado."}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Sí, eliminar mi cuenta
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
