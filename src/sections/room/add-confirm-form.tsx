import { useState } from 'react';
import {
    Box,
    Button,
    Paper,
    Stack,
    Typography,
    Grid,
    Chip,
    Divider,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import CategoryIcon from '@mui/icons-material/Category';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AnimateButton from 'components/@extended/AnimateButton';
import { FormattedMessage, useIntl } from 'react-intl';

import { Room } from 'types/room';
import { create, update } from 'api/room';
import { Seat, SeatType } from 'types/seat';
import { useNavigate } from 'react-router';
import { HttpStatusCode } from 'axios';

interface RoomConfirmFormProps {
    handleBack: () => void;
    room: Room;
    isEdit?: boolean;
}

const getSeatColor = (seat: Seat) => {
    if ((seat.seatStatus || '').toUpperCase() === 'DELETED') return 'transparent';
    const type = (seat.type || '').toUpperCase();
    switch (type) {
        case 'STANDARD': return '#e3f2fd';
        case 'VIP': return '#fff3e0';
        case 'SWEETBOX': return '#fce4ec';
        default: return '#e3f2fd';
    }
};

const getSeatBorder = (seat: Seat) => {
    if ((seat.seatStatus || '').toUpperCase() === 'DELETED') return '1px dashed #bdbdbd';
    const type = (seat.type || '').toUpperCase();
    switch (type) {
        case 'STANDARD': return '1px solid #2196f3';
        case 'VIP': return '1px solid #ff9800';
        case 'SWEETBOX': return '1px solid #e91e63';
        default: return '1px solid #2196f3';
    }
};

const getSeatTextColor = (seat: Seat) => {
    if ((seat.seatStatus || '').toUpperCase() === 'DELETED') return 'transparent';
    const type = (seat.type || '').toUpperCase();
    switch (type) {
        case 'STANDARD': return '#0d47a1';
        case 'VIP': return '#e65100';
        case 'SWEETBOX': return '#880e4f';
        default: return '#0d47a1';
    }
};

const generateAlphabetLabel = (index: number) => {
    let label = '';
    let temp = index;
    while (temp >= 0) {
        label = String.fromCharCode((temp % 26) + 65) + label;
        temp = Math.floor(temp / 26) - 1;
    }
    return label;
};

export default function RoomConfirmForm({ handleBack, room, isEdit = false }: RoomConfirmFormProps) {
    const navigate = useNavigate();
    const intl = useIntl();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const seats: (Seat & { isHidden?: boolean })[][] = room.seats
        ? (() => {
            const flat = room.seats as Seat[];
            const rows: (Seat & { isHidden?: boolean })[][] = [];
            for (let r = 0; r < room.totalRow; r++) {
                const rowSeats = flat.filter((s) => s.row === r).sort((a, b) => a.col - b.col);
                let skipNext = false;
                const processedRow = rowSeats.map(seat => {
                    if (skipNext) {
                        skipNext = false;
                        return { ...seat, isHidden: true };
                    }
                    if ((seat.type || '').toUpperCase() === 'SWEETBOX' && (seat.seatStatus || 'ACTIVE').toUpperCase() === 'ACTIVE') {
                        skipNext = true;
                    }
                    return { ...seat, isHidden: false };
                });
                rows.push(processedRow);
            }
            return rows;
        })()
        : [];

    const countByType = (type: SeatType) =>
        (room.seats as Seat[] | undefined)?.filter(
            (s) => (s.type || '').toUpperCase() === type && (s.seatStatus || '').toUpperCase() === 'ACTIVE'
        ).length ?? 0;

    const getPriceByType = (type: SeatType) =>
        (room.seats as Seat[] | undefined)?.find(
            (s) => (s.type || '').toUpperCase() === type && (s.seatStatus || '').toUpperCase() === 'ACTIVE'
        )?.price ?? 0;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                id: room.id,
                name: room.name,
                capacity: room.capacity,
                totalRow: room.totalRow,
                totalColumn: room.totalColumn,
                type: room.type,
                status: room.status || 'ACTIVE',
                theaterId: room.theaterId,
                seats: (room.seats as Seat[]).map((s) => ({
                    row: s.row,
                    col: s.col,
                    type: s.type,
                    label: s.label,
                    price: s.price,
                    seatStatus: s.seatStatus
                }))
            };

            const response = isEdit ? await update(room.id!, payload) : await create(payload as any);

            if (response.status === HttpStatusCode.Ok) {
                setAlert({ open: true, message: intl.formatMessage({ id: isEdit ? 'update-room-success' : 'add-room-success' }), severity: 'success' });
                setTimeout(() => {
                    navigate('/admin/room');
                }, 1500);
            } else {
                const errMsg = response?.message || intl.formatMessage({ id: 'error-occurred' });
                setAlert({ open: true, message: errMsg, severity: 'error' });
            }
        } catch {
            setAlert({ open: true, message: intl.formatMessage({ id: 'error-occurred' }), severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack spacing={3}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {isEdit ? <FormattedMessage id="confirm-update-room" /> : <FormattedMessage id="confirm-room-info" />}
                </Typography>
                <Typography variant="body2" color="textSecondary" mb={3}>
                    {isEdit ? <FormattedMessage id="check-update-changes" /> : <FormattedMessage id="check-create-changes" />}
                </Typography>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={2}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <MeetingRoomIcon color="primary" />
                                <Box>
                                    <Typography variant="caption" color="textSecondary"><FormattedMessage id="room-name" /></Typography>
                                    <Typography variant="body1" fontWeight={600}>{room.name}</Typography>
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <CategoryIcon color="primary" />
                                <Box>
                                    <Typography variant="caption" color="textSecondary"><FormattedMessage id="room-type" /></Typography>
                                    <Typography variant="body1" fontWeight={600}>
                                        {(room.type || '').toUpperCase() === 'STANDARD' ? <FormattedMessage id="standard-2d" /> : (room.type || '').toUpperCase() === 'THREE_D' ? '3D' : room.type}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <TheaterComedyIcon color="primary" />
                                <Box>
                                    <Typography variant="caption" color="textSecondary"><FormattedMessage id="theater" /></Typography>
                                    <Typography variant="body1" fontWeight={600}>{room.theaterName || `ID: ${room.theaterId}`}</Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={2}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <EventSeatIcon color="primary" />
                                <Box>
                                    <Typography variant="caption" color="textSecondary"><FormattedMessage id="planned-capacity" /></Typography>
                                    <Typography variant="body1" fontWeight={600}>{room.capacity} <FormattedMessage id="seats" /></Typography>
                                </Box>
                            </Stack>

                            <Box>
                                <Typography variant="caption" color="textSecondary"><FormattedMessage id="grid-size" /></Typography>
                                <Typography variant="body1" fontWeight={600}>{room.totalRow} <FormattedMessage id="row-count" /> × {room.totalColumn} <FormattedMessage id="column-count" /></Typography>
                            </Box>

                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                <Chip
                                    size="small"
                                    icon={<EventSeatIcon style={{ fontSize: 14, color: '#2196f3' }} />}
                                    label={`${intl.formatMessage({ id: 'standard' })}: ${countByType('STANDARD')} (${getPriceByType('STANDARD').toLocaleString()}đ)`}
                                    sx={{ bgcolor: '#e3f2fd', color: '#0d47a1', fontWeight: 600, border: '1px solid #2196f3' }}
                                />
                                <Chip
                                    size="small"
                                    icon={<StarIcon style={{ fontSize: 14, color: '#ff9800' }} />}
                                    label={`VIP: ${countByType('VIP')} (${getPriceByType('VIP').toLocaleString()}đ)`}
                                    sx={{ bgcolor: '#fff3e0', color: '#e65100', fontWeight: 600, border: '1px solid #ff9800' }}
                                />
                                <Chip
                                    size="small"
                                    icon={<FavoriteIcon style={{ fontSize: 14, color: '#e91e63' }} />}
                                    label={`Sweetbox: ${countByType('SWEETBOX')} (${getPriceByType('SWEETBOX').toLocaleString()}đ)`}
                                    sx={{ bgcolor: '#fce4ec', color: '#880e4f', fontWeight: 600, border: '1px solid #e91e63' }}
                                />
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>

            {seats.length > 0 && (
                <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        <FormattedMessage id="preview-seat-map" />
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Box sx={{ overflowX: 'auto' }}>
                        <Box sx={{ minWidth: 'max-content', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                            <Box sx={{
                                width: '80%',
                                maxWidth: 500,
                                height: 40,
                                bgcolor: '#cfd8dc',
                                mb: 5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '0 0 50% 50% / 0 0 100% 100%',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                borderTop: '4px solid #90a4ae'
                            }}>
                                <Typography variant="caption" color="textSecondary" sx={{ letterSpacing: 4, fontWeight: 'bold' }}><FormattedMessage id="screen" /></Typography>
                            </Box>

                            <Stack spacing={1}>
                                {seats.map((row, rIndex) => (
                                    <Stack key={`row-${rIndex}`} direction="row" spacing={1} alignItems="center">
                                        <Typography variant="caption" sx={{ width: 24, textAlign: 'center', fontWeight: 'bold', color: '#546e7a' }}>
                                            {generateAlphabetLabel(rIndex)}
                                        </Typography>
                                        {row.map((seat) => {
                                            if (seat.isHidden) return null;
                                            return (
                                                <Box
                                                    key={`${seat.row}-${seat.col}`}
                                                    sx={{
                                                        width: ((seat.type || '').toUpperCase() === 'SWEETBOX' && (seat.seatStatus || '').toUpperCase() === 'ACTIVE') ? 84 : 38,
                                                        height: 38,
                                                        bgcolor: getSeatColor(seat),
                                                        border: getSeatBorder(seat),
                                                        borderRadius: 1,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    {(seat.seatStatus || '').toUpperCase() !== 'DELETED' && (
                                                        <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 600, color: getSeatTextColor(seat) }}>
                                                            {seat.label}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            )
                                        })}
                                        <Typography variant="caption" sx={{ width: 24, textAlign: 'center', fontWeight: 'bold', color: '#546e7a' }}>
                                            {generateAlphabetLabel(rIndex)}
                                        </Typography>
                                    </Stack>
                                ))}
                            </Stack>
                        </Box>
                    </Box>
                </Paper>
            )}

            <Stack direction="row" justifyContent="space-between" sx={{ pb: 2 }}>
                <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack} disabled={loading}>
                    <FormattedMessage id="back" />
                </Button>
                <AnimateButton>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <CheckCircleOutlineIcon />}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <FormattedMessage id="saving-room" /> : isEdit ? <FormattedMessage id="update-room" /> : <FormattedMessage id="complete-create-room" />}
                    </Button>
                </AnimateButton>
            </Stack>

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
        </Stack>
    );
}

