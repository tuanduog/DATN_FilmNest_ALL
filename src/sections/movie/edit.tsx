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
    Grid,
    MenuItem,
    FormHelperText
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Movie } from 'types/movie';
import { CloseCircle } from 'iconsax-reactjs';
import AnimateButton from 'components/@extended/AnimateButton';
import ImageDropZone from 'components/ImageDropZone';
import { useParams } from 'react-router';
import { HttpStatusCode } from 'axios';
import { getById, update } from 'api/movie';
import { uploadImage } from 'api/file';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

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
    showingStatus: Yup.string().required(intl.formatMessage({ id: 'showing-status-required' }))
});

export default function EditMovie() {
    const { id } = useParams<{ id: string }>();
    const intl = useIntl();
    const navigate = useNavigate();
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>('');

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    const initialValues: Movie = {
        name: '',
        description: '',
        director: '',
        actor: '',
        genre: '',
        releaseDate: '',
        endDate: '',
        duration: 0,
        trailerUrl: '',
        showingStatus: 'COMING_SOON'
    };
    const [movie, setMovie] = useState<Movie>(initialValues);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await getById(Number(id));

                if (response.status === HttpStatusCode.Ok) {
                    response.data.showingStatus = response.data.showingStatus.toUpperCase();
                    setMovie(response.data);
                    setPreview(response.data.image || '');
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

    const formik = useFormik<Movie>({
        initialValues: movie,
        enableReinitialize: true,
        validationSchema: validationSchema(intl),
        onSubmit: async (values) => {
            let currentImageUrl = preview;

            if (!currentImageUrl && (!image || !(image instanceof File))) {
                return;
            }

            if (image && image instanceof File) {
                const formData = new FormData();
                formData.append('file', image);
                formData.append('folder', 'movie');
                try {
                    const uploadResponse = await uploadImage(formData);
                    if (uploadResponse.status === HttpStatusCode.Ok) {
                        if (uploadResponse.data.secure_url) {
                            currentImageUrl = uploadResponse.data.secure_url;
                        } else if (uploadResponse.data.url) {
                            currentImageUrl = uploadResponse.data.url;
                        }
                    }
                } catch (err) {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'upload-image-error' }), severity: 'error' });
                    return;
                }
            }

            const payload = {
                ...values,
                image: currentImageUrl
            };

            try {
                const response = await update(Number(id), payload);

                if (response.status === HttpStatusCode.Ok) {
                    navigate('/admin/movie', {
                        state: { alert: { open: true, severity: 'success', message: intl.formatMessage({ id: 'update-movie-success' }) } }
                    });
                } else if (response.status === HttpStatusCode.BadRequest) {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'invalid-form' }), severity: 'error' });
                } else {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'unknown-error' }), severity: 'error' });
                }
            } catch (err: any) {
                setAlert({ open: true, message: err.message, severity: 'error' });
            }
        }
    });

    const handleGetFileUrl = (e: any) => {
        const selectedFile = e.target.files[0];
        setImage(selectedFile);
        return URL.createObjectURL(selectedFile);
    };

    const handleDeleteImage = async () => {
        setImage(null);
        setPreview('');
    };

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 15 }, mr: { xs: 0, lg: 15 }, borderRadius: 2 }}>
                <form onSubmit={formik.handleSubmit} noValidate>
                    <Box mb={4}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                            {intl.formatMessage({ id: 'movie-info' })}
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <Box sx={{ width: '100%', mb: 2 }}>
                                    <InputLabel required sx={{ mb: 1, '& .MuiInputLabel-asterisk': { color: 'error.main' } }}>{intl.formatMessage({ id: 'movie-image' })}</InputLabel>
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
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteImage();
                                                }}
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
                                    {formik.submitCount > 0 && !preview && (!image || !(image instanceof File)) && (
                                        <FormHelperText error sx={{ mt: 1 }}>{intl.formatMessage({ id: 'required-field' })}</FormHelperText>
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

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="showingStatus" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'showing-status' })}
                                </InputLabel>
                                <TextField
                                    id="showingStatus"
                                    name="showingStatus"
                                    select
                                    size="small"
                                    fullWidth
                                    value={formik.values.showingStatus}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.showingStatus && Boolean(formik.errors.showingStatus)}
                                    helperText={formik.touched.showingStatus && formik.errors.showingStatus}
                                >
                                    <MenuItem value="COMING_SOON">{intl.formatMessage({ id: 'coming-soon' })}</MenuItem>
                                    <MenuItem value="NOW_SHOWING">{intl.formatMessage({ id: 'now-showing' })}</MenuItem>
                                    <MenuItem value="STOP">{intl.formatMessage({ id: 'stop-showing' })}</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={12}>
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
                                    {intl.formatMessage({ id: 'confirm' })}
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
