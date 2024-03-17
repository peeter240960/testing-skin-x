import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/material';

import { TagChipItem } from '../tag';
import { paths } from '../../routes/paths';
import { RouterLink } from '../../routes/components';
import { Post } from '../../graphql/generated';
import TextMaxLine from '../../components/text-max-line';
import { replaceHtml } from '../../utils';

// ----------------------------------------------------------------------

type Props = {
  post: Post;
};

export default function PostItem({ post }: Props) {
  return (
    <Box py={2}>
      <PostContent {...post} />
    </Box>
  );
}

// ----------------------------------------------------------------------

type PostContentProps = Post;

export function PostContent({
  title,
  content,
  id,
  postTags,
}: PostContentProps) {
  const linkTo = paths.post.details(id);

  return (
    <Stack spacing={4}>
      <Stack direction="column">
        <Link color="inherit" underline='hover' component={RouterLink} href={linkTo}>
          <TextMaxLine
            sx={{ height: 'fit-content' }}
            variant={'h6'}
            line={2}
            persistent
          >
            {title}
          </TextMaxLine>
        </Link>
        <TextMaxLine color="text.secondary" variant="body2" line={2} persistent>
          {replaceHtml(content)}
        </TextMaxLine>
      </Stack>
      <Stack direction="row" flexWrap="wrap" justifyContent="space-between">
        <Stack alignItems="center" spacing={1} direction="row">
          {postTags?.map((tag) => (
            <TagChipItem
              key={tag.id}
              topic={{
                name: tag.tagId,
              }}
              size='small'
              variant='outlined'
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
