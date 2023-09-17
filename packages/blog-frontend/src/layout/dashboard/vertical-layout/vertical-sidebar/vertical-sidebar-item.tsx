import type { FC, ReactNode } from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { Box, Button, ListItem } from '@mui/material';
import type { ListItemProps } from '@mui/material';
import { Category } from '../../../../types/category.type';

interface DashboardSidebarItemProps extends ListItemProps {
  icon?: ReactNode;
  item?: Category;
  query?: string;
}

export const DashboardSidebarItem: FC<DashboardSidebarItemProps> = (props) => {
  const { icon, query, item } = props;

  const active = query === item.name; // We don't compare query params

  // Leaf
  return (
    <ListItem
      disableGutters
      sx={{
        display: 'flex',
        mb: 0.5,
        py: 0,
        px: 2,
      }}
    >
      <NextLink href={item.path} passHref>
        <Button
          component="a"
          size="large"
          startIcon={icon}
          disableRipple
          sx={{
            borderRadius: 1,
            color: 'neutral.300',
            justifyContent: 'flex-start',
            pl: `24px`,
            pr: 3,
            textAlign: 'left',
            textTransform: 'none',
            width: '100%',
            ...(active && {
              backgroundColor: 'rgba(255,255,255, 0.08)',
              color: 'secondary.main',
              fontWeight: 'fontWeightBold',
            }),
            '& .MuiButton-startIcon': {
              color: active ? 'secondary.main' : 'neutral.400',
            },
            '&:hover': {
              backgroundColor: 'rgba(255,255,255, 0.08)',
            },
          }}
        >
          <Box sx={{ flexGrow: 1 }}>{item.name}</Box>
        </Button>
      </NextLink>
    </ListItem>
  );
};

DashboardSidebarItem.propTypes = {
  icon: PropTypes.node,
  item: PropTypes.any,
  query: PropTypes.string,
};
