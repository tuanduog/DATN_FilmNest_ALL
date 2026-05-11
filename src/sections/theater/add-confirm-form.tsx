import { useState } from 'react';
import { HttpStatusCode } from 'axios';
import { useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import { Alert, Box, Divider, Grid, Paper, Snackbar, Stack, Typography } from '@mui/material';

// project-imports
import { create } from 'api/theater';
import { useIntl } from 'react-intl';
import useAuth from 'hooks/useAuth';
import { Theater } from 'types/theater';
import AnimateButton from 'components/@extended/AnimateButton';

interface ConfirmProps {
    handleBack: () => void;
    theater: Theater;
}

export default function AddConfirmForm({ handleBack, theater }: ConfirmProps) {
    const { logout } = useAuth();
    const intl = useIntl();
    const navigate = useNavigate();

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    const handleSubmit = async () => {
        try {
            const response = await create(theater);

            if (response.status === HttpStatusCode.Ok) {
                navigate('/admin/theater', {
                    state: { alert: { open: true, severity: 'success', message: intl.formatMessage({ id: 'add-theater-success' }) } }
                });
            } else if (response.status === HttpStatusCode.BadRequest) {
                setAlert({ open: true, message: intl.formatMessage({ id: 'invalid-form' }), severity: 'error' });
            } else if (response.status === HttpStatusCode.Unauthorized) {
                logout();
            } else if (response.status === HttpStatusCode.UnprocessableEntity) {
                setAlert({ open: true, message: response.message, severity: 'error' });
            } else {
                setAlert({ open: true, message: intl.formatMessage({ id: 'unknown-error' }), severity: 'error' });
            }
        } catch (err: any) {
            setAlert({ open: true, message: err.message, severity: 'error' });
        }
    };

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 15 }, mr: { xs: 0, lg: 15 }, borderRadius: 2 }}>
                <Box mb={4}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                        {intl.formatMessage({ id: 'confirm-theater-info' })}
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'theater-name' })}</InputLabel>
                                <Typography>{theater.name}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'hotline' })}</InputLabel>
                                <Typography>{theater.hotline}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'province-city' })}</InputLabel>
                                <Typography>{theater.provinceName}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'commune-ward' })}</InputLabel>
                                <Typography>{theater.communeName}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'open-time' })}</InputLabel>
                                <Typography>{theater.openTime}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'close-time' })}</InputLabel>
                                <Typography>{theater.closeTime}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'detailed-address' })}</InputLabel>
                                <Typography>{theater.address}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'description' })}</InputLabel>
                                <Typography sx={{ whiteSpace: 'pre-wrap' }}>{theater.description}</Typography>
                            </Stack>
                        </Grid>

                        {theater.latitude && theater.longitude && (
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Stack sx={{ gap: 1 }}>
                                    <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'coordinates' })}</InputLabel>
                                    <Typography>{theater.latitude}, {theater.longitude}</Typography>
                                </Stack>
                            </Grid>
                        )}
                    </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
                    <Button variant="contained" sx={{ my: 3 }} color="secondary" onClick={handleBack}>
                        {intl.formatMessage({ id: 'back' })}
                    </Button>

                    <AnimateButton>
                        <Button variant="contained" type="button" sx={{ my: 3 }} color="primary" onClick={handleSubmit}>
                            {intl.formatMessage({ id: 'confirm' })}
                        </Button>
                    </AnimateButton>
                </Grid>
            </Paper>

            <Snackbar
                open={alert.open}
                autoHideDuration={3000}
                onClose={() => setAlert({ ...alert, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity} variant="filled" sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
