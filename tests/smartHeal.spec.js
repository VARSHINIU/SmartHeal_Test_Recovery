import { test, expect } from "@playwright/test";
import { setPage, smartHeal } from "../UTILS/heal";

test.beforeEach(async ({ page }) => {
      setPage(page); 
});

test("SmartHeal test", async ({ page }) => {
      await page.waitForLoadState("load");
      await page.goto("/practice-test-login/");

      await (await smartHeal('input#user', 'username'))  
            .fill('student');
      

      await (await smartHeal('input[name=""]', 'password'))   
            .fill('Password123');
   

      await (await smartHeal("//button[@name='mit']", 'submit'))     
            .click();
  
            
      await expect(await smartHeal("h1.post", "Logged In")) 
            .toBeVisible();
      

})