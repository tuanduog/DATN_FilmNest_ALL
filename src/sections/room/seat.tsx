import { useState } from 'react';
import {
    Box,
    Button,
    Paper,
    Stack,
    TextField,
    Typography,
    Tooltip
} from '@mui/material';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';

// Types
export type SeatType = 'STANDARD' | 'VIP' | 'SWEETBOX' | 'DELETED';

export interface SeatInfo {
    id: string;
    row: number;
    col: number;
    type: SeatType;
    label: string;
}

export default function RoomSeatConfig() {
    const [rowCount, setRowCount] = useState<number>(10);
    const [colCount, setColCount] = useState<number>(12);

    const [seats, setSeats] = useState<SeatInfo[][]>([]);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    const generateAlphabetLabel = (index: number) => {
        let label = '';
        let temp = index;
        while (temp >= 0) {
            label = String.fromCharCode((temp % 26) + 65) + label;
            temp = Math.floor(temp / 26) - 1;
        }
        return label;
    };

    const recalculateLabels = (currentSeats: SeatInfo[][]) => {
        const updatedSeats = currentSeats.map((row, rIndex) => {
            const rowLabel = generateAlphabetLabel(rIndex);
            let seatNumber = 1;
            return row.map((seat) => {
                if (seat.type === 'DELETED') {
                    return { ...seat, label: '' };
                }
                const newLabel = `${rowLabel}${seatNumber}`;
                seatNumber++;
                return { ...seat, label: newLabel };
            });
        });
        return updatedSeats;
    };

    const handleGenerate = () => {
        if (rowCount <= 0 || colCount <= 0) return;

        let newSeats: SeatInfo[][] = [];
        for (let r = 0; r < rowCount; r++) {
            const rowArr: SeatInfo[] = [];
            for (let c = 0; c < colCount; c++) {
                rowArr.push({
                    id: `${r}-${c}`,
                    row: r,
                    col: c,
                    type: 'STANDARD',
                    label: '' // Sẽ được tính lại ngay sau đó
                });
            }
            newSeats.push(rowArr);
        }

        newSeats = recalculateLabels(newSeats);
        setSeats(newSeats);
    };

    const handleSeatClick = (r: number, c: number) => {
        const seatId = `${r}-${c}`;
        setSelectedSeats((prev) => {
            if (prev.includes(seatId)) {
                return prev.filter((id) => id !== seatId);
            } else {
                return [...prev, seatId];
            }
        });
    };

    const handleApplyType = (type: SeatType) => {
        if (selectedSeats.length === 0) return;

        setSeats((prev) => {
            let newSeats = prev.map(row => [...row]);

            for (const seatId of selectedSeats) {
                const [rStr, cStr] = seatId.split('-');
                const r = parseInt(rStr, 10);
                const c = parseInt(cStr, 10);
                newSeats[r][c] = { ...newSeats[r][c], type };
            }

            return recalculateLabels(newSeats);
        });
        setSelectedSeats([]); // Xóa vùng chọn sau khi áp dụng
    };

    const getSeatColor = (type: SeatType) => {
        switch (type) {
            case 'STANDARD': return '#e3f2fd'; // light blue
            case 'VIP': return '#fff3e0'; // light orange
            case 'SWEETBOX': return '#fce4ec'; // light pink
            case 'DELETED': return 'transparent';
        }
    };

    const getSeatBorder = (type: SeatType) => {
        switch (type) {
            case 'STANDARD': return '1px solid #2196f3';
            case 'VIP': return '1px solid #ff9800';
            case 'SWEETBOX': return '1px solid #e91e63';
            case 'DELETED': return '1px dashed #bdbdbd';
        }
    };

    const getSeatTextColor = (type: SeatType) => {
        switch (type) {
            case 'STANDARD': return '#0d47a1';
            case 'VIP': return '#e65100';
            case 'SWEETBOX': return '#880e4f';
            case 'DELETED': return 'transparent';
        }
    };

    return (
        <Stack spacing={3}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    Thiết lập sơ đồ phòng chiếu
                </Typography>
                <Typography variant="body2" color="textSecondary" mb={3}>
                    Nhập số hàng và số cột để tạo sơ đồ ghế mặc định. Sau đó bạn có thể chọn công cụ bên dưới và click vào từng ghế để tùy chỉnh loại ghế hoặc xóa tạo khoảng trống lối đi.
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        label="Số hàng"
                        type="number"
                        size="small"
                        value={rowCount}
                        onChange={(e) => setRowCount(Number(e.target.value))}
                        inputProps={{ min: 1, max: 50 }}
                        sx={{ width: 120 }}
                    />
                    <TextField
                        label="Số cột"
                        type="number"
                        size="small"
                        value={colCount}
                        onChange={(e) => setColCount(Number(e.target.value))}
                        inputProps={{ min: 1, max: 50 }}
                        sx={{ width: 120 }}
                    />
                    <Button variant="contained" onClick={handleGenerate} size="large">
                        Tạo sơ đồ ghế
                    </Button>
                </Stack>
            </Paper>

            {seats.length > 0 && (
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Stack spacing={1} mb={3}>
                        <Typography variant="subtitle1" fontWeight="bold">Công cụ chỉnh sửa ghế:</Typography>
                        <Typography variant="body2" color="textSecondary">
                            Chọn các ghế bên dưới rồi nhấn vào chế độ ở thanh công cụ bên cạnh để áp dụng
                        </Typography>
                    </Stack>

                    <Stack direction={{ xs: 'column-reverse', lg: 'row' }} spacing={3} alignItems="flex-start">
                        {/* Vùng sơ đồ ghế */}
                        <Box sx={{ flex: 1, width: '100%', overflowX: 'auto', p: 4, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                            <Box sx={{ minWidth: 'max-content', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {/* Màn hình */}
                                <Box sx={{
                                    width: '80%',
                                    maxWidth: 600,
                                    height: 48,
                                    bgcolor: '#cfd8dc',
                                    mb: 6,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '0 0 50% 50% / 0 0 100% 100%',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                    borderTop: '4px solid #90a4ae'
                                }}>
                                    <Typography variant="button" color="textSecondary" sx={{ letterSpacing: 4, fontWeight: 'bold' }}>MÀN HÌNH</Typography>
                                </Box>

                                {/* Lưới ghế */}
                                <Stack spacing={1.5}>
                                    {seats.map((row, rIndex) => (
                                        <Stack key={`row-${rIndex}`} direction="row" spacing={1.5} alignItems="center">
                                            {/* Row Label Left */}
                                            <Typography variant="subtitle2" sx={{ width: 30, textAlign: 'center', fontWeight: 'bold', color: '#546e7a' }}>
                                                {generateAlphabetLabel(rIndex)}
                                            </Typography>

                                            {row.map((seat, cIndex) => {
                                                const isSelected = selectedSeats.includes(seat.id);
                                                return (
                                                    <Box
                                                        key={seat.id}
                                                        onClick={() => handleSeatClick(rIndex, cIndex)}
                                                        sx={{
                                                            width: seat.type === 'SWEETBOX' ? 80 : 38, // Ghế đôi rộng hơn
                                                            height: 38,
                                                            bgcolor: getSeatColor(seat.type),
                                                            border: getSeatBorder(seat.type),
                                                            borderRadius: 1,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.15s ease-in-out',
                                                            boxShadow: isSelected ? '0 0 0 2px #4caf50 inset, 0 0 8px rgba(76, 175, 80, 0.5)' : 'none',
                                                            transform: isSelected ? 'scale(1.05)' : 'none',
                                                            '&:hover': {
                                                                opacity: 0.8,
                                                                transform: 'scale(1.1)',
                                                                boxShadow: isSelected ? '0 0 0 2px #4caf50 inset, 0 2px 8px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.15)'
                                                            }
                                                        }}
                                                    >
                                                        {seat.type !== 'DELETED' && (
                                                            <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 600, color: getSeatTextColor(seat.type) }}>
                                                                {seat.label}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                );
                                            })}

                                            {/* Row Label Right */}
                                            <Typography variant="subtitle2" sx={{ width: 30, textAlign: 'center', fontWeight: 'bold', color: '#546e7a' }}>
                                                {generateAlphabetLabel(rIndex)}
                                            </Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Box>
                        </Box>

                        {/* Thanh công cụ dọc */}
                        <Paper
                            elevation={3}
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: { xs: 'row', lg: 'column' },
                                gap: 1.5,
                                position: { lg: 'sticky' },
                                top: 24,
                                minWidth: 160,
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                alignSelf: 'flex-start'
                            }}
                        >
                            <Typography variant="subtitle2" sx={{ textAlign: 'center', mb: { lg: 1 }, width: '100%', color: 'primary.main', fontWeight: 'bold' }}>
                                Áp dụng cho {selectedSeats.length} ghế
                            </Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => handleApplyType('STANDARD')}
                                disabled={selectedSeats.length === 0}
                                startIcon={<EventSeatIcon />}
                            >
                                Thường
                            </Button>
                            <Button
                                variant="outlined"
                                color="warning"
                                onClick={() => handleApplyType('VIP')}
                                disabled={selectedSeats.length === 0}
                                startIcon={<StarIcon />}
                            >
                                VIP
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => handleApplyType('SWEETBOX')}
                                disabled={selectedSeats.length === 0}
                                startIcon={<FavoriteIcon />}
                                sx={{
                                    color: '#e91e63',
                                    borderColor: '#e91e63',
                                    '&:hover': {
                                        borderColor: '#c2185b',
                                        backgroundColor: 'rgba(233, 30, 99, 0.04)'
                                    }
                                }}
                            >
                                Sweetbox
                            </Button>
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={() => handleApplyType('DELETED')}
                                disabled={selectedSeats.length === 0}
                                startIcon={<DeleteIcon />}
                            >
                                Xóa
                            </Button>
                        </Paper>
                    </Stack>
                </Paper>
            )}
        </Stack>
    );
}
