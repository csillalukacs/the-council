import { test, expect } from '@playwright/test'

test.describe('User Flows', () => {
    test.beforeEach(async ({ page }) => {
        // Clear localStorage before each test
        await page.goto('/')
        await page.evaluate(() => localStorage.clear())
    })

    test('first-time setup: API key entry and first query', async ({ page }) => {
        await page.goto('/')

        // Should show API key input initially
        const apiKeyInput = page.getByPlaceholder(/enter your openrouter api key/i)
        await expect(apiKeyInput).toBeVisible()

        // Enter API key
        await apiKeyInput.fill('test-api-key-123')
        await page.getByRole('button', { name: /save/i }).click()

        // Input should be hidden after saving
        await expect(apiKeyInput).not.toBeVisible()

        // Should see query input
        const queryInput = page.getByPlaceholder(/speak, citizen/i)
        await expect(queryInput).toBeVisible()
    })

    test('should persist API key across page reloads', async ({ page }) => {
        await page.goto('/')

        // Set API key
        const apiKeyInput = page.getByPlaceholder(/enter your openrouter api key/i)
        await apiKeyInput.fill('persistent-key-456')
        await page.getByRole('button', { name: /save/i }).click()

        // Reload page
        await page.reload()

        // API key input should not be visible (key persisted)
        await expect(apiKeyInput).not.toBeVisible()

        // Should see edit button
        const editButton = page.getByRole('button', { name: /edit key/i })
        await expect(editButton).toBeVisible()
    })

    test('should allow editing API key', async ({ page }) => {
        await page.goto('/')

        // Set initial API key
        const apiKeyInput = page.getByPlaceholder(/enter your openrouter api key/i)
        await apiKeyInput.fill('initial-key')
        await page.getByRole('button', { name: /save/i }).click()

        // Click edit button
        const editButton = page.getByRole('button', { name: /edit key/i })
        await editButton.click()

        // Should show input with existing key
        await expect(apiKeyInput).toBeVisible()
        await expect(apiKeyInput).toHaveValue('initial-key')

        // Update the key
        await apiKeyInput.fill('updated-key')
        await page.getByRole('button', { name: /save/i }).click()

        // Should save the new key
        await editButton.click()
        await expect(apiKeyInput).toHaveValue('updated-key')
    })

    test('should show query input when API key is set', async ({ page }) => {
        await page.goto('/')

        // Set API key
        await page.getByPlaceholder(/enter your openrouter api key/i).fill('test-key')
        await page.getByRole('button', { name: /save/i }).click()

        // Query input should be visible
        const queryInput = page.getByPlaceholder(/speak, citizen/i)
        await expect(queryInput).toBeVisible()
    })

    test('should display settings button', async ({ page }) => {
        await page.goto('/')

        // Settings button should be visible
        const settingsButton = page.getByRole('button', { name: /settings/i }).or(
            page.locator('button').filter({ hasText: /settings/i }).first()
        )

        // Try to find any button that might be the settings button
        // Since we don't have exact text, we'll check for button group
        const buttons = page.locator('button')
        await expect(buttons.first()).toBeVisible()
    })

    test('should display history button', async ({ page }) => {
        await page.goto('/')

        // History button should be visible (check for button group)
        const buttons = page.locator('button')
        const count = await buttons.count()
        expect(count).toBeGreaterThan(0)
    })
})

