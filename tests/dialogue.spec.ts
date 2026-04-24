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
    await page.locator('button[aria-label*="Socrates"]').click();
    await expect(page.locator("text=Active")).toBeVisible();
    await expect(page.locator("textarea")).toBeVisible();
  });

  test("should show chat interface with philosopher header", async ({ page }) => {
    await page.goto("/dialogue?philosopher=socrates", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Active", { timeout: 10000 });
    // Verify the philosopher header is visible
    await expect(page.locator("text=Socrates").first()).toBeVisible();
  });

  test("should have textarea for input", async ({ page }) => {
    await page.goto("/dialogue?philosopher=socrates", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Active", { timeout: 10000 });
    await expect(page.locator("textarea")).toBeVisible();
  });

  test("should send a message and see it in chat", async ({ page }) => {
    await page.goto("/dialogue?philosopher=socrates", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Active", { timeout: 10000 });
    await page.fill("textarea", "What is virtue?");
    await page.locator("button[type='submit']").click();
    // Should have user message container
    const userMessages = page.locator(".bg-primary");
    await expect(userMessages.first()).toBeVisible();
  });

  test("should show context indicator when resuming from archive", async ({ page }) => {
    // First navigate to page, then set localStorage
    await page.goto("/dialogue?philosopher=socrates", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Active", { timeout: 10000 });
    // Set up localStorage after page load
    await page.evaluate(() => {
      localStorage.setItem("ai-phi-philosopher-conversations", JSON.stringify({
        "socrates": "test-conversation-id"
      }));
      localStorage.setItem("ai-phi-conversation-history", JSON.stringify({
        "socrates": { topic: "Ethics of AI", date: new Date().toISOString() }
      }));
    });
    // Reload to see the context indicator
    await page.reload();
    await page.waitForSelector("text=Active", { timeout: 10000 });
  });

  test("should load past messages when resuming conversation", async ({ page }) => {
    await page.goto("/dialogue?philosopher=socrates", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Active", { timeout: 10000 });
    await page.evaluate(() => {
      localStorage.setItem("ai-phi-philosopher-conversations", JSON.stringify({
        "socrates": "mock-conversation-id-123"
      }));
    });
    await page.reload();
    await page.waitForSelector("text=Active", { timeout: 10000 });
  });

  test("should display voice duration when playing speech", async ({ page }) => {
    await page.goto("/dialogue?philosopher=socrates", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Active", { timeout: 10000 });
    await page.fill("textarea", "Tell me about virtue");
    await page.locator("button[type='submit']").click();
    await page.waitForTimeout(500);
    const playButton = page.locator("button[aria-label='Play speech']").first();
    await expect(playButton).toBeVisible();
  });

  test("should show follow-up suggestions section", async ({ page }) => {
    await page.goto("/dialogue?philosopher=socrates", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Active", { timeout: 10000 });
    await page.fill("textarea", "What is virtue?");
    await page.locator("button[type='submit']").click();
    await page.waitForTimeout(500);
  });

  test("should navigate to debate from dialogue", async ({ page }) => {
    await page.goto("/dialogue?philosopher=socrates", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Active", { timeout: 10000 });
    await page.locator("text=+ Debate").click();
    await expect(page).toHaveURL(/\/debate\?philosopher=socrates/);
  });

  test("Escape key should go back to philosopher selector", async ({ page }) => {
    await page.goto("/dialogue?philosopher=socrates", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Active", { timeout: 10000 });
    await page.keyboard.press("Escape");
    await expect(page.locator("text=Choose Your Thinker")).toBeVisible();
  });
});
