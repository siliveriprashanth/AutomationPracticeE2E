import { test } from '@playwright/test';
import { ContactUsPage } from '../../pages/ContactUsPage';
import { HomePage } from '../../pages/HomePage';
import { TestCasesPage } from '../../pages/TestCasesPage';

test.describe('Automation Exercise navigation cases', () => {
  test('TC06 - Contact Us Form', async ({ page }) => {
    const contactUsPage = new ContactUsPage(page);
    const homePage = new HomePage(page);

    await homePage.open();
    await homePage.header.navigateToContactUs();
    await contactUsPage.expectLoaded();
    await contactUsPage.submitForm(
      'Automation User',
      'automation.user@example.com',
      'Playwright contact flow',
      'This message was sent by the Playwright test suite.',
    );
    await contactUsPage.expectSuccessMessage();
    await contactUsPage.goHome();
    await homePage.expectLoaded();
  });

  test('TC07 - Verify Test Cases Page', async ({ page }) => {
    const homePage = new HomePage(page);
    const testCasesPage = new TestCasesPage(page);

    await homePage.open();
    await homePage.header.navigateToTestCases();
    await testCasesPage.expectLoaded();
  });
});
