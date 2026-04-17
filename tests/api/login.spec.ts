import { expect, test } from '@playwright/test';
import {
  createUserByApi,
  deleteForm,
  deleteUserByApi,
  expectApiCode,
  expectApiMessage,
  postForm,
  readJson,
} from './support/apiHelpers';
import { createApiUser } from './support/apiData';

test.describe('Automation Exercise API login cases', () => {
  test('API 7 - POST To Verify Login with valid details', async ({ request }) => {
    const user = createApiUser('login-valid');

    await createUserByApi(request, user);

    const response = await postForm(request, '/api/verifyLogin', {
      email: user.email,
      password: user.password,
    });
    const body = await readJson(response);

    expect(response.ok()).toBeTruthy();
    expectApiCode(body, 200);
    expectApiMessage(body, /user exists!/i);

    await deleteUserByApi(request, user);
  });

  test('API 8 - POST To Verify Login without email parameter', async ({ request }) => {
    const response = await postForm(request, '/api/verifyLogin', {
      password: 'Password@123',
    });
    const body = await readJson(response);

    expect(response.ok()).toBeTruthy();
    expectApiCode(body, 400);
    expectApiMessage(body, /email or password parameter is missing/i);
  });

  test('API 9 - DELETE To Verify Login', async ({ request }) => {
    const response = await deleteForm(request, '/api/verifyLogin', {});
    const body = await readJson(response);

    expect(response.ok()).toBeTruthy();
    expectApiCode(body, 405);
    expectApiMessage(body, /this request method is not supported/i);
  });

  test('API 10 - POST To Verify Login with invalid details', async ({ request }) => {
    const response = await postForm(request, '/api/verifyLogin', {
      email: `missing.${Date.now()}@example.com`,
      password: 'WrongPassword@123',
    });
    const body = await readJson(response);

    expect(response.ok()).toBeTruthy();
    expectApiCode(body, 404);
    expectApiMessage(body, /user not found!/i);
  });
});
