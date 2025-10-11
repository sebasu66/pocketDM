import { useEffect, useState } from 'react';
import { subscribeToChatMessages, type ChatMessage } from '@/lib/firebase/chat';

/**
 * Hook to track unread chat messages
 * Returns the number of unread messages since the last time the chat was opened
 */
export function useChatUnread(campaignId: string | undefined, userId: string | undefined) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastReadTimestamp, setLastReadTimestamp] = useState<number>(() => {
    // Load last read timestamp from localStorage
    if (typeof window === 'undefined' || !campaignId) return Date.now();
    const stored = localStorage.getItem(`chat_last_read_${campaignId}`);
    return stored ? parseInt(stored, 10) : Date.now();
  });

  useEffect(() => {
    if (!campaignId || !userId) return;

    const unsubscribe = subscribeToChatMessages(campaignId, (messages: ChatMessage[]) => {
      // Count messages from other users that are newer than last read
      const unread = messages.filter(
        (msg) => msg.userId !== userId && msg.timestamp > lastReadTimestamp
      ).length;

      setUnreadCount(unread);
    }, 50); // Only fetch last 50 messages for unread count

    return () => {
      unsubscribe();
    };
  }, [campaignId, userId, lastReadTimestamp]);

  const markAsRead = () => {
    const now = Date.now();
    setLastReadTimestamp(now);
    setUnreadCount(0);

    // Persist to localStorage
    if (typeof window !== 'undefined' && campaignId) {
      localStorage.setItem(`chat_last_read_${campaignId}`, now.toString());
    }
  };

  return { unreadCount, markAsRead };
}
