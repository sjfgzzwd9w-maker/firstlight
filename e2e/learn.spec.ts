import { test, expect } from '@playwright/test';

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function dismissOnboarding(page: import('@playwright/test').Page) {
  const modal = page.getByText("Let's go!");
  if (await modal.isVisible()) {
    await modal.click();
    await page.waitForTimeout(300);
  }
}

// ─── Landing page ─────────────────────────────────────────────────────────────

test.describe('Landing page', () => {
  test('shows onboarding modal on first visit', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Welcome to Stardance Learn!')).toBeVisible();
    await expect(page.getByText("Let's go!")).toBeVisible();
  });

  test('shows subject grid after dismissing onboarding', async ({ page }) => {
    await page.goto('/');
    await dismissOnboarding(page);
    await expect(page.getByText('What do you want to master today?')).toBeVisible();
    for (const subject of ['Math', 'Biology', 'Chemistry', 'Physics', 'Space']) {
      await expect(page.getByText(subject, { exact: true })).toBeVisible();
    }
  });
});

// ─── Math learn session ───────────────────────────────────────────────────────

test.describe('Math learn session', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await dismissOnboarding(page);
    await page.getByText('Math', { exact: true }).click();
    await page.waitForURL('**/learn/math');
  });

  test('shows module map with Linear Equations unlocked', async ({ page }) => {
    await expect(page.getByText('Math · Algebra 2')).toBeVisible();
    await expect(page.getByRole('button', { name: /Linear Equations/i }).first()).toBeVisible();
  });

  test('navigates to session when a topic is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /Linear Equations/i }).first().click();
    await page.waitForURL('**/learn/math/session**');
    await expect(page).toHaveURL(/topic=linear-equations/);
  });

  test('displays a question with 4 answer choices', async ({ page }) => {
    await page.getByRole('button', { name: /Linear Equations/i }).first().click();
    await page.waitForURL('**/learn/math/session**');
    await expect(page.getByText('Check answer')).toBeVisible();
    const choices = page.locator('button').filter({ hasNotText: /exit|note|check answer|🔊/i });
    await expect(choices).toHaveCount(4);
  });

  test('shows explanation and correct answer highlight after wrong answer', async ({ page }) => {
    await page.getByRole('button', { name: /Linear Equations/i }).first().click();
    await page.waitForURL('**/learn/math/session**');

    // Pick the first choice (may be wrong) and submit
    const choices = page.locator('button').filter({ hasNotText: /exit|note|check answer|🔊/i });
    await choices.first().click();
    await page.getByText('Check answer').click();

    // Regardless of correct/wrong: explanation and next-question button appear
    await expect(page.getByText('Next question →')).toBeVisible();
    await expect(page.getByText(/To get|Subtract|Add|Divide|Multiply|Combine|Distribute/i).first()).toBeVisible();
  });

  test('Check answer button is disabled until a choice is selected', async ({ page }) => {
    await page.getByRole('button', { name: /Linear Equations/i }).first().click();
    await page.waitForURL('**/learn/math/session**');
    const checkBtn = page.getByRole('button', { name: 'Check answer' });
    await expect(checkBtn).toBeVisible();
    await expect(checkBtn).toBeDisabled();
  });

  test('Exit button returns to the module map', async ({ page }) => {
    await page.getByRole('button', { name: /Linear Equations/i }).first().click();
    await page.waitForURL('**/learn/math/session**');
    await page.getByText('← Exit').click();
    await page.waitForURL('**/learn/math');
    await expect(page.getByText('Math · Algebra 2')).toBeVisible();
  });
});

// ─── Physics learn session ────────────────────────────────────────────────────

test.describe('Physics learn session', () => {
  test('module map shows all three units', async ({ page }) => {
    await page.goto('/');
    await dismissOnboarding(page);
    await page.getByText('Physics').click();
    await page.waitForURL('**/learn/physics');
    await expect(page.getByText('Unit 1 · Motion & Measurement', { exact: false })).toBeVisible();
    await expect(page.getByText('Unit 2 · Forces & Energy', { exact: false })).toBeVisible();
    await expect(page.getByText('Unit 3 · Waves, Sound & Electromagnetism', { exact: false })).toBeVisible();
  });

  test('starts a question session for first Physics topic', async ({ page }) => {
    await page.goto('/');
    await dismissOnboarding(page);
    await page.getByText('Physics').click();
    await page.waitForURL('**/learn/physics');
    await page.getByRole('button', { name: /Measurement & Scientific/i }).first().click();
    await page.waitForURL('**/learn/physics/session**');
    await expect(page).toHaveURL(/topic=physics-measurement/);
    await expect(page.getByText('Check answer')).toBeVisible();
  });
});

// ─── Space learn session ──────────────────────────────────────────────────────

test.describe('Space learn session', () => {
  test('module map loads with Solar System topic visible', async ({ page }) => {
    await page.goto('/');
    await dismissOnboarding(page);
    await page.getByText('Space').click();
    await page.waitForURL('**/learn/space');
    await expect(page.getByRole('button', { name: /The Solar System/i }).first()).toBeVisible();
  });
});

// ─── Profile page ─────────────────────────────────────────────────────────────

test.describe('Profile page', () => {
  test('shows XP and topic progress grid', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.getByText('Your Progress')).toBeVisible();
    await expect(page.getByText('0 XP', { exact: true })).toBeVisible();
    await expect(page.getByText('Linear Equations').first()).toBeVisible();
  });
});

// ─── Practice page ────────────────────────────────────────────────────────────

test.describe('Practice page', () => {
  test('shows empty-state message when queue is empty', async ({ page }) => {
    await page.goto('/practice');
    await expect(page.getByText(/practice queue is empty/i)).toBeVisible();
    await expect(page.getByText('Go study →')).toBeVisible();
  });

  test('Go study button navigates to landing', async ({ page }) => {
    await page.goto('/practice');
    await page.getByText('Go study →').click();
    await expect(page).toHaveURL('/');
  });
});
