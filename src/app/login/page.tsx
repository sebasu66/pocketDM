
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { useAuth } from "@/context/auth-context";
import { getUserByEmail, checkPassword, signInWithGoogle, createUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/context/i18n-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Crown, User as UserIcon } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isGm, setIsGm] = useState(false);
  const [isPlayer, setIsPlayer] = useState(true);
  const [secretCode, setSecretCode] = useState("");
  
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { t } = useI18n();

  useEffect(() => {
    const codeFromUrl = searchParams.get('secretCode');
    if (codeFromUrl) {
      setSecretCode(codeFromUrl);
      setIsPlayer(true);
    }
  }, [searchParams]);

  const handleLogin = async () => {
    const user = await getUserByEmail(email);
    if (user && checkPassword(user, password)) {
      await login(user.id);
      router.push("/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: t('loginFailedTitle'),
        description: t('loginFailedDescription'),
      });
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
        toast({ variant: "destructive", title: "Missing Fields", description: "Please fill out all required fields." });
        return;
    }
    if (!isGm && !isPlayer) {
        toast({ variant: "destructive", title: "No Role Selected", description: "You must select at least one role (GM or Player)." });
        return;
    }
    if (isPlayer && !secretCode && !isGm) {
        toast({ variant: "destructive", title: "Secret Code Required", description: "As a player, you must provide a secret code to join a campaign." });
        return;
    }

    try {
        const newUser = await createUser({
            name, email, password,
            role: { isGm, isPlayer },
            campaignSecret: isPlayer ? secretCode : undefined
        });
        await login(newUser.id);
        router.push("/dashboard");
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Registration Failed",
            description: error.message,
        });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat p-4" style={{backgroundImage: "url('https://picsum.photos/1920/1080?grayscale&blur=5&random=1')"}} data-ai-hint="fantasy landscape">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="w-full max-w-lg z-10">
        <Card className="bg-card/80 backdrop-blur-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Logo className="w-16 h-16"/>
            </div>
            <CardTitle className="text-3xl font-headline">Lore Weaver</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="space-y-4">
                <CardDescription className="text-center">{t('loginSubtitle')}</CardDescription>
                <div className="grid gap-2">
                  <Label htmlFor="login-email">{t('emailLabel')}</Label>
                  <Input id="login-email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="login-password">{t('passwordLabel')}</Label>
                  <Input id="login-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
                </div>
                <Button onClick={handleLogin} className="w-full">{t('loginButton')}</Button>
              </TabsContent>
              <TabsContent value="register" className="space-y-4">
                <CardDescription className="text-center">Create a new account to start your adventure.</CardDescription>
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your Name" required value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="register-email">{t('emailLabel')}</Label>
                    <Input id="register-email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="register-password">{t('passwordLabel')}</Label>
                    <Input id="register-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label>Choose Your Role(s)</Label>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="role-gm" checked={isGm} onCheckedChange={(c) => setIsGm(c as boolean)} />
                            <Label htmlFor="role-gm" className="flex items-center gap-2"><Crown className="text-amber-400" /> Game Master</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="role-player" checked={isPlayer} onCheckedChange={(c) => setIsPlayer(c as boolean)}/>
                            <Label htmlFor="role-player" className="flex items-center gap-2"><UserIcon /> Player</Label>
                        </div>
                    </div>
                </div>
                {isPlayer && (
                    <div className="grid gap-2">
                        <Label htmlFor="secret-code">Campaign Secret Code</Label>
                        <Input id="secret-code" placeholder="Enter code from GM" required={isPlayer && !isGm} value={secretCode} onChange={(e) => setSecretCode(e.target.value)} />
                    </div>
                )}
                <Button onClick={handleRegister} className="w-full">Sign Up</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
