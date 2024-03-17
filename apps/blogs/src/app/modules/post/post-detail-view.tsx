import { Container, Stack, Typography } from '@mui/material';
import { useParams } from '../../routes/hooks';
import Markdown from '../../components/markdown/markdown';
import { useGetPostQuery } from '../../graphql/generated';
import { LoadingScreen } from '../../components/loading-screen';
import { TagChipItem } from '../tag';

export default function PostDetailView() {
  const { id = '' } = useParams();
  const { loading, data } = useGetPostQuery({ variables: { id }, skip: !id });
  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <Container>
      <Typography pt={3} variant="h5">
        {data?.getPost.title}
      </Typography>
      <Stack alignItems="center" spacing={1} direction="row" py={2}>
        {data?.getPost?.postTags?.map((tag) => (
          <TagChipItem
            key={tag.id}
            topic={{
              name: tag.tagId,
            }}
          />
        ))}
      </Stack>
      {data?.getPost.content && <Markdown>{data?.getPost.content}</Markdown>}
    </Container>
  );
}
