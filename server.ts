import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini API Proxy
  app.post("/api/analyze", async (req, res) => {
    try {
      const { students, avgScore } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key not configured" });
      }

      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `
        Saya adalah guru kelas 6 SD. Berikut adalah data hasil tes pemahaman bacaan siswa saya:
        ${students.map((s: any) => `- ${s.name}: Nilai ${s.score} (${s.level})`).join('\n')}
        
        Rata-rata kelas: ${avgScore.toFixed(2)}.
        
        Mohon buatkan analisis profesional sebagai pakar pendidikan:
        1. Ringkasan singkat kondisi kelas (1-2 paragraf).
        2. Strategi pengajaran yang paling efektif diterapkan untuk keberagaman nilai ini.
        3. 3 Aktivitas spesifik di kelas yang bisa membantu siswa di semua tingkatan.
        
        Berikan respon dalam format JSON yang rapi.
      `;

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

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
