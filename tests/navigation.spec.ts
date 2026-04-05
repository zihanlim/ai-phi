import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should have header on all pages", async ({ page }) => {
    const pages = ["/", "/dialogue", "/debate", "/dossier", "/archive", "/settings"];

    for (const path of pages) {
      await page.goto(path, { waitUntil: "networkidle" });
      await expect(page.locator("header")).toBeVisible();
      await expect(page.locator("text=DIGITAL AGORA")).toBeVisible();
    }
  });

  test("should have bottom navigation on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/", { waitUntil: "networkidle" });

    // Bottom nav is a separate nav element with class bottom-nav
    await expect(page.locator(".bottom-nav >> text=Hub")).toBeVisible();
    await expect(page.locator(".bottom-nav >> text=Debate")).toBeVisible();
    await expect(page.locator(".bottom-nav >> text=Dialogue")).toBeVisible();
    await expect(page.locator(".bottom-nav >> text=Dossier")).toBeVisible();
    await expect(page.locator(".bottom-nav >> text=Archive")).toBeVisible();
    await expect(page.locator(".bottom-nav span.font-mono >> text=Settings")).toBeVisible();
  });

  test("should navigate between all pages via header nav", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Hub -> Debate via header nav
    await page.locator("header nav a[href='/debate']").click();
    await expect(page).toHaveURL(/\/debate/);

    // Debate -> Dialogue via header nav
    await page.locator("header nav a[href='/dialogue']").click();
    await expect(page).toHaveURL(/\/dialogue/);

    // Dialogue -> Dossier via header nav
    await page.locator("header nav a[href='/dossier']").click();
    await expect(page).toHaveURL(/\/dossier/);

    // Dossier -> Archive via header nav
    await page.locator("header nav a[href='/archive']").click();
    await expect(page).toHaveURL(/\/archive/);

    // Archive -> Settings via header nav
    await page.locator("header nav a[href='/settings']").click();
    await expect(page).toHaveURL(/\/settings/);

    // Settings -> Hub via header nav
    await page.locator("header nav a[href='/']").click();
    await expect(page).toHaveURL("/");
  });

  test("should highlight active nav item", async ({ page }) => {
    await page.goto("/debate", { waitUntil: "networkidle" });

    const debateNav = page.locator("header nav a[href='/debate']").first();
    await expect(debateNav).toHaveClass(/text-primary/);
  });
});

test.describe("Accessibility", () => {
  test("should have accessible labels on buttons", async ({ page }) => {
    await page.goto("/dialogue", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Choose Your Thinker", { timeout: 10000 });

    // Check philosopher selection buttons have aria-labels
    const philosopherButtons = page.locator('[aria-label*="Select"]');
    const count = await philosopherButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test("images should have alt text", async ({ page }) => {
    await page.goto("/dossier", { waitUntil: "networkidle" });
    await page.waitForSelector("text=Socrates", { timeout: 10000 });

    // Images should have alt attributes
    const images = page.locator("img");
    const count = await images.count();
    if (count > 0) {
      const firstImage = images.first();
      const alt = await firstImage.getAttribute("alt");
      expect(alt !== null).toBeTruthy();
    }
  });
});
