import { test, expect } from "@playwright/test";

test.describe("User Flows", () => {
  test("philosopher dossier -> start dialogue flow", async ({ page }) => {
    await page.goto("/dossier/socrates", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Start Dialogue", { timeout: 10000 });

    // Click Start Dialogue
    await page.locator("text=Start Dialogue").click();

    // Should navigate to dialogue with Socrates pre-selected
    await expect(page).toHaveURL(/\/dialogue\?philosopher=socrates/);
    await expect(page.locator("text=Active")).toBeVisible();
  });

  test("philosopher dossier -> add to debate flow", async ({ page }) => {
    await page.goto("/dossier/socrates", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Add to Debate", { timeout: 10000 });

    // Click Add to Debate
    await page.locator("text=Add to Debate").click();

    // Should navigate to debate with Socrates pre-selected
    await expect(page).toHaveURL(/\/debate\?philosopher=socrates/);
    await expect(page.locator("text=Selected: 1")).toBeVisible();
  });

  test("hub -> dossier -> individual dossier navigation", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Navigate to Dossier via header
    await page.locator("header nav a[href='/dossier']").click();
    await expect(page).toHaveURL(/\/dossier/);

    // Wait for philosophers to load
    await page.waitForSelector("text=Socrates", { timeout: 10000 });

    // Click on Socrates card
    await page.locator("article").filter({ hasText: "Socrates" }).click();
    await expect(page).toHaveURL(/\/dossier\/socrates/);
  });

  test("settings flow: change display name -> verify persistence", async ({ page }) => {
    await page.goto("/settings", { waitUntil: "networkidle" });

    // Change display name
    const input = page.locator('input[placeholder*="display name"]');
    await input.fill("Philosopher King");

    // Save settings
    await page.locator("button", { hasText: "Save Settings" }).click();

    // Should show saved confirmation
    await expect(page.locator("text=Settings Saved")).toBeVisible();

    // Refresh page
    await page.reload();

    // Display name should still be there (persisted to localStorage)
    await expect(input).toHaveValue("Philosopher King");
  });

  test("dossier -> back to dossier list -> navigate to dialogue", async ({ page }) => {
    await page.goto("/dossier/socrates", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Start Dialogue", { timeout: 10000 });

    // Go back to dossier list
    await page.locator('[aria-label="Go back"]').click();
    await expect(page).toHaveURL(/\/dossier/);

    // Start Dialogue with Socrates
    await page.waitForSelector("text=Socrates", { timeout: 10000 });
    await page.locator("article").filter({ hasText: "Socrates" }).click();

    await page.locator("text=Start Dialogue").click();
    await expect(page).toHaveURL(/\/dialogue\?philosopher=socrates/);
  });
});
