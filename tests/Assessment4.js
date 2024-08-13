const { test, expect } = require('@playwright/test');

const nameInput = 'John Doe';
const validemailInput = 'test@yahoo.com';
const invalidemailInput = 'testyahoo'; 
const currentAddressInput = '41, Townpark, New York, USA';
const permanentAddressInput = '61, Parklane, New Jersey, USA';

test('DEMOQA automation scenario', async ({ page }) => {
await page.goto('https://demoqa.com/'); 
await expect(page).toHaveTitle('DEMOQA');

// Starting Validation the Email field with invalid values
await page.click("(//div[@class='card mt-4 top-card'])[1]");
await page.click("//div[@class='element-list collapse show']//li[@id='item-0']");
await page.fill("//input[@id='userName']", nameInput);
await page.fill("//input[@id='userEmail']", invalidemailInput); 
await page.fill("//textarea[@id='currentAddress']", currentAddressInput);
await page.fill("//textarea[@id='permanentAddress']", permanentAddressInput);
await page.click("//button[@id='submit']");
await page.waitForTimeout(1000);

const borderColor = await page.evaluate(() => {
   const emailInput = document.querySelector("#userEmail");
    return getComputedStyle(emailInput).borderColor;
  });
  expect(borderColor).toBe('rgb(255, 0, 0)');
// Asserts that the border color of the email input field is red

// Starting Validation the Email field with valid values
  await page.fill("//input[@id='userEmail']", validemailInput);
  await page.click("//button[@id='submit']");
  await page.waitForTimeout(1000);

// Retrieve and assert the displayed name
const displayedName = await page.textContent('//p[@id="name"]');
  expect(displayedName).toContain(nameInput); 

// Retrieve and assert the displayed email
const displayedEmail = await page.textContent('//p[@id="email"]');
  expect(displayedEmail).toContain(validemailInput);

// Retrieve and assert the displayed current address
const displayedCurrentAddress = await page.textContent('//p[@id="currentAddress"]');
  expect(displayedCurrentAddress).toContain(currentAddressInput);

// Retrieve and assert the displayed permanent address
const displayedPermanentAddress = await page.textContent('//p[@id="permanentAddress"]');
  expect(displayedPermanentAddress).toContain(permanentAddressInput);
});