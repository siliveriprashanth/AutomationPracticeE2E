export type ApiUser = {
  name: string;
  email: string;
  password: string;
  title: string;
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
};

let apiCounter = 0;

export function createApiUser(prefix = 'api-user'): ApiUser {
  apiCounter += 1;
  const stamp = `${Date.now()}-${apiCounter}`;

  return {
    name: `API ${prefix} ${apiCounter}`,
    email: `${prefix}.${stamp}@example.com`,
    password: 'Password@123',
    title: 'Mr',
    birth_date: '10',
    birth_month: '5',
    birth_year: '1995',
    firstname: 'Api',
    lastname: 'Tester',
    company: 'Codex QA',
    address1: '221B Baker Street',
    address2: 'Suite 7',
    country: 'India',
    zipcode: '560001',
    state: 'Karnataka',
    city: 'Bengaluru',
    mobile_number: '9999999999',
  };
}
