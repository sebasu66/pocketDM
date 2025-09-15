
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { Crown, User } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/context/i18n-context";
import { getUserById } from "@/lib/auth";

export default function HomePage() {
  const { login } = useAuth();
  const router = useRouter();
  const { t, locale } = useI18n();

  const handleQuickLogin = async (userId: string) => {
    const user = await getUserById(userId);
    await login(userId);
    if (user?.role === 'player') {
      router.push("/dashboard/playerview");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat p-4" style={{backgroundImage: "url('https://picsum.photos/1920/1080?grayscale&blur=5&random=1')"}} data-ai-hint="fantasy landscape">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="w-full max-w-4xl z-10 text-center text-white p-8">
        <div className="flex justify-center mb-6">
            <Logo className="w-24 h-24"/>
        </div>
        <h1 className="text-6xl font-headline drop-shadow-lg">Lore Weaver</h1>
        <p className="text-xl text-white/80 mt-4 max-w-2xl mx-auto">
            {t('homeSubtitle')}
        </p>
        <div className="mt-8">
             <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6">
                <Link href="/login">{t('goToLoginButton')}</Link>
            </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-16 text-left">
            <Card className="bg-card/50 backdrop-blur-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                        <Crown className="text-amber-400" />
                        {t('gmDemoTitle')}
                    </CardTitle>
                    <CardDescription>
                        {t('gmDemoDescription')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full" onClick={() => handleQuickLogin("1")}>{t('gmDemoButton')}</Button>
                </CardContent>
            </Card>
             {locale === 'es' ? (
                <Card className="bg-card/50 backdrop-blur-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline">
                           <User />
                            {t('playerDemoTitle')}
                        </CardTitle>
                        <CardDescription>
                           {t('playerDemoDescription')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                         <Button className="w-full" onClick={() => handleQuickLogin("4")}>{t('playerDemoButton')} (Carlos)</Button>
                         <Button className="w-full" onClick={() => handleQuickLogin("5")}>{t('playerDemoButton')} (Diana)</Button>
                    </CardContent>
                </Card>
             ) : (
                <Card className="bg-card/50 backdrop-blur-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline">
                           <User />
                            {t('playerDemoTitle')}
                        </CardTitle>
                        <CardDescription>
                           {t('playerDemoDescription')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button className="w-full" onClick={() => handleQuickLogin("2")}>{t('playerDemoButton')} (Alice)</Button>
                        <Button className="w-full" onClick={() => handleQuickLogin("3")} disabled>{t('playerDemoButton')} (Bob - Inactive)</Button>
                    </CardContent>
                </Card>
             )}
        </div>
      </div>
    </div>
  );
}
