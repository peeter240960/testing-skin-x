import Stack from '@mui/material/Stack';
import { Divider } from '@mui/material';
import { Post } from '../../graphql/generated';
import PostItem from './post-item';
import { PostItemSkeleton } from './post-skeleton';
// ----------------------------------------------------------------------

type Props = {
  posts: Post[];
  loading?: boolean;
};

export default function PostList({ posts, loading }: Props) {
  const renderSkeleton = [...Array(16)].map((_, index) => (
    <PostItemSkeleton variant="horizontal" key={index} />
  ));

  const renderList = posts.map((post, index) => (
    <PostItem post={post} key={index} />
  ));

  return (
    <Stack spacing={1} divider={<Divider flexItem />}>
      {loading ? renderSkeleton : renderList}
    </Stack>
  );
}
