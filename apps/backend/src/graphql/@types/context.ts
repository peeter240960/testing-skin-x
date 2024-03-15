import { AuthenticationService } from '../modules/authentication/authentication.service';
import { GraphqlContext } from '@blogs/graphql';

export type GraphqlContextService = {
  authenticationService: AuthenticationService;
};

export type AppContext = GraphqlContextService & GraphqlContext;
