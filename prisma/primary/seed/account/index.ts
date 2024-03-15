import { client } from '../client';
import { hash } from 'argon2';

export async function seedAccount() {
  return await client.account.create({
    data: {
      username: 'user',
      password: await hash('user@1234'),
      createdBy: 'DB Seed',
    },
  });
}
