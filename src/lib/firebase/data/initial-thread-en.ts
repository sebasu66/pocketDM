import type { NarrativeThread } from "../types";

export const initialThreadEn: Omit<NarrativeThread, 'id' | 'campaignId' | 'createdAt'> = {
    title: "The Last Chance",
    authorId: "1", // GM User ID
    content: `
<p>The wind has teeth this far north. It’s a bitter, relentless thing that scours the plains and finds every gap in your cloak, a constant reminder that you’ve reached the edge of the world. Before you, huddled behind a formidable stone wall, is the city of Aslov—the last bastion of civilization before the endless, monster-haunted wastes of the Borderlands. They call it the City of Shattered Hope. After weeks on the road, it is your sanctuary.</p>

<p>Whatever your reasons for coming here—be it the lure of fortune, the escape from a past you’d rather forget, or the noble desire to hold back the encroaching darkness—you find yourself pushing through the heavy wooden door of the city’s most famous tavern: The Last Chance.</p>

<p>The air inside is thick with the smell of wet wool, cheap stew, and woodsmoke. The place is packed, a microcosm of Aslov itself. Grizzled trappers with frostbitten ears trade stories in low voices, nervous merchants count their coins, and hollow-eyed refugees, who huddle in the sprawling "Tent Town" outside the walls, nurse watered-down ale. This is a city on the brink, overflowing with desperation and opportunity in equal measure.</p>

<p>As you find a table near the hearth, the warmth a welcome relief from the biting cold, the noise of the common room presents a tapestry of possibilities. The choice of where to begin, of what path to walk in this frozen land, is yours. Four distinct threads of fate present themselves to you:</p>

<ol>
    <li>On a crowded notice board near the bar, a worn parchment stamped with the seal of a northern town, <strong>Giantwatch</strong>, catches your eye. It announces a renewed, and generous, bounty for the skulls of beastmen who plague the Aurochs Hills. It’s bloody work, but the pay is direct and the target is clear.</li>
    <li>Huddled in a corner, a frail-looking man in scholarly robes nervously clutches a leather satchel. He speaks to anyone who will listen, seeking armed guards for a journey east to the town of <strong>Nara</strong>. He carries rare books for the House of Lore and speaks of bandits who prey on the weak and unprepared along the trade road.</li>
    <li>A commotion near the door draws your attention. A woman, her face etched with worry, pleads with the patrons. Her child is sick with the rattling fever in Tent Town, and her only hope is the potent medicine brewed by the Sisters of Mercy in a place called <strong>Sanctuary</strong>. The journey is long, however, and she has nothing to offer but her eternal gratitude to any who would serve as her protectors.</li>
    <li>Holding court by the fire is a one-eyed trapper, his voice a low growl. He warns a group of wide-eyed newcomers about the dangers to the south, in the shadow of the <strong>Jagged Peaks</strong>. He tells a grim tale of a friend who sought shelter in the ruins of Castle Graystone and was never seen again, leaving behind only a blood-frozen scream on the wind. It’s not a job, but a stark warning—and perhaps a challenge.</li>
</ol>

<p>The fire crackles. The crowd murmurs. Aslov, with all its misery and all its promise, lays itself bare before you. The first step is yours to take.</p>

<p>So… what do you do?</p>
  `,
    imageUrl: "https://picsum.photos/seed/last-chance-tavern/800/400",
    imageAiHint: "fantasy tavern interior"
};
