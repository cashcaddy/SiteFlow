
import { GoogleGenAI } from "@google/genai";

/**
 * Spark AI Service
 * Handles content generation for Spark Builder using Gemini 3 Flash.
 */

export const generateSectionContent = async (type: string, description: string) => {
  // Use process.env.API_KEY directly as required
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
  const prompt = `You are the content engine for "Spark Builder", a modern website creation tool.
  Generate content for a website section of type "${type}" based on this user request: "${description}". 
  
  Return ONLY a valid JSON object. No markdown formatting, no preamble.
  
  SCHEMA REQUIREMENTS:
  1. If type is "header": { "logo": "Brand Name", "links": [{ "label": "Home", "href": "#" }] }
  2. If type is "hero": { "title": "Headline", "subtitle": "Description", "cta": "Button Text", "image": "Unsplash URL" }
  3. If type is "about": { "title": "Title", "text": "Detailed content" }
  4. If type is "services": { "title": "Title", "items": [{ "title": "Service Name", "desc": "Details" }] }
  5. If type is "pricing": { "title": "Title", "plans": [{ "name": "Plan", "price": "29", "features": ["Feature A", "Feature B"] }] }
  6. If type is "contact": { "title": "Title", "subtitle": "Text" }
  7. If type is "footer": { "copyright": "© 2024 Brand Name" }
  8. If type is "custom": { "title": "Custom Section", "elements": [{ "type": "heading|text|button|input|image", "content": "Actual content for element", "placeholder": "Optional for input" }] }

  User Request: ${description}`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    
    // Use .text property access directly
    let text = response.text || '{}';
    
    // Remove potential markdown noise
    if (text.includes('```')) {
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Spark AI Generation Error:", error);
    return null;
  }
};
