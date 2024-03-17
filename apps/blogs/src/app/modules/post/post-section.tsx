import { Box, Stack, TextField, Typography } from '@mui/material';
import PostList from './post-list';
import { useGetPostsQuery } from '../../graphql/generated';
import { useMemo, useState } from 'react';
import { useDebounce } from '../../hooks/use-debounce';
import { TagChipItem } from '../tag';
import { useRouter, useSearchParams } from '../../routes/hooks';
import { paths } from '../../routes/paths';
export default function PostSection() {
  const limit = 10;
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchByTag = searchParams.get('searchByTag');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 700);
  const { data, loading } = useGetPostsQuery({
    variables: { limit, search: debouncedQuery, searchByTag: searchByTag },
  });
  const posts = useMemo(
    () => data?.getPosts.edges ?? [],
    [data?.getPosts.edges]
  );
  const renderFilter = (
    <Stack spacing={1}>
      <TextField
        label="For you"
        variant="standard"
        value={searchQuery}
        sx={{ '& .MuiInputBase-root': { height: 40 } }}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchByTag && (
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
          <Typography variant="caption">Results of topic</Typography>
          <TagChipItem
            topic={{
              name: searchByTag,
            }}
            onDelete={() => {
              router.replace(paths.root);
            }}
          />
        </Stack>
      )}
    </Stack>
  );
  const renderContent = (
    <>
      <PostList posts={posts} loading={loading} />
      {data && data?.getPosts.total > posts.length && (
        <Stack mt={1}>
          <Typography
            component={Box}
            variant="subtitle2"
            fontWeight={400}
            color="green"
            sx={{ cursor: 'pointer', ':hover': { color: 'black' } }}
            // onClick={onSeeMoreTopic}
          >
            See more topics
          </Typography>
        </Stack>
      )}
    </>
  );
  return (
    <Stack spacing={1}>
      {renderFilter}
      {renderContent}
    </Stack>
  );
}
