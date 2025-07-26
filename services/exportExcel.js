import { dialog } from 'electron';
import ExcelJS from 'exceljs';

async function generateExcel(data) {
    let {accountStatement, statementHeader} = data;

    // Open a "Save As" dialog
    const result = await dialog.showSaveDialog({
        title: "Save Excel",
        defaultPath: `account-statement-${statementHeader.accountId}.xlsx`,
        filters: [{ name: "Excel Files", extensions: ["xlsx"] }]
    });

    if (result.canceled) return; // User canceled

    const filePath = result.filePath; // Get selected path

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('التقرير', {views: [{rightToLeft: true}]}); // Arabic sheet name

    // title row
    const titleRow = sheet.addRow([`معاملات ${statementHeader.accountName} - ${statementHeader.accountId}`])
    sheet.mergeCells('A1:F1')
    // Style the title row
    titleRow.getCell(1).font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } }; // White text, large font
    titleRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF007ACC' } }; // Blue background
    titleRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    titleRow.height = 25; // Increase row height for better appearance

    // start and end period row
    const dateRow = sheet.addRow(['بداية الفترة', statementHeader.startPeriod, '', '', 'نهاية الفترة', statementHeader.endPeriod])
    dateRow.eachCell((cell, index) =>
    {
      if(index === 1 || index === 5)
      {
        cell.font = { bold: true, size: 13, color: { argb: 'FF000000' } }; // White text, large font 
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // Blue background
      }
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    })

    // Manually add a row instead of using `sheet.columns`
    const headerRow = sheet.addRow(['كود', 'الرصيد', 'مدين', 'دائن', 'بيان', 'تاريخ']);

    // Set column widths manually (since we removed `sheet.columns`)
    const columnWidths = [10, 15, 15, 15, 30, 15];
    columnWidths.forEach((width, index) => {
        sheet.getColumn(index + 1).width = width;
    });

    // Style the header row
    headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // White text
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF333333' } }; // Dark background
        cell.alignment = { horizontal: 'center' };
    });

    // restructured rows
    // sheet.addRow()
    let rows = [["", statementHeader.startPeriodBalance, "", "", "رصيد بداية الفترة", ""]]
    for(let transaction of accountStatement)
  {
      let {transaction_id, balance, amount, state, comment, date} = transaction
      let row = [transaction_id, balance, "", "", comment, date]
      state
      ? row[2] = amount
      : row[3] = amount
      rows.push(row)
    }

    rows.forEach( row => {
      const rowSheet = sheet.addRow(row)
      rowSheet.eachCell((cell) => {
        cell.alignment = {horizontal: 'center', vertical: 'middle'};
        cell.border = {
          top: { style: 'thin'},
          bottom: { style: 'thin'},
          left: { style: 'thin'},
          right: { style: 'thin'},
        }
        if(row[3]) cell.fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC9C9' } }
        if(row[2]) cell.fill = {fgColor: {argb: 'FFCBFBF1'}, type: 'pattern', pattern: 'solid'}
      })

      
    })

    // Write to file
    await workbook.xlsx.writeFile(filePath)
}

export default generateExcel;
