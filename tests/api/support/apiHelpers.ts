import { expect, APIRequestContext, APIResponse } from '@playwright/test';
import { ApiUser } from './apiData';

type ApiBody = Record<string, unknown>;

export async function postForm(
  request: APIRequestContext,
  url: string,
  form: Record<string, string>,
): Promise<APIResponse> {
  return request.post(url, {
    form,
  });
}

export async function putForm(
  request: APIRequestContext,
  url: string,
  form: Record<string, string>,
): Promise<APIResponse> {
  return request.put(url, {
    form,
  });
}

export async function deleteForm(
  request: APIRequestContext,
  url: string,
  form: Record<string, string>,
): Promise<APIResponse> {
  return request.delete(url, {
    form,
  });
}

export async function readJson(response: APIResponse): Promise<ApiBody> {
  return response.json();
}

export function expectApiMessage(body: ApiBody, expectedMessage: RegExp | string) {
  const actual = String(body.message ?? body.responseMessage ?? '');
  if (expectedMessage instanceof RegExp) {
    expect(actual).toMatch(expectedMessage);
    return;
  }

  expect(actual).toContain(expectedMessage);
}

export function expectApiCode(body: ApiBody, expectedCode: number) {
  const actual = Number(body.responseCode ?? body.code ?? body.status ?? NaN);
  expect(actual).toBe(expectedCode);
}

export async function createUserByApi(request: APIRequestContext, user: ApiUser) {
  const response = await postForm(request, '/api/createAccount', user);
  const body = await readJson(response);

  expect(response.ok()).toBeTruthy();
  expectApiCode(body, 201);
  expectApiMessage(body, /user created!/i);
}

export async function deleteUserByApi(request: APIRequestContext, user: Pick<ApiUser, 'email' | 'password'>) {
  const response = await deleteForm(request, '/api/deleteAccount', {
    email: user.email,
    password: user.password,
  });
  const body = await readJson(response);

  expect(response.ok()).toBeTruthy();
  expectApiCode(body, 200);
  expectApiMessage(body, /account deleted!/i);
}
