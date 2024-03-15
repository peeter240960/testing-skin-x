import { last } from 'lodash';

import { InvalidPaginationArgs } from './error';
import { Edge, PrismaOffsetFindmanyArguments } from './@types';

export async function findManyOffsetPagination<
  Record extends { id: string },
  CustomEdge extends Edge<Record> = Edge<Record>
>(
  findMany: (args: PrismaOffsetFindmanyArguments) => Promise<Record[]>,
  args: PrismaOffsetFindmanyArguments = {}
) {
  if (args.skip && args.skip < 0) {
    throw new InvalidPaginationArgs('skip must be positive value');
  }

  if (args.take && args.take < 0) {
    throw new InvalidPaginationArgs('take must be positive value');
  }

  const records = await findMany({
    skip: args.skip,
    take: args.take,
  });

  return {
    edges: records.map(
      (el) =>
        ({
          ...el,
          cursor: (el as unknown as { id: string }).id,
        } as unknown as CustomEdge)
    ),
    nodes: records.map((el) => el),
    pageInfo: {
      hasNextPage: records.length === args.take,
      hasPreviousPage: args.skip > 0,
      startCursor: (records[0] as unknown as { id: string })?.id ?? null,
      endCursor: (last(records) as unknown as { id: string })?.id ?? null,
    },
  };
}
