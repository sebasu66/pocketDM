"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { WikiLocation } from '@/lib/types/wiki';

interface WikiMarkdownProps {
  content: string;
  onLocationClick?: (locationId: string) => void;
  onNpcClick?: (npcId: string) => void;
  onFactionClick?: (factionId: string) => void;
}

/**
 * WikiMarkdown - Renders markdown with wiki tag support
 * Converts @location:, @npc:, @faction: tags into clickable links
 */
export function WikiMarkdown({
  content,
  onLocationClick,
  onNpcClick,
  onFactionClick
}: WikiMarkdownProps) {

  // Process wiki tags into clickable elements
  const processedContent = React.useMemo(() => {
    let processed = content;

    // Replace @location:id with clickable links
    processed = processed.replace(
      /@location:([a-z0-9_]+)/gi,
      (match, id) => `[📍 ${id}](wiki://location/${id})`
    );

    // Replace @npc:id with clickable links
    processed = processed.replace(
      /@npc:([a-z0-9_]+)/gi,
      (match, id) => `[👤 ${id}](wiki://npc/${id})`
    );

    // Replace @faction:id with clickable links
    processed = processed.replace(
      /@faction:([a-z0-9_]+)/gi,
      (match, id) => `[⚔️ ${id}](wiki://faction/${id})`
    );

    return processed;
  }, [content]);

  return (
    <ReactMarkdown
      className="prose prose-stone dark:prose-invert max-w-none"
      components={{
        a: ({ node, href, children, ...props }) => {
          // Handle wiki:// protocol links
          if (href?.startsWith('wiki://')) {
            const [, type, id] = href.split('/');

            const handleClick = (e: React.MouseEvent) => {
              e.preventDefault();

              if (type === 'location' && onLocationClick) {
                onLocationClick(id);
              } else if (type === 'npc' && onNpcClick) {
                onNpcClick(id);
              } else if (type === 'faction' && onFactionClick) {
                onFactionClick(id);
              }
            };

            return (
              <a
                href="#"
                onClick={handleClick}
                className="text-amber-700 hover:text-amber-900 underline cursor-pointer"
                {...props}
              >
                {children}
              </a>
            );
          }

          // Regular links
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
              {children}
            </a>
          );
        },
        h1: ({ node, ...props }) => (
          <h1 className="font-headline text-3xl text-stone-900 mt-6 mb-4" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="font-headline text-2xl text-stone-800 mt-5 mb-3" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="font-headline text-xl text-stone-800 mt-4 mb-2" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="text-stone-700 mb-3 leading-relaxed" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside mb-3 text-stone-700" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-inside mb-3 text-stone-700" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="mb-1" {...props} />
        ),
        strong: ({ node, ...props }) => (
          <strong className="font-bold text-stone-900" {...props} />
        ),
        em: ({ node, ...props }) => (
          <em className="italic" {...props} />
        ),
      }}
    >
      {processedContent}
    </ReactMarkdown>
  );
}
