import { Stack, Skeleton, Typography } from '@mui/material';

import TagChipItem from './tag-chip-item';
import { Tag } from '../../graphql/generated';
import { useCallback } from 'react';
import { useRouter } from '../../routes/hooks';
import { paths } from '../../routes/paths';
// --------------------------------------------------

type Props = {
  topics: Tag[];
  loading?: boolean;
};
export default function TagChipList({ topics, loading }: Props) {
  const router = useRouter();
  const onClickTag = useCallback(
    (tagId: string) => {
      router.push(`${paths.root}?searchByTag=${tagId}`);
    },
    [router]
  );
  const renderSkeleton = [...Array(10)].map((_, index) => (
    <Skeleton height={40} width={80} key={index} />
  ));
  const renderList = (
    <>
      {topics.map((topic, index) => (
        <TagChipItem
          onClick={() => onClickTag(topic.name)}
          topic={topic}
          key={index}
        />
      ))}
    </>
  );

  if (!loading && !topics.length) {
    return <Typography variant="subtitle2">No data available.</Typography>;
  }
  return (
    <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
      {loading ? renderSkeleton : renderList}
    </Stack>
  );
}
