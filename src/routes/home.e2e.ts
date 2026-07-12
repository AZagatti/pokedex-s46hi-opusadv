import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("loads the Pokémon grid", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('[aria-label="Pokémon list"]')).toBeVisible({ timeout: 15000 });
    const cards = page.locator('[aria-label="Pokémon list"] a');
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
  });

  test("search filters Pokémon by name", async ({ page }) => {
    await page.goto("/");
    await page.locator('[aria-label="Pokémon list"] a').first().waitFor({ timeout: 15000 });
    const searchInput = page.locator('[aria-label="Search Pokémon by name or number"]');
    await searchInput.fill("pikachu");
    await page.waitForTimeout(400); // debounce 250ms + render
    const cards = page.locator('[aria-label="Pokémon list"] a');
    await expect(cards).toHaveCount(1, { timeout: 5000 });
    await expect(cards.first()).toContainText("Pikachu");
  });

  test("navigates to Pokémon detail page on card click", async ({ page }) => {
    await page.goto("/");
    await page.locator('[aria-label="Pokémon list"] a').first().waitFor({ timeout: 15000 });
    const firstCard = page.locator('[aria-label="Pokémon list"] a').first();
    await firstCard.click();
    await expect(page).toHaveURL(/\/pokemon\//);
    await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });
  });

  test("dark mode toggle works", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const toggle = page
      .locator('[aria-label*="dark"], [aria-label*="light"], [aria-label*="theme"]')
      .first();
    if (await toggle.isVisible()) {
      const hasDark = await html.evaluate((el) => el.classList.contains("dark"));
      await toggle.click();
      const nowHasDark = await html.evaluate((el) => el.classList.contains("dark"));
      expect(nowHasDark).toBe(!hasDark);
    }
  });
});

test.describe("Berries page", () => {
  test("loads berry list", async ({ page }) => {
    await page.goto("/berries");
    const links = page.locator('a[href*="/berries/"]');
    await expect(links.first()).toBeVisible({ timeout: 10000 });
    const count = await links.count();
    expect(count).toBeGreaterThan(10);
  });

  test("navigates to berry detail", async ({ page }) => {
    await page.goto("/berries");
    const firstBerry = page.locator('a[href*="/berries/"]').first();
    await firstBerry.waitFor({ timeout: 10000 });
    await firstBerry.click();
    await expect(page).toHaveURL(/\/berries\/.+/);
    await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Favorites page", () => {
  test("shows empty state when no favorites", async ({ page }) => {
    await page.goto("/favorites");
    await expect(page.locator("text=No favorites yet")).toBeVisible({ timeout: 10000 });
  });
});
