
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { useAuth } from "@/context/auth-context";
import { getUserByEmail, checkPassword, signInWithGoogle } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/context/i18n-context";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { t, setLocale, locale } = useI18n();

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

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      // The onAuthStateChanged listener in AuthProvider will handle the rest.
      router.push('/dashboard');
    } catch (error: any) {
      console.error(`Google sign in error`, error);
      toast({
        variant: "destructive",
        title: `Login with Google Failed`,
        description: error.message || "An unknown error occurred.",
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
            <CardDescription>
              {t('loginSubtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">{t('emailLabel')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="bg-background/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t('passwordLabel')}</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    {t('forgotPasswordLink')}
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="bg-background/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
                <Button onClick={handleLogin} type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  {t('loginButton')}
                </Button>
              <div className="relative my-2">
                <Separator />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">OR CONTINUE WITH</span>
              </div>
              <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                {t('loginWithGoogleButton')}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {t('noAccountPrompt')}{" "}
              <Link href="/" className="underline">
                {t('goHomeLink')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
