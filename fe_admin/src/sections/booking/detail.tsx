import {
    Box,
    InputLabel,
    Typography,
    Paper,
    Button,
    Stack,
    Grid,
    Snackbar,
    Alert,
    CircularProgress,
    Divider,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getById } from 'api/booking';
import { HttpStatusCode } from 'axios';
import { Booking } from 'types/booking';
import { useIntl } from 'react-intl';

export default function BookingDetail() {
    const { id } = useParams<{ id: string }>();
    const intl = useIntl();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await getById(Number(id));
                console.log(response);
                if (response.status === HttpStatusCode.Ok) {
                    setBooking(response.data);
                } else if (response.code === "ERR_NETWORK" || response.name === "AxiosError") {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'unknown-error', defaultMessage: 'Unknown Error' }), severity: 'error' });
                } else if (response.data) {
                    setBooking(response.data);
                } else {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'booking-not-found', defaultMessage: 'Booking not found' }), severity: 'error' });
                }
            } catch (err: any) {
                setAlert({ open: true, message: err.message || intl.formatMessage({ id: 'unknown-error', defaultMessage: 'System Error' }), severity: 'error' });
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchBooking();
    }, [id, intl]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!booking) {
        return (
            <Box p={3}>
                <Alert severity="error">{intl.formatMessage({ id: 'booking-not-found', defaultMessage: 'Booking not found' })}</Alert>
                <Button onClick={() => navigate('/admin/booking')} sx={{ mt: 2 }} variant="contained">
                    {intl.formatMessage({ id: 'back-to-list', defaultMessage: 'Back to List' })}
                </Button>
            </Box>
        );
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <Box>
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 4 }, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 10 }, mr: { xs: 0, lg: 10 }, borderRadius: 2 }}>
                <Box mb={3}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h4" fontWeight="bold">
                            {intl.formatMessage({ id: 'detail-booking', defaultMessage: 'Booking Detail' })} #{booking.code}
                        </Typography>
                        <Chip
                            label={
                                (booking.paymentStatus || '').toUpperCase() === 'DONE' ? intl.formatMessage({ id: 'done', defaultMessage: 'Done' })
                                    : (booking.paymentStatus || '').toUpperCase() === 'PENDING' ? intl.formatMessage({ id: 'pending', defaultMessage: 'Pending' })
                                        : (booking.paymentStatus || '').toUpperCase() === 'FAILED' || (booking.paymentStatus || '').toUpperCase() === 'CANCELLED' ? intl.formatMessage({ id: 'cancelled', defaultMessage: 'Cancelled' })
                                            : booking.paymentStatus
                            }
                            color={(booking.paymentStatus || '').toUpperCase() === 'DONE' ? 'success' : (booking.paymentStatus || '').toUpperCase() === 'FAILED' || (booking.paymentStatus || '').toUpperCase() === 'CANCELLED' ? 'error' : 'warning'}
                            size="medium"
                            sx={{ fontWeight: 'bold', px: 1 }}
                        />
                    </Stack>

                    <Grid container spacing={4}>
                        {/* Booking & User Info */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h6" color="primary" gutterBottom sx={{ borderBottom: '2px solid', borderColor: 'primary.light', pb: 1, mb: 2 }}>
                                {intl.formatMessage({ id: 'customer-info', defaultMessage: 'Customer Info' })}
                            </Typography>
                            <Stack spacing={2}>
                                <Box>
                                    <Typography variant="caption" color="textSecondary" fontWeight="bold" textTransform="uppercase">
                                        {intl.formatMessage({ id: 'username', defaultMessage: 'Username' })}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>{booking.username || 'N/A'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="textSecondary" fontWeight="bold" textTransform="uppercase">
                                        {intl.formatMessage({ id: 'booking-code', defaultMessage: 'Booking Code' })}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>{booking.code}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="textSecondary" fontWeight="bold" textTransform="uppercase">
                                        {intl.formatMessage({ id: 'total-price', defaultMessage: 'Total Price' })}
                                    </Typography>
                                    <Typography variant="h5" color="error.main" fontWeight="bold">
                                        {formatCurrency(booking.totalPrice)}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Grid>

                        {/* Showtime Info */}
                        {booking.showTime && (
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="h6" color="primary" gutterBottom sx={{ borderBottom: '2px solid', borderColor: 'primary.light', pb: 1, mb: 2 }}>
                                    {intl.formatMessage({ id: 'showtime-info', defaultMessage: 'Showtime Info' })}
                                </Typography>
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" fontWeight="bold" textTransform="uppercase">
                                            {intl.formatMessage({ id: 'movie', defaultMessage: 'Movie' })}
                                        </Typography>
                                        <Typography variant="body1" fontWeight={600}>{booking.showTime.movieName}</Typography>
                                    </Box>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 6 }}>
                                            <Box>
                                                <Typography variant="caption" color="textSecondary" fontWeight="bold" textTransform="uppercase">
                                                    {intl.formatMessage({ id: 'theater', defaultMessage: 'Theater' })}
                                                </Typography>
                                                <Typography variant="body2">{booking.showTime.theaterName}</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Box>
                                                <Typography variant="caption" color="textSecondary" fontWeight="bold" textTransform="uppercase">
                                                    {intl.formatMessage({ id: 'room', defaultMessage: 'Room' })}
                                                </Typography>
                                                <Typography variant="body2">{booking.showTime.roomName}</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Box>
                                                <Typography variant="caption" color="textSecondary" fontWeight="bold" textTransform="uppercase">
                                                    {intl.formatMessage({ id: 'date-time', defaultMessage: 'Date & Time' })}
                                                </Typography>
                                                <Typography variant="body2" color="primary.main" fontWeight="bold">
                                                    {booking.showTime.startTime} - {booking.showTime.showDate}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Box>
                                                <Typography variant="caption" color="textSecondary" fontWeight="bold" textTransform="uppercase">
                                                    {intl.formatMessage({ id: 'chair', defaultMessage: 'Seats' })}
                                                </Typography>
                                                <Typography variant="body2" fontWeight="bold">{booking.chair}</Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Stack>
                            </Grid>
                        )}

                        {/* Combos */}
                        {booking.bookingCombos && booking.bookingCombos.length > 0 && (
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="h6" color="primary" gutterBottom sx={{ borderBottom: '2px solid', borderColor: 'primary.light', pb: 1, mb: 2, mt: 1 }}>
                                    {intl.formatMessage({ id: 'combo-list', defaultMessage: 'Combos' })}
                                </Typography>
                                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                                    <Table size="small">
                                        <TableHead sx={{ bgcolor: 'secondary.lighter' }}>
                                            <TableRow>
                                                <TableCell>{intl.formatMessage({ id: 'combo-name', defaultMessage: 'Combo Name' })}</TableCell>
                                                <TableCell align="center">{intl.formatMessage({ id: 'quantity', defaultMessage: 'Quantity' })}</TableCell>
                                                <TableCell align="right">{intl.formatMessage({ id: 'price', defaultMessage: 'Price' })}</TableCell>
                                                <TableCell align="right">{intl.formatMessage({ id: 'total', defaultMessage: 'Total' })}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {booking.bookingCombos.map((bc, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell sx={{ fontWeight: 500 }}>{bc.Combo?.name || 'Combo'}</TableCell>
                                                    <TableCell align="center">{bc.quantity}</TableCell>
                                                    <TableCell align="right">{formatCurrency(bc.price)}</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatCurrency(bc.price * bc.quantity)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        )}

                        {/* Vouchers */}
                        {booking.vouchers && booking.vouchers.length > 0 && (
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="h6" color="primary" gutterBottom sx={{ borderBottom: '2px solid', borderColor: 'primary.light', pb: 1, mb: 2, mt: 1 }}>
                                    {intl.formatMessage({ id: 'voucher-list', defaultMessage: 'Vouchers Applied' })}
                                </Typography>
                                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                                    <Table size="small">
                                        <TableHead sx={{ bgcolor: 'secondary.lighter' }}>
                                            <TableRow>
                                                <TableCell>{intl.formatMessage({ id: 'voucher-code', defaultMessage: 'Code' })}</TableCell>
                                                <TableCell>{intl.formatMessage({ id: 'description', defaultMessage: 'Description' })}</TableCell>
                                                <TableCell align="right">{intl.formatMessage({ id: 'discount-value', defaultMessage: 'Discount' })}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {booking.vouchers.map((v, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>{v.code}</TableCell>
                                                    <TableCell>{v.description}</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                                        {v.discount ? `${v.discount}%` : 'N/A'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        )}

                    </Grid>
                </Box>

                <Divider sx={{ my: 4 }} />

                <Stack direction="row" justifyContent="center">
                    <Button variant="contained" color="primary" onClick={() => navigate('/admin/booking')} size="large" sx={{ px: 4 }}>
                        {intl.formatMessage({ id: 'back-to-list', defaultMessage: 'Back to List' })}
                    </Button>
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
