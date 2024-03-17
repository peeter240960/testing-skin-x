import { Box, Container, Divider, Stack, Typography } from '@mui/material';
import { useParams } from '../../routes/hooks';
import Markdown from '../../components/markdown/markdown';
import { useGetPostQuery } from '../../graphql/generated';
import { LoadingScreen } from '../../components/loading-screen';
import { TagChipItem } from '../tag';
import { fDate } from '../../utils';

export default function PostDetailView() {
  const { id = '' } = useParams();
  const { loading, data } = useGetPostQuery({ variables: { id }, skip: !id });
  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <Container maxWidth={'md'}>
      <Typography pt={3} variant="h3" fontWeight={'bold'}>
        {data?.getPost.title}
      </Typography>
      <Stack>
        <Stack direction={'row'} alignItems={'center'} spacing={1} mt={1}>
          <Typography variant="subtitle2" color={'text.secondary'}>
            Published
          </Typography>
          <Box sx={{width:'4px', height: '4px', background: '#999999', borderRadius: '2px'}} />
          <Typography variant="subtitle2" color={'text.secondary'}>
            {fDate(data?.getPost.postedAt, 'MMM d, yyyy')}
          </Typography>
        </Stack>
        <Typography variant="body1" fontWeight={400}>
          Posted by {data?.getPost.postedBy}
        </Typography>
      </Stack>
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
      <Divider sx={{ mt: 1, mb: 4 }} />
      {data?.getPost.content && <Markdown>{data?.getPost.content}</Markdown>}
    </Container>
  );
}
