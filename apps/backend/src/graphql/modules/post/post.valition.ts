import { z } from 'zod';

export const postSortValidation = z.object({
  orderBy: z
    .enum(['title', 'content', 'postedAt', 'postedBy'])
    .default('postedAt'),
  orderType: z.enum(['asc', 'desc']).default('asc'),
});
