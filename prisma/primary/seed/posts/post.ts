import { client } from '../client';
import { Post } from '@prisma/client-primary';
import fs from 'fs'
import path from 'path';

export async function seedPosts() {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'posts.json'), 'utf-8')) as Omit<Post, 'id'>[]
  await client.post.createMany({
    data,
  });
}