import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:3000/graphql',
  documents: './apps/blogs/src/app/graphql/**/**/*.gql',
  generates: {
    './apps/blogs/src/app/graphql/generated.ts': {
      // preset: 'client',
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
