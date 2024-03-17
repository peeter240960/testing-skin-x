import { Stack, Typography, Box } from '@mui/material';
import { useCallback, useMemo } from 'react';
import TagChipList from './tag-chip-list';
import { useGetTagsQuery } from '../../graphql/generated';

export default function TagSection() {
  const limit = 10;
  const {
    data: tagResponse,
    loading: tagResponseLoading,
    fetchMore: fetchMoreTags,
  } = useGetTagsQuery({
    variables: { limit },
  });

  const tags = useMemo(
    () => tagResponse?.getTags.edges ?? [],
    [tagResponse?.getTags.edges]
  );
  const onSeeMoreTopic = useCallback(() => {
    fetchMoreTags({
      variables: { limit, skip: tagResponse?.getTags.edges?.length ?? 10 },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult.getTags?.edges || !prev.getTags?.edges)
          return prev;
        const newTags = [
          ...prev.getTags.edges,
          ...fetchMoreResult.getTags.edges,
        ];
        return {
          ...prev,
          getTags: {
            ...prev.getTags,
            edges: newTags,
          },
        };
      },
    });
  }, [fetchMoreTags, tagResponse?.getTags.edges?.length]);

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle1" fontWeight={600}>
        Topics
      </Typography>

      <TagChipList topics={tags} loading={tagResponseLoading} />
      {tagResponse && tagResponse?.getTags.total > tags.length && !tagResponseLoading && (
        <Stack mt={1}>
          <Typography
            component={Box}
            variant="subtitle2"
            fontWeight={400}
            color="green"
            sx={{ cursor: 'pointer', ':hover': { color: 'black' } }}
            onClick={onSeeMoreTopic}
          >
            See more topics
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}
