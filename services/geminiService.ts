
import { StudentRecord } from "../types";

export const getAIAnalysis = async (students: StudentRecord[]) => {
  const avgScore = students.length > 0 ? students.reduce((acc, s) => acc + s.score, 0) / students.length : 0;
  
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ students, avgScore }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch analysis");
    }

    return await response.json();
  } catch (error) {
    console.error("Analysis Error:", error);
    return null;
  }
};
