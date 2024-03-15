import { GraphQLResolveInfo } from 'graphql';

// Prisma Relay Cursor Connection Arguments
export interface Options<Record, Cursor, Node, CustomEdge extends Edge<Node>> {
  getCursor?: (record: Record) => Cursor;
  encodeCursor?: (cursor: Cursor) => string;
  decodeCursor?: (cursorString: string) => Cursor;

  recordToEdge?: (record: Record) => Omit<CustomEdge, 'cursor'>;

  resolveInfo?: GraphQLResolveInfo | null;
}

// Prisma Arguments
export interface PrismaCursorFindManyArguments<Cursor> {
  cursor?: Cursor;
  take?: number;
  skip?: number;
}

// Relay Arguments
export interface ConnectionArguments {
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}

export type PrismaOffsetFindmanyArguments = {
  take?: number;
  skip?: number;
};

// Relay Response
export interface Connection<T, CustomEdge extends Edge<T> = Edge<T>> {
  nodes: T[];
  edges: Array<CustomEdge>;
  pageInfo: PageInfo;
}

export interface Edge<T> {
  cursor: string;
  node: T;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}
