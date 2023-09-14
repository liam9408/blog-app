import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { DashboardLayout as VerticalLayout } from './vertical-layout';

interface DashboardLayoutProps {
  children?: ReactNode;
}

export const DashboardLayout: FC<DashboardLayoutProps> = (props) => {
  const { children } = props;
  return <VerticalLayout>{children}</VerticalLayout>;
};

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
