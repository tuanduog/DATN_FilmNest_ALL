import {
    Box,
    InputLabel,
    TextField,
    Typography,
    Paper,
    Snackbar,
    Alert,
    Button,
    IconButton,
    Stack,
    Grid
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { Movie } from 'types/movie';
import { CloseCircle } from 'iconsax-reactjs';
import AnimateButton from 'components/@extended/AnimateButton';
import ImageDropZone from 'components/ImageDropZone';

interface MovieFormProps {
    handleNext: () => void;
    setMovie: (movie: Movie) => void;
    movie: Movie;
}

const validationSchema = (intl: any) => Yup.object({
    name: Yup.string().required(intl.formatMessage({ id: 'movie-name-required' })),
    description: Yup.string().required(intl.formatMessage({ id: 'description-required' })),
    director: Yup.string().required(intl.formatMessage({ id: 'director-required' })),
    actor: Yup.string().required(intl.formatMessage({ id: 'actor-required' })),
    genre: Yup.string().required(intl.formatMessage({ id: 'genre-required' })),
    releaseDate: Yup.string().required(intl.formatMessage({ id: 'release-date-required' })),
    endDate: Yup.string().required(intl.formatMessage({ id: 'end-date-required' })),
    duration: Yup.number().required(intl.formatMessage({ id: 'duration-required' })).min(1, intl.formatMessage({ id: 'duration-min' })),
    trailerUrl: Yup.string().required(intl.formatMessage({ id: 'trailer-url-required' })),
});

export default function MovieForm({ handleNext, setMovie, movie }: MovieFormProps) {
    const intl = useIntl();
    const [image, setImage] = useState<File | string | null>(movie.image!);
    const [preview, setPreview] = useState<string | null>('');

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    const formik = useFormik<Movie>({
        initialValues: movie,
        validationSchema: validationSchema(intl),
        onSubmit: async (values) => {
            setMovie({ ...values, image: image });
            handleNext();
        }
    });

    const handleGetFileUrl = (e: any) => {
        const selectedFile = e.target.files[0];
        setImage(selectedFile);
        return URL.createObjectURL(selectedFile);
    };

    const handleDeleteImage = async () => {
        setImage(null);
    };

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 30 }, mr: { xs: 0, lg: 30 }, borderRadius: 2 }}>
                <form onSubmit={formik.handleSubmit} noValidate>
                    <Box mb={4}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                            {intl.formatMessage({ id: 'movie-info' })}
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <Box sx={{ width: '100%', mb: 2 }}>
                                    <InputLabel sx={{ mb: 1 }}>{intl.formatMessage({ id: 'movie-image' })}</InputLabel>
                                    {!preview ? (
                                        <ImageDropZone
                                            value={preview ?? ''}
                                            onGetFile={(files) => handleGetFileUrl(files)}
                                            onChange={(url) => {
                                                setPreview(url);
                                            }}
                                            width="150px"
                                            height="150px"
                                        />
                                    ) : (
                                        <Box sx={{ position: 'relative', width: '150px' }}>
                                            <Box>
                                                <img
                                                    alt="image"
                                                    src={preview}
                                                    style={{ width: '150px', height: '150px', display: 'block', borderRadius: '5px', objectFit: 'cover' }}
                                                />
                                            </Box>

                                            <IconButton
                                                onClick={handleDeleteImage}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 4,
                                                    right: 4,
                                                    zIndex: 10,
                                                    '&:hover': { backgroundColor: 'transparent' }
                                                }}
                                                size="small"
                                            >
                                                <CloseCircle
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        fontWeight: 'bold',
                                                        color: 'white',
                                                        backgroundColor: 'black',
                                                        borderRadius: '50%'
                                                    }}
                                                />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="name" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'movie-name' })}
                                </InputLabel>

                                <TextField
                                    id="name"
                                    name="name"
                                    placeholder={intl.formatMessage({ id: 'movie-name-placeholder' })}
                                    size="small"
                                    fullWidth
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="genre" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'genre' })}
                                </InputLabel>

                                <TextField
                                    id="genre"
                                    name="genre"
                                    placeholder={intl.formatMessage({ id: 'genre-placeholder' })}
                                    size="small"
                                    fullWidth
                                    value={formik.values.genre}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.genre && Boolean(formik.errors.genre)}
                                    helperText={formik.touched.genre && formik.errors.genre}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="duration" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'duration-minutes' })}
                                </InputLabel>

                                <TextField
                                    id="duration"
                                    name="duration"
                                    type="number"
                                    placeholder={intl.formatMessage({ id: 'duration-placeholder' })}
                                    size="small"
                                    fullWidth
                                    value={formik.values.duration}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.duration && Boolean(formik.errors.duration)}
                                    helperText={formik.touched.duration && formik.errors.duration}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="director" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'director' })}
                                </InputLabel>

                                <TextField
                                    id="director"
                                    name="director"
                                    type="text"
                                    placeholder={intl.formatMessage({ id: 'director-placeholder' })}
                                    size="small"
                                    fullWidth
                                    value={formik.values.director}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.director && Boolean(formik.errors.director)}
                                    helperText={formik.touched.director && formik.errors.director}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="actor" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'actor' })}
                                </InputLabel>

                                <TextField
                                    id="actor"
                                    name="actor"
                                    type="text"
                                    placeholder={intl.formatMessage({ id: 'actor-placeholder' })}
                                    size="small"
                                    fullWidth
                                    value={formik.values.actor}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.actor && Boolean(formik.errors.actor)}
                                    helperText={formik.touched.actor && formik.errors.actor}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="releaseDate" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'release-date' })}
                                </InputLabel>

                                <TextField
                                    id="releaseDate"
                                    name="releaseDate"
                                    type="date"
                                    placeholder={intl.formatMessage({ id: 'release-date-placeholder' })}
                                    size="small"
                                    fullWidth
                                    value={formik.values.releaseDate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.releaseDate && Boolean(formik.errors.releaseDate)}
                                    helperText={formik.touched.releaseDate && formik.errors.releaseDate}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="endDate" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'end-date' })}
                                </InputLabel>

                                <TextField
                                    id="endDate"
                                    name="endDate"
                                    type="date"
                                    placeholder={intl.formatMessage({ id: 'end-date-placeholder' })}
                                    size="small"
                                    fullWidth
                                    value={formik.values.endDate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                                    helperText={formik.touched.endDate && formik.errors.endDate}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="trailerUrl" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'trailer-link' })}
                                </InputLabel>

                                <TextField
                                    id="trailerUrl"
                                    name="trailerUrl"
                                    placeholder={intl.formatMessage({ id: 'trailer-link-placeholder' })}
                                    size="small"
                                    fullWidth
                                    value={formik.values.trailerUrl}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.trailerUrl && Boolean(formik.errors.trailerUrl)}
                                    helperText={formik.touched.trailerUrl && formik.errors.trailerUrl}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 12 }}>
                                <InputLabel htmlFor="description" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'description' })}
                                </InputLabel>

                                <TextField
                                    id="description"
                                    name="description"
                                    placeholder={intl.formatMessage({ id: 'description-placeholder' })}
                                    size="small"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Grid size={12} sx={{ p: 0, m: 0 }}>
                        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
                            <AnimateButton>
                                <Button variant="contained" type="submit" sx={{ my: 3, ml: 1 }}>
                                    {intl.formatMessage({ id: 'continue' })}
                                </Button>
                            </AnimateButton>
                        </Stack>
                    </Grid>
                </form>
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
