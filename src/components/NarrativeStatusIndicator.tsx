'use client';

import { useEffect, useState } from 'react';
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

const STATUS_ICONS: Record<NarrativeStatus, string> = {
  idle: '⏸️',
  init: '🔄',
  in_progress: '✨',
  completed_no_tts: '🎭',
  completed: '✅',
  error: '❌',
};

const STATUS_COLORS: Record<NarrativeStatus, string> = {
  idle: 'bg-gray-500',
  init: 'bg-blue-500',
  in_progress: 'bg-purple-500 animate-pulse',
  completed_no_tts: 'bg-yellow-500',
  completed: 'bg-green-500',
  error: 'bg-red-500',
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

  if (!isVisible || !status) return null;

  const currentStatus = status.narrative_status;
  const icon = STATUS_ICONS[currentStatus];
  const colorClass = STATUS_COLORS[currentStatus];
  const label = status.message || STATUS_LABELS[currentStatus];

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-fade-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${colorClass} text-white backdrop-blur-sm`}>
        <div className="text-2xl">
          {icon}
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
