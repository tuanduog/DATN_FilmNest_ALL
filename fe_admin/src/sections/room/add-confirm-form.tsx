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

const ROOM_TYPE_LABEL: Record<string, string> = {
    STANDARD: 'Tiêu chuẩn (2D)',
    IMAX: 'IMAX',
    THREE_D: '3D'
};

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
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const seats: Seat[][] = room.seats
        ? (() => {
            const flat = room.seats as Seat[];
            const rows: Seat[][] = [];
            for (let r = 0; r < room.totalRow; r++) {
                rows.push(flat.filter((s) => s.row === r).sort((a, b) => a.col - b.col));
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
                setAlert({ open: true, message: isEdit ? 'Cập nhật phòng chiếu thành công!' : 'Tạo phòng chiếu thành công!', severity: 'success' });
                setTimeout(() => {
                    navigate('/admin/room');
                }, 1500);
            } else {
                const errMsg = response?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
                setAlert({ open: true, message: errMsg, severity: 'error' });
            }
        } catch {
            setAlert({ open: true, message: 'Có lỗi xảy ra. Vui lòng thử lại.', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack spacing={3}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {isEdit ? 'Xác nhận cập nhật phòng chiếu' : 'Xác nhận thông tin phòng chiếu'}
                </Typography>
                <Typography variant="body2" color="textSecondary" mb={3}>
                    {isEdit ? 'Vui lòng kiểm tra lại các thay đổi trước khi lưu.' : 'Vui lòng kiểm tra lại toàn bộ thông tin trước khi hoàn tất tạo phòng chiếu.'}
                </Typography>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={2}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <MeetingRoomIcon color="primary" />
                                <Box>
                                    <Typography variant="caption" color="textSecondary">Tên phòng chiếu</Typography>
                                    <Typography variant="body1" fontWeight={600}>{room.name}</Typography>
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <CategoryIcon color="primary" />
                                <Box>
                                    <Typography variant="caption" color="textSecondary">Loại phòng</Typography>
                                    <Typography variant="body1" fontWeight={600}>
                                        {ROOM_TYPE_LABEL[(room.type || '').toUpperCase()] || room.type}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <TheaterComedyIcon color="primary" />
                                <Box>
                                    <Typography variant="caption" color="textSecondary">Rạp chiếu</Typography>
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
                                    <Typography variant="caption" color="textSecondary">Tổng chỗ ngồi (kế hoạch)</Typography>
                                    <Typography variant="body1" fontWeight={600}>{room.capacity} chỗ</Typography>
                                </Box>
                            </Stack>

                            <Box>
                                <Typography variant="caption" color="textSecondary">Kích thước sơ đồ</Typography>
                                <Typography variant="body1" fontWeight={600}>{room.totalRow} hàng × {room.totalColumn} cột</Typography>
                            </Box>

                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                <Chip
                                    size="small"
                                    icon={<EventSeatIcon style={{ fontSize: 14, color: '#2196f3' }} />}
                                    label={`Thường: ${countByType('STANDARD')} (${getPriceByType('STANDARD').toLocaleString()}đ)`}
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
                        Xem trước sơ đồ ghế
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
                                <Typography variant="caption" color="textSecondary" sx={{ letterSpacing: 4, fontWeight: 'bold' }}>MÀN HÌNH</Typography>
                            </Box>

                            <Stack spacing={1}>
                                {seats.map((row, rIndex) => (
                                    <Stack key={`row-${rIndex}`} direction="row" spacing={1} alignItems="center">
                                        <Typography variant="caption" sx={{ width: 24, textAlign: 'center', fontWeight: 'bold', color: '#546e7a' }}>
                                            {generateAlphabetLabel(rIndex)}
                                        </Typography>
                                        {row.map((seat) => (
                                            <Box
                                                key={`${seat.row}-${seat.col}`}
                                                sx={{
                                                    width: ((seat.type || '').toUpperCase() === 'SWEETBOX' && (seat.seatStatus || '').toUpperCase() === 'ACTIVE') ? 60 : 38,
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
                                        ))}
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
                    Quay lại
                </Button>
                <AnimateButton>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <CheckCircleOutlineIcon />}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Đang lưu...' : isEdit ? 'Cập nhật phòng' : 'Hoàn tất tạo phòng'}
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

