'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { doc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export type NarrativeStatus =
  | 'idle'
  | 'init'
  | 'in_progress'
  | 'completed_no_tts'
  | 'completed'
  | 'error';

interface CampaignStatus {
  narrative_status: NarrativeStatus;
  message?: string;
  error?: string;
  character_name?: string;
  started_at?: Date;
  completed_at?: Date;
  failed_at?: Date;
}

interface NarrativeStatusIndicatorProps {
  campaignId: string;
}

const STATUS_IMAGES: Record<NarrativeStatus, string> = {
  idle: '/ui/status/loading1.png',
  init: '/ui/status/loading1.png',
  in_progress: '/ui/status/loading1.png', // Will cycle through loading1-4
  completed_no_tts: '/ui/status/tts.png',
  completed: '/ui/status/success.png',
  error: '/ui/status/error.png',
};

const STATUS_LABELS: Record<NarrativeStatus, string> = {
  idle: 'Esperando...',
  init: 'Inicializando...',
  in_progress: 'Generando narrativa...',
  completed_no_tts: 'Generando audio...',
  completed: '¡Listo!',
  error: 'Error',
};

export default function NarrativeStatusIndicator({ campaignId }: NarrativeStatusIndicatorProps) {
  const [status, setStatus] = useState<CampaignStatus | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loadingFrame, setLoadingFrame] = useState(1); // For cycling loading1-4

  useEffect(() => {
    if (!campaignId) return;

    const statusRef = doc(db, 'campaign_status', campaignId);

    const unsubscribe: Unsubscribe = onSnapshot(
      statusRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as CampaignStatus;
          setStatus(data);

          // Show indicator when there's active status (not idle or completed)
          const activeStates: NarrativeStatus[] = ['init', 'in_progress', 'completed_no_tts', 'error'];
          setIsVisible(activeStates.includes(data.narrative_status));
        } else {
          setStatus(null);
          setIsVisible(false);
        }
      },
      (error) => {
        console.error('Error listening to campaign status:', error);
      }
    );

    return () => unsubscribe();
  }, [campaignId]);

  // Hide after 5 seconds when completed
  useEffect(() => {
    if (status?.narrative_status === 'completed') {
      const timer = setTimeout(() => setIsVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Cycle through loading frames for init and in_progress states
  useEffect(() => {
    if (status?.narrative_status === 'init' || status?.narrative_status === 'in_progress') {
      const interval = setInterval(() => {
        setLoadingFrame((prev) => (prev % 4) + 1); // Cycle 1 -> 2 -> 3 -> 4 -> 1
      }, 300); // Change frame every 300ms

      return () => clearInterval(interval);
    } else {
      setLoadingFrame(1); // Reset to first frame
    }
  }, [status?.narrative_status]);

  if (!isVisible || !status) return null;

  const currentStatus = status.narrative_status;
  const label = status.message || STATUS_LABELS[currentStatus];

  // Get the correct image based on status
  let imageSrc = STATUS_IMAGES[currentStatus];

  // For init and in_progress states, use the current loading frame
  if (currentStatus === 'init' || currentStatus === 'in_progress') {
    imageSrc = `/ui/status/loading${loadingFrame}.png`;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-fade-in">
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-black/80 text-white backdrop-blur-sm">
        <div className="relative w-12 h-12">
          <Image
            src={imageSrc}
            alt={currentStatus}
            fill
            className="object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm">
            {label}
          </span>
          {status.character_name && currentStatus !== 'completed' && (
            <span className="text-xs opacity-90">
              {status.character_name}
            </span>
          )}
          {status.error && currentStatus === 'error' && (
            <span className="text-xs opacity-90 mt-1">
              {status.error}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
