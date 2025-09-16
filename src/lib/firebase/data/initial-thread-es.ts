
import type { NarrativeThread } from "../types";

export const initialThreadEs: Omit<NarrativeThread, 'id' | 'campaignId'> = {
    title: "Una Sombra en el Mercado",
    authorId: "1", // GM User ID
    createdAt: Date.now(),
    content: `
    <p>
      El sol de la tarde proyecta largas sombras sobre el bullicioso mercado de Silverwood. Una figura encapuchada se desliza hacia el callejón detrás de la taberna 'El Grifo Dorado'. Momentos después, se oye un débil grito, abruptamente silenciado. El bullicio del mercado parece enmascarar el incidente, y solo los más observadores de vuestro grupo podrían haberse dado cuenta.
    </p>
    <p>
      ¿Qué hacéis?
    </p>
  `,
    imageUrl: "https://picsum.photos/seed/sombra-mercado/800/400",
    imageAiHint: "callejon mercado fantasia"
};
