import {test, expect} from "@playwright/test";
//const { test, expect } = require('@playwright/test');
test.only('session 3', async({page})=>
{

    await page.goto("https://demoblaze.com"); 
    
    //1. SIGNUP Positive Scenario
    await page.getByText('Sign up').click();
    await page.locator('#sign-username').fill('mayurj002');
    await page.locator('#sign-password').fill('Password');
    await page.getByRole('button', {getByText: 'Sign up'}).click();
    page.on("dialog", dialog => dialog.accept());

    //SIGNUP Negetive Scenario
    await page.getByText('Sign up').click();
    await page.locator('#sign-username').fill('mayurj002');
    await page.locator('#sign-password').fill('Password');
    await page.getByRole('button', {getByText: 'Sign up'}).click();
    page.on("dialog", dialog => dialog.accept());
    await page.getByRole('button', {getByText: 'Close'}).click();

    //2 User Login Negetive scenario
    await page.getByText('Log in').click();
    await page.locator('#sign-username').fill('mayurj002');
    await page.locator('#sign-password').fill('Password');
    await page.getByRole('button', {getByText: 'Log in'}).click();
    page.on("dialog", dialog => dialog.accept());
    
    //2 User Login Positive scenario
    await page.getByText('Log in').click();
    await page.locator('#sign-username').fill('mayurj002');
    await page.locator('#sign-password').fill('Password');
    await page.getByRole('button', {getByText: 'Log in'}).click();
    await expect (page.locator('#nameofuser')).toHaveText('Welcome mayurj002');

    //Verify products are displayed on the home page
    await expect(page.locator('.card-titel').toHaveCount(9));

    //verify categories are visible
    test('Verify product categories can be navigated successfully', async ({ page }) => {
        const categories = {
          'Phones': ['Samsung galaxy s6', 'Nokia lumia 1520', 'Nexus 6', 'Samsung galaxy s7', 'Iphone 6 32gb', 'Sony xperia z5', 'HTC One M9'],
          'Laptops': ['Sony vaio i5', 'Sony vaio i7', 'MacBook air', 'Dell i7 8gb', '2017 Dell 15.6 Inch', 'MacBook Pro'],
          'Monitors': ['Apple monitor 24', 'ASUS Full HD']
        };
    
        for (const [category, products] of Object.entries(categories)) {
          const categoryLink = page.locator(`a:has-text("${category}")`);
          await categoryLink.click();
          for (const product of products) {
            const productTitle = page.locator(`.card-title:has-text("${product}")`);
            await expect(productTitle).toBeVisible(); // Verify that the product title is visible
          }
        }
      });

      test('Add phones with price <= $650 to cart and validate total and success checkout', async ({ page }) => {
        // Navigate to Phones category
        const phonesCategoryLink = page.locator('a:has-text("Phones")');
        await phonesCategoryLink.click();
        await page.waitForTimeout(2000);
    
        // Find all phone elements
        const phoneElements = page.locator('.card');
        const phoneCount = await phoneElements.count();
    
        // Iterate through phone elements to find ones with price <= $650
        for (let i = 0; i < phoneCount; i++) {
          const phoneElement = phoneElements.nth(i);
          const priceText = await phoneElement.locator('h5').innerText();
          const price = parseFloat(priceText.replace('$', ''));
    
          if (price <= 650) {
            await phoneElement.locator('.card-title a').click();
            await page.locator('a:has-text("Add to cart")').click();
            await page.waitForTimeout(2000);
            // Perform back operation in the browser
            await page.goBack();
            await page.goBack();
            await page.waitForTimeout(2000);
          }
        }
        // Navigate to the cart
        const cartLink = page.locator('a:has-text("Cart")');
        await cartLink.click();
        await page.waitForTimeout(3000);
    
        // Print the title of the product in the cart
        const cartProductTitle = await page.locator('.success td:nth-child(2)').allInnerTexts();
    
        // Verify the total value in the cart
        const totalValueText = await page.locator('#totalp').innerText();
        const totalValue = parseFloat(totalValueText);
        expect(totalValue).toBe(1330); 
    
        const cartProductTitles = await page.locator('.success td:nth-child(2)').allInnerTexts();
        expect(cartProductTitles.length).toBeGreaterThan(0);
    
        // Proceed to checkout
        const placeOrderButton = page.locator('button:has-text("Place Order")');
        await placeOrderButton.click();
    
        // Fill in the required details
        await page.fill('#name', 'John Doe');
        await page.fill('#country', 'USA');
        await page.fill('#city', 'New York');
        await page.fill('#card', '1234 5678 9012 3456');
        await page.fill('#month', '12');
        await page.fill('#year', '2025');
    
        // Confirm the purchase
        const purchaseButton = page.locator('button:has-text("Purchase")');
        await purchaseButton.click();
    
        // Verify the success message
        const successMessage = await page.locator('.sweet-alert h2').innerText();
        expect(successMessage).toBe('Thank you for your purchase!');
        const orderDetails = await page.locator('.sweet-alert p').innerText();
        const expectedAmount = 'Amount: 1330 USD';
        expect(orderDetails).toContain(expectedAmount);
      });
    
      test('Add the last product to cart and validate', async ({ page }) => {
        // Navigate to a category (e.g., Phones, Laptops, Monitors)
        const categoryLink = page.locator('a:has-text("Phones")'); // Change this to the desired category
        await categoryLink.click();
    
        // Handle the alert dialog
        page.on('dialog', async dialog => {
          await dialog.accept();
        });
    
        // Find all product elements
        const productElements = page.locator('.card.h-100');
        const productCount = await productElements.count();
    
        if (productCount > 0) {
          // Navigate to the last product's detail page
          const lastProductElement = productElements.nth(productCount - 1);
          await lastProductElement.locator('.card-title a').click();
    
          // Click on "Add to cart"
          await page.locator('a:has-text("Add to cart")').click();
    
          // Wait for a short period to ensure the dialog is handled
          await page.waitForTimeout(1000);
    
          // Navigate to the cart
          const cartLink = page.locator('a:has-text("Cart")');
          await cartLink.click();
          await page.waitForTimeout(3000);
    
          // Print the titles of the products in the cart
          const cartProductTitles = await page.locator('.success td:nth-child(2)').allInnerTexts();
    
          const lastProductTitle = cartProductTitles[cartProductTitles.length - 1];
          expect(cartProductTitles).toContain(lastProductTitle);
        } else {
          console.log('No products found in the category.');
        }
      });
    
      test('Attempt to checkout without adding products', async ({ page }) => {
        // Navigate to the cart
        const cartLink = page.locator('a:has-text("Cart")');
        await cartLink.click();
        await page.waitForTimeout(3000);
    
        // Verify that the cart is empty
        const cartProductTitles = await page.locator('.success td:nth-child(2)').allInnerTexts();
        expect(cartProductTitles.length).toBe(0);
    
        // Attempt to proceed to checkout
        const placeOrderButton = page.locator('button:has-text("Place Order")');
        await placeOrderButton.click();
    
        // Verify that the checkout process is not allowed or an thank you message is displayed for empty cart checkout
        await page.fill('#name', 'John Doe');
        await page.fill('#country', 'USA');
        await page.fill('#city', 'New York');
        await page.fill('#card', '1234 5678 9012 3456');
        await page.fill('#month', '12');
        await page.fill('#year', '2025');
    
        // Confirm the purchase
        const purchaseButton = page.locator('button:has-text("Purchase")');
        await purchaseButton.click();
    
        // Verify the success message
        const successMessage = await page.locator('.sweet-alert h2').innerText();
        expect(successMessage).toBe('Thank you for your purchase!');
        const orderDetails = await page.locator('.sweet-alert p').innerText();
        const expectedCard = '1234 5678 9012 3456';
        expect(orderDetails).toContain(expectedCard);
        const expectedAmount = 'Amount: 0 USD';
        expect(orderDetails).toContain(expectedAmount);
        const okButton = page.locator('button:has-text("OK")');
        expect(await okButton.isVisible()).toBeTruthy();
        
      });
    
    });

    






    
/*
    await page.getByPlaceholder('Password').fill('admin123');
    await page.getByRole('button', {name: 'Login'}).click();

    await page.getByText('My Info').click();

    await page.locator('span').filter({hasText: 'Time'}).click();
*/
    