// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Logo from 'assets/images/lg.png';

// project-imports
import useAuth from 'hooks/useAuth';
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/auth-forms/AuthLogin';

// ================================|| LOGIN ||================================ //

export default function Login() {
  const theme = useTheme();
  const { isLoggedIn } = useAuth();

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid sx={{ textAlign: 'center' }} size={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box component="img" src={Logo} alt="FilmNest Logo" sx={{ width: 'auto', height: 80 }} />
          </Box>
        </Grid>
        <Grid size={12} sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Đăng nhập
          </Typography>
        </Grid>
        <Grid size={12}>
          <AuthLogin forgot="/auth/forgot-password" />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
