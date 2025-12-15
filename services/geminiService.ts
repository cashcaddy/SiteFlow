
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateSectionContent = async (type: string, description: string) => {
  const model = 'gemini-2.5-flash';
  
  const prompt = `Generate content for a website section of type "${type}" based on this description: "${description}". 
  Provide the result in a clean JSON format compatible with a generic content object. 
  Example for hero: { "title": "...", "subtitle": "...", "cta": "..." }
  Example for about: { "title": "...", "text": "..." }
  Example for services: { "title": "Our Services", "items": [{ "title": "...", "desc": "..." }] }
  Only return the JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Generation failed:", error);
    return null;
  }
};
