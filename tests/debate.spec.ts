import { test, expect } from "@playwright/test";

test.describe("Debate Page", () => {
  test("should load the debate page", async ({ page }) => {
    await page.goto("/debate", { waitUntil: "networkidle" });
    await expect(page.locator("text=Select Philosophers")).toBeVisible();
  });

  test("should display philosopher selection grid", async ({ page }) => {
    await page.goto("/debate", { waitUntil: "networkidle" });
    await expect(page.locator("text=Socrates")).toBeVisible();
  });

  test("should select multiple philosophers", async ({ page }) => {
    await page.goto("/debate", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Socrates", { timeout: 10000 });

    // Select Socrates by clicking the button that contains Socrates text
    await page.locator("button[aria-pressed]").filter({ hasText: "Socrates" }).click();
    await expect(page.locator("text=Selected: 1")).toBeVisible();

    // Select Aristotle
    await page.locator("button[aria-pressed]").filter({ hasText: "Aristotle" }).click();
    await expect(page.locator("text=Selected: 2")).toBeVisible();
  });

  test("should deselect philosophers", async ({ page }) => {
    await page.goto("/debate", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Socrates", { timeout: 10000 });

    // Select Socrates
    await page.locator("button[aria-pressed]").filter({ hasText: "Socrates" }).click();
    await expect(page.locator("text=Selected: 1")).toBeVisible();

    // Deselect Socrates by clicking again
    await page.locator("button[aria-pressed]").filter({ hasText: "Socrates" }).click();
    // Selected text should no longer be visible when nothing is selected
    await expect(page.locator("text=Selected: 1")).not.toBeVisible();
  });

  test("should show empty state with suggested questions", async ({ page }) => {
    await page.goto("/debate", { waitUntil: "networkidle" });
    await page.waitForSelector("text=The Arena Awaits", { timeout: 10000 });

    await expect(page.locator("text=The Arena Awaits")).toBeVisible();
    await expect(page.locator("text=What is the meaning of life?")).toBeVisible();
  });

  test("should use suggested question", async ({ page }) => {
    await page.goto("/debate", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Socrates", { timeout: 10000 });

    // Select Socrates first
    await page.locator("button[aria-pressed]").filter({ hasText: "Socrates" }).click();

    // Click suggested question button
    await page.locator("button", { hasText: "What is the meaning of life?" }).click();

    // Should populate textarea
    await expect(page.locator("textarea")).toHaveValue("What is the meaning of life?");
  });

  test("pre-selected philosopher from query param", async ({ page }) => {
    await page.goto("/debate?philosopher=socrates", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Selected: 1", { timeout: 10000 });

    await expect(page.locator("text=Selected: 1")).toBeVisible();
  });
});
