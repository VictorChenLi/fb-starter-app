import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

FBLogo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default function FBLogo({ sx }) {
  const theme = useTheme();

  const PRIMARY_MAIN = theme.palette.primary.main;

  const FBLogo = (
    <Box sx={{ width: 24, height: 24, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" fill={PRIMARY_MAIN} />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 10.1202C0 4.53074 4.53074 0 10.116 0H24V13.884C24 19.4693 19.4693 24 13.8798 24H0V10.1202ZM15.0052 7.57346C16.835 7.57346 18.3189 6.09378 18.3189 4.25981V3.39284H14.751C12.9837 3.39284 11.5415 4.77249 11.4415 6.51476V3.39284H7.52761V20.6072H11.4665V13.7506H16.2473V10.4203H11.4456V7.57346H15.0052Z"
          fill="white"
        />
      </svg>
    </Box>
  );

  return FBLogo;
}
