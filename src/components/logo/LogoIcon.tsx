import { Typography, Box, Stack } from '@mui/material';

export default function LogoIcon() {
  return (
    <Stack direction="row" alignItems="center" justifyContent="center" sx={{ width: '100%', cursor: 'pointer' }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 900,
          display: 'flex',
          alignItems: 'center',
          lineHeight: 1
        }}
      >
        <Box component="span" sx={{ color: 'text.primary' }}>
          F
        </Box>
        <Box component="span" sx={{ color: '#10b981' }}>
          N
        </Box>
      </Typography>
    </Stack>
  );
}
