import { dialog } from 'electron'
import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'node:path'
import { fileURLToPath } from 'url';
import PDFTable from '../utils/PDFTable.js';

async function generatePDF(data) {
    // Open a "Save As" dialog
    const result = await dialog.showSaveDialog({
        title: "Save PDF",
        defaultPath: "export.pdf",
        filters: [{ name: "PDF Files", extensions: ["pdf"] }]
    });

    if (result.canceled) return; // User canceled
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const fontPath = path.resolve(__dirname, 'font', 'Amiri-Regular.ttf')
    let doc = new PDFDocument({ margin: 30, size: 'A4'});
    const stream = fs.createWriteStream(result.filePath);
    doc.pipe(stream);
    
    doc.font(fontPath)
    // Add Title

    doc.fontSize(20).text("تقرير معاملات", { align: "center" , features: ['rtla']});
   
    const headers = ['كود', 'الرصيد', 'مدين', 'دائن', 'بيان', 'تاريخ'];
    const rows = [
        ['001', '1000$', '500$', '500$', 'فاتورة رقم 1', '2025-03-19'],
        ['002', '2000$', '1000$', '1000$', 'فاتورة رقم 2 طويلة جدًا وستلتف إلى سطر جديد إذا لم يكن هناك مساحة كافية', '2025-03-18'],
        ['003', '3000$', '1500$', '1500$', 'فاتورة رقم 3', '2025-03-17'],
    ];

    const table = new PDFTable(doc, 50, 100, [60, 80, 80, 80, 180, 80]);
    table.drawTable(headers, rows);

    doc.moveDown();
    doc.end();
}

export default generatePDF