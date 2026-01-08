
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMorseExplanation = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explique brevemente o significado ou o contexto histórico desta frase/palavra em Português e como ela soaria em código Morse: "${text}". Seja conciso e educativo.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 250,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao consultar Gemini:", error);
    return "Não foi possível obter uma explicação agora.";
  }
};
