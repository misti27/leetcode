import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const explainCode = async (code: string, language: string = 'javascript'): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are an expert algorithm tutor. Explain the following ${language} code clearly and concisely IN CHINESE (中文). Focus on time and space complexity and the core logic used.\n\nCode:\n${code}`,
    });
    return response.text || "暂无解释";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "分析失败，请稍后重试。";
  }
};

export const suggestImprovement = async (problemTitle: string, currentSolution: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `For the LeetCode problem "${problemTitle}", review this solution strategy/notes and suggest improvements or edge cases to consider IN CHINESE:\n\n${currentSolution}`,
    });
    return response.text || "暂无建议";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "获取建议失败。";
  }
};