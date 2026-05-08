import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// material-ui
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
    IconButton,
    Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import CategoryIcon from '@mui/icons-material/Category';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';

// project-imports
import { Room } from 'types/room';
import { getById } from 'api/room';
import { Seat, SeatType } from 'types/seat';
import { HttpStatusCode } from 'axios';

const ROOM_TYPE_LABEL: Record<string, string> = {
    STANDARD: 'Tiêu chuẩn (2D)',
    IMAX: 'IMAX',
    THREE_D: '3D'
};

const getSeatColor = (seat: Seat) => {
    if (seat.seatStatus === 'DELETED') return 'transparent';
    const type = (seat.type || '').toUpperCase();
    switch (type) {
        case 'STANDARD': return '#e3f2fd';
        case 'VIP': return '#fff3e0';
        case 'SWEETBOX': return '#fce4ec';
        default: return '#e3f2fd';
    }
};

const getSeatBorder = (seat: Seat) => {
    if (seat.seatStatus === 'DELETED') return '1px dashed #bdbdbd';
    const type = (seat.type || '').toUpperCase();
    switch (type) {
        case 'STANDARD': return '1px solid #2196f3';
        case 'VIP': return '1px solid #ff9800';
        case 'SWEETBOX': return '1px solid #e91e63';
        default: return '1px solid #2196f3';
    }
};

const getSeatTextColor = (seat: Seat) => {
    if (seat.seatStatus === 'DELETED') return 'transparent';
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

export default function RoomDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoom = async () => {
            if (!id) return;
            try {
                const response = await getById(Number(id));
                if (response.status === HttpStatusCode.Ok) {
                    setRoom(response.data);
                }
            } catch (error) {
                console.error('Error fetching room detail:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRoom();
    }, [id]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (!room) {
        return (
            <Box p={3}>
                <Typography color="error">Không tìm thấy thông tin phòng chiếu.</Typography>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/room')} sx={{ mt: 2 }}>
                    Quay lại danh sách
                </Button>
            </Box>
        );
    }

    const seatsGrid: Seat[][] = room.seats
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

    return (
        <Stack spacing={3}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Tooltip title="Quay lại">
                        <IconButton onClick={() => navigate('/admin/room')}>
                            <ArrowBackIcon />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="h3">Chi tiết phòng chiếu</Typography>
                </Stack>
                <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/admin/room/edit/${room.id}`)}
                    disabled={room.status === 'INACTIVE'}
                >
                    Chỉnh sửa
                </Button>
            </Box>

            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={2.5}>
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

                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Box>
                                    <Typography variant="caption" color="textSecondary">Trạng thái</Typography>
                                    <Box mt={0.5}>
                                        <Chip
                                            label={room.status === 'ACTIVE' ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                                            color={room.status === 'ACTIVE' ? 'success' : 'error'}
                                            size="small"
                                        />
                                    </Box>
                                </Box>
                            </Stack>
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={2.5}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <EventSeatIcon color="primary" />
                                <Box>
                                    <Typography variant="caption" color="textSecondary">Sức chứa</Typography>
                                    <Typography variant="body1" fontWeight={600}>{room.capacity} chỗ ngồi</Typography>
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

            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Sơ đồ ghế ngồi
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ overflowX: 'auto', bgcolor: '#f8fafc', borderRadius: 2, p: 4, border: '1px solid #e0e0e0' }}>
                    <Box sx={{ minWidth: 'max-content', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Screen */}
                        <Box sx={{
                            width: '80%',
                            maxWidth: 500,
                            height: 40,
                            bgcolor: '#cfd8dc',
                            mb: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '0 0 50% 50% / 0 0 100% 100%',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            borderTop: '4px solid #90a4ae'
                        }}>
                            <Typography variant="caption" color="textSecondary" sx={{ letterSpacing: 4, fontWeight: 'bold' }}>MÀN HÌNH</Typography>
                        </Box>

                        {/* Seat rows */}
                        <Stack spacing={1.5}>
                            {seatsGrid.map((row, rIndex) => (
                                <Stack key={`row-${rIndex}`} direction="row" spacing={1.5} alignItems="center">
                                    <Typography variant="subtitle2" sx={{ width: 30, textAlign: 'center', fontWeight: 'bold', color: '#546e7a' }}>
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
                                                <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 600, color: getSeatTextColor(seat) }}>
                                                    {seat.label}
                                                </Typography>
                                            )}
                                        </Box>
                                    ))}
                                    <Typography variant="subtitle2" sx={{ width: 30, textAlign: 'center', fontWeight: 'bold', color: '#546e7a' }}>
                                        {generateAlphabetLabel(rIndex)}
                                    </Typography>
                                </Stack>
                            ))}
                        </Stack>
                    </Box>
                </Box>
            </Paper>
        </Stack>
    );
}
