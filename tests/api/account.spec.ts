import { expect, test } from '@playwright/test';
import {
  createUserByApi,
  deleteUserByApi,
  expectApiCode,
  expectApiMessage,
  putForm,
  readJson,
} from './support/apiHelpers';
import { createApiUser } from './support/apiData';

test.describe('Automation Exercise API account cases', () => {
  test('API 11 - POST To Create Register User Account @smoke @regression', async ({ request }) => {
    const user = createApiUser('create');

    await createUserByApi(request, user);
    await deleteUserByApi(request, user);
  });

  test('API 12 - DELETE METHOD To Delete User Account @regression', async ({ request }) => {
    const user = createApiUser('delete');

    await createUserByApi(request, user);
    await deleteUserByApi(request, user);
  });

  test('API 13 - PUT METHOD To Update User Account @smoke @regression', async ({ request }) => {
    const user = createApiUser('update');

    await createUserByApi(request, user);

    const updatedCompany = 'Updated Codex QA';
    const updatedCity = 'Mysuru';

    const response = await putForm(request, '/api/updateAccount', {
      ...user,
      company: updatedCompany,
      city: updatedCity,
    });
    const body = await readJson(response);

    expect(response.ok()).toBeTruthy();
    expectApiCode(body, 200);
    expectApiMessage(body, /user updated!/i);

    const detailsResponse = await request.get(`/api/getUserDetailByEmail?email=${encodeURIComponent(user.email)}`);
    const detailsBody = await readJson(detailsResponse);

    expect(detailsResponse.ok()).toBeTruthy();
    expectApiCode(detailsBody, 200);
    expect(JSON.stringify(detailsBody)).toContain(updatedCompany);
    expect(JSON.stringify(detailsBody)).toContain(updatedCity);

    await deleteUserByApi(request, user);
  });

  test('API 14 - GET user account detail by email @smoke @regression', async ({ request }) => {
    const user = createApiUser('details');

    await createUserByApi(request, user);

    const response = await request.get(`/api/getUserDetailByEmail?email=${encodeURIComponent(user.email)}`);
    const body = await readJson(response);

    expect(response.ok()).toBeTruthy();
    expectApiCode(body, 200);
    expect(JSON.stringify(body)).toContain(user.email);
    expect(JSON.stringify(body)).toContain(user.name);

    await deleteUserByApi(request, user);
  });
});
