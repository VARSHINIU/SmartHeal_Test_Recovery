import {test,expect} from "@playwright/test";

test("InValid Selector test",async({page})=>{
  await page.goto("/practice-test-login/");
  
  await page.locator("input#user")   // Wrong Id value
        .fill("student");

  await page.locator('input[name=""]')   //no password value is specified
        .fill("Password123");
  
  await page.locator("//button[@name='mit']")   //There is no attrbute named "name"
        .click();

  await expect(page.locator("h1.post")).toBeVisible();  // wrong class value
  
})