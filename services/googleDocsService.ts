
export const createStudentReportDoc = async (
  accessToken: string,
  studentName: string,
  studentClass: string,
  period: string,
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
    fullText += `LiteraTrack - Evaluasi Capaian Level Siswa\n\n`;
    
    fullText += `IDENTITAS SISWA\n`;
    fullText += `Nama Siswa      : ${studentName}\n`;
    fullText += `Kelas           : ${studentClass}\n`;
    fullText += `Periode Penilaian: ${period}\n`;
    fullText += `----------------------------------------------------\n\n`;
    
    fullText += `CAPAIAN LEVEL SAAT INI: ${latest.level.toUpperCase()}\n`;
    fullText += `Skor Terakhir: ${latest.score}\n\n`;
    
    fullText += `MATRIKS REKOMENDASI TINDAK LANJUT\n`;
    fullText += `====================================================\n\n`;
    
    fullText += `1. KARAKTERISTIK KEMAMPUAN:\n`;
    recommendation.characteristics.forEach(c => fullText += `- ${c}\n`);
    fullText += `\n`;
    
    fullText += `2. STRATEGI TINDAK LANJUT (FOLLOW-UP):\n`;
    fullText += `${recommendation.followUp}\n\n`;
    
    fullText += `3. MATERI BACAAN YANG DISARANKAN:\n`;
    recommendation.readingMaterials.forEach(m => fullText += `- ${m}\n`);
    
    fullText += `\n====================================================\n`;
    fullText += `Laporan ini dihasilkan secara otomatis berdasarkan data capaian literasi siswa.\n`;
    fullText += `Dicetak pada: ${new Date().toLocaleString('id-ID')}\n`;

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
