
"use client";

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
import { Separator } from "@/components/ui/separator";

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
        toast({ variant: "destructive", title: t('registerMissingFields'), description: t('registerMissingFieldsDesc') });
        return;
    }
    if (!isGm && !isPlayer) {
        toast({ variant: "destructive", title: t('registerNoRole'), description: t('registerNoRoleDesc') });
        return;
    }
    if (isPlayer && !secretCode && !isGm) {
        toast({ variant: "destructive", title: t('registerSecretCodeRequired'), description: t('registerSecretCodeRequiredDesc') });
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
            title: t('registerFailed'),
            description: error.message,
        });
    }
  };

  const handleOAuthLogin = async () => {
    try {
      await signInWithGoogle();
      // The onAuthStateChanged listener in AuthProvider will handle finding/creating the user.
      // After the popup closes, the listener will fire and the context will redirect.
      // We can push to dashboard optimistically.
      router.push('/dashboard');
    } catch (error) {
      console.error("OAuth login error", error);
      toast({
        variant: "destructive",
        title: t('loginFailedTitle'),
        description: "Could not log in with Google. Please try again.",
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
                <TabsTrigger value="login">{t('loginButton')}</TabsTrigger>
                <TabsTrigger value="register">{t('registerTitle')}</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="space-y-4 pt-4">
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
              <TabsContent value="register" className="space-y-4 pt-4">
                <CardDescription className="text-center">{t('registerDescription')}</CardDescription>
                <div className="grid gap-2">
                    <Label htmlFor="name">{t('registerNameLabel')}</Label>
                    <Input id="name" placeholder={t('registerNamePlaceholder')} required value={name} onChange={(e) => setName(e.target.value)} />
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
                    <Label>{t('registerChooseRoleLabel')}</Label>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="role-gm" checked={isGm} onCheckedChange={(c) => setIsGm(c as boolean)} />
                            <Label htmlFor="role-gm" className="flex items-center gap-2"><Crown className="text-amber-400" /> {t('registerRoleGmLabel')}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="role-player" checked={isPlayer} onCheckedChange={(c) => setIsPlayer(c as boolean)}/>
                            <Label htmlFor="role-player" className="flex items-center gap-2"><UserIcon /> {t('registerRolePlayerLabel')}</Label>
                        </div>
                    </div>
                </div>
                {isPlayer && (
                    <div className="grid gap-2">
                        <Label htmlFor="secret-code">{t('registerSecretCodeLabel')}</Label>
                        <Input id="secret-code" placeholder={t('registerSecretCodePlaceholder')} required={isPlayer && !isGm} value={secretCode} onChange={(e) => setSecretCode(e.target.value)} />
                    </div>
                )}
                <Button onClick={handleRegister} className="w-full">{t('registerButton')}</Button>
              </TabsContent>
            </Tabs>
             <Separator className="my-4" />
            <div className="space-y-4 text-center">
                 <p className="text-xs text-muted-foreground">{t('registerOrSignInWith')}</p>
                <Button variant="outline" className="w-full" onClick={handleOAuthLogin}>
                  <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                    <path
                      fill="currentColor"
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.98-4.32 1.98-3.36 0-6.21-2.82-6.21-6.21s2.85-6.21 6.21-6.21c1.84 0 3.15.75 4.14 1.68l2.79-2.79C18.01 1.98 15.49 1 12.48 1 5.88 1 1 5.88 1 12.48s4.88 11.48 11.48 11.48c6.48 0 11.04-4.56 11.04-11.04 0-.75-.06-1.48-.18-2.16h-9.86z"
                    />
                  </svg>
                  {t('loginWithGoogleButton')}
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
