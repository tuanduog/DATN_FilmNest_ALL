import {
    Box,
    InputLabel,
    Typography,
    Paper,
    Button,
    Stack,
    Grid,
    Snackbar,
    Alert
} from '@mui/material';
import { useState } from 'react';
import AnimateButton from 'components/@extended/AnimateButton';
import { useNavigate } from 'react-router-dom';
import { Showtime } from 'types/showtime';
import { create } from 'api/showtime';
import { HttpStatusCode } from 'axios';
import { useIntl } from 'react-intl';
import formatDate from 'utils/formatDateTime';

interface AddConfirmFormProps {
    handleBack: () => void;
    showtime: Showtime;
}

export default function AddConfirmForm({ handleBack, showtime }: AddConfirmFormProps) {
    const intl = useIntl();
    const navigate = useNavigate();
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    const handleSave = async () => {
        try {
            const response = await create(showtime);

            if (response.status === HttpStatusCode.Ok) {
                navigate('/admin/showtime', {
                    state: { alert: { open: true, severity: 'success', message: intl.formatMessage({ id: 'add-showtime-success' }) } }
                });
            } else if (response.status === HttpStatusCode.BadRequest) {
                setAlert({ open: true, message: intl.formatMessage({ id: 'invalid-form' }), severity: 'error' });
            } else {
                setAlert({ open: true, message: intl.formatMessage({ id: 'unknown-error' }), severity: 'error' });
            }
        } catch (err: any) {
            setAlert({ open: true, message: err.message, severity: 'error' });
        }
    };

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 30 }, mr: { xs: 0, lg: 30 }, borderRadius: 2 }}>
                <Box mb={4}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                        {intl.formatMessage({ id: 'confirm-showtime-info' })}
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 12 }}>
                            <InputLabel sx={{ mb: 1 }}>{intl.formatMessage({ id: 'movie' })}</InputLabel>
                            <Typography variant="subtitle1" fontWeight="600">{showtime.movieName}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel sx={{ mb: 1 }}>{intl.formatMessage({ id: 'theater' })}</InputLabel>
                            <Typography variant="body1">{showtime.theaterName}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel sx={{ mb: 1 }}>{intl.formatMessage({ id: 'room' })}</InputLabel>
                            <Typography variant="body1">{showtime.roomName}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel sx={{ mb: 1 }}>{intl.formatMessage({ id: 'show-date' })}</InputLabel>
                            <Typography variant="body1">{formatDate(showtime.showDate)}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel sx={{ mb: 1 }}>{intl.formatMessage({ id: 'show-time' })}</InputLabel>
                            <Typography variant="body1">{showtime.startTime}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 12 }}>
                            <InputLabel sx={{ mb: 1 }}>{intl.formatMessage({ id: 'surcharge-vnd' })}</InputLabel>
                            <Typography variant="body1">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(showtime.surcharge)}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <Button variant="outlined" color="secondary" onClick={handleBack}>
                        {intl.formatMessage({ id: 'back' })}
                    </Button>
                    <AnimateButton>
                        <Button variant="contained" onClick={handleSave}>
                            {intl.formatMessage({ id: 'confirm' })}
                        </Button>
                    </AnimateButton>
                </Stack>
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
