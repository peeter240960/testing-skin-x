import type { CodegenConfig } from '@graphql-codegen/cli';
import { typeDefs } from '../../apps/backend/src/graphql/schema';

const config: CodegenConfig = {
  overwrite: true,
  schema: typeDefs,
  documents: './apps/blogs/src/app/graphql/**/**/*.gql',
  generates: {
    './apps/blogs/src/app/graphql/generated.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        withHooks: true,
        withRefetchFn: true,
        withMutationFn: true,
      },
    },
  },
};

export default config;
