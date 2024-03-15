
import { client } from './client';
import { seedPosts } from './posts/post';
async function cleanup() {
  const tablenamesList = (await client.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname='public'`) as {
    tablename: string;
  }[];

  const tablenames = tablenamesList.filter(({ tablename }) => tablename !== '_prisma_migrations').map((t) => t.tablename);

  for (const tablename of tablenames) {
    await client.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
  }
}

async function main() {
  await cleanup(); // clean db
  await seedPosts()
}

main();
