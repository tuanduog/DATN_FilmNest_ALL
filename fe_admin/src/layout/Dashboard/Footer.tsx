import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ==============================|| MAIN LAYOUT - FOOTER ||============================== //

export default function Footer() {
  return (
    <Stack direction="row" sx={{ justifyContent: 'left', alignItems: 'center', p: '24px 16px 0px', mt: 'auto' }}>
      <Typography variant="caption">
        &copy; FilmNest crafted with ♥ by Team{' '}
        <Link href="https://themeforest.net/user/phoenixcoded" target="_blank" underline="none">
          {' '}
          FilmNest
        </Link>
      </Typography>
    </Stack>
  );
}
