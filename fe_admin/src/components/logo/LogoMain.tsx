import { Typography, Stack, Box } from '@mui/material';

export default function LogoMain() {
  return (
    <Stack direction="row" alignItems="center" justifyContent="center" sx={{ width: '100%', py: 1.5, cursor: 'pointer' }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          letterSpacing: '-1px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Box component="span" sx={{ color: 'text.primary' }}>
          Film
        </Box>
        <Box component="span" sx={{ color: '#10b981' }}>
          Nest
        </Box>
      </Typography>
    </Stack>
  );
}
