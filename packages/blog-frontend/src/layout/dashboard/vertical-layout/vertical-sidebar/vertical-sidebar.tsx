import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FC } from 'react';
import NextLink from 'next/link';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { Box, Divider } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useAuth } from '../../../../hooks/use-auth';
import { Logo } from '../../../../components/atoms/Logo';
import { Scrollbar } from '../../../../components/molecules/ScrollBar';
import { DashboardSidebarItem } from './vertical-sidebar-item';
import { useHover } from '../../../..//hooks/use-hover';
import { useMounted } from '../../../..//hooks/use-mounted';
import { categoriesApi } from '../../../../api/category-api';

interface VerticalSidebarComponentProps {
  onClose?: () => void;
  open?: boolean;
  query?: string;
}

export const VerticalSidebarComponent: FC<VerticalSidebarComponentProps> = (
  props
) => {
  const { onClose, query } = props;
  const { user, changeCompany } = useAuth();
  const isMounted = useMounted();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const getSections = useCallback(async () => {
    setLoading(true);
    try {
      const { success, data } = await categoriesApi.getCategories();

      if (isMounted()) {
        if (success)
          setCategories(
            data.map((category) => ({
              id: category.id,
              name: category.name,
              path: `home?category=${category.id}`,
            }))
          );
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getSections();
  }, []);

  const [hoverRef, isHovered] = useHover<HTMLDivElement>();

  return (
    <>
      <Scrollbar
        sx={{
          height: '100%',
          '& .simplebar-content': {
            height: '100%',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
          ref={hoverRef}
        >
          <div>
            <Box
              sx={{
                p: 3,
                height: '65px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <ArrowBackIosNewIcon
                onClick={() => onClose()}
                sx={{
                  display: !isHovered && 'none',
                  color: 'white',
                  cursor: 'pointer',
                  opacity: '40%',
                  height: 20,
                  width: 20,
                }}
              />
            </Box>
          </div>
          <Divider
            sx={{
              borderColor: '#2D3748', // dark divider
              mb: 3,
            }}
          />
          <Box sx={{ flexGrow: 1 }}>
            {categories.map((category) => (
              <DashboardSidebarItem
                key={`category-${category.id}`}
                item={category}
                query={query}
                sx={{
                  mt: 2,
                  '& + &': {
                    mt: 2,
                  },
                }}
              />
            ))}
          </Box>
          <Divider
            sx={{
              borderColor: '#2D3748', // dark divider
            }}
          />
        </Box>
      </Scrollbar>
    </>
  );
};

VerticalSidebarComponent.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
