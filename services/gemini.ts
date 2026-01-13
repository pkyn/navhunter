import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, NavigationLink, GroundingSource } from "../types";

const parseJsonResponse = (text: string): { links: NavigationLink[], summary: string, scriptsAndStylesheets: string[] } => {
  // Guard clause: If the text doesn't contain a JSON object start, treat it as a plain text summary/error
  if (!text.includes('{')) {
    return {
      links: [],
      summary: text.trim(),
      scriptsAndStylesheets: []
    };
  }

  try {
    let parsed: any;
    // 1. Attempt to extract from Markdown code blocks
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      parsed = JSON.parse(jsonMatch[1]);
    } else {
      // 2. Attempt to find the outermost JSON object if mixed with text
      const firstOpen = text.indexOf('{');
      const lastClose = text.lastIndexOf('}');
      if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
         const potentialJson = text.substring(firstOpen, lastClose + 1);
         parsed = JSON.parse(potentialJson);
      } else {
         // 3. Attempt direct parse
         parsed = JSON.parse(text);
      }
    }

    return {
      links: Array.isArray(parsed.links) ? parsed.links : [],
      summary: typeof parsed.summary === 'string' ? parsed.summary : "Analysis parsed.",
      scriptsAndStylesheets: Array.isArray(parsed.scriptsAndStylesheets) ? parsed.scriptsAndStylesheets : []
    };

  } catch (e) {
    console.warn("Gemini response was not valid JSON. Falling back to raw text summary.", e);
    // Fallback: Return empty structure with the raw text as the summary
    return {
      links: [],
      summary: text,
      scriptsAndStylesheets: []
    };
  }
};

export const analyzeWebsiteNav = async (url: string): Promise<AnalysisResult> => {	
  const apiKey = "fasfsafioh4124125nklga$%@!%$@!"; // process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

  // Improved prompt to strictly enforce JSON and handle refusals gracefully
  const prompt = `
    I need to analyze the navigation structure and external assets of this website: ${url}
    
    Task:
    1. Use Google Search to find the main navigation menu items (header/footer).
    2. Identify and list any external CSS files, CDN links (e.g., Tailwind, Bootstrap, Fonts), or JavaScript libraries (e.g., React, jQuery) that are likely used by this site.
    3. Output the result strictly as a JSON object.

    JSON Schema:
    {
      "summary": "A brief 1-sentence summary of the site's primary purpose based on its navigation.",
      "links": [
        { "name": "Link Text", "url": "https://target-url.com", "type": "internal", "description": "Optional details" },
        { "name": "Link Text", "url": "https://external.com", "type": "third-party" }
      ],
      "scriptsAndStylesheets": [
        "https://cdn.tailwindcss.com",
        "https://fonts.googleapis.com/css?family=Roboto",
        "https://code.jquery.com/jquery-3.6.0.min.js"
      ]
    }

    Constraints:
    - Output valid JSON only.
    - If you cannot access the website, find no links, or encounter a safety restriction, return the JSON structure with an empty "links" array ([]) and explain the reason in the "summary".
    - Do NOT start with "I am sorry" or "Here is the JSON". Return ONLY the JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0, // Zero temperature for deterministic JSON output
      },
    });

    const text = response.text || "";
    const parsedData = parseJsonResponse(text);
    
    // Extract grounding chunks for attribution
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const groundingSources: GroundingSource[] = groundingChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title)
      .map((web: any) => ({
        title: web.title,
        uri: web.uri
      }));

    const uniqueSources = Array.from(new Map(groundingSources.map(s => [s.uri, s])).values());

    return {
      links: parsedData.links || [],
      summary: parsedData.summary || "No summary available.",
      groundingSources: uniqueSources,
      scriptsAndStylesheets: parsedData.scriptsAndStylesheets || []
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};