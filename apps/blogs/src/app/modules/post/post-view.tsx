import { Box, Container, Divider, Stack } from '@mui/material';
import TagSection from '../tag/tag-section';
import PostSection from './post-section';

export default function PostView() {
  return (
    <Container>
      <Stack
        direction="row"
        justifyContent={'space-evenly'}
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Box width={720} p={5}>
          <PostSection />
        </Box>
        <Box width={360} p={5} height="100vh" position={'sticky'} top={0}>
          <TagSection />
        </Box>
      </Stack>
    </Container>
  );
}
