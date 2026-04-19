import { expect, test } from '@playwright/test';
import { expectApiCode, expectApiMessage, postForm, putForm, readJson } from './support/apiHelpers';

test.describe('Automation Exercise API catalog cases', () => {
  test('API 1 - Get All Products List @smoke @regression', async ({ request }) => {
    const response = await request.get('/api/productsList');
    const body = await readJson(response);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    expect(Array.isArray(body.products)).toBeTruthy();
    expect((body.products as unknown[]).length).toBeGreaterThan(0);
  });

  test('API 2 - POST To All Products List @regression', async ({ request }) => {
    const response = await request.post('/api/productsList');
    const body = await readJson(response);

    expect(response.ok()).toBeTruthy();
    expectApiCode(body, 405);
    expectApiMessage(body, /this request method is not supported/i);
  });

  test('API 3 - Get All Brands List @smoke @regression', async ({ request }) => {
    const response = await request.get('/api/brandsList');
    const body = await readJson(response);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    expect(Array.isArray(body.brands)).toBeTruthy();
    expect((body.brands as unknown[]).length).toBeGreaterThan(0);
  });

  test('API 4 - PUT To All Brands List @regression', async ({ request }) => {
    const response = await putForm(request, '/api/brandsList', {});
    const body = await readJson(response);

    expect(response.ok()).toBeTruthy();
    expectApiCode(body, 405);
    expectApiMessage(body, /this request method is not supported/i);
  });

  test('API 5 - POST To Search Product @smoke @regression', async ({ request }) => {
    const response = await postForm(request, '/api/searchProduct', {
      search_product: 'top',
    });
    const body = await readJson(response);

    expect(response.ok()).toBeTruthy();
    expect(Array.isArray(body.products)).toBeTruthy();
    expect((body.products as unknown[]).length).toBeGreaterThan(0);
  });

  test('API 6 - POST To Search Product without search_product parameter @regression', async ({ request }) => {
    const response = await postForm(request, '/api/searchProduct', {});
    const body = await readJson(response);

    expect(response.ok()).toBeTruthy();
    expectApiCode(body, 400);
    expectApiMessage(body, /search_product parameter is missing/i);
  });
});
