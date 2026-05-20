
export const createStudentReportDoc = async (
  accessToken: string,
  studentName: string,
  studentClass: string,
  period: string,
  matrixData: {
    readingFluency: string;
    readingAccuracy: string;
    literalComprehension: string;
    hotsInference: string;
    vocabulary: string;
  },
  history: { date: string; score: number; level: string }[],
  recommendation: { characteristics: string[]; followUp: string; readingMaterials: string[] }
) => {
  try {
    // 1. Create the document
    const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: `Laporan Literasi - ${studentName} - ${studentClass} - ${period}`
      })
    });

    if (!createRes.ok) {
      const errorData = await createRes.json();
      throw new Error(`Failed to create document: ${JSON.stringify(errorData)}`);
    }

    const { documentId } = await createRes.json();

    // 2. Build the content
    const latest = history[history.length - 1];
    const dateStr = new Date().toLocaleDateString('id-ID');
    
    // Build one big string and insert it once
    let fullText = `MATRIKS REKOMENDASI TINDAK LANJUT LITERASI\n`;
    fullText += `LiteraTrack Kelas 6 - Evaluasi Capaian Siswa\n\n`;
    
    fullText += `IDENTITAS SISWA\n`;
    fullText += `Nama Siswa       : ${studentName}\n`;
    fullText += `Kelas            : ${studentClass}\n`;
    fullText += `Periode Penilaian: ${period}\n`;
    fullText += `Tanggal Laporan  : ${dateStr}\n`;
    fullText += `----------------------------------------------------\n\n`;
    
    fullText += `STATUS CAPAIAN LEVEL: ${latest.level.toUpperCase()}\n`;
    fullText += `Skor Literasi Terakhir: ${latest.score}\n\n`;
    
    fullText += `PROGRESS PERKEMBANGAN (Riwayat Skor Literasi)\n`;
    fullText += `----------------------------------------------------\n`;
    history.forEach((h) => {
      const bar = '█'.repeat(Math.floor(h.score / 4)); // Progress bar visualization
      fullText += `${h.date.padEnd(12)} | Skor: ${h.score.toString().padEnd(3)} | ${bar}\n`;
    });
    fullText += `\n`;
    
    fullText += `MATRIKS EVALUASI & ANALISIS CAPAIAN\n`;
    fullText += `----------------------------------------------------\n`;
    
    fullText += `1. KELANCARAN MEMBACA:\n`;
    fullText += `${matrixData.readingFluency || '-'}\n\n`;
    
    fullText += `2. AKURASI MEMBACA:\n`;
    fullText += `${matrixData.readingAccuracy || '-'}\n\n`;
    
    fullText += `3. PEMAHAMAN LITERAL:\n`;
    fullText += `${matrixData.literalComprehension || '-'}\n\n`;
    
    fullText += `4. PEMAHAMAN HOTS/INFERENSIAL:\n`;
    fullText += `${matrixData.hotsInference || '-'}\n\n`;
    
    fullText += `5. KOSA KATA:\n`;
    fullText += `${matrixData.vocabulary || '-'}\n\n`;
    
    fullText += `MATRIKS REKOMENDASI TINDAK LANJUT\n`;
    fullText += `====================================================\n\n`;
    
    fullText += `STRATEGI PEMBELAJARAN KHUSUS:\n`;
    fullText += `${recommendation.followUp}\n\n`;
    
    fullText += `MATERI BACAAN YANG DISARANKAN:\n`;
    recommendation.readingMaterials.forEach(m => fullText += `- ${m}\n`);
    
    fullText += `\n====================================================\n`;
    fullText += `Dihasilkan secara otomatis oleh LiteraTrack.\n`;
    fullText += `Copyright © ${new Date().getFullYear()}\n`;

    const finalRequests = [
      {
        insertText: {
          location: { index: 1 },
          text: fullText
        }
      }
    ];

    const updateRes = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: finalRequests
      })
    });

    if (!updateRes.ok) {
      throw new Error('Failed to update document content');
    }

    return `https://docs.google.com/document/d/${documentId}/edit`;
  } catch (error) {
    console.error('Error generating Google Doc:', error);
    throw error;
  }
};
