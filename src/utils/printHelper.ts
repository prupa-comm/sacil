/**
 * Reliable Document Printing & PDF Export Helper
 * Works both in standalone browser tabs, mobile devices, and embedded sandboxed iframes.
 */
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

/**
 * Export an HTML element directly to a downloadable PDF file.
 */
export async function exportElementToPdf(
  elementId: string,
  filename: string = 'Dokumen-SACIL.pdf',
  onProgress?: (status: string) => void
): Promise<boolean> {
  const elem = document.getElementById(elementId);
  if (!elem) {
    console.error(`Element #${elementId} not found`);
    return false;
  }

  try {
    onProgress?.('Menyiapkan tata letak dokumen...');

    // Render DOM element to canvas with high resolution using html2canvas-pro (native oklch support)
    const canvas = await html2canvas(elem, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1024,
      onclone: (clonedDoc) => {
        const clonedElem = clonedDoc.getElementById(elementId);
        if (clonedElem) {
          clonedElem.style.backgroundColor = '#ffffff';
          clonedElem.style.color = '#0f172a';
        }
      }
    });

    onProgress?.('Mengonversi ke format PDF standar...');
    const imgData = canvas.toDataURL('image/png');

    // Create A4 PDF (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Subsequent pages if content overflows A4
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    onProgress?.('Mengunduh berkas...');
    pdf.save(filename);
    return true;
  } catch (err) {
    console.error('Failed to export PDF:', err);
    return false;
  }
}

/**
 * Open printable HTML element in a dedicated new tab/window for unconstrained printing.
 */
export function openInNewTabForPrint(elementId: string, title: string = 'Dokumen Kas Basket SACIL'): boolean {
  const elem = document.getElementById(elementId);
  if (!elem) return false;

  const headStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((el) => el.outerHTML)
    .join('\n');

  const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${headStyles}
  <style>
    @page { size: A4 portrait; margin: 10mm 12mm; }
    *, *::before, *::after { box-sizing: border-box; }
    body {
      background: #ffffff !important;
      color: #0f172a !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      margin: 0; padding: 16px;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .print\\:hidden, button, [role="button"] { display: none !important; }
    .print-actions {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0f172a;
      color: white;
      padding: 10px 18px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: bold;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      display: flex;
      gap: 10px;
      align-items: center;
      cursor: pointer;
      z-index: 9999;
    }
    @media print {
      .print-actions { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="print-actions" onclick="window.print()">
    <span>🖨️ Klik untuk Mencetak (Ctrl+P)</span>
  </div>
  <div class="print-container">
    ${elem.outerHTML}
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        try {
          window.print();
        } catch (e) {
          console.log('Auto print blocked, user can click the floating button');
        }
      }, 400);
    };
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const newWin = window.open(url, '_blank');
  if (!newWin) {
    // If pop-up blocker triggered, simulate link click
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => a.remove(), 1000);
  }
  return true;
}

/**
 * Standard print trigger with multi-stage fallback.
 */
export function printHtmlElement(elementId: string, title: string = 'Dokumen Kas Basket SACIL'): boolean {
  const elem = document.getElementById(elementId);
  if (!elem) {
    window.print();
    return false;
  }

  const originalTitle = document.title;
  document.title = title;

  document.querySelectorAll('.printable-document-active').forEach((el) => {
    el.classList.remove('printable-document-active');
  });
  elem.classList.add('printable-document-active');

  try {
    window.print();
  } catch (err) {
    console.warn('Direct window.print() failed, opening in new tab', err);
    openInNewTabForPrint(elementId, title);
  } finally {
    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
  }

  return true;
}
