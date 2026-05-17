import { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Button,
    Paper,
    Stack,
    Typography,
    Chip,
    TextField,
    InputLabel,
    Grid,
    Divider
} from '@mui/material';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RefreshIcon from '@mui/icons-material/Refresh';
import AnimateButton from 'components/@extended/AnimateButton';

import { Room } from 'types/room';
import { Seat } from 'types/seat';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FormattedMessage, useIntl } from 'react-intl';

// Internal UI type — 'DELETED' chỉ dùng để hiển thị lối đi
export type SeatDisplayType = 'STANDARD' | 'VIP' | 'SWEETBOX' | 'DELETED';

export interface SeatInfo {
    id: string;
    row: number;
    col: number;
    type: SeatDisplayType;
    label: string;
    price: number;
    isHidden?: boolean;
}

interface RoomSeatConfigProps {
    handleNext: () => void;
    handleBack: () => void;
    setRoom: (room: Room) => void;
    room: Room;
}

export default function RoomSeatConfig({ handleNext, handleBack, setRoom, room }: RoomSeatConfigProps) {
    const intl = useIntl();
    const [seats, setSeats] = useState<SeatInfo[][]>([]);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [prices, setPrices] = useState({
        STANDARD: 50000,
        VIP: 80000,
        SWEETBOX: 120000
    });

    const formik = useFormik({
        initialValues: {
            totalRow: room.totalRow > 0 ? room.totalRow : ('' as any),
            totalColumn: room.totalColumn > 0 ? room.totalColumn : ('' as any)
        },
        validationSchema: Yup.object({
            totalRow: Yup.number()
                .typeError(intl.formatMessage({ id: 'number-required' }))
                .required(intl.formatMessage({ id: 'row-required' }))
                .min(1, intl.formatMessage({ id: 'row-min' }))
                .max(26, intl.formatMessage({ id: 'row-max' })),
            totalColumn: Yup.number()
                .typeError(intl.formatMessage({ id: 'number-required' }))
                .required(intl.formatMessage({ id: 'column-required' }))
                .min(1, intl.formatMessage({ id: 'column-min' }))
                .max(50, intl.formatMessage({ id: 'column-max' }))
        }),
        onSubmit: (values) => {
            generateSeats(Number(values.totalRow), Number(values.totalColumn));
        }
    });

    // Auto-generate if coming back with existing data
    useEffect(() => {
        if (room.totalRow > 0 && room.totalColumn > 0) {
            if (room.seats && room.seats.length > 0) {
                // Restore from existing seats
                const flat = room.seats as Seat[];
                const rows: SeatInfo[][] = [];
                for (let r = 0; r < room.totalRow; r++) {
                    const rowArr = flat
                        .filter((s) => s.row === r)
                        .map((s) => ({
                            id: `${s.row}-${s.col}`,
                            row: s.row,
                            col: s.col,
                            type: ((s.seatStatus || '').toUpperCase() === 'DELETED' ? 'DELETED' : (s.type || 'STANDARD').toUpperCase()) as SeatDisplayType,
                            label: s.label,
                            price: s.price
                        }));
                    rows.push(rowArr);
                }
                setSeats(recalculateLabels(rows));

                // Also restore base prices from first found seats of each type
                const standard = flat.find((s) => (s.type || '').toUpperCase() === 'STANDARD' && (s.seatStatus || '').toUpperCase() === 'ACTIVE');
                const vip = flat.find((s) => (s.type || '').toUpperCase() === 'VIP' && (s.seatStatus || '').toUpperCase() === 'ACTIVE');
                const sweetbox = flat.find((s) => (s.type || '').toUpperCase() === 'SWEETBOX' && (s.seatStatus || '').toUpperCase() === 'ACTIVE');

                setPrices({
                    STANDARD: standard?.price || 50000,
                    VIP: vip?.price || 80000,
                    SWEETBOX: sweetbox?.price || 120000,
                });
            } else {
                generateSeats(room.totalRow, room.totalColumn);
            }

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-calculate capacity = số ghế không bị xóa
    const autoCapacity = useMemo(
        () => seats.flat().reduce((acc, s) => {
            if (s.type === 'DELETED' || s.isHidden) return acc;
            return acc + 1;
        }, 0),
        [seats]
    );

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
        return currentSeats.map((row, rIndex) => {
            const rowLabel = generateAlphabetLabel(rIndex);
            let seatNumber = 1;
            let skipNext = false;
            return row.map((seat) => {
                if (skipNext) {
                    skipNext = false;
                    return { ...seat, type: seat.type === 'SWEETBOX' ? 'STANDARD' : seat.type, label: '', isHidden: true };
                }

                if (seat.type === 'DELETED') {
                    return { ...seat, label: '', isHidden: false };
                }

                const newLabel = `${rowLabel}${seatNumber}`;
                seatNumber++;
                if (seat.type === 'SWEETBOX') {
                    skipNext = true;
                }
                return { ...seat, label: newLabel, isHidden: false };
            });
        });
    };

    const generateSeats = (rows: number, cols: number) => {
        let newSeats: SeatInfo[][] = [];
        for (let r = 0; r < rows; r++) {
            const rowArr: SeatInfo[] = [];
            for (let c = 0; c < cols; c++) {
                rowArr.push({ id: `${r}-${c}`, row: r, col: c, type: 'STANDARD', label: '', price: prices.STANDARD });
            }
            newSeats.push(rowArr);
        }
        newSeats = recalculateLabels(newSeats);
        setSeats(newSeats);
        setSelectedSeats([]);
    };

    const handleSeatClick = (r: number, c: number) => {
        const seatId = `${r}-${c}`;
        setSelectedSeats((prev) =>
            prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
        );
    };

    const handleApplyType = (type: SeatDisplayType) => {
        if (selectedSeats.length === 0) return;
        setSeats((prev) => {
            const newSeats = prev.map((row) => [...row]);
            for (const seatId of selectedSeats) {
                const [rStr, cStr] = seatId.split('-');
                const r = parseInt(rStr);
                const c = parseInt(cStr);
                const price = type === 'DELETED' ? 0 : prices[type as keyof typeof prices] || prices.STANDARD;
                newSeats[r][c] = { ...newSeats[r][c], type, price };
            }
            return recalculateLabels(newSeats);
        });
        setSelectedSeats([]);
    };

    const getSeatColor = (type: SeatDisplayType) => {
        switch (type) {
            case 'STANDARD': return '#e3f2fd';
            case 'VIP': return '#fff3e0';
            case 'SWEETBOX': return '#fce4ec';
            case 'DELETED': return 'transparent';
            default: return '#e3f2fd';
        }
    };

    const getSeatBorder = (type: SeatDisplayType) => {
        switch (type) {
            case 'STANDARD': return '1px solid #2196f3';
            case 'VIP': return '1px solid #ff9800';
            case 'SWEETBOX': return '1px solid #e91e63';
            case 'DELETED': return '1px dashed #bdbdbd';
            default: return '1px solid #2196f3';
        }
    };

    const getSeatTextColor = (type: SeatDisplayType) => {
        switch (type) {
            case 'STANDARD': return '#0d47a1';
            case 'VIP': return '#e65100';
            case 'SWEETBOX': return '#880e4f';
            case 'DELETED': return 'transparent';
            default: return '#0d47a1';
        }
    };

    const countByType = (type: SeatDisplayType) =>
        seats.flat().filter((s) => s.type === type && !s.isHidden).length;

    const handleConfirmSeats = () => {
        const payload: Seat[] = seats.flat().map((seat) => {
            const isEffectivelyDeleted = seat.type === 'DELETED' || seat.isHidden;
            return {
                row: seat.row,
                col: seat.col,
                label: seat.label,
                type: (isEffectivelyDeleted ? 'STANDARD' : seat.type) as "STANDARD" | "VIP" | "SWEETBOX",
                price: seat.price,
                seatStatus: isEffectivelyDeleted ? 'DELETED' : 'ACTIVE'
            };
        });
        console.log("payload", payload)
        setRoom({
            ...room,
            capacity: autoCapacity,
            totalRow: Number(formik.values.totalRow),
            totalColumn: Number(formik.values.totalColumn),
            seats: payload
        });
        handleNext();
    };

    // Nút "Tiếp tục" chỉ active khi đã tạo sơ đồ
    const canProceed = seats.length > 0;

    return (
        <Stack spacing={3}>
            {/* Layout config form */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    <FormattedMessage id="seat-layout-setup" />
                </Typography>
                <Typography variant="body2" color="textSecondary" mb={3}>
                    <FormattedMessage id="seat-layout-description" />
                </Typography>

                <form onSubmit={formik.handleSubmit} noValidate>
                    <Grid container spacing={2} alignItems="flex-end">
                        {/* Số hàng */}
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <InputLabel htmlFor="totalRow" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                <FormattedMessage id="row-number" />{' '}
                                <Typography component="span" variant="caption" color="textSecondary"><FormattedMessage id="max-26" /></Typography>
                            </InputLabel>
                            <TextField
                                id="totalRow"
                                name="totalRow"
                                type="number"
                                placeholder="VD: 10"
                                size="small"
                                fullWidth
                                inputProps={{ min: 1, max: 26 }}
                                value={formik.values.totalRow}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.totalRow && Boolean(formik.errors.totalRow)}
                                helperText={formik.touched.totalRow && formik.errors.totalRow}
                            />
                        </Grid>

                        {/* Số cột */}
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <InputLabel htmlFor="totalColumn" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                <FormattedMessage id="column-number" />{' '}
                                <Typography component="span" variant="caption" color="textSecondary"><FormattedMessage id="max-50" /></Typography>
                            </InputLabel>
                            <TextField
                                id="totalColumn"
                                name="totalColumn"
                                type="number"
                                placeholder="VD: 12"
                                size="small"
                                fullWidth
                                inputProps={{ min: 1, max: 50 }}
                                value={formik.values.totalColumn}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.totalColumn && Boolean(formik.errors.totalColumn)}
                                helperText={formik.touched.totalColumn && formik.errors.totalColumn}
                            />
                        </Grid>

                        {/* Số chỗ ngồi (auto) */}
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <InputLabel sx={{ mb: 1 }}>
                                <FormattedMessage id="seat-count" />{' '}
                                <Typography component="span" variant="caption" color="textSecondary"><FormattedMessage id="auto" /></Typography>
                            </InputLabel>
                            <TextField
                                size="small"
                                fullWidth
                                value={seats.length > 0 ? autoCapacity : '—'}
                                InputProps={{ readOnly: true }}
                                sx={{ '& .MuiInputBase-input': { color: 'text.secondary', bgcolor: 'action.disabledBackground', borderRadius: 1 } }}
                            />
                        </Grid>

                        {/* Nút tạo */}
                        <Grid size={{ xs: 12 }}>
                            <Button
                                variant="contained"
                                type="submit"
                                startIcon={<RefreshIcon />}
                            >
                                {seats.length > 0 ? <FormattedMessage id="recreate-layout" /> : <FormattedMessage id="create-layout" />}
                            </Button>
                        </Grid>
                    </Grid>
                </form>

                {seats.length > 0 && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        {/* Legend */}
                        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                            <Chip size="small" label={intl.formatMessage({ id: 'standard' })} sx={{ bgcolor: '#e3f2fd', border: '1px solid #2196f3', color: '#0d47a1', fontWeight: 600 }} icon={<EventSeatIcon style={{ color: '#2196f3', fontSize: 14 }} />} />
                            <Chip size="small" label="VIP" sx={{ bgcolor: '#fff3e0', border: '1px solid #ff9800', color: '#e65100', fontWeight: 600 }} icon={<StarIcon style={{ color: '#ff9800', fontSize: 14 }} />} />
                            <Chip size="small" label="Sweetbox" sx={{ bgcolor: '#fce4ec', border: '1px solid #e91e63', color: '#880e4f', fontWeight: 600 }} icon={<FavoriteIcon style={{ color: '#e91e63', fontSize: 14 }} />} />
                            <Chip size="small" label={intl.formatMessage({ id: 'deleted' })} sx={{ bgcolor: 'transparent', border: '1px dashed #bdbdbd', color: '#9e9e9e', fontWeight: 600 }} />
                            <Chip size="small" label={intl.formatMessage({ id: 'selected' })} sx={{ bgcolor: 'rgba(76,175,80,0.1)', border: '2px solid #4caf50', color: '#2e7d32', fontWeight: 600 }} />


                        </Stack>
                    </>
                )}
            </Paper>

            {/* Seat grid */}
            {seats.length > 0 && (
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Stack direction={{ xs: 'column-reverse', lg: 'row' }} spacing={3} alignItems="flex-start">
                        {/* Seat Grid */}
                        <Box sx={{ flex: 1, width: '100%', overflowX: 'auto', p: 4, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                            <Box sx={{ minWidth: 'max-content', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {/* Screen */}
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
                                    <Typography variant="button" color="textSecondary" sx={{ letterSpacing: 4, fontWeight: 'bold' }}><FormattedMessage id="screen" /></Typography>
                                </Box>

                                {/* Seat rows */}
                                <Stack spacing={1.5}>
                                    {seats.map((row, rIndex) => (
                                        <Stack key={`row-${rIndex}`} direction="row" spacing={1.5} alignItems="center">
                                            <Typography variant="subtitle2" sx={{ width: 30, textAlign: 'center', fontWeight: 'bold', color: '#546e7a' }}>
                                                {generateAlphabetLabel(rIndex)}
                                            </Typography>

                                            {row.map((seat, cIndex) => {
                                                if (seat.isHidden) return null;
                                                const isSelected = selectedSeats.includes(seat.id);
                                                return (
                                                    <Box
                                                        key={seat.id}
                                                        onClick={() => handleSeatClick(rIndex, cIndex)}
                                                        sx={{
                                                            width: seat.type === 'SWEETBOX' ? 88 : 38,
                                                            height: 38,
                                                            bgcolor: getSeatColor(seat.type),
                                                            border: isSelected ? '2px solid #4caf50' : getSeatBorder(seat.type),
                                                            borderRadius: 1,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.15s ease-in-out',
                                                            boxShadow: isSelected ? '0 0 0 2px #4caf50 inset, 0 0 8px rgba(76,175,80,0.4)' : 'none',
                                                            transform: isSelected ? 'scale(1.08)' : 'none',
                                                            '&:hover': { opacity: 0.8, transform: 'scale(1.1)' }
                                                        }}
                                                    >
                                                        {seat.type !== 'DELETED' && (
                                                            <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 600, color: getSeatTextColor(seat.type) }}>
                                                                {seat.label}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                );
                                            })}

                                            <Typography variant="subtitle2" sx={{ width: 30, textAlign: 'center', fontWeight: 'bold', color: '#546e7a' }}>
                                                {generateAlphabetLabel(rIndex)}
                                            </Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Box>
                        </Box>

                        {/* Toolbar */}
                        <Paper elevation={3} sx={{
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
                        }}>
                            <Typography variant="subtitle2" sx={{ textAlign: 'center', width: '100%', color: 'primary.main', fontWeight: 'bold' }}>
                                {selectedSeats.length > 0 ? intl.formatMessage({ id: 'selected-seats' }, { count: selectedSeats.length }) : <FormattedMessage id="select-seat-to-apply" />}
                            </Typography>

                            <Stack spacing={1} sx={{ width: '100%', mb: 1 }}>
                                <TextField
                                    label={intl.formatMessage({ id: 'standard-price' })}
                                    type="number"
                                    size="small"
                                    value={prices.STANDARD}
                                    onChange={(e) => setPrices({ ...prices, STANDARD: Number(e.target.value) })}
                                />
                                <TextField
                                    label={intl.formatMessage({ id: 'vip-price' })}
                                    type="number"
                                    size="small"
                                    value={prices.VIP}
                                    onChange={(e) => setPrices({ ...prices, VIP: Number(e.target.value) })}
                                />
                                <TextField
                                    label={intl.formatMessage({ id: 'sweetbox-price' })}
                                    type="number"
                                    size="small"
                                    value={prices.SWEETBOX}
                                    onChange={(e) => setPrices({ ...prices, SWEETBOX: Number(e.target.value) })}
                                />
                            </Stack>

                            <Button variant="outlined" color="primary" onClick={() => handleApplyType('STANDARD')} disabled={selectedSeats.length === 0} startIcon={<EventSeatIcon />} fullWidth>
                                <FormattedMessage id="standard" />
                            </Button>
                            <Button variant="outlined" color="warning" onClick={() => handleApplyType('VIP')} disabled={selectedSeats.length === 0} startIcon={<StarIcon />} fullWidth>
                                VIP
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => handleApplyType('SWEETBOX')}
                                disabled={selectedSeats.length === 0}
                                startIcon={<FavoriteIcon />}
                                fullWidth
                                sx={{ color: '#e91e63', borderColor: '#e91e63', '&:hover': { borderColor: '#c2185b', backgroundColor: 'rgba(233,30,99,0.04)' } }}
                            >
                                Sweetbox
                            </Button>
                            <Button variant="outlined" color="error" onClick={() => handleApplyType('DELETED')} disabled={selectedSeats.length === 0} startIcon={<DeleteIcon />} fullWidth>
                                <FormattedMessage id="delete-seat" />
                            </Button>




                            {selectedSeats.length > 0 && (
                                <Button variant="text" size="small" onClick={() => setSelectedSeats([])} fullWidth>
                                    <FormattedMessage id="deselect-all" />
                                </Button>
                            )}

                            {/* Stats */}
                            <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 1.5, width: '100%' }}>
                                <Typography variant="caption" display="block" color="textSecondary" fontWeight={600} mb={0.5}><FormattedMessage id="statistics" /></Typography>
                                <Typography variant="caption" display="block" sx={{ color: '#0d47a1' }}><FormattedMessage id="standard" />: {countByType('STANDARD')}</Typography>
                                <Typography variant="caption" display="block" sx={{ color: '#e65100' }}>VIP: {countByType('VIP')}</Typography>
                                <Typography variant="caption" display="block" sx={{ color: '#880e4f' }}>Sweetbox: {countByType('SWEETBOX')}</Typography>
                                <Typography variant="caption" display="block" sx={{ color: '#9e9e9e' }}><FormattedMessage id="deleted" />: {countByType('DELETED')}</Typography>


                                <Divider sx={{ my: 0.5 }} />
                                <Typography variant="caption" display="block" fontWeight={700}><FormattedMessage id="room-total-seats" />: {autoCapacity}</Typography>
                            </Box>
                        </Paper>
                    </Stack>
                </Paper>
            )}

            {/* Navigation */}
            <Stack direction="row" justifyContent="space-between" sx={{ pb: 2 }}>
                <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
                    <FormattedMessage id="back" />
                </Button>
                <AnimateButton>
                    <Button
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        onClick={handleConfirmSeats}
                        disabled={!canProceed}
                    >
                        <FormattedMessage id="continue" />
                    </Button>
                </AnimateButton>
            </Stack>
        </Stack>
    );
}
