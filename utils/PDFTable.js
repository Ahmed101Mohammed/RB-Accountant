import PDFDocument from 'pdfkit'
import fs from 'fs'

export class PDFTable {
    constructor(doc, startX, startY, columnWidths) {
        this.doc = doc;
        this.startX = startX;
        this.startY = startY;
        this.columnWidths = columnWidths;
        this.rowHeight = 25; // Adjust row height
        this.currentY = startY;
    }

    drawTable(headers, rows) {
        // Draw table header
        this.doc.fontSize(12).fillColor('white');
        this.doc.rect(this.startX, this.currentY, this.getTotalWidth(), this.rowHeight).fill('#333'); // Dark background
        this.drawRow(headers, true); // Header row
        this.doc.fillColor('black'); // Reset text color

        // Draw table body
        this.doc.fontSize(11);
        rows.forEach((row, rowIndex) => {
            this.currentY += this.rowHeight; // Move to next row

            if (this.currentY + this.rowHeight > this.doc.page.height - 50) {
                this.doc.addPage(); // Add new page if overflow
                this.currentY = this.startY + this.rowHeight; // Reset Y position
                this.drawRow(headers, true); // Redraw header on new page
            }

            this.drawRow(row, false, rowIndex);
        });

        // Draw table border at the bottom
        this.doc.moveTo(this.startX, this.currentY + this.rowHeight).lineTo(this.startX + this.getTotalWidth(), this.currentY + this.rowHeight).stroke();
    }

    drawRow(rowData, isHeader = false, rowIndex = 0) {
        let x = this.startX;
        rowData.forEach((cell, colIndex) => {
            const width = this.columnWidths[colIndex];

            // Draw column border
            this.doc.moveTo(x, this.currentY).lineTo(x, this.currentY + this.rowHeight).stroke();

            // Draw text with wrapping
            this.doc.text(cell, x + 5, this.currentY + 7, {
                width: width - 10,
                align: 'center',
                features: ['rtla']
            });

            x += width;
        });

        // Close the rightmost border
        this.doc.moveTo(x, this.currentY).lineTo(x, this.currentY + this.rowHeight).stroke();

        // Draw row separation line (except header)
        if (!isHeader) {
            this.doc.moveTo(this.startX, this.currentY + this.rowHeight).lineTo(this.startX + this.getTotalWidth(), this.currentY + this.rowHeight).stroke();
        }
    }

    getTotalWidth() {
        return this.columnWidths.reduce((sum, width) => sum + width, 0);
    }
}