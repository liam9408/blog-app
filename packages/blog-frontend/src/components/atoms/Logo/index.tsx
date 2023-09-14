import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Image from 'next/image';

type Variant = 'light' | 'primary';

interface LogoProps {
  src?: string;
  variant?: Variant;
}

export const Logo = styled((props: LogoProps) => {
  const { src, ...other } = props;

  // const color = variant === 'light' ? '#C1C4D6' : '#5048E5';

  return (
    <Image
      alt=""
      src={src || '/static/logo.png'}
      width="42px"
      height="42px"
      {...other}
    />
  );
})``;

Logo.defaultProps = {
  variant: 'primary',
};

Logo.propTypes = {
  variant: PropTypes.oneOf<Variant>(['light', 'primary']),
};
