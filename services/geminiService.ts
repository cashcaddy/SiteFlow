
import { GoogleGenAI } from "@google/genai";

/**
 * Gemini Service
 * Handles content generation for various website sections using the Google GenAI SDK.
 */

export const generateSectionContent = async (type: string, description: string) => {
  // Always initialize inside the function or use a getter to ensure the most recent API Key is used
  const ai = new GoogleGenAI({ apiKey: AIzaSyC3OB7k1RGTHLj6v_DrBA5MtriWqYI9Y2Y });
  const model = 'gemini-2.5-flash';
  
  const prompt = `Generate content for a website section of type "${type}" based on this user request: "${description}". 
  Provide the result in a clean JSON format compatible with the following schemas.
  
  Rules:
  1. ONLY return the JSON object. Do not include markdown code blocks like \`\`\`json.
  2. If type is "hero": { "title": "...", "subtitle": "...", "cta": "Button Text", "image": "Unsplash URL" }
  3. If type is "about": { "title": "...", "text": "..." }
  4. If type is "services": { "title": "...", "items": [{ "title": "...", "desc": "..." }] }
  5. If type is "pricing": { "title": "...", "plans": [{ "name": "...", "price": "...", "features": ["...", "..."] }] }
  6. If type is "contact": { "title": "...", "subtitle": "..." }
  
  Section Type: ${type}
  Description: ${description}`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    
    // Access response.text directly (property access, not a method call)
    let text = response.text || '{}';
    
    // Robust cleaning: Gemini sometimes wraps JSON in markdown blocks even when told not to.
    if (text.includes('```')) {
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini AI Content Generation failed:", error);
    // Return a default object if parsing or API fails so the app doesn't crash
    return null;
  }
};
