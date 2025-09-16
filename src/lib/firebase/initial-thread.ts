
// This file is deprecated. Use data/initial-thread-en.ts or data/initial-thread-es.ts instead.
import type { NarrativeThread } from "./types";

export const initialThread: Omit<NarrativeThread, 'id' | 'campaignId'> = {
    title: "A Shadow in the Market",
    authorId: "1", // GM User ID
    createdAt: 1672531200000, // Jan 1, 2023
    content: `
    <p>
      The afternoon sun casts long shadows across the bustling Silverwood market. A cloaked figure slips into the alley behind the 'Gilded Griffin' tavern. Moments later, a faint cry is heard, abruptly silenced. The market chatter seems to mask the incident, and only the most observant of you might have noticed.
    </p>
    <p>
      What do you do?
    </p>
  `,
    imageUrl: "https://picsum.photos/seed/picsum/800/400",
    imageAiHint: "fantasy market alley"
};
