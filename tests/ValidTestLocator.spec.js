import {test,expect} from "@playwright/test";

test("Valid Selector test",async({page})=>{
  await page.waitForLoadState("load");
  await page.goto("/practice-test-login/");
  
  await page.locator("input#username")
        .fill("student");

  await page.locator("//input[@id='password']")
        .fill("Password123");
  
  await page.locator("button#submit").click();
  
  await expect(page.locator("//h1[normalize-space()='Logged In Successfully']")).toBeVisible();
  
})