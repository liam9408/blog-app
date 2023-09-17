import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Image from 'next/image';

type Variant = 'light' | 'primary';

interface LogoProps {
  variant?: Variant;
}

export const Logo = styled((props: LogoProps) => {
  const { ...other } = props;

  return (
    <Image
      alt=""
      src="/static/images/logo.png"
      width="42px"
      height="42px"
      {...other}
    />
  );
})``;

Logo.propTypes = {
  variant: PropTypes.oneOf<Variant>(['light', 'primary']),
};
