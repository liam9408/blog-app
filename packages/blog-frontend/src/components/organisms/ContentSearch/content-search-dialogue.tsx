import { Fragment } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import { Box, Card, CircularProgress, Typography } from '@mui/material';
import { Post } from 'src/types/posts.type';

interface ContentSearchProps {
  onClose?: () => void;
  open?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modalRef?: any;
  loading: boolean;
  showResults: boolean;
  results: Post[];
}

export const ContentSearchDialog: FC<ContentSearchProps> = (props) => {
  const { open, modalRef, results, showResults, loading, ...other } = props;

  return (
    <Card
      ref={modalRef}
      elevation={10}
      sx={{
        backgroundColor: '#FFFFFF',
        borderRadius: 1,
        position: 'absolute',
        top: 55,
        p: 1,
        minWidth: '55vw',
        maxHeight: '60vh',
        overflowY: 'scroll',
        ...(!open && { display: 'none' }),
      }}
      {...other}
    >
      <Box>
        {loading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              p: 4,
              minWidth: '50vw',
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {!loading && (
          <Box sx={{ minWidth: '50vw' }}>
            {/* <Tip message="Displaying top 10 results" /> */}
            {!showResults && (
              <Box sx={{ p: 2 }}>
                <Typography color="textSecondary" variant="body2">
                  Type and press enter
                </Typography>
              </Box>
            )}
            {showResults && (
              <>
                <Typography
                  sx={{
                    ml: 2,
                    mt: 3,
                    mb: 1,
                    color: 'neutral.900',
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}
                  variant="h6"
                >
                  Results
                  <span>
                    <Typography
                      color="textSecondary"
                      sx={{
                        ml: 1.5,
                        '& span': {
                          fontWeight: 700,
                        },
                      }}
                      variant="caption"
                    >
                      Displaying top 10 results
                    </Typography>
                  </span>
                </Typography>
                {results.length === 0 && (
                  <Box sx={{ p: 2 }}>
                    <Typography color="textSecondary" variant="body2">
                      No matching results
                    </Typography>
                  </Box>
                )}
                {results.map((post) => (
                  <Fragment key={post.title}>
                    <Box sx={{ p: 2, my: 0.5 }}>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ color: 'neutral.800' }}
                        >
                          {post.title}
                        </Typography>
                      </Box>
                      <Typography color="textSecondary" variant="body2">
                        {post.description}
                      </Typography>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                        sx={{ mt: 1 }}
                      >
                        {post.description}
                      </Typography>
                    </Box>
                  </Fragment>
                ))}
                {/* </Box> */}
                {/* ))} */}
              </>
            )}
          </Box>
        )}
      </Box>
    </Card>
  );
};

ContentSearchDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
