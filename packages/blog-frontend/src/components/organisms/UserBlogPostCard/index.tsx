import type { FC } from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
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

interface UserBlogPostCardProps {
  authorAvatar: string;
  authorName: string;
  category: string;
  cover: string;
  createdAt: number;
  publishedAt: number;
  readTime: string;
  shortDescription: string;
  title: string;
  id: number;
  status: string;
}

export const UserBlogPostCardSkeleton = () => {
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

export const UserBlogPostCard: FC<UserBlogPostCardProps> = (props) => {
  const {
    id,
    publishedAt,
    category,
    cover,
    createdAt,
    shortDescription,
    title,
    status,
    ...other
  } = props;

  return (
    <Card
      sx={{
        '& + &': {
          mt: 3,
        },
      }}
      {...other}
    >
      <CardContent sx={{ py: 3, cursor: 'pointer' }}>
        <NextLink href={`/post/${id}`} target="_blank" passHref>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
          >
            <Link
              color="textPrimary"
              component="a"
              target="_blank"
              variant="h5"
            >
              <CardMedia
                component="a"
                image={cover}
                sx={{ width: 100, height: 130, mr: 2, borderRadius: '5px' }}
              />
            </Link>
            <Box
              height="auto"
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="flex-start"
            >
              <Box sx={{ mb: 2 }}>
                <Chip
                  size="small"
                  label={
                    <Typography
                      color="textSecondary"
                      sx={{
                        fontSize: '11px',
                      }}
                    >
                      {category}
                    </Typography>
                  }
                />
              </Box>
              <NextLink href={`/post/${id}`} target="_blank" passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  target="_blank"
                  variant="h6"
                >
                  {title}
                </Link>
              </NextLink>
              <Typography
                color="textSecondary"
                sx={{
                  height: 'auto',
                  mt: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                }}
                variant="body2"
              >
                {shortDescription}
              </Typography>
              <Box
                height="auto"
                display="flex"
                flexDirection="row"
                alignItems="flex-start"
                justifyContent="flex-start"
                mt="10px"
              >
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontSize: '12px' }}
                >
                  Created On: {format(createdAt, 'MMM d, yyyy')}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontSize: '12px', ml: 1 }}
                >
                  •{' '}
                  {publishedAt
                    ? `Published On: ${format(
                        new Date(publishedAt).getTime(),
                        'MMMM d, yyyy'
                      )}`
                    : status.toUpperCase()}{' '}
                </Typography>
              </Box>
            </Box>
          </Box>
        </NextLink>
      </CardContent>
    </Card>
  );
};

UserBlogPostCard.propTypes = {
  authorAvatar: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  cover: PropTypes.string.isRequired,
  publishedAt: PropTypes.number.isRequired,
  readTime: PropTypes.string.isRequired,
  shortDescription: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
