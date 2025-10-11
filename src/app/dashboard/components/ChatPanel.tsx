"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, Users } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useCampaign } from "@/context/campaign-context";
import { sendChatMessage, subscribeToChatMessages, type ChatMessage } from "@/lib/firebase/chat";
import { getCharactersByCampaign } from "@/lib/firebase/characters";
import type { Character } from "@/lib/firebase/types";

interface ChatPanelProps {
  onClose: () => void;
  onOpen?: () => void;
}

export function ChatPanel({ onClose, onOpen }: ChatPanelProps) {
  const { user } = useAuth();
  const { campaign } = useCampaign();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [playerCharacter, setPlayerCharacter] = useState<Character | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount and notify parent
  useEffect(() => {
    inputRef.current?.focus();
    onOpen?.();
  }, [onOpen]);

  // Load player's character
  useEffect(() => {
    if (!campaign || !user) return;

    const loadCharacter = async () => {
      try {
        const characters = await getCharactersByCampaign(campaign.id, user.id);
        if (characters.length > 0) {
          setPlayerCharacter(characters[0]);
        }
      } catch (error) {
        console.error("Error loading character:", error);
      }
    };

    loadCharacter();
  }, [campaign?.id, user?.id]);

  // Subscribe to chat messages
  useEffect(() => {
    if (!campaign) return;

    const unsubscribe = subscribeToChatMessages(campaign.id, (newMessages) => {
      setMessages(newMessages);
    });

    return () => {
      unsubscribe();
    };
  }, [campaign?.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !campaign || !user || isSending) return;

    setIsSending(true);

    try {
      await sendChatMessage(
        campaign.id,
        user.id,
        user.name,
        newMessage.trim(),
        playerCharacter?.name
      );

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return date.toLocaleString('es-ES', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-900/30 rounded-lg shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-amber-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-900/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-headline text-amber-100 uppercase tracking-wider">
                Chat de Campaña
              </h2>
              <p className="text-xs text-amber-200/60">{campaign?.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-white/40 py-8">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No hay mensajes aún.</p>
              <p className="text-xs mt-1">¡Sé el primero en enviar un mensaje!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.userId === user?.id;

              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg p-3 ${
                      isOwnMessage
                        ? 'bg-amber-900/40 border border-amber-700/30'
                        : 'bg-slate-800/60 border border-slate-700/30'
                    }`}
                  >
                    {/* Sender Info */}
                    <div className="flex items-baseline gap-2 mb-1">
                      <span
                        className={`text-xs font-semibold ${
                          isOwnMessage ? 'text-amber-300' : 'text-cyan-300'
                        }`}
                      >
                        {message.userName}
                      </span>
                      {message.characterName && (
                        <span className="text-xs text-white/40">
                          ({message.characterName})
                        </span>
                      )}
                      <span className="text-xs text-white/30 ml-auto">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>

                    {/* Message Text */}
                    <p className="text-sm text-white/90 whitespace-pre-wrap break-words">
                      {message.text}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-amber-900/30 bg-slate-950/50"
        >
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-slate-900/80 border border-slate-700/50 rounded-lg px-4 py-2 text-white/90 placeholder:text-white/30 focus:outline-none focus:border-amber-700/50 focus:ring-1 focus:ring-amber-700/30"
              maxLength={500}
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="p-3 bg-amber-900/40 hover:bg-amber-900/60 border border-amber-700/40 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 text-amber-300" />
            </button>
          </div>
          <p className="text-xs text-white/30 mt-2">
            {newMessage.length}/500 caracteres
          </p>
        </form>
      </div>
    </div>
  );
}
