import type { FC } from 'react';
import NextLink from 'next/link';
import { Button } from '@mui/material';
import { ArrowLeft as ArrowLeftIcon } from 'src/icons/arrow-left';

interface BackButtonProps {
  text: string;
  to: string;
}

export const BackButton: FC<BackButtonProps> = (props) => {
  const { text, to } = props;

  return (
    <NextLink href={to} passHref>
      <Button component="a" startIcon={<ArrowLeftIcon fontSize="small" />}>
        {text}
      </Button>
    </NextLink>
  );
};
