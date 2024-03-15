import { mergeTypeDefs } from '@graphql-tools/merge';
import { print } from 'graphql';
import { typeDef as authenticationTypeDef } from './modules/authentication/authentication.schema';
import { uploadTypeDefs, dateTypeDefs, deleteOperationResultTypeDef, jsonTypeDef, authorizeDirective, sdlTypeDef } from '@blogs/graphql';

const { authorizedDirectiveTypeDefs } = authorizeDirective();

export const typeDefs = print(
  mergeTypeDefs([
    authenticationTypeDef,
    authorizedDirectiveTypeDefs,
    jsonTypeDef,
    deleteOperationResultTypeDef,
    uploadTypeDefs,
    dateTypeDefs,
    sdlTypeDef,
  ])
);
