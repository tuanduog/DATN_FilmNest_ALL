import { useState } from 'react';
import { HttpStatusCode } from 'axios';
import { useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import { Alert, Box, Divider, Grid, Paper, Snackbar, Stack, Typography } from '@mui/material';

// project-imports
import { create } from 'api/movie';
import { useIntl } from 'react-intl';
import useAuth from 'hooks/useAuth';
import { Movie } from 'types/movie';
import AnimateButton from 'components/@extended/AnimateButton';
import { uploadImage } from 'api/file';
import formatDate from 'utils/formatDateTime';

interface ConfirmProps {
    handleBack: () => void;
    movie: Movie;
}

export default function AddConfirmForm({ handleBack, movie }: ConfirmProps) {
    const { logout } = useAuth();
    const intl = useIntl();
    const navigate = useNavigate();

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    const handleSubmit = async () => {
        let imageUrl = '';

        if (movie.image) {
            const formData = new FormData();
            formData.append('file', movie.image);
            formData.append('folder', 'movie');
            try {
                const uploadResponse = await uploadImage(formData);

                if (uploadResponse.status === HttpStatusCode.Ok) {
                    if (uploadResponse.data.secure_url) {
                        imageUrl = uploadResponse.data.secure_url;
                    }
                } else if (uploadResponse.status === HttpStatusCode.BadRequest) {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'invalid-form' }), severity: 'error' });
                    return;
                } else if (uploadResponse.status === HttpStatusCode.Unauthorized) {
                    logout();
                    return;
                } else {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'unknown-error' }), severity: 'error' });
                    return;
                }
            } catch (err) {
                setAlert({ open: true, message: intl.formatMessage({ id: 'upload-image-error' }), severity: 'error' });
                return;
            }
        }

        const payload = {
            ...movie,
            image: imageUrl
        };

        try {
            const response = await create(payload as any);

            if (response.status === HttpStatusCode.Ok) {
                navigate('/admin/movie', {
                    state: { alert: { open: true, severity: 'success', message: intl.formatMessage({ id: 'add-movie-success' }) } }
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
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 25 }, mr: { xs: 0, lg: 25 }, borderRadius: 2 }}>
                <Box mb={4}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                        {intl.formatMessage({ id: 'confirm-movie-info' })}
                    </Typography>

                    <Grid container spacing={2}>
                        {movie.image && (
                            <Grid size={12}>
                                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'left', mb: 2 }}>
                                    <Box>
                                        <img
                                            alt="movie-poster"
                                            src={typeof movie.image === 'string' ? movie.image : URL.createObjectURL(movie.image as File)}
                                            style={{ width: '200px', height: 'auto', display: 'block', borderRadius: '8px', objectFit: 'cover', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                        )}

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack spacing={1}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'movie-name' })}</InputLabel>
                                <Typography>{movie.name}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack spacing={1}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'duration-minutes' })}</InputLabel>
                                <Typography>{movie.duration}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack spacing={1}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'director' })}</InputLabel>
                                <Typography>{movie.director || intl.formatMessage({ id: 'not-updated' })}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack spacing={1}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'genre' })}</InputLabel>
                                <Typography>{movie.genre || intl.formatMessage({ id: 'not-updated' })}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack spacing={1}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'release-date' })}</InputLabel>
                                <Typography>{movie.releaseDate ? formatDate(movie.releaseDate) : intl.formatMessage({ id: 'not-updated' })}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack spacing={1}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'end-date' })}</InputLabel>
                                <Typography>{movie.endDate ? formatDate(movie.endDate) : intl.formatMessage({ id: 'not-updated' })}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={12}>
                            <Stack spacing={1}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'actor' })}</InputLabel>
                                <Typography>{movie.actor || intl.formatMessage({ id: 'not-updated' })}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={12}>
                            <Stack spacing={1}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'trailer-link' })}</InputLabel>
                                <Typography sx={{ wordBreak: 'break-all' }}>
                                    {movie.trailerUrl || intl.formatMessage({ id: 'not-updated' })}
                                </Typography>
                            </Stack>
                        </Grid>

                        <Grid size={12}>
                            <Stack spacing={1}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'description' })}</InputLabel>
                                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                    {movie.description || intl.formatMessage({ id: 'not-updated' })}
                                </Typography>
                            </Stack>
                        </Grid>
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
