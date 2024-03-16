import { PrimaryRepository, Prisma } from '@blogs/database';
import { GraphqlContext } from '@blogs/graphql';
import { TagResponse, QueryGetTagsArgs } from '../../codegen-generated';

export class TagService extends PrimaryRepository<GraphqlContext> {
  async findMany(filter: QueryGetTagsArgs): Promise<TagResponse> {
    const where: Prisma.TagWhereInput = {};
    if (filter.search) {
      const strFilter: Prisma.StringFilter<'Tag'> = {
        contains: filter.search,
        mode: 'insensitive',
      };
      where.OR = [
        {
          name: strFilter,
        },
      ];
    }
    const [total, result] = await Promise.all([
      this.db.tag.count({ where }),
      this.db.tag.findMany({
        where,
        take: filter.limit,
        skip: filter.skip,
      }),
    ]);

    return {
      edges: result,
      total,
    };
  }
}
