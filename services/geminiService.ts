
import { GoogleGenAI, Type } from "@google/genai";
import { StudentRecord } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIAnalysis = async (students: StudentRecord[]) => {
  const avgScore = students.length > 0 ? students.reduce((acc, s) => acc + s.score, 0) / students.length : 0;
  
  const prompt = `
    Saya adalah guru kelas 6 SD. Berikut adalah data hasil tes pemahaman bacaan siswa saya:
    ${students.map(s => `- ${s.name}: Nilai ${s.score} (${s.level})`).join('\n')}
    
    Rata-rata kelas: ${avgScore.toFixed(2)}.
    
    Mohon buatkan analisis profesional sebagai pakar pendidikan:
    1. Ringkasan singkat kondisi kelas (1-2 paragraf).
    2. Strategi pengajaran yang paling efektif diterapkan untuk keberagaman nilai ini.
    3. 3 Aktivitas spesifik di kelas yang bisa membantu siswa di semua tingkatan.
    
    Berikan respon dalam format JSON yang rapi.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            detailedStrategy: { type: Type.STRING },
            suggestedActivities: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["summary", "detailedStrategy", "suggestedActivities"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
