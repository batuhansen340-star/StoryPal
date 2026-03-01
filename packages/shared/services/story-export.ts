import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

interface ExportPage {
  text: string;
  imageUrl?: string;
}

function buildHTML(title: string, pages: ExportPage[], coverUrl?: string): string {
  const coverSection = coverUrl
    ? `<div class="cover">
        <img src="${coverUrl}" alt="Cover" />
        <h1>${escapeHtml(title)}</h1>
      </div>`
    : `<div class="cover text-only">
        <h1>${escapeHtml(title)}</h1>
      </div>`;

  const pagesSections = pages.map((p, i) => {
    const imgTag = p.imageUrl
      ? `<img src="${p.imageUrl}" alt="Page ${i + 1}" />`
      : '';
    return `<div class="page">
      ${imgTag}
      <p>${escapeHtml(p.text)}</p>
      <span class="page-num">${i + 1}</span>
    </div>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @page { margin: 0; size: A4; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Georgia', serif; color: #2D2D2D; }
  .cover {
    page-break-after: always;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #FFF8F0, #FFE8E8);
    padding: 40px;
    text-align: center;
  }
  .cover img {
    width: 70%;
    max-height: 60vh;
    object-fit: contain;
    border-radius: 16px;
    margin-bottom: 32px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }
  .cover h1 {
    font-size: 36px;
    font-weight: 900;
    color: #FF6B6B;
    line-height: 1.3;
  }
  .cover.text-only { justify-content: center; }
  .page {
    page-break-after: always;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    background: #FFFFFF;
    position: relative;
  }
  .page img {
    width: 80%;
    max-height: 55vh;
    object-fit: contain;
    border-radius: 12px;
    margin-bottom: 24px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  }
  .page p {
    font-size: 22px;
    line-height: 1.6;
    text-align: center;
    max-width: 600px;
    color: #2D2D2D;
  }
  .page-num {
    position: absolute;
    bottom: 20px;
    right: 30px;
    font-size: 14px;
    color: #999;
    font-weight: 600;
  }
</style>
</head>
<body>
${coverSection}
${pagesSections}
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function exportStoryAsPDF(params: {
  title: string;
  pages: ExportPage[];
  coverUrl?: string;
}): Promise<string> {
  const html = buildHTML(params.title, params.pages, params.coverUrl);

  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  return uri;
}

export async function shareStoryPDF(params: {
  title: string;
  pages: ExportPage[];
  coverUrl?: string;
}): Promise<void> {
  const uri = await exportStoryAsPDF(params);

  if (Platform.OS === 'web') {
    // On web, trigger download
    const link = document.createElement('a');
    link.href = uri;
    link.download = `${params.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    link.click();
    return;
  }

  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) {
    throw new Error('Sharing is not available on this device');
  }

  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    dialogTitle: `Share "${params.title}"`,
    UTI: 'com.adobe.pdf',
  });
}
