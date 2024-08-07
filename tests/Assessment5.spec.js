import {test, expect} from "@playwright/test"

test.only('session 3', async({page})=>
{

    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");  
    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin123');
    await page.getByRole('button', {name: 'Login'}).click();

    await page.getByText('My Info').click();

    await page.locator('span').filter({hasText: 'Time'}).click();

    })