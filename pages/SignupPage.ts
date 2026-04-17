import { expect, Page } from '@playwright/test';

export type SignupDetails = {
  password: string;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  mobileNumber: string;
};

export class SignupPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async expectAccountInformationVisible() {
    await expect(this.page.getByText(/enter account information/i)).toBeVisible();
  }

  async fillAccountInformation(details: SignupDetails) {
    await this.expectAccountInformationVisible();

    await this.page.locator('#id_gender1').check();
    await this.page.locator('[data-qa="password"]').fill(details.password);
    await this.page.locator('[data-qa="days"]').selectOption('10');
    await this.page.locator('[data-qa="months"]').selectOption('5');
    await this.page.locator('[data-qa="years"]').selectOption('1995');
    await this.page.locator('#newsletter').check();
    await this.page.locator('#optin').check();

    await this.page.locator('[data-qa="first_name"]').fill(details.firstName);
    await this.page.locator('[data-qa="last_name"]').fill(details.lastName);
    await this.page.locator('[data-qa="company"]').fill(details.company);
    await this.page.locator('[data-qa="address"]').fill(details.address);
    await this.page.locator('[data-qa="address2"]').fill(details.address2);
    await this.page.locator('[data-qa="country"]').selectOption(details.country);
    await this.page.locator('[data-qa="state"]').fill(details.state);
    await this.page.locator('[data-qa="city"]').fill(details.city);
    await this.page.locator('[data-qa="zipcode"]').fill(details.zipCode);
    await this.page.locator('[data-qa="mobile_number"]').fill(details.mobileNumber);
  }

  async createAccount() {
    await this.page.locator('[data-qa="create-account"]').click();
  }

  async expectAccountCreated() {
    await expect(this.page.getByText(/account created!/i)).toBeVisible();
  }

  async continue() {
    await this.page.locator('[data-qa="continue-button"]').click();
  }

  async expectAccountDeleted() {
    await expect(this.page.getByText(/account deleted!/i)).toBeVisible();
  }
}
