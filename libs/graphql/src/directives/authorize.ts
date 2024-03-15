import { GraphQLSchema, defaultFieldResolver } from 'graphql';
import { mapSchema, MapperKind, getDirective } from '@graphql-tools/utils';
import { AuthenticationError } from '../errors/authentication';
import { GraphqlContext } from '../auth/@types';

export function authorizeDirective() {
  const directiveName = 'authorize';

  return {
    authorizedDirectiveTypeDefs: `
        directive @${directiveName} on FIELD_DEFINITION
        `,
    authorizedDirectiveValidator: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
          const accessDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
          if (!accessDirective) {
            return;
          }
          const { resolve = defaultFieldResolver } = fieldConfig;
          fieldConfig.resolve = async function (source, args, context: GraphqlContext, info) {
            if (!context.accountId || !context.authorization) {
              throw new AuthenticationError(undefined, {
                directive: 'Authorization',
              });
            }
            return resolve(source, args, context, info);
          };

          return fieldConfig;
        },
      }),
  };
}
