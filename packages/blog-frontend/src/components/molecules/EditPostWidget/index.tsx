import type { FC } from 'react';
import NextLink from 'next/link';
import {
  Card,
  // Typography,
  Button,
} from '@mui/material';

interface EditPostWidgetProps {
  text: string;
  to: string;
}

export const EditPostWidget: FC<EditPostWidgetProps> = (props) => {
  const { text, to } = props;

  return (
    <Card
      elevation={16}
      sx={{
        alignItems: 'center',
        borderRadius: 1,
        display: 'flex',
        justifyContent: 'space-between',
        mb: 6,
        mt: 3,
        px: 3,
        py: 2,
      }}
    >
      {/* <Typography variant="subtitle1">Hello, Admin</Typography> */}
      <NextLink href={to} passHref>
        <Button component="a" variant="contained">
          {text}
        </Button>
      </NextLink>
    </Card>
  );
};
