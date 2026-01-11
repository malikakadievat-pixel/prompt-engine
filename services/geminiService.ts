import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, PromptMode } from '../types';

const getSystemInstruction = (mode: PromptMode) => `
You are a World-Class Senior Prompt Engineer and AI Architect. Your goal is to take a raw, often vague user input and transform it into highly effective, structured prompts for LLMs.

Context: The user wants to generate the "best prompt" for a specific task.
Current Mode: ${mode}

You must output a JSON object containing:
1. A score (0-100) of their original input.
2. A critique of what was missing (context, constraints, persona, etc.).
3. Three (3) specific suggestions for improvement.
4. Three (3) distinct, fully optimized prompt variations using different engineering frameworks (e.g., CO-STAR, Persona-Based, Chain-of-Thought, Socratic).

The schema MUST be followed exactly.
`;

export const generatePrompts = async (originalInput: string, mode: PromptMode): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not defined in the environment.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User Input: "${originalInput}"\n\nPlease analyze and optimize this prompt according to your system instructions.`,
      config: {
        systemInstruction: getSystemInstruction(mode),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            originalScore: { type: Type.INTEGER, description: "Score from 0 to 100 representing quality of user input" },
            critique: { type: Type.STRING, description: "Honest critique of the original input" },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3 short bullet points on how to improve"
            },
            variations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Name of the prompt strategy (e.g. 'The CO-STAR Framework')" },
                  method: { type: Type.STRING, description: "Brief description of the methodology used" },
                  content: { type: Type.STRING, description: "The full, optimized prompt text ready to be copied" },
                  explanation: { type: Type.STRING, description: "Why this version works better" }
                },
                required: ["title", "method", "content", "explanation"]
              }
            }
          },
          required: ["originalScore", "critique", "suggestions", "variations"]
        }
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response text received from Gemini.");
    }
    
    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};