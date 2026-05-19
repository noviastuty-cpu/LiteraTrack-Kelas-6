
export const createStudentReportDoc = async (
  accessToken: string,
  studentName: string,
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
        title: `Laporan Literasi - ${studentName}`
      })
    });

    if (!createRes.ok) {
      const errorData = await createRes.json();
      throw new Error(`Failed to create document: ${JSON.stringify(errorData)}`);
    }

    const { documentId } = await createRes.json();

    // 2. Build the content requests
    const latest = history[history.length - 1];
    const dateStr = new Date().toLocaleDateString('id-ID');
    
    const requests = [
      {
        insertText: {
          location: { index: 1 },
          text: `LAPORAN PERKEMBANGAN LITERASI - LITERA TRACK KELAS 6\n\n`
        }
      },
      {
        updateParagraphStyle: {
          range: { startIndex: 1, endIndex: 53 },
          paragraphStyle: { namedStyleType: 'HEADING_1', alignment: 'CENTER' },
          fields: 'namedStyleType,alignment'
        }
      },
      {
        insertText: {
          location: { index: 53 },
          text: `Nama Siswa: ${studentName}\nTanggal Laporan: ${dateStr}\n\n`
        }
      },
      {
        insertText: {
          location: { index: 53 + studentName.length + dateStr.length + 32 },
          text: `STATUS TERKINI\nSkor Terakhir: ${latest.score}\nLevel Kemampuan: ${latest.level.toUpperCase()}\n\n`
        }
      },
      {
        insertText: {
          location: { index: 53 + studentName.length + dateStr.length + 32 + 50 }, // Approximation, we should ideally track index accurately
          text: `RIWAYAT PERKEMBANGAN (3 Tes Terakhir)\n`
        }
      }
    ];

    // To be more precise, we should append text at the end
    // Let's use a simpler approach: build one big string and insert it once, then apply formatting if needed
    // But Docs API index-based updates are tricky with dynamic text.
    
    // Alternative: Just use a single insertText at index 1 for the whole content
    let fullText = `LAPORAN PERKEMBANGAN LITERASI - LITERA TRACK KELAS 6\n`;
    fullText += `Nama Siswa: ${studentName}\n`;
    fullText += `Tanggal Laporan: ${dateStr}\n`;
    fullText += `----------------------------------------------------\n\n`;
    
    fullText += `STATUS TERKINI\n`;
    fullText += `Skor Terakhir: ${latest.score}\n`;
    fullText += `Level Kemampuan: ${latest.level.toUpperCase()}\n\n`;
    
    fullText += `RIWAYAT PERKEMBANGAN\n`;
    history.forEach((h, i) => {
      const bar = '█'.repeat(Math.floor(h.score / 2));
      fullText += `${h.date}: ${h.score} ${bar}\n`;
    });
    fullText += `\n`;
    
    fullText += `ANALISIS & REKOMENDASI TINDAK LANJUT\n`;
    fullText += `Karakteristik Siswa:\n`;
    recommendation.characteristics.forEach(c => fullText += `- ${c}\n`);
    fullText += `\n`;
    
    fullText += `Rekomendasi Tindak Lanjut:\n`;
    fullText += `${recommendation.followUp}\n\n`;
    
    fullText += `Materi Bacaan Yang Disarankan:\n`;
    recommendation.readingMaterials.forEach(m => fullText += `- ${m}\n`);
    
    fullText += `\n----------------------------------------------------\n`;
    fullText += `Dihasilkan oleh LiteraTrack Kelas 6 pada ${new Date().toLocaleString('id-ID')}\n`;

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
