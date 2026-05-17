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
    Autocomplete,
    InputAdornment
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Showtime } from 'types/showtime';
import AnimateButton from 'components/@extended/AnimateButton';
import { Movie } from 'types/movie';
import { Theater } from 'types/theater';
import { Room } from 'types/room';
import MovieDialog from './movie-dialog';
import TheaterDialog from './theater-dialog';
import RoomDialog from './room-dialog';
import useAuth from 'hooks/useAuth';
import { getById as getTheaterById } from 'api/theater';

interface ShowtimeFormProps {
    handleNext: () => void;
    setShowtime: (showtime: Showtime) => void;
    showtime: Showtime;
}

const validationSchema = (intl: any) => Yup.object({
    movieId: Yup.number().required(intl.formatMessage({ id: 'select-movie-required' })).min(1, intl.formatMessage({ id: 'select-movie-required' })),
    roomId: Yup.number().required(intl.formatMessage({ id: 'select-room-required' })).min(1, intl.formatMessage({ id: 'select-room-required' })),
    showDate: Yup.string().required(intl.formatMessage({ id: 'show-date-required' })),
    startTime: Yup.string().required(intl.formatMessage({ id: 'show-time-required' })),
    surcharge: Yup.number().required(intl.formatMessage({ id: 'surcharge-required' })).min(0, intl.formatMessage({ id: 'surcharge-min' })),
});

export default function ShowtimeForm({ handleNext, setShowtime, showtime }: ShowtimeFormProps) {
    const intl = useIntl();
    const { user } = useAuth();
    const isManager = user?.role?.toUpperCase() === 'MANAGER';
    const [selectedTheater, setSelectedTheater] = useState<Theater | null>(showtime.theaterId ? { id: showtime.theaterId, name: showtime.theaterName } as any : null);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(showtime.movieId ? { id: showtime.movieId, name: showtime.movieName } as any : null);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(showtime.roomId ? { id: showtime.roomId, name: showtime.roomName } as any : null);

    const [openMovieDialog, setOpenMovieDialog] = useState(false);
    const [openTheaterDialog, setOpenTheaterDialog] = useState(false);
    const [openRoomDialog, setOpenRoomDialog] = useState(false);

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    const formik = useFormik<Showtime>({
        initialValues: showtime,
        validationSchema: validationSchema(intl),
        onSubmit: async (values) => {
            setShowtime({
                ...values,
                theaterId: selectedTheater?.id,
                movieName: selectedMovie?.name,
                roomName: selectedRoom?.name,
                theaterName: selectedTheater?.name
            });
            handleNext();
        }
    });

    useEffect(() => {
        const fetchDefaultTheater = async () => {
            if (isManager && user?.theaterId && !selectedTheater) {
                const response = await getTheaterById(Number(user.theaterId));
                if (response.status === 200) {
                    setSelectedTheater(response.data);
                }
            }
        };
        fetchDefaultTheater();
    }, [isManager, user?.theaterId, selectedTheater]);

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 30 }, mr: { xs: 0, lg: 30 }, borderRadius: 2 }}>
                <form onSubmit={formik.handleSubmit} noValidate>
                    <Box mb={4}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                            {intl.formatMessage({ id: 'showtime-info' })}
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 12 }}>
                                <InputLabel required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>{intl.formatMessage({ id: 'movie' })}</InputLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder={intl.formatMessage({ id: 'select-movie' })}
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
                                <InputLabel required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>{intl.formatMessage({ id: 'theater' })}</InputLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder={intl.formatMessage({ id: 'select-theater' })}
                                    value={selectedTheater?.name || ''}
                                    onClick={() => !isManager && setOpenTheaterDialog(true)}
                                    autoComplete="off"
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                            endAdornment: !isManager && (
                                                <InputAdornment position="end">
                                                    <ArrowDropDownIcon />
                                                </InputAdornment>
                                            )
                                        }
                                    }}
                                    sx={{
                                        ...(isManager && {
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: 'action.hover',
                                                '& fieldset': { border: 'none' }
                                            }
                                        })
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>{intl.formatMessage({ id: 'room' })}</InputLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder={selectedTheater ? intl.formatMessage({ id: 'select-room' }) : intl.formatMessage({ id: 'please-select-theater-first' })}
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
                                <InputLabel required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>{intl.formatMessage({ id: 'show-date' })}</InputLabel>
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
                                <InputLabel required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>{intl.formatMessage({ id: 'show-time' })}</InputLabel>
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
                                <InputLabel required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>{intl.formatMessage({ id: 'surcharge-vnd' })}</InputLabel>
                                <TextField
                                    id="surcharge"
                                    name="surcharge"
                                    type="number"
                                    placeholder={intl.formatMessage({ id: 'surcharge-placeholder' })}
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

                    <Stack direction="row" justifyContent="flex-end">
                        <AnimateButton>
                            <Button variant="contained" type="submit">
                                {intl.formatMessage({ id: 'continue' })}
                            </Button>
                        </AnimateButton>
                    </Stack>
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
