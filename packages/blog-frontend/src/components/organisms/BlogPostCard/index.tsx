import type { FC } from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Link,
  Typography,
  Skeleton,
  CardHeader,
} from '@mui/material';
import { getInitials } from '../../../utils/get-initials';

interface BlogPostCardProps {
  authorAvatar: string;
  authorName: string;
  category: string;
  cover: string;
  publishedAt: number;
  readTime: string;
  shortDescription: string;
  title: string;
  id: number;
}

export const BlogPostCardSkeleton = () => {
  return (
    <Card sx={{ maxWidth: '100%', m: 2 }}>
      <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
      <CardHeader
        avatar={
          <Skeleton
            animation="wave"
            variant="circular"
            width={40}
            height={40}
          />
        }
        title={
          <Skeleton
            animation="wave"
            height={20}
            width="100%"
            style={{ marginBottom: 6 }}
          />
        }
        subheader={<Skeleton animation="wave" height={20} width="100%" />}
      />
    </Card>
  );
};

export const BlogPostCard: FC<BlogPostCardProps> = (props) => {
  const {
    id,
    authorAvatar,
    authorName,
    category,
    cover,
    publishedAt,
    readTime,
    shortDescription,
    title,
    ...other
  } = props;

  return (
    <Card
      sx={{
        '& + &': {
          mt: 6,
        },
      }}
      {...other}
    >
      <NextLink href={`/posts/${id}`} target="_blank" passHref>
        <Link color="textPrimary" component="a" target="_blank" variant="h5">
          <CardMedia component="a" image={cover} sx={{ height: 280 }} />
        </Link>
      </NextLink>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <NextLink href={`/post/${id}`} target="_blank" passHref>
            <Link
              color="textPrimary"
              component="a"
              target="_blank"
              variant="h5"
            >
              {title}
            </Link>
          </NextLink>
          <Box sx={{ mb: 2 }}>
            <Chip label={category} />
          </Box>
        </Box>
        <Typography
          color="textSecondary"
          sx={{
            height: 48,
            mt: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          }}
          variant="body1"
        >
          {shortDescription}
        </Typography>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            mt: 2,
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <Avatar src={authorAvatar} sx={{ mr: 2 }}>
              {getInitials(authorName)}
            </Avatar>
            <Typography variant="subtitle2">
              By {authorName} • {format(publishedAt, 'MMM d, yyyy')}
            </Typography>
          </Box>
          <Typography
            align="right"
            color="textSecondary"
            sx={{ flexGrow: 1 }}
            variant="body2"
          >
            {`${readTime} read`}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

BlogPostCard.propTypes = {
  authorAvatar: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  cover: PropTypes.string.isRequired,
  publishedAt: PropTypes.number.isRequired,
  readTime: PropTypes.string.isRequired,
  shortDescription: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
