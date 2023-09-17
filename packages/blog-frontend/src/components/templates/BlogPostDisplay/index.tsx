import type { FC } from 'react';
import { format } from 'date-fns';
import { styled } from '@mui/material/styles';
import { Avatar, Box, Button, Chip, Divider, Typography } from '@mui/material';
import { BackButton } from 'src/components/atoms/BackButton';
import { Post } from 'src/types/posts.type';
import { HTMLStringComponent } from 'src/components/atoms/HTMLStringComponent';

interface BlogPostDisplayProps {
  post: Post;
  isAuthor: boolean;
  onToggleEdit: () => void;
}

const TextDisplayWrapper = styled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  '& h2': {
    fontSize: theme.typography.h5.fontSize,
    fontWeight: theme.typography.fontWeightBold,
    lineHeight: theme.typography.h5.lineHeight,
    marginBottom: theme.spacing(3),
  },
  '& h3': {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.fontWeightBold,
    lineHeight: theme.typography.h3.lineHeight,
    marginBottom: theme.spacing(3),
  },
  '& p': {
    fontSize: theme.typography.body1.fontSize,
    lineHeight: theme.typography.body1.lineHeight,
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
  },
  '& li': {
    fontSize: theme.typography.body1.fontSize,
    lineHeight: theme.typography.body1.lineHeight,
    marginBottom: theme.spacing(1),
  },
}));

export const BlogPostDisplay: FC<BlogPostDisplayProps> = (props) => {
  const { post, isAuthor, onToggleEdit } = props;
  return (
    <>
      <BackButton text="Back" to="/" />
      <Box sx={{ mt: 3 }}>
        <Chip label={post.category.name} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography sx={{ mt: 3 }} variant="h3">
          {post.title}
        </Typography>
        {isAuthor && (
          <Button component="a" variant="contained" onClick={onToggleEdit}>
            Edit
          </Button>
        )}
      </Box>
      <Typography color="textSecondary" sx={{ mt: 3 }} variant="subtitle1">
        {post.description}
      </Typography>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          mt: 3,
        }}
      >
        <Avatar src={''} />
        <Box sx={{ ml: 2 }}>
          <Typography variant="subtitle2">
            By {post.user.firstName + post.user.lastName} •{' '}
            {post.publishedAt
              ? format(new Date(post.publishedAt).getTime(), 'MMMM d, yyyy')
              : post.status.toUpperCase()}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            {`${3} min read`}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundImage: `url(${post.cover})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          borderRadius: 1,
          height: 380,
          mt: 3,
        }}
      />

      <Box sx={{ py: 3 }}>
        <TextDisplayWrapper>
          <HTMLStringComponent htmlString={post.content} />
        </TextDisplayWrapper>
      </Box>
      <Divider sx={{ my: 3 }} />
    </>
  );
};
