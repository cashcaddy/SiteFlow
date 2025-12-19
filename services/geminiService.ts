import { GoogleGenAI } from "@google/genai";

/**
 * Spark AI Service
 * Handles content generation for Spark Builder using Gemini Flash
 */
export const generateSectionContent = async (
  type: string,
  description: string
) => {
  const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY!, // ✅ FIXED
  });

  const model = "gemini-2.0-flash"; // ✅ FIXED

  const prompt = `
You are the content engine for "Spark Builder", a modern website creation tool.

Generate content for a website section of type "${type}"
based on this user request: "${description}".

Return ONLY a valid JSON object.
No markdown.
No explanations.

SCHEMA REQUIREMENTS:
1. header: { "logo": "Brand Name", "links": [{ "label": "Home", "href": "#" }] }
2. hero: { "title": "Headline", "subtitle": "Description", "cta": "Button Text", "image": "Unsplash URL" }
3. about: { "title": "Title", "text": "Detailed content" }
4. services: { "title": "Title", "items": [{ "title": "Service Name", "desc": "Details" }] }
5. pricing: { "title": "Title", "plans": [{ "name": "Plan", "price": "29", "features": ["Feature A"] }] }
6. contact: { "title": "Title", "subtitle": "Text" }
7. footer: { "copyright": "© 2025 Brand Name" }
8. custom: {
   "title": "Custom Section",
   "elements": [
     { "type": "heading|text|button|input|image", "content": "Text", "placeholder": "Optional" }
   ]
}

User Request: ${description}
`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // ✅ CORRECT RESPONSE EXTRACTION
    let text =
      response.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

    // Clean accidental markdown
    text = text.replace(/```json|```/g, "").trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Spark AI Generation Error:", error);
    return null;
  }
};
