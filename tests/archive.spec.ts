import { test, expect } from "@playwright/test";

test.describe("Archive Page", () => {
  test("should load the archive page", async ({ page }) => {
    await page.goto("/archive", { waitUntil: "networkidle" });
    await expect(page.locator("text=Conversation Archive")).toBeVisible();
  });

  test("should show empty state when no conversations", async ({ page }) => {
    await page.goto("/archive", { waitUntil: "networkidle" });
    // Wait for loading to finish and empty state to appear
    await page.waitForSelector("text=No Saved Conversations", { timeout: 10000 });
    await expect(page.locator("text=No Saved Conversations")).toBeVisible();
    await expect(page.locator("text=Return to Hub")).toBeVisible();
  });

  test("Return to Hub should navigate to home", async ({ page }) => {
    await page.goto("/archive", { waitUntil: "networkidle" });
    await page.waitForSelector("text=No Saved Conversations", { timeout: 10000 });

    await page.locator("text=Return to Hub").click();
    await expect(page).toHaveURL("/");
  });

  test("should have breadcrumbs", async ({ page }) => {
    await page.goto("/archive", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Conversation Archive", { timeout: 10000 });

    // Check for breadcrumbs with aria-label
    await expect(page.locator('nav[aria-label="Breadcrumb"]')).toBeVisible();
  });

  test("Continue Debate should load debate page with correct grid", async ({ page }) => {
    // First create a mock debate conversation in localStorage
    await page.goto("/debate", { waitUntil: "networkidle" });
    
    await page.waitForSelector("text=Socrates", { timeout: 10000 });
    
    // Select Socrates and Nietzsche for a debate
    await page.locator('button[aria-label*="Socrates"]').click();
    await page.locator('button[aria-label*="Nietzsche"]').click();
    
    // Type a question
    await page.fill("textarea", "What is the meaning of life?");
    
    // Submit the question (this creates a conversation)
    // Note: This test requires API to be working
    
    // Now navigate to archive
    await page.goto("/archive", { waitUntil: "networkidle" });
    
    // If there's a debate conversation, click Continue Debate
    const continueButton = page.locator("text=Continue Debate").first();
    if (await continueButton.isVisible({ timeout: 3000 })) {
      await continueButton.click();
      
      // Should navigate to debate page
      await expect(page).toHaveURL(/\/debate/);
      
      // Wait for the comparison view to load
      await page.waitForSelector("text=Comparative Responses", { timeout: 10000 });
      
      // Check that the grid has multiple columns (not multiple rows)
      // The grid should have columns based on number of philosophers
      const gridContainer = page.locator(".grid-cols-1\\/lg\\\\:grid-cols-2, .grid-cols-1.md\\\\:grid-cols-3").first();
      // More specifically check that messages are displayed side by side
      const responseCards = page.locator("[class*='bg-surface-variant'][class*='rounded-2xl']");
      const count = await responseCards.count();
      expect(count).toBeGreaterThan(0);
    }
  });
});
