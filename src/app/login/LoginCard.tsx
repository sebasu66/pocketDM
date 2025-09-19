
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { useAuth } from "@/context/auth-context";
import { getUserByEmail, signInWithGoogle, createUser } from "@/lib/firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/context/i18n-context";
import { Checkbox } from "@/components/ui/checkbox";
import { Crown, User as UserIcon, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

type Step = 'check-email' | 'login' | 'register';

export function LoginCard() {
  const [step, setStep] = useState<Step>('check-email');
  const [isChecking, setIsChecking] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isGm, setIsGm] = useState(false);
  const [isPlayer, setIsPlayer] = useState(true);
  const [secretCode, setSecretCode] = useState("");
  
  const { user, setupSession } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { t } = useI18n();

  useEffect(() => {
    const codeFromUrl = searchParams.get('secretCode');
    if (codeFromUrl) {
      setSecretCode(codeFromUrl);
      setIsPlayer(true); 
      setIsGm(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);
  
  const handleEmailCheck = async () => {
    if (!email) {
      toast({ variant: 'destructive', title: 'Email is required' });
      return;
    }
    setIsChecking(true);
    try {
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        setStep('login');
      } else {
        toast({ title: "No tengo recuerdos de ti", description: "¿Deseas unirte?" });
        setStep('register');
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not check email.' });
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogin = async () => {
    setIsChecking(true);
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await setupSession(userCredential.user);
        toast({ title: "Login Successful", description: "Redirecting to your dashboard..."});
    } catch (error) {
        console.error("Login error", error);
        toast({
            variant: "destructive",
            title: t('loginFailedTitle'),
            description: t('loginFailedDescription'),
        });
    } finally {
        setIsChecking(false);
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
    if (isPlayer && !isGm && !secretCode) {
        toast({ variant: "destructive", title: t('registerSecretCodeRequired'), description: t('registerSecretCodeRequiredDesc') });
        return;
    }

    setIsChecking(true);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Create user in Firestore with all details
        await createUser({
            uid: userCredential.user.uid,
            name,
            email,
            role: { isGm, isPlayer },
            campaignSecret: isPlayer ? secretCode : undefined,
        });
        // Setup session which will fetch the newly created user
        await setupSession(userCredential.user);
        toast({ title: "Registration Successful", description: "Redirecting to your dashboard..."});
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: t('registerFailed'),
            description: error.message,
        });
    } finally {
        setIsChecking(false);
    }
  };
  
  const handleOAuthLogin = async () => {
    setIsChecking(true);
    try {
      const firebaseUser = await signInWithGoogle();
      await setupSession(firebaseUser);
      toast({ title: "Login Successful", description: "Redirecting to your dashboard..."});
    } catch (error) {
      console.error("OAuth login error", error);
      toast({
        variant: "destructive",
        title: t('loginFailedTitle'),
        description: "Could not log in with Google. Please try again.",
      });
    } finally {
        setIsChecking(false);
    }
  };
  
  const isInvite = !!searchParams.get('secretCode');

  const renderStep = () => {
    switch (step) {
      case 'check-email':
        return (
          <div className="space-y-4 pt-4">
            <CardDescription className="text-center">¿Nos conocemos? Introduce tu email para empezar.</CardDescription>
            <div className="grid gap-2">
              <Label htmlFor="check-email">Email</Label>
              <Input id="check-email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleEmailCheck()} />
            </div>
            <Button onClick={handleEmailCheck} className="w-full" disabled={isChecking}>
              {isChecking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continuar
            </Button>
          </div>
        );
      case 'login':
        return (
           <div className="space-y-4 pt-4">
            <CardDescription className="text-center">¡Bienvenido de nuevo! Te recuerdo.</CardDescription>
             <div className="grid gap-2">
                <Label htmlFor="login-email">{t('emailLabel')}</Label>
                <Input id="login-email" type="email" value={email} disabled />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="login-password">{t('passwordLabel')}</Label>
                <Input id="login-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} autoFocus/>
            </div>
            <Button onClick={handleLogin} className="w-full" disabled={isChecking}>
                {isChecking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('loginButton')}
            </Button>
            
            <Separator className="my-4" />

            <Button variant="outline" className="w-full" onClick={handleOAuthLogin} disabled={isChecking}>
              {isChecking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                <path
                  fill="currentColor"
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.98-4.32 1.98-3.36 0-6.21-2.82-6.21-6.21s2.85-6.21 6.21-6.21c1.84 0 3.15.75 4.14 1.68l2.79-2.79C18.01 1.98 15.49 1 12.48 1 5.88 1 1 5.88 1 12.48s4.88 11.48 11.48 11.48c6.48 0 11.04-4.56 11.04-11.04 0-.75-.06-1.48-.18-2.16h-9.86z"
                />
              </svg>
              {t('loginWithGoogleButton')}
            </Button>
          </div>
        );
      case 'register':
        return (
          <div className="space-y-4 pt-4">
            <CardDescription className="text-center">{t('registerDescription')}</CardDescription>
            <div className="grid gap-2">
                <Label htmlFor="name">{t('registerNameLabel')}</Label>
                <Input id="name" placeholder={t('registerNamePlaceholder')} required value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="register-email">{t('emailLabel')}</Label>
                <Input id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="register-password">{t('passwordLabel')}</Label>
                <Input id="register-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="grid gap-2">
                <Label>{t('registerChooseRoleLabel')}</Label>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="role-gm" checked={isGm} onCheckedChange={(c) => setIsGm(c as boolean)} disabled={isInvite} />
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
                    <Input id="secret-code" placeholder={t('registerSecretCodePlaceholder')} required={isPlayer} value={secretCode} onChange={(e) => setSecretCode(e.target.value)} disabled={isInvite} />
                </div>
            )}
            <Button onClick={handleRegister} className="w-full" disabled={isChecking}>
                {isChecking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('registerButton')}
            </Button>
             <Separator className="my-4" />
            <p className="text-xs text-muted-foreground text-center">{t('registerOrSignInWith')}</p>
            <Button variant="outline" className="w-full" onClick={handleOAuthLogin} disabled={isChecking}>
              {isChecking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                <path
                  fill="currentColor"
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.98-4.32 1.98-3.36 0-6.21-2.82-6.21-6.21s2.85-6.21 6.21-6.21c1.84 0 3.15
.75 4.14 1.68l2.79-2.79C18.01 1.98 15.49 1 12.48 1 5.88 1 1 5.88 1 12.48s4.88 11.48 11.48 11.48c6.48 0 11.04-4.56 11.04-11.04 0-.75-.06-1.48-.18-2.16h-9.86z"
                />
              </svg>
              {t('loginWithGoogleButton')}
            </Button>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <Card className="bg-card/80 backdrop-blur-lg">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Logo className="w-16 h-16"/>
        </div>
        <CardTitle className="text-3xl font-body">Pocket DM</CardTitle>
      </CardHeader>
      <CardContent>
        {renderStep()}
          {step !== 'check-email' && (
            <div className="mt-4 text-center">
                <Button variant="link" onClick={() => { setStep('check-email'); setPassword(''); }}>
                    Volver
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
