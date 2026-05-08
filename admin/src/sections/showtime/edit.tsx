import {
    Box,
    InputLabel,
    TextField,
    Typography,
    Paper,
    Snackbar,
    Alert,
    Button,
    Stack,
    Grid,
    FormControl,
    FormHelperText,
    Select,
    MenuItem,
    Autocomplete,
    InputAdornment
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Showtime } from 'types/showtime';
import AnimateButton from 'components/@extended/AnimateButton';
import { useParams } from 'react-router';
import { HttpStatusCode } from 'axios';
import { getById, update } from 'api/showtime';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import MovieDialog from './movie-dialog';
import TheaterDialog from './theater-dialog';
import RoomDialog from './room-dialog';
import { Theater } from 'types/theater';
import { Movie } from 'types/movie';
import { Room } from 'types/room';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const validationSchema = Yup.object({
    movieId: Yup.number().required('Vui lòng chọn phim').min(1, 'Vui lòng chọn phim'),
    roomId: Yup.number().required('Vui lòng chọn phòng chiếu').min(1, 'Vui lòng chọn phòng chiếu'),
    showDate: Yup.string().required('Vui lòng chọn ngày chiếu'),
    startTime: Yup.string().required('Vui lòng chọn giờ chiếu'),
    surcharge: Yup.number().required('Phụ phí là bắt buộc').min(0, 'Phụ phí không được âm')
});

export default function EditShowtime() {
    const { id } = useParams<{ id: string }>();
    const intl = useIntl();
    const navigate = useNavigate();

    const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    const [openMovieDialog, setOpenMovieDialog] = useState(false);
    const [openTheaterDialog, setOpenTheaterDialog] = useState(false);
    const [openRoomDialog, setOpenRoomDialog] = useState(false);

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    const initialValues = {
        id: 0,
        showDate: '',
        startTime: '',
        endTime: '',
        surcharge: 0,
        movieId: 0,
        roomId: 0,
        status: ''
    };
    const [showtime, setShowtime] = useState<Showtime>(initialValues);

    useEffect(() => {
        const fetchShowtime = async () => {
            try {
                const response = await getById(Number(id));

                if (response.status === HttpStatusCode.Ok) {
                    const data = response.data;
                    setShowtime(data);
                    setSelectedTheater(data.theaterId ? { id: data.theaterId, name: data.theaterName } as any : null);
                    setSelectedMovie(data.movieId ? { id: data.movieId, name: data.movieName } as any : null);
                    setSelectedRoom(data.roomId ? { id: data.roomId, name: data.roomName } as any : null);
                } else if (response.status === HttpStatusCode.BadRequest) {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'invalid-form' }), severity: 'error' });
                } else {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'unknown-error' }), severity: 'error' });
                }
            } catch (err: any) {
                setAlert({ open: true, message: err.message, severity: 'error' });
            }
        }
        fetchShowtime();
    }, [id]);

    const formik = useFormik<Showtime>({
        initialValues: showtime,
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await update(Number(id), values);

                if (response.status === HttpStatusCode.Ok) {
                    navigate('/admin/showtime', {
                        state: { alert: { open: true, severity: 'success', message: 'Cập nhật suất chiếu thành công' } }
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

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 30 }, mr: { xs: 0, lg: 30 }, borderRadius: 2 }}>
                <form onSubmit={formik.handleSubmit} noValidate>
                    <Box mb={4}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                            Thông tin suất chiếu
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 12 }}>
                                <InputLabel required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>Phim</InputLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Chọn phim"
                                    value={selectedMovie?.name || ''}
                                    onClick={() => setOpenMovieDialog(true)}
                                    autoComplete="off"
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <ArrowDropDownIcon />
                                                </InputAdornment>
                                            )
                                        }
                                    }}
                                    error={formik.touched.movieId && Boolean(formik.errors.movieId)}
                                    helperText={formik.touched.movieId && formik.errors.movieId}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>Rạp chiếu</InputLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Chọn rạp"
                                    value={selectedTheater?.name || ''}
                                    onClick={() => setOpenTheaterDialog(true)}
                                    autoComplete="off"
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <ArrowDropDownIcon />
                                                </InputAdornment>
                                            )
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>Phòng chiếu</InputLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder={selectedTheater ? 'Chọn phòng' : 'Vui lòng chọn rạp trước'}
                                    value={selectedRoom?.name || ''}
                                    onClick={() => selectedTheater && setOpenRoomDialog(true)}
                                    disabled={!selectedTheater}
                                    autoComplete="off"
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <ArrowDropDownIcon />
                                                </InputAdornment>
                                            )
                                        }
                                    }}
                                    error={formik.touched.roomId && Boolean(formik.errors.roomId)}
                                    helperText={formik.touched.roomId && formik.errors.roomId}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>Ngày chiếu</InputLabel>
                                <TextField
                                    id="showDate"
                                    name="showDate"
                                    type="date"
                                    fullWidth
                                    size="small"
                                    value={formik.values.showDate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.showDate && Boolean(formik.errors.showDate)}
                                    helperText={formik.touched.showDate && formik.errors.showDate}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>Giờ chiếu</InputLabel>
                                <TextField
                                    id="startTime"
                                    name="startTime"
                                    type="time"
                                    fullWidth
                                    size="small"
                                    value={formik.values.startTime}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.startTime && Boolean(formik.errors.startTime)}
                                    helperText={formik.touched.startTime && formik.errors.startTime}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 12 }}>
                                <InputLabel required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>Phụ phí (VND)</InputLabel>
                                <TextField
                                    id="surcharge"
                                    name="surcharge"
                                    type="number"
                                    placeholder="Nhập phụ phí nếu có"
                                    fullWidth
                                    size="small"
                                    value={formik.values.surcharge}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.surcharge && Boolean(formik.errors.surcharge)}
                                    helperText={formik.touched.surcharge && formik.errors.surcharge}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Grid size={12} sx={{ p: 0, m: 0 }}>
                        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
                            <AnimateButton>
                                <Button variant="contained" type="submit" sx={{ my: 3, ml: 1 }}>
                                    Xác nhận
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

            <MovieDialog
                open={openMovieDialog}
                onClose={() => setOpenMovieDialog(false)}
                onConfirm={(movie) => {
                    setSelectedMovie(movie);
                    formik.setFieldValue('movieId', movie.id);
                    setOpenMovieDialog(false);
                }}
                id={formik.values.movieId}
            />

            <TheaterDialog
                open={openTheaterDialog}
                onClose={() => setOpenTheaterDialog(false)}
                onConfirm={(theater) => {
                    setSelectedTheater(theater);
                    formik.setFieldValue('roomId', 0);
                    setSelectedRoom(null);
                    setOpenTheaterDialog(false);
                }}
                id={selectedTheater?.id}
            />

            <RoomDialog
                open={openRoomDialog}
                theaterId={selectedTheater?.id}
                onClose={() => setOpenRoomDialog(false)}
                onConfirm={(room) => {
                    setSelectedRoom(room);
                    formik.setFieldValue('roomId', room.id);
                    setOpenRoomDialog(false);
                }}
                id={formik.values.roomId}
            />
        </Box>
    );
}
