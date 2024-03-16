import { AuthenticationService } from '../modules/authentication/authentication.service';
import { GraphqlContext } from '@blogs/graphql';
import { PostService } from '../modules/post/post.service';
import { TagService } from '../modules/tag/tag.service';

export type GraphqlContextService = {
  authenticationService: AuthenticationService;
  postService: PostService;
  tagService: TagService;
};

export type AppContext = GraphqlContextService & GraphqlContext;
