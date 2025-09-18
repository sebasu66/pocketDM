// src/hooks/use-push-notifications.ts
"use client";

import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

// IMPORTANTE: Reemplaza esta cadena con la clave pública VAPID real de la configuración de tu proyecto de Firebase.
// Consola de Firebase > Configuración del Proyecto > Cloud Messaging > Certificados de Web Push
const VAPID_PUBLIC_KEY = "YOUR_VAPID_PUBLIC_KEY_HERE";

function urlBase64ToUint8Array(base64String: string) {  
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


export const usePushNotifications = () => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.ready.then(registration => {
                registration.pushManager.getSubscription().then(sub => {
                    if (sub) {
                        setIsSubscribed(true);
                        setSubscription(sub);
                    }
                    setIsLoading(false);
                });
            });
        } else {
             setIsLoading(false);
        }
    }, []);

    const subscribeToNotifications = async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            toast({ variant: 'destructive', title: 'Push Not Supported', description: 'Your browser does not support push notifications.' });
            return;
        }

        if (VAPID_PUBLIC_KEY === "YOUR_VAPID_PUBLIC_KEY_HERE") {
            toast({ variant: 'destructive', title: 'VAPID Key Not Configured', description: 'The VAPID public key is missing from the application code.' });
            console.error("VAPID public key is not configured. Please add it to src/hooks/use-push-notifications.ts");
            return;
        }
        
        const registration = await navigator.serviceWorker.ready;
        
        const permission = await window.Notification.requestPermission();
        if (permission !== 'granted') {
            toast({ variant: 'destructive', title: 'Permission Denied', description: 'You have denied notification permissions.' });
            return;
        }

        try {
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });
            
            await fetch('/api/subscriptions', {
                method: 'POST',
                body: JSON.stringify(sub),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setSubscription(sub);
            setIsSubscribed(true);
            toast({ title: 'Subscribed!', description: 'You will now receive notifications.' });

        } catch (error) {
            console.error('Failed to subscribe to push notifications:', error);
            toast({ variant: 'destructive', title: 'Subscription Failed', description: 'Could not subscribe to notifications.' });
        }
    };

    const unsubscribeFromNotifications = async () => {
        if (!subscription) return;

        try {
            await subscription.unsubscribe();

            await fetch('/api/subscriptions', {
                method: 'DELETE',
                body: JSON.stringify({ endpoint: subscription.endpoint }),
                 headers: {
                    'Content-Type': 'application/json',
                },
            });

            setSubscription(null);
            setIsSubscribed(false);
            toast({ title: 'Unsubscribed', description: 'You will no longer receive notifications.' });
        } catch (error) {
            console.error('Failed to unsubscribe:', error);
            toast({ variant: 'destructive', title: 'Unsubscription Failed' });
        }
    };

    return {
        isSubscribed,
        subscribeToNotifications,
        unsubscribeFromNotifications,
        isLoading
    };
};
