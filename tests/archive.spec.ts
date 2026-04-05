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
});
