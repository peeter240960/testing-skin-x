import {
  PrimaryRepository,
  Prisma,
  findManyCursorPagination,
} from '@blogs/database';

import { GraphqlContext } from '@blogs/graphql';
import { Post, PostResponse, QueryGetPostsArgs } from '../../codegen-generated';
export class PostService extends PrimaryRepository<GraphqlContext> {
  async findTagsOfPost(postId: string) {
    return this.db.postTag.findMany({ where: { postId } });
  }
  async findMany(filter: QueryGetPostsArgs): Promise<PostResponse> {
    const where: Prisma.PostWhereInput = {
      ...(filter.searchByTag && {
        PostTag: { some: { tagId: filter.searchByTag } },
      }),
    };
    if (filter.search) {
      const strFilter: Prisma.StringFilter<'Post'> = {
        contains: filter.search,
        mode: 'insensitive',
      };
      where.OR = [
        {
          title: strFilter,
        },
        {
          content: strFilter,
        },
      ];
    }
    const [total, result] = await Promise.all([
      this.db.post.count({ where }),
      findManyCursorPagination(
        (args) =>
          this.db.post.findMany({
            ...args,
            where,
            ...(filter.sort && {
              orderBy: { [filter.sort.sortBy]: filter.sort.sortType },
            }),
          }),
        { first: filter.limit, after: filter.cursor }
      ),
    ]);

    console.log(result);
    return {
      edges: result.edges.map(({ node }) => node as Post) ?? [],
      endCursor: result.pageInfo.endCursor,
      hasNextPage: result.pageInfo.hasNextPage,
      total,
    };
  }
  async findById(id: string) {
    return await this.db.post.findUniqueOrThrow({ where: { id } });
  }
}
