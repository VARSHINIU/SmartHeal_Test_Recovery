# SmartHeal - Self Healing Selectors for Playwright

SmartHeal is a custom self-healing utility built for Playwright that helps automation tests continue running even when XPath or CSS selectors become invalid due to UI changes.

Instead of failing immediately, SmartHeal intelligently scans the DOM and identifies the best matching element using fallback strategies like:
- Tag name matching
- Visible text matching
- ID similarity
- Class similarity

---

# Features

- Supports XPath and CSS selectors
- Automatic fallback locator recovery
- Reduces flaky test failures
- Improves automation stability
- Lightweight and reusable utility
- Easy integration with Playwright projects

---

# Installation

Install Playwright:

```bash
npm init playwright@latest
```

---

# Usage

## Import Utility

```javascript
import { setPage, smartHeal } from "../UTILS/heal";
```

---

## Set Page Instance

```javascript
test.beforeEach(async ({ page }) => {
    setPage(page);
});
```

---

# smartHeal Syntax

```javascript
await smartHeal(selector, clueText);
```

Example:

```javascript
await (await smartHeal(
    'input#user',
    'username'
)).fill('student');
```

---

# Example Test

```javascript
import { test, expect } from "@playwright/test";
import { setPage, smartHeal } from "../UTILS/heal";

test.beforeEach(async ({ page }) => {
    setPage(page);
});

test("SmartHeal test", async ({ page }) => {

    await page.goto("/practice-test-login/");

    await (await smartHeal(
        'input#user',
        'username'
    )).fill('student');

    await (await smartHeal(
        'input[name=""]',
        'password'
    )).fill('Password123');

    await (await smartHeal(
        "//button[@name='mit']",
        'submit'
    )).click();

    await page.waitForURL(
        "**/logged-in-successfully/"
    );

    await expect(
        await smartHeal(
            "h1.post",
            "Logged In"
        )
    ).toBeVisible();
});
```

---

# How SmartHeal Works

1. Checks whether the selector is XPath or CSS
2. Attempts the original selector first
3. If failed, extracts the HTML tag
4. Scans the DOM for matching elements
5. Scores elements using:
   - Text similarity
   - ID similarity
   - Class similarity
6. Selects the best matching element automatically

---

# Example Logs

```bash
[smartHeal] CSS failed. Trying fallback <input>
[smartHeal] Fallback by ID: #username
```

---

# Benefits

- Reduces locator maintenance
- Handles dynamic UI changes
- Improves framework reliability
- Prevents unnecessary test failures

---

# Built With

- Playwright
- JavaScript
- Node.js

---

##  Author

**Varshini UmaShankar**
> Built with passion for making Cypress tests smarter and more resilient.<br>
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/u-varshini)<br>
[![Demo](https://img.shields.io/badge/Demo-View%20Site-green?style=for-the-badge&logo=google)](https://sites.google.com/view/smartelementdetect-varshini/self-healing-selectors/)

---

##  License

MIT License — free to use, modify, and distribute.

---
