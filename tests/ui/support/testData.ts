import { SignupDetails } from '../../../pages/SignupPage';
import { PaymentDetails } from '../../../pages/CheckoutPage';

export type TestUser = SignupDetails & {
  name: string;
  email: string;
};

let uniqueCounter = 0;

export function createTestUser(prefix = 'playwright-user'): TestUser {
  uniqueCounter += 1;
  const stamp = `${Date.now()}-${uniqueCounter}`;

  return {
    name: `PW ${prefix} ${uniqueCounter}`,
    email: `${prefix}.${stamp}@example.com`,
    password: 'Password@123',
    firstName: 'Automation',
    lastName: 'Tester',
    company: 'Codex QA',
    address: '221B Baker Street',
    address2: 'Suite 7',
    country: 'India',
    state: 'Karnataka',
    city: 'Bengaluru',
    zipCode: '560001',
    mobileNumber: '9999999999',
  };
}

export const defaultPaymentDetails: PaymentDetails = {
  nameOnCard: 'Automation Tester',
  cardNumber: '4111111111111111',
  cvc: '123',
  expiryMonth: '12',
  expiryYear: '2030',
};

export const defaultCheckoutComment = 'Please deliver this order with standard shipping.';
