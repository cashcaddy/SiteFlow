// Correct
import { GoogleGenerativeAI } from "@google/generative-ai";

// Incorrect (Common mistake)
import { GoogleGenAI } from "@google/genai";

/**
 * Gemini Service
 * Generates structured JSON for website sections.
 */
export const generateSectionContent = async (type: string, description: string) => {
  // Initialize with your API Key
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyC3OB7k1RGTHLj6v_DrBA5MtriWqYI9Y2Y');
  
  // Use 'gemini-1.5-flash' for speed and cost-efficiency
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const prompt = `
    Generate content for a website section of type "${type}" based on this request: "${description}".
    Return a JSON object matching the schema for "${type}".
    
    Context:
    - hero: { title, subtitle, cta, image }
    - about: { title, text }
    - services: { title, items: [{ title, desc }] }
    - pricing: { title, plans: [{ name, price, features: [] }] }
    - contact: { title, subtitle }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini AI Content Generation failed:", error);
    return null;
  }
};
