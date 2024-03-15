import { generate } from '@genql/cli';
import * as path from 'path';
import { typeDefs } from '../../apps/backend/src/graphql/schema';

generate({
  schema: typeDefs,
  output: path.join(__dirname, '../../libs/genql/src/generated'),
})
  .then(() => {
    process.exit(0);
  })
  .catch(() => {
    process.exit(0);
  });
