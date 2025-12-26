import { GoogleGenAI } from "@google/genai";
import { BasketItem } from "../types";

const getSystemInstruction = () => `
Eres un experto en cuidado de ropa y mantenimiento de lavadoras.
Tu objetivo es analizar una lista de prendas que el usuario va a lavar y dar consejos breves y útiles.
Responde siempre en Español.
Mantén tus respuestas cortas (máximo 3 puntos clave).
Si la carga parece muy pesada o desequilibrada, advierte sobre el riesgo para el motor de la lavadora.
`;

export const getLaundryAdvice = async (items: BasketItem[], totalDryWeight: number, capacity: number): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key no configurada. No puedo dar consejos personalizados.";
  }

  if (items.length === 0) {
    return "Agrega prendas a la lavadora para recibir consejos.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Group items for a cleaner prompt
  const summary = items.reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const inventoryString = Object.entries(summary)
    .map(([name, count]) => `${count}x ${name}`)
    .join(", ");

  const prompt = `
    Mi lavadora tiene capacidad de ${capacity}kg.
    Actualmente tengo ${totalDryWeight.toFixed(1)}kg de ropa seca.
    Lista de prendas: ${inventoryString}.
    
    Dame 3 consejos específicos para este lavado (temperatura, centrifugado, separación de colores si aplica).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(),
      }
    });

    return response.text || "No se pudo generar un consejo en este momento.";
  } catch (error) {
    console.error("Error fetching Gemini advice:", error);
    return "Hubo un error conectando con el asistente inteligente.";
  }
};