import { database } from './config';
import { ref, push, onValue, query, orderByChild, limitToLast, off, serverTimestamp } from 'firebase/database';

export interface ChatMessage {
  id: string;
  campaignId: string;
  userId: string;
  userName: string;
  characterName?: string;
  text: string;
  timestamp: number;
}

/**
 * Send a chat message to a campaign
 */
export async function sendChatMessage(
  campaignId: string,
  userId: string,
  userName: string,
  text: string,
  characterName?: string
): Promise<void> {
  const messagesRef = ref(database, `campaigns/${campaignId}/messages`);

  await push(messagesRef, {
    campaignId,
    userId,
    userName,
    characterName: characterName || null,
    text,
    timestamp: serverTimestamp(),
  });
}

/**
 * Subscribe to chat messages for a campaign
 * Returns unsubscribe function
 */
export function subscribeToChatMessages(
  campaignId: string,
  onMessagesUpdate: (messages: ChatMessage[]) => void,
  limit: number = 100
): () => void {
  const messagesRef = ref(database, `campaigns/${campaignId}/messages`);
  const messagesQuery = query(
    messagesRef,
    orderByChild('timestamp'),
    limitToLast(limit)
  );

  const callback = (snapshot: any) => {
    const messages: ChatMessage[] = [];

    snapshot.forEach((childSnapshot: any) => {
      const data = childSnapshot.val();
      messages.push({
        id: childSnapshot.key,
        ...data,
      });
    });

    // Sort by timestamp (oldest first)
    messages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    onMessagesUpdate(messages);
  };

  onValue(messagesQuery, callback);

  // Return unsubscribe function
  return () => {
    off(messagesQuery, 'value', callback);
  };
}
