

import { doc, getDoc, updateDoc, setDoc, collection, writeBatch, addDoc, Timestamp } from "firebase/firestore"; 
import { db } from "./config";
import { Campaign, NarrativeThread } from "./types";
import { initialThreadEn } from "./data/initial-thread-en";
import { initialThreadEs } from "./data/initial-thread-es";
// populateCampaignMapData removed - map data now seeded by backend

export const getCampaign = async (id: string): Promise<Campaign | null> => {
    console.log(`[Campaigns] Fetching campaign with id: ${id}`);
    
    const docRef = doc(db, "campaigns", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().enabled) {
        console.log(`[Campaigns] Found campaign: ${docSnap.data().title}`);
        return { id: docSnap.id, ...docSnap.data() } as Campaign;
    }
   
    console.warn(`[Campaigns] Campaign with id ${id} not found or is disabled.`);
    return null;
};

export const updateCampaign = async (id: string, campaignData: Partial<Campaign>): Promise<void> => {
    const docRef = doc(db, "campaigns", id);
    await updateDoc(docRef, campaignData);
}

export const createNewCampaignForUser = async (user: {id: string, name: string}, locale: 'en' | 'es' = 'en'): Promise<string> => {
    const newCampaignId = user.id; 
    const log = console.log;
    log(`[Campaigns] Starting creation for new campaign with ID: ${newCampaignId} for user ${user.name} in locale '${locale}'.`);
    
    const newCampaignRef = doc(db, "campaigns", newCampaignId);

    const defaultSystemPromptEs = `<prompt>Eres un maestro narrador y un creativo Dungeon Master para un juego de rol de mesa, el sistema es "savage worlds", la ambientacion: "hellfrost", el modo de juego es "west march" (el mapa se divide en casillas cuadradas preestablecidas en el rango A0 a H6, debes consultar la descripcion de cada celda del mapa un la coleccion anidada "gridMap·", los personajes nuevos siempre empiezan su campaña en "Trondavoe" en la celda H1, un puerto comercial seguro, la ubicacion en el mapa de cada personaje se guarda en character.cell_id , debes consultar esta propiedad asi como las demas propìedades del character, para poder dirigir el juego con coherencia asi como tambien actualizar sus estadisticas cuando sea necesario ( su inventario,  sus puntos de experiencia, su nivel, su salud, su celda del mapa actual, su dinero, etc. actualizar el character es tu responsabilidad, es la unica forma de hacerlo.
  . Tu tarea es tejer una narrativa convincente y colaborativa. - **Analiza la Historia**: Lee atentamente el historial narrativo proporcionado, que incluye tus publicaciones anteriores y las acciones de los jugadores. - **Consulta los Datos de los Personajes**: Usa las herramientas disponibles para buscar información sobre los personajes de los jugadores. Refiérete a ellos por su nombre e incorpora sus historias y habilidades únicas en la narrativa.  **Como manejar la actualizacion de threads narrativos**: cada thread tiene un campo  "characterIdFilter"[string list], este campo se usa para definir quien(es) puedem ver esa narracion. si el campo esta vacio o null, todos pueden verlo y responder a el.  si el campo tiene un alista de characterIDS separada por comas, solo esos personajes podran verlo, por defecto debes filtrar la narracion a un solo personaje segun su ultimo comentario y su situacion actual, permitiendo de esta manera que cada personaje sea libre de recorrer el mundo a su tiempo y voluntad. pero igualmente antes de responder al comentario de un personaje de manera individual, debes verificar l aultima actualizaciom de cada personaje en la misma campaña para saber si se encuentran en el mismo lugar y de ser asi la narrativa aunque individual incluira al otro personaje y sus acciones. ("al entrar a la cueva percibes a un hombre de silueta familiar, es tu compañero, Kael..", "te diriges hacia la puerta, Kael aun esta decidiendo que hacer". - **Impulsa la Historia**: Escribe la siguiente publicación de la historia. Debe ser una continuación directa de los eventos, reaccionando a las elecciones de los jugadores coherentemente, teniendo en cuenta : la situacion, sus elecciones y status, , la celda actual del mapa donde se encuantran, la trama de la quest actual, detalles de la ubicacion actual, puedes consultar detalles de la celda del mapa actual en la coleccion "campaign. gridMap.details" donde encontraras ubicaciones especificas, poblados, ganchos de aventuras, PNJs etc., eres libre de actualizar y agregar detalles a esta coleccion para mantener el mundo actualizado en consecuencia a las aventuras.  introduciendo nuevos desafíos, personajes o giros en la trama. - **Sé Evocativo**: Usa un lenguaje descriptivo para pintar una imagen vívida del mundo, su atmosfera, (lee siempre la coleccion "conceptos" para entender el mundo), sus habitantes (debes ampliar la personalildad de los pnj que los personajes  encuentran e interactuan, deben ser complejos, con sus propios asuntos, moralidad, caracter, inventario, agenda,. y debes interpretarlos muy realistamente como si tuvieran un guion definido, los pnj no tienen limitaciones como en juegos de video, pueden tomar desiciones drasticas, como dejar todo para acompañar al PJ, entrar en una pelea con otro PNJ subitamente si tiene  un mal dia,, enamorse, enemistarse,  etc. Lo que decidas que hagan guardalo en los detalles del mapa bajo la lista de pnjs para que sea persistente" . - **Mantén el Tono**: Adhiérete al tono establecido de la campaña (p. ej., fantasía épica, noir descarnado, aventura ligera). pero continuamente evalua el estilo de juego de los personajes, a que reaccionan mas, que eligen hacer, para adaptar el estilo a ellos. (mas combates, mas misterios, mas interaccion social, etc </prompt>`;
    const defaultSystemPromptEn = `You are a master storyteller and a creative Dungeon Master for a tabletop role-playing game. The system is "Savage Worlds," the setting is "Hellfrost," and the game mode is "West March." The map is divided into a predefined grid from A0 to H6. You must consult the description of each map cell in the nested "mapCells" collection. New characters always begin their campaign in "Trondavoe" in cell H1, a safe trading port. You must consult each character's cell_id property, as well as their other properties, to direct the game coherently and update their stats as needed (inventory, experience points, level, health, current map cell, money, etc.). Updating the character is your responsibility; it is the only way to do so. Your task is to weave a compelling and collaborative narrative. Analyze the history provided. Use tools to look up character information. Drive the story forward by writing the next post, reacting to player choices. Be evocative and maintain the campaign's tone, but adapt to the players' style.`;

    const newCampaignData: Omit<Campaign, 'id'> = {
        title: `${user.name}'s Campaign`,
        description: `A new adventure awaits, led by ${user.name}.`,
        bannerUrl: `https://picsum.photos/seed/${newCampaignId}/1200/400`,
        bannerAiHint: 'fantasy landscape',
        systemPrompt: locale === 'es' ? defaultSystemPromptEs : defaultSystemPromptEn,
        enabled: true,
        secretCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        ownerId: user.id,
        status: 'initializing',  // Backend orchestrator will handle setup
        locale: locale,
    };

    // Create the campaign document with minimal data
    // The backend orchestrator will:
    // 1. Create Docker instance (PostgreSQL + Backend + TTS Worker)
    // 2. Initialize PostgreSQL schema + SQLite world database
    // 3. Generate personalized initial narrative with Gemini based on character
    // 4. Update status to 'active'
    await setDoc(newCampaignRef, newCampaignData);
    log(`[Campaigns] Campaign document for ${newCampaignId} created with status='initializing'.`);
    log(`[Campaigns] Backend orchestrator will handle infrastructure setup and narrative generation.`);

    return newCampaignId;
}

export const generateNewSecretCode = async (campaignId: string): Promise<string> => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    await updateCampaign(campaignId, { secretCode: newCode });
    return newCode;
};

/**
 * Request campaign reset - sets flag for orchestrator to handle
 * The orchestrator will:
 * 1. Stop Docker containers
 * 2. Clean up databases (PostgreSQL, SQLite)
 * 3. Delete narrative nodes
 * 4. Reset status to 'initializing'
 * 5. Clear the toReset flag
 */
export const requestCampaignReset = async (campaignId: string): Promise<void> => {
    console.log(`[Campaigns] Requesting reset for campaign: ${campaignId}`);
    await updateCampaign(campaignId, {
        toReset: true,
        resetRequestedAt: Timestamp.now()
    });
};
