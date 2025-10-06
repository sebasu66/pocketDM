
import { Timestamp } from "firebase/firestore";
import type { NarrativeThread } from "../types";

// This object represents the data for a thread, but doesn't perfectly match the final DB schema
// The 'narrative' property will be used during seeding.
export const initialThreadEs: Omit<NarrativeThread, 'id' | 'createdAt' | 'comments'> = {
    title: "La Última Oportunidad",
    authorId: "1", // GM User ID
    narrative: `
<p>El viento tiene dientes tan al norte. Es una fuerza amarga e implacable que azota las llanuras y encuentra cada rendija en tu capa, un recordatorio constante de que has llegado al borde del mundo. Ante ti, acurrucada tras una formidable muralla de piedra, se encuentra la ciudad de Aslov: el último bastión de la civilización antes de los interminables páramos de las Tierras Fronterizas, infestados de monstruos. La llaman la Ciudad de la Esperanza Rota. Después de semanas de viaje, es tu santuario.</p>

<p>Cualesquiera que sean tus razones para venir aquí —ya sea la promesa de fortuna, la huida de un pasado que preferirías olvidar o el noble deseo de contener la oscuridad que avanza— te encuentras empujando la pesada puerta de madera de la taberna más famosa de la ciudad: La Última Oportunidad.</p>

<p>El aire en el interior es denso, con olor a lana mojada, guiso barato y humo de leña. El lugar está abarrotado, un microcosmos de Aslov. Tramperos curtidos con las orejas congeladas intercambian historias en voz baja, mercaderes nerviosos cuentan sus monedas y refugiados de ojos hundidos, que se hacinan en la creciente "Ciudad de Lona" fuera de las murallas, beben cerveza aguada. Esta es una ciudad al límite, rebosante de desesperación y oportunidad a partes iguales.</p>

<p>Mientras encuentras una mesa cerca del hogar, sintiendo el calor como un alivio bienvenido tras el frío cortante, el ruido de la sala común te presenta un tapiz de posibilidades. La elección de por dónde empezar, de qué camino tomar en esta tierra helada, es tuya. Cuatro hilos distintos del destino se presentan ante ti:</p>

<ol>
    <li>En un tablón de anuncios abarrotado cerca de la barra, un pergamino desgastado con el sello de un pueblo del norte, <strong>Guardia del Gigante</strong>, te llama la atención. Anuncia una recompensa renovada, y generosa, por las calaveras de los hombres bestia que asolan las Colinas de los Uros. Es un trabajo sangriento, pero la paga es directa y el objetivo está claro.</li>
    <li>Acurrucado en un rincón, un hombre de aspecto frágil con túnica de erudito agarra nerviosamente un maletín de cuero. Habla con cualquiera que le escuche, buscando guardias armados para un viaje al este, hacia el pueblo de <strong>Nara</strong>. Lleva libros raros para la Casa del Saber y habla de bandidos que acechan a los débiles y a los incautos en la ruta comercial.</li>
    <li>Un alboroto cerca de la puerta atrae tu atención. Una mujer, con el rostro marcado por la preocupación, suplica a los clientes. Su hijo está enfermo con la fiebre ronca en la Ciudad de Lona, y su única esperanza es la potente medicina preparada por las Hermanas de la Piedad en un lugar llamado <strong>Santuario</strong>. Sin embargo, el viaje es largo y no tiene nada que ofrecer salvo su eterna gratitud a quienes sirvan como sus protectores.</li>
    <li>Dominando la conversación junto al fuego se encuentra un trampero tuerto, su voz un gruñido grave. Advierte a un grupo de recién llegados de ojos abiertos sobre los peligros del sur, a la sombra de los <strong>Picos Dentados</strong>. Cuenta la sombría historia de un amigo que buscó refugio en las ruinas del Castillo Graystone y nunca más fue visto, dejando atrás solo un grito congelado en la sangre sobre el viento. No es un trabajo, sino una cruda advertencia... y quizás un desafío.</li>
</ol>

<p>El fuego crepita. La multitud murmura. Aslov, con toda su miseria y toda su promesa, se muestra desnuda ante ti. El primer paso es tuyo.</p>

<p>Así que... ¿qué hacéis?</p>
  `,
    imageUrl: "https://picsum.photos/seed/ultima-oportunidad/800/400",
    imageAiHint: "interior taberna fantasia",
    characterFilterList: []
};
