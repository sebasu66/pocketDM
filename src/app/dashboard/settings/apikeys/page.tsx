
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/context/i18n-context';
import Link from 'next/link';

const defaultSystemPrompt = `You are a master storyteller and creative Dungeon Master for a tabletop role-playing game. Your task is to weave a compelling and collaborative narrative.

- **Analyze the History**: Carefully read the narrative history provided, which includes your previous posts and the players' actions.
- **Consult Character Data**: Use the available tools to look up information about the player characters. Refer to them by name and incorporate their unique backstories and abilities into the narrative.
- **Drive the Story Forward**: Write the next post in the story. It should be a direct continuation of the events, reacting to player choices and introducing new challenges, characters, or plot developments.
- **Be Evocative**: Use descriptive language to paint a vivid picture of the world, its inhabitants, and the atmosphere.
- **Maintain Tone**: Adhere to the established tone of the campaign (e.g., epic fantasy, gritty noir, lighthearted adventure).`;

export default function ApiKeysPage() {
    const { toast } = useToast();
    const { user, campaign, updateCampaign, isLoading } = useAuth();
    const router = useRouter();
    const [apiKey, setApiKey] = useState('');
    const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt);
    const { t } = useI18n();

    useEffect(() => {
        if (!isLoading && user?.role !== 'master') {
          toast({
            variant: 'destructive',
            title: t('charactersAccessDenied'),
            description: t('charactersMustBeGM'),
          });
          router.push('/dashboard/settings');
        }
    }, [user, isLoading, router, toast, t]);

    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) setApiKey(savedKey);
        
        if (campaign?.systemPrompt) {
            setSystemPrompt(campaign.systemPrompt);
        }
    }, [campaign]);

    const handleSave = async () => {
        localStorage.setItem('gemini_api_key', apiKey);
        if (campaign) {
            await updateCampaign({ ...campaign, systemPrompt });
        }
        
        toast({
            title: t('apiKeysSavedToast'),
            description: t('apiKeysSavedToastDesc'),
        });
    };

    if (isLoading || user?.role !== 'master') {
      return (
        <Card>
          <CardHeader>
            <CardTitle>{t('charactersAccessDenied')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t('charactersMustBeGM')}</p>
          </CardContent>
        </Card>
      );
    }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{t('apiKeysTitle')}</CardTitle>
          <CardDescription>{t('apiKeysDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="api-key">{t('apiKeysGeminiLabel')}</Label>
                <Input 
                    id="api-key" 
                    type="password" 
                    placeholder={t('apiKeysGeminiPlaceholder')}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                    {t('apiKeysGeminiDesc', {link: ''})}
                    <Link href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</Link>.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="system-prompt">{t('apiKeysSystemPromptLabel')}</Label>
                <Textarea 
                    id="system-prompt"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    rows={15}
                    className="font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">
                    {t('apiKeysSystemPromptDesc')}
                </p>
            </div>
             <div className="flex justify-end">
                <Button onClick={handleSave}>{t('apiKeysSave')}</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

    