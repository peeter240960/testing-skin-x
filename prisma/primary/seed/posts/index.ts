import { Post } from '@prisma/client-primary';
import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import { client } from '../client';

export async function seedPost() {
  const createdBy = 'DB Seed';
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'posts.json'), 'utf-8')
  ) as (Omit<Post, 'id'> & { tags: string[] })[];
  await Promise.all(
    data.map(async (item) => {
      const post = await client.post.create({
        data: _.omit(item, 'tags'),
      });
      const tags = await Promise.all(
        item.tags.map(async (tagname) => {
          const tag = await client.tag.upsert({
            where: { name: tagname },
            create: { name: tagname, createdBy },
            update: { name: tagname, createdBy },
          });
          const postTag = await client.postTag.create({
            data: {
              postId: post.id,
              tagId: tag.name,
              createdBy,
            },
          });

          return {
            tag,
            postTag,
          };
        })
      );

      return { post, tags };
    })
  );
}
