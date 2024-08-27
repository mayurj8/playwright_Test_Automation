const { test, expect } = require('@playwright/test');
const ExcelJS = require('exceljs');

async function readAndUpdateExcelFile(filePath) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(1); // Accessing Sheet Number 1
    const row = worksheet.getRow(3); // Getting value from row 3
    const priceCell = row.getCell('B'); // Getting value from column B

    console.log(`Original Price: ${priceCell.value}`);

    // Update the price to 600
    priceCell.value = 600;
    row.commit(); // Commit the changes

    // Save the updated Excel file
    await workbook.xlsx.writeFile(filePath);

    // Reload the workbook to validate the update
    const updatedWorkbook = new ExcelJS.Workbook();
    await updatedWorkbook.xlsx.readFile(filePath);
    const updatedWorksheet = updatedWorkbook.getWorksheet(1);
    const updatedRow = updatedWorksheet.getRow(3);
    const updatedPriceCell = updatedRow.getCell('B');

    console.log(`Updated Price: ${updatedPriceCell.value}`);

    // Validate the updated price
    expect(updatedPriceCell.value).toBe(600);
}

test('should update the price in the 3rd row to 600 and validate', async () => {
    const filePath = 'C:/Users/mayurj8/Documents/playwright_Test_Automation/ExcelAssessment.xlsx';
    await readAndUpdateExcelFile(filePath);
});