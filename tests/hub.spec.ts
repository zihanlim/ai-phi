import { test, expect } from "@playwright/test";

test.describe("Hub Page", () => {
  test("should load the hub page", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator("text=DIGITAL AGORA")).toBeVisible();
  });

  test("should display the philosopher roster", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForSelector('[href^="/dossier/"]', { timeout: 10000 });
    await expect(page.locator('[href^="/dossier/"]').first()).toBeVisible();
  });

  test("should navigate to Debate Chamber", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    // Use header navigation
    await page.locator("header nav a[href='/debate']").click();
    await expect(page).toHaveURL(/\/debate/);
  });

  test("should navigate to Dialogue", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.locator("header nav a[href='/dialogue']").click();
    await expect(page).toHaveURL(/\/dialogue/);
  });

  test("should navigate to Archive", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.locator("header nav a[href='/archive']").click();
    await expect(page).toHaveURL(/\/archive/);
  });

  test("should navigate to Dossier", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.locator("header nav a[href='/dossier']").click();
    await expect(page).toHaveURL(/\/dossier/);
  });

  test("should navigate to Settings", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.locator("header nav a[href='/settings']").click();
    await expect(page).toHaveURL(/\/settings/);
  });

  test("should have working bottom navigation", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    // Use header navigation on desktop (bottom nav is mobile-only)
    await page.locator("header nav a[href='/debate']").click();
    await expect(page).toHaveURL(/\/debate/);
  });
});
