
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/context/theme-context";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from '@/lib/firebase/types';
import Link from 'next/link';
import { ChevronRight, Bell, BellOff, Loader2 } from 'lucide-react';
import { useI18n } from '@/context/i18n-context';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { handwritingFont, setHandwritingFont } = useTheme();
  const { user: authUser, isLoading, updateUser: updateAuthUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const { t } = useI18n();

  const {
      isSubscribed,
      subscribeToNotifications,
      unsubscribeFromNotifications,
      isLoading: isPushLoading,
    } = usePushNotifications();

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);

  const handleUpdateProfile = async () => {
    if (user) {
      await updateAuthUser(user);
      toast({ title: "Profile Updated" });
    }
  };

  if (isLoading || !user) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                    <Skeleton className="h-24 w-24 rounded-full" />
                </div>
                <div className="grid gap-4 flex-1">
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                </div>
             </div>
             <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
             </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
    <div className="max-w-3xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{t('settingsProfileTitle')}</CardTitle>
          <CardDescription>{t('settingsProfileDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt="User Avatar" data-ai-hint="person portrait" />
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            <div className="grid gap-4 flex-1">
              <div className="grid gap-2">
                <Label htmlFor="username">{t('settingsUsername')}</Label>
                <Input id="username" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t('settingsEmail')}</Label>
                <Input id="email" type="email" value={user.email} disabled />
                <p className="text-xs text-muted-foreground">{t('settingsEmailDesc')}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleUpdateProfile}>{t('settingsUpdateProfile')}</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{t('settingsAppTitle')}</CardTitle>
          <CardDescription>{t('settingsAppDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 divide-y divide-border/50">
           <div className="space-y-2 pt-4">
                <h4 className='font-medium'>Notificaciones Push</h4>
                <div className="flex items-center justify-between rounded-lg p-3 -m-3">
                    <p className="text-sm text-muted-foreground">
                        Recibe notificaciones cuando la historia avance.
                    </p>
                    {isPushLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : isSubscribed ? (
                        <Button variant="outline" onClick={unsubscribeFromNotifications}>
                            <BellOff className="mr-2 h-4 w-4" />
                            Desactivar
                        </Button>
                    ) : (
                        <Button onClick={subscribeToNotifications}>
                            <Bell className="mr-2 h-4 w-4" />
                            Activar
                        </Button>
                    )}
                </div>
            </div>
          <div className="space-y-2 pt-4">
            <Label htmlFor="handwriting-font">{t('settingsHandwritingFont')}</Label>
            <Select value={handwritingFont} onValueChange={setHandwritingFont}>
              <SelectTrigger id="handwriting-font">
                <SelectValue placeholder={t('settingsSelectFont')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grace">{t('settingsFontGrace')}</SelectItem>
                <SelectItem value="merienda">{t('settingsFontMerienda')}</SelectItem>
                <SelectItem value="comic">{t('settingsFontComic')}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {t('settingsHandwritingFontDesc')}
            </p>
          </div>
          {user.role.isGm && (
            <div className='pt-4'>
                <Link href="/dashboard/settings/apikeys" className="flex items-center justify-between rounded-lg p-3 -m-3 hover:bg-muted/50 transition-colors">
                    <div>
                        <h4 className='font-medium'>{t('settingsAiSettings')}</h4>
                        <p className="text-sm text-muted-foreground">
                            {t('settingsAiSettingsDesc')}
                        </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  );
}
