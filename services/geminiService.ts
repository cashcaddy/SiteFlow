
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client using the required object parameter and process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'AIzaSyCukdxpoGEuP6lv13_YGm7APqacWvxZ7EI' });

export const generateSectionContent = async (type: string, description: string) => {
  // Use gemini-2.5-flash for summarization and content generation tasks
  const model = 'gemini-2.5-flash';
  
  const prompt = `Generate content for a website section of type "${type}" based on this user request: "${description}". 
  Provide the result in a clean JSON format compatible with the following schemas.
  
  Rules:
  1. Only return the JSON. No preamble or code blocks.
  2. If type is "hero": { "title": "Catchy headline", "subtitle": "Supporting text", "cta": "Button text", "image": "High quality Unsplash URL" }
  3. If type is "about": { "title": "About Us Title", "text": "A few paragraphs of compelling story" }
  4. If type is "services": { "title": "Section Title", "items": [{ "title": "Service Name", "desc": "Service Description" }] }
  5. If type is "pricing": { "title": "Pricing Title", "plans": [{ "name": "Plan Name", "price": "Numerical price", "features": ["Feature 1", "Feature 2"] }] }
  6. If type is "contact": { "title": "Contact Title", "subtitle": "Contact invitation text" }
  
  The description is: "${description}"`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    
    const text = response.text;
    // Clean up response if needed (Gemini sometimes adds markdown blocks despite instructions)
    const cleanedJson = text?.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedJson || '{}');
  } catch (error) {
    console.error("AI Generation failed:", error);
    return null;
  }
};
