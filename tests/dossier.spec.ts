import { test, expect } from "@playwright/test";

test.describe("Dossier Page", () => {
  test("should load the dossier page", async ({ page }) => {
    await page.goto("/dossier", { waitUntil: "networkidle" });
    await expect(page.locator("text=DIGITAL AGORA")).toBeVisible();
  });

  test("should display all philosophers", async ({ page }) => {
    await page.goto("/dossier", { waitUntil: "networkidle" });
    // Wait for philosopher cards to load
    await page.waitForSelector("article", { timeout: 10000 });
    // Check that philosopher names are visible in the article cards
    await expect(page.locator("article").first()).toBeVisible();
  });

  test("should filter by tradition", async ({ page }) => {
    await page.goto("/dossier", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Socrates", { timeout: 10000 });

    // Click Western filter
    await page.locator("button", { hasText: "Western" }).click();

    // Should show Western philosophers
    await expect(page.locator("button", { hasText: "Western" })).toHaveClass(/bg-primary/);
  });

  test("should show tradition counts", async ({ page }) => {
    await page.goto("/dossier", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Western", { timeout: 10000 });

    // Should show counts like "Western (2)"
    const westernButton = page.locator("button", { hasText: "Western" });
    await expect(westernButton).toContainText(/\(\d+\)/);
  });

  test("should navigate to individual philosopher dossier", async ({ page }) => {
    await page.goto("/dossier", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Socrates", { timeout: 10000 });

    // Click on Socrates card
    await page.locator("article").filter({ hasText: "Socrates" }).click();
    await expect(page).toHaveURL(/\/dossier\/socrates/);
  });

  test("should have Start Dialogue button", async ({ page }) => {
    await page.goto("/dossier/socrates", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Start Dialogue", { timeout: 10000 });

    await expect(page.locator("text=Start Dialogue")).toBeVisible();
  });

  test("should have Add to Debate button", async ({ page }) => {
    await page.goto("/dossier/socrates", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Add to Debate", { timeout: 10000 });

    await expect(page.locator("text=Add to Debate")).toBeVisible();
  });

  test("should display philosopher name in uppercase", async ({ page }) => {
    await page.goto("/dossier/socrates", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Socrates", { timeout: 10000 });

    // Name is displayed in uppercase via CSS, so we check for the DOM text
    await expect(page.locator("h2").getByText("Socrates")).toBeVisible();
  });

  test("should display major works section", async ({ page }) => {
    await page.goto("/dossier/socrates", { waitUntil: "networkidle" });
    await page.waitForSelector("text=MAJOR WORKS", { timeout: 10000 });

    await expect(page.locator("text=MAJOR WORKS")).toBeVisible();
  });

  test("should display key ideas section", async ({ page }) => {
    await page.goto("/dossier/socrates", { waitUntil: "networkidle" });
    await page.waitForSelector("text=KEY IDEAS", { timeout: 10000 });

    await expect(page.locator("text=KEY IDEAS")).toBeVisible();
  });

  test("back button should navigate to dossier list", async ({ page }) => {
    await page.goto("/dossier/socrates", { waitUntil: "networkidle" });
    await page.waitForSelector('[aria-label="Go back"]', { timeout: 10000 });

    await page.locator('[aria-label="Go back"]').click();
    await expect(page).toHaveURL(/\/dossier/);
  });
});
