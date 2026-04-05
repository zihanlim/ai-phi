import { test, expect } from "@playwright/test";

test.describe("Dialogue Page", () => {
  test("should load and display philosopher selector", async ({ page }) => {
    await page.goto("/dialogue", { waitUntil: "networkidle" });
    await expect(page.locator("text=Choose Your Thinker")).toBeVisible();
  });

  test("should display philosopher cards", async ({ page }) => {
    await page.goto("/dialogue", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Socrates", { timeout: 10000 });
    await expect(page.locator("text=Socrates")).toBeVisible();
  });

  test("should select a philosopher and show chat interface", async ({ page }) => {
    await page.goto("/dialogue", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Socrates", { timeout: 10000 });

    // Click on Socrates button - use aria-label which is more specific
    await page.locator('button[aria-label*="Socrates"]').click();

    // Should show the chat interface
    await expect(page.locator("text=Active")).toBeVisible();
    await expect(page.locator("textarea")).toBeVisible();
  });

  test("should have suggested questions in empty chat", async ({ page }) => {
    await page.goto("/dialogue?philosopher=socrates", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Active", { timeout: 10000 });

    // Should show suggested questions
    await expect(page.locator("text=What is the nature of reality?")).toBeVisible();
    await expect(page.locator("text=How should we live a good life?")).toBeVisible();
  });

  test("should send a message and see it in chat", async ({ page }) => {
    await page.goto("/dialogue?philosopher=socrates", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Active", { timeout: 10000 });

    // Type a message
    await page.fill("textarea", "What is virtue?");

    // Submit via button click
    await page.locator("button[type='submit']").click();

    // Should show user message in the chat area
    await expect(page.locator("text=What is virtue?")).toBeVisible();
  });

  test("should navigate to debate from dialogue", async ({ page }) => {
    await page.goto("/dialogue?philosopher=socrates", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Active", { timeout: 10000 });

    // Click Add to Debate button
    await page.locator("text=+ Debate").click();

    // Should navigate to debate page with philosopher pre-selected
    await expect(page).toHaveURL(/\/debate\?philosopher=socrates/);
  });

  test("Escape key should go back to philosopher selector", async ({ page }) => {
    await page.goto("/dialogue?philosopher=socrates", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Active", { timeout: 10000 });

    await page.keyboard.press("Escape");

    // Should show philosopher selector again
    await expect(page.locator("text=Choose Your Thinker")).toBeVisible();
  });
});
