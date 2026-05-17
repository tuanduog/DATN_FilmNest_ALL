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
import { getById } from 'api/movie';
import { HttpStatusCode } from 'axios';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import formatDate from 'utils/formatDateTime';

export default function MovieDetail() {
    const { id } = useParams<{ id: string }>();
    const intl = useIntl();
    const [movie, setMovie] = useState<any>(null);
    const navigate = useNavigate();
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await getById(Number(id));

                if (response.status === HttpStatusCode.Ok) {
                    setMovie(response.data);
                } else if (response.status === HttpStatusCode.BadRequest) {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'invalid-form' }), severity: 'error' });
                } else {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'unknown-error' }), severity: 'error' });
                }
            } catch (err: any) {
                setAlert({ open: true, message: err.message, severity: 'error' });
            }
        }
        fetchMovie();
    }, [id]);

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 30 }, mr: { xs: 0, lg: 30 }, borderRadius: 2 }}>
                <Box mb={4}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                        {intl.formatMessage({ id: 'movie-info' })}
                    </Typography>

                    <Grid container spacing={2}>
                        {movie?.image && (
                            <Grid size={12}>
                                <Box sx={{ width: '100%', mb: 2 }}>
                                    <InputLabel sx={{ mb: 1 }}>{intl.formatMessage({ id: 'movie-image' })}</InputLabel>
                                    <img
                                        src={movie.image}
                                        alt="movie"
                                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                    />
                                </Box>
                            </Grid>
                        )}

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="name" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'movie-name' })}
                            </InputLabel>

                            <Typography>{movie?.name}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="duration" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'duration-minutes' })}
                            </InputLabel>

                            <Typography>{movie?.duration}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="director" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'director' })}
                            </InputLabel>

                            <Typography>{movie?.director}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="actor" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'actor' })}
                            </InputLabel>

                            <Typography>{movie?.actor}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="genre" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'genre' })}
                            </InputLabel>

                            <Typography>{movie?.genre}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="releaseDate" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'release-date' })}
                            </InputLabel>

                            <Typography>{formatDate(movie?.releaseDate)}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="endDate" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'end-date' })}
                            </InputLabel>

                            <Typography>{formatDate(movie?.endDate)}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="trailerUrl" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'trailer-link' })}
                            </InputLabel>

                            <Typography>{movie?.trailerUrl}</Typography>
                        </Grid>

                        <Grid size={12}>
                            <InputLabel htmlFor="description" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'description' })}
                            </InputLabel>

                            <Typography>{movie?.description}</Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Grid size={12} sx={{ p: 0, m: 0 }}>
                    <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
                        <AnimateButton>
                            <Button variant="contained" sx={{ my: 3, ml: 1 }} onClick={() => navigate(`/admin/movie/edit/${id}`)}>
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
