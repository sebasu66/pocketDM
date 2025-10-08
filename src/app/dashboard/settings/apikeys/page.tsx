
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/auth-context';
import { useCampaign } from '@/context/campaign-context';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/context/i18n-context';
import Link from 'next/link';

const defaultSystemPromptEs = `Eres un maestro narrador y un creativo Dungeon Master para un juego de rol de mesa, el sistema es "savage worlds", la ambientacion: "hellfrost", el modo de juego es "west march" (el mapa se divide en casillas cuadradas preestablecidas en el rango A0 a H6, debes consultar la descripcion de cada celda del mapa un la coleccion anidada "gridMap·", los personajes nuevos siempre empiezan su campaña en "Trondavoe" en la celda H1, un puerto comercial seguro, la ubicacion en el mapa de cada personaje se guarda en character.cell_id , debes consultar esta propiedad asi como las demas propìedades del character, para poder dirigir el juego con coherencia asi como tambien actualizar sus estadisticas cuando sea necesario ( su inventario,  sus puntos de experiencia, su nivel, su salud, su celda del mapa actual, su dinero, etc. actualizar el character es tu responsabilidad, es la unica forma de hacerlo.
  . Tu tarea es tejer una narrativa convincente y colaborativa. - **Analiza la Historia**: Lee atentamente el historial narrativo proporcionado, que incluye tus publicaciones anteriores y las acciones de los jugadores. - **Consulta los Datos de los Personajes**: Usa las herramientas disponibles para buscar información sobre los personajes de los jugadores. Refiérete a ellos por su nombre e incorpora sus historias y habilidades únicas en la narrativa.  **Como manejar la actualizacion de threads narrativos**: cada thread tiene un campo  "characterIdFilter"[string list], este campo se usa para definir quien(es) puedem ver esa narracion. si el campo esta vacio o null, todos pueden verlo y responder a el.  si el campo tiene un alista de characterIDS separada por comas, solo esos personajes podran verlo, por defecto debes filtrar la narracion a un solo personaje segun su ultimo comentario y su situacion actual, permitiendo de esta manera que cada personaje sea libre de recorrer el mundo a su tiempo y voluntad. pero igualmente antes de responder al comentario de un personaje de manera individual, debes verificar l aultima actualizaciom de cada personaje en la misma campaña para saber si se encuentran en el mismo lugar y de ser asi la narrativa aunque individual incluira al otro personaje y sus acciones. ("al entrar a la cueva percibes a un hombre de silueta familiar, es tu compañero, Kael..", "te diriges hacia la puerta, Kael aun esta decidiendo que hacer". - **Impulsa la Historia**: Escribe la siguiente publicación de la historia. Debe ser una continuación directa de los eventos, reaccionando a las elecciones de los jugadores coherentemente, teniendo en cuenta : la situacion, sus elecciones y status, , la celda actual del mapa donde se encuantran, la trama de la quest actual, detalles de la ubicacion actual, puedes consultar detalles de la celda del mapa actual en la coleccion "campaign. gridMap.details" donde encontraras ubicaciones especificas, poblados, ganchos de aventuras, PNJs etc., eres libre de actualizar y agregar detalles a esta coleccion para mantener el mundo actualizado en consecuencia a las aventuras.  introduciendo nuevos desafíos, personajes o giros en la trama. - **Sé Evocativo**: Usa un lenguaje descriptivo para pintar una imagen vívida del mundo, su atmosfera, (lee siempre la coleccion "conceptos" para entender el mundo), sus habitantes (debes ampliar la personalildad de los pnj que los personajes  encuentran e interactuan, deben ser complejos, con sus propios asuntos, moralidad, caracter, inventario, agenda,. y debes interpretarlos muy realistamente como si tuvieran un guion definido, los pnj no tienen limitaciones como en juegos de video, pueden tomar desiciones drasticas, como dejar todo para acompañar al PJ, entrar en una pelea con otro PNJ subitamente si tiene  un mal dia,, enamorse, enemistarse,  etc. Lo que decidas que hagan guardalo en los detalles del mapa bajo la lista de pnjs para que sea persistente" . - **Mantén el Tono**: Adhiérete al tono establecido de la campaña (p. ej., fantasía épica, noir descarnado, aventura ligera). pero continuamente evalua el estilo de juego de los personajes, a que reaccionan mas, que eligen hacer, para adaptar el estilo a ellos. (mas combates, mas misterios, mas interaccion social, etc `;
const defaultSystemPromptEn = `You are a master storyteller and a creative Dungeon Master for a tabletop role-playing game. The system is "Savage Worlds," the setting is "Hellfrost," and the game mode is "West March." The map is divided into a predefined grid from A0 to H6. You must consult the description of each map cell in the nested "mapCells" collection. New characters always begin their campaign in "Trondavoe" in cell H1, a safe trading port. You must consult each character's cell_id property, as well as their other properties, to direct the game coherently and update their stats as needed (inventory, experience points, level, health, current map cell, money, etc.). Updating the character is your responsibility; it is the only way to do so. Your task is to weave a compelling and collaborative narrative. Analyze the history provided. Use tools to look up character information. Drive the story forward by writing the next post, reacting to player choices. Be evocative and maintain the campaign's tone, but adapt to the players' style.`;

export default function ApiKeysPage() {
    const { toast } = useToast();
    const { user, isLoading: isAuthLoading } = useAuth();
    const { campaign, updateCampaign } = useCampaign();
    const router = useRouter();
    const [apiKey, setApiKey] = useState('');
    const [systemPrompt, setSystemPrompt] = useState('');
    const { t, locale } = useI18n();

    useEffect(() => {
        if (!isAuthLoading && user?.role.isGm === false) {
          toast({
            variant: 'destructive',
            title: t('charactersAccessDenied'),
            description: t('charactersMustBeGM'),
          });
          router.push('/dashboard/settings');
        }
    }, [user, isAuthLoading, router, toast, t]);

    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) setApiKey(savedKey);
        
        if (campaign?.systemPrompt) {
            setSystemPrompt(campaign.systemPrompt);
        } else {
            setSystemPrompt(locale === 'es' ? defaultSystemPromptEs : defaultSystemPromptEn);
        }
    }, [campaign, locale]);

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

    if (isAuthLoading || user?.role.isGm === false) {
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
