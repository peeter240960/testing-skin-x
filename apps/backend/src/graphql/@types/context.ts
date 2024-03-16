import { AuthenticationService } from '../modules/authentication/authentication.service';
import { GraphqlContext } from '@blogs/graphql';
import { PostService } from '../modules/post/post.service';

export type GraphqlContextService = {
  authenticationService: AuthenticationService;
  postService: PostService;
};

export type AppContext = GraphqlContextService & GraphqlContext;
