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
import { useEffect, useState } from 'react';
import AnimateButton from 'components/@extended/AnimateButton';
import { useParams } from 'react-router';
import { getById } from 'api/theater';
import { HttpStatusCode } from 'axios';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';

export default function TheaterDetail() {
    const { id } = useParams<{ id: string }>();
    const intl = useIntl();
    const navigate = useNavigate();
    const [theater, setTheater] = useState<any>(null);
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    useEffect(() => {
        const fetchTheater = async () => {
            try {
                const response = await getById(Number(id));

                if (response.status === HttpStatusCode.Ok) {
                    setTheater(response.data);
                } else if (response.status === HttpStatusCode.BadRequest) {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'invalid-form' }), severity: 'error' });
                } else {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'unknown-error' }), severity: 'error' });
                }
            } catch (err: any) {
                setAlert({ open: true, message: err.message, severity: 'error' });
            }
        }
        fetchTheater();
    }, [id]);

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 30 }, mr: { xs: 0, lg: 30 }, borderRadius: 2 }}>
                <Box mb={4}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                        {intl.formatMessage({ id: 'theater-info' })}
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="name" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'theater-name' })}
                            </InputLabel>

                            <Typography>{theater?.name}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="provinceName" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'province-city' })}
                            </InputLabel>

                            <Typography>{theater?.provinceName}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="communeName" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'commune-ward' })}
                            </InputLabel>

                            <Typography>{theater?.communeName}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="address" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'address' })}
                            </InputLabel>

                            <Typography>{theater?.address}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="hotline" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'hotline' })}
                            </InputLabel>

                            <Typography>{theater?.hotline}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="openTime" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'open-time' })}
                            </InputLabel>

                            <Typography>{theater?.openTime}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="closeTime" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'close-time' })}
                            </InputLabel>

                            <Typography>{theater?.closeTime}</Typography>
                        </Grid>

                        <Grid size={12}>
                            <InputLabel htmlFor="description" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'description' })}
                            </InputLabel>

                            <Typography>{theater?.description}</Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Grid size={12} sx={{ p: 0, m: 0 }}>
                    <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
                        <AnimateButton>
                            <Button variant="contained" sx={{ my: 3, ml: 1 }} onClick={() => navigate(`/admin/theater/edit/${id}`)}>
                                {intl.formatMessage({ id: 'update' })}
                            </Button>
                        </AnimateButton>
                    </Stack>
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
