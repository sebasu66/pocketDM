// THIS SCRIPT IS FOR DEMO PURPOSES ONLY
// It contains the initial user and campaign data needed to seed the Firestore database.

export const initialUsers = [
    { id: "1", name: "Game Master", email: "gm@example.com", role: "master", avatar: "/ui/avatar/avatar.jpg", campaignId: "1" },
    { id: "2", name: "Alice", email: "alice@example.com", role: "player", avatar: "/ui/avatar/avatar.jpg", campaignId: "1" },
    { id: "3", name: "Bob", email: "bob@example.com", role: "player", avatar: "/ui/avatar/avatar.jpg", campaignId: "1" },
    { id: "4", name: "Carlos", email: "carlos@example.com", role: "player", avatar: "/ui/avatar/avatar.jpg", campaignId: "1" },
    { id: "5", name: "Diana", email: "diana@example.com", role: "player", avatar: "/ui/avatar/avatar.jpg", campaignId: "1" },
];

export const initialCampaigns = [
    { 
        id: "1", 
        title: "The Frozen Reach", 
        description: "A campaign set in the northern territories of Rassilon, where the biting winds of the Hellfrost are a constant threat and ancient evils stir beneath the ice.",
        bannerUrl: "https://picsum.photos/seed/campaign1/1200/400",
        bannerAiHint: "frozen landscape fantasy",
        systemPrompt: "You are a master storyteller and creative Dungeon Master for a tabletop role-playing game. Your task is to weave a compelling and collaborative narrative.\n\n- **Analyze the History**: Carefully read the narrative history provided, which includes your previous posts and the players' actions.\n- **Consult Character Data**: Use the available tools to look up information about the player characters. Refer to them by name and incorporate their unique backstories and abilities into the narrative.\n- **Drive the Story Forward**: Write the next post in the story. It should be a direct continuation of the events, reacting to player choices and introducing new challenges, characters, or plot developments.\n- **Be Evocative**: Use descriptive language to paint a vivid picture of the world, its inhabitants, and the atmosphere.\n- **Maintain Tone**: Adhere to the established tone of the campaign (e.g., epic fantasy, gritty noir, lighthearted adventure)."
    }
];
