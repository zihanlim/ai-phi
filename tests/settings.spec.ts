import { test, expect } from "@playwright/test";

test.describe("Settings Page", () => {
  test("should load the settings page", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.locator("text=Settings").first()).toBeVisible();
  });

  test("should have display name input", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.locator('input[placeholder*="display name"]')).toBeVisible();
  });

  test("should type in display name", async ({ page }) => {
    await page.goto("/settings");

    const input = page.locator('input[placeholder*="display name"]');
    await input.fill("Test User");

    await expect(input).toHaveValue("Test User");
  });

  test("should show character count", async ({ page }) => {
    await page.goto("/settings");

    await expect(page.locator("text=/\\d+\\/32/")).toBeVisible();
  });

  test("should show dark mode info", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.locator("text=Dark Mode")).toBeVisible();
    await expect(page.locator("text=dark theme only")).toBeVisible();
  });

  test("should have save button", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.locator("button:has-text('Save Settings')")).toBeVisible();
  });

  test("should show saved confirmation", async ({ page }) => {
    await page.goto("/settings");

    await page.click("button:has-text('Save Settings')");

    await expect(page.locator("text=Settings Saved")).toBeVisible();
  });

  test("should show app info", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.locator("text=Version")).toBeVisible();
    await expect(page.locator("text=Next.js")).toBeVisible();
  });

  test("should have breadcrumbs", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.locator("text=Settings").first()).toBeVisible();
  });
});
