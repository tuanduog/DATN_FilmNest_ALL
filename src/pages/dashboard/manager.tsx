import React, { useState } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    SelectChangeEvent,
    Avatar,
    useTheme,
    Button,
    TextField,
    Collapse,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    LinearProgress
} from '@mui/material';
import {
    AttachMoney,
    LocalPlay,
    Fastfood,
    TrendingUp,
    MeetingRoom,
    EventSeat,
    Schedule,
    CheckCircle,
    RadioButtonUnchecked,
    TrendingDown
} from '@mui/icons-material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';

// --- Mock Data ---

const revenueTrendByDay = [
    { date: '7h', revenue: 800000, tickets: 10 },
    { date: '9h', revenue: 2100000, tickets: 26 },
    { date: '11h', revenue: 3500000, tickets: 43 },
    { date: '13h', revenue: 4800000, tickets: 59 },
    { date: '15h', revenue: 6200000, tickets: 76 },
    { date: '17h', revenue: 8500000, tickets: 105 },
    { date: '19h', revenue: 12000000, tickets: 148 },
    { date: '21h', revenue: 9500000, tickets: 118 },
];

const revenueTrendByWeek = [
    { date: 'T2', revenue: 8500000, tickets: 95 },
    { date: 'T3', revenue: 11000000, tickets: 130 },
    { date: 'T4', revenue: 9200000, tickets: 108 },
    { date: 'T5', revenue: 15000000, tickets: 182 },
    { date: 'T6', revenue: 22000000, tickets: 260 },
    { date: 'T7', revenue: 31000000, tickets: 370 },
    { date: 'CN', revenue: 28500000, tickets: 340 },
];

const revenueTrendByMonth = [
    { date: 'Tuần 1', revenue: 32000000, tickets: 380 },
    { date: 'Tuần 2', revenue: 41000000, tickets: 490 },
    { date: 'Tuần 3', revenue: 37500000, tickets: 445 },
    { date: 'Tuần 4', revenue: 52000000, tickets: 620 },
];

const revenueTrendByYear = [
    { date: 'T1', revenue: 95000000, tickets: 1180 },
    { date: 'T2', revenue: 82000000, tickets: 1020 },
    { date: 'T3', revenue: 108000000, tickets: 1350 },
    { date: 'T4', revenue: 135000000, tickets: 1690 },
    { date: 'T5', revenue: 148000000, tickets: 1850 },
    { date: 'T6', revenue: 128000000, tickets: 1600 },
    { date: 'T7', revenue: 175000000, tickets: 2190 },
    { date: 'T8', revenue: 162000000, tickets: 2025 },
    { date: 'T9', revenue: 120000000, tickets: 1500 },
    { date: 'T10', revenue: 140000000, tickets: 1750 },
    { date: 'T11', revenue: 158000000, tickets: 1975 },
    { date: 'T12', revenue: 210000000, tickets: 2625 },
];

const topMoviesData = [
    { name: 'Lật Mặt 7', revenue: 28000000, tickets: 2800, occupancy: 92 },
    { name: 'Godzilla x Kong', revenue: 21000000, tickets: 2100, occupancy: 78 },
    { name: 'Mai', revenue: 15500000, tickets: 1550, occupancy: 65 },
    { name: 'Kung Fu Panda 4', revenue: 10000000, tickets: 1000, occupancy: 48 },
    { name: 'Exhuma', revenue: 8700000, tickets: 870, occupancy: 42 },
];

const roomPerformanceData = [
    { name: 'Phòng 1', revenue: 35000000, occupancy: 85 },
    { name: 'Phòng 2', revenue: 28000000, occupancy: 72 },
    { name: 'Phòng 3', revenue: 22000000, occupancy: 68 },
    { name: 'Phòng 4 (VIP)', revenue: 40000000, occupancy: 91 },
];

const revenueSourceData = [
    { name: 'Vé Xem Phim', value: 87000000 },
    { name: 'Combo Đồ Ăn', value: 28000000 },
    { name: 'Ghế VIP', value: 10200000 },
];

const todayShowtimes = [
    { time: '08:30', movie: 'Lật Mặt 7', room: 'Phòng 1', sold: 88, total: 100, status: 'done' },
    { time: '10:00', movie: 'Godzilla x Kong', room: 'Phòng 2', sold: 72, total: 80, status: 'done' },
    { time: '11:30', movie: 'Mai', room: 'Phòng 3', sold: 45, total: 90, status: 'ongoing' },
    { time: '13:00', movie: 'Kung Fu Panda 4', room: 'Phòng 1', sold: 60, total: 100, status: 'upcoming' },
    { time: '14:30', movie: 'Lật Mặt 7', room: 'Phòng 4 (VIP)', sold: 38, total: 50, status: 'upcoming' },
    { time: '16:00', movie: 'Exhuma', room: 'Phòng 2', sold: 20, total: 80, status: 'upcoming' },
    { time: '18:00', movie: 'Godzilla x Kong', room: 'Phòng 3', sold: 5, total: 90, status: 'upcoming' },
    { time: '20:30', movie: 'Lật Mặt 7', room: 'Phòng 4 (VIP)', sold: 0, total: 50, status: 'upcoming' },
];

const COLORS = ['#6366f1', '#22d3ee', '#f59e0b'];
const THEATER_NAME = 'FilmNest Hà Nội';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const formatCurrencyShort = (value: number) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
    return String(value);
};

// --- Components ---

export default function ManagerDashboard() {
    const theme = useTheme();
    const [timeFilter, setTimeFilter] = useState('week');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const handleTimeChange = (event: SelectChangeEvent) => {
        setTimeFilter(event.target.value);
    };

    const getChartData = () => {
        switch (timeFilter) {
            case 'today': return revenueTrendByDay;
            case 'week': return revenueTrendByWeek;
            case 'month': return revenueTrendByMonth;
            case 'year': return revenueTrendByYear;
            case 'custom': {
                if (fromDate && toDate) {
                    const diffDays = Math.ceil(
                        (new Date(toDate).getTime() - new Date(fromDate).getTime()) / (1000 * 60 * 60 * 24)
                    );
                    if (diffDays <= 1) return revenueTrendByDay;
                    if (diffDays <= 31) return revenueTrendByWeek;
                    if (diffDays <= 90) return revenueTrendByMonth;
                    return revenueTrendByYear;
                }
                return revenueTrendByWeek;
            }
            default: return revenueTrendByWeek;
        }
    };

    const getChartGranularityLabel = () => {
        switch (timeFilter) {
            case 'today': return 'theo giờ';
            case 'week': return 'theo ngày';
            case 'month': return 'theo tuần';
            case 'year': return 'theo tháng';
            case 'custom': {
                if (fromDate && toDate) {
                    const diffDays = Math.ceil(
                        (new Date(toDate).getTime() - new Date(fromDate).getTime()) / (1000 * 60 * 60 * 24)
                    );
                    if (diffDays <= 1) return 'theo giờ';
                    if (diffDays <= 31) return 'theo ngày';
                    if (diffDays <= 90) return 'theo tuần';
                    return 'theo tháng';
                }
                return 'theo ngày';
            }
            default: return 'theo ngày';
        }
    };

    const getFilterLabel = () => {
        switch (timeFilter) {
            case 'today': return 'Hôm nay';
            case 'week': return 'Tuần này';
            case 'month': return 'Tháng này';
            case 'year': return 'Năm nay';
            case 'custom': return fromDate && toDate ? `${fromDate} → ${toDate}` : 'Tùy chỉnh';
            default: return '';
        }
    };

    const renderKpiCard = (
        title: string,
        value: string | number,
        icon: React.ReactNode,
        color: string,
        trend: string,
        trendUp: boolean = true
    ) => (
        <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="subtitle2" color="textSecondary" fontWeight="bold" gutterBottom>
                            {title.toUpperCase()}
                        </Typography>
                        <Typography variant="h4" fontWeight="800" sx={{ mt: 1, mb: 1 }}>
                            {value}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {trendUp
                                ? <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />
                                : <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />}
                            <Typography variant="body2" color={trendUp ? 'success.main' : 'error.main'} fontWeight="bold">
                                {trend}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                so với kỳ trước
                            </Typography>
                        </Box>
                    </Box>
                    <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main`, width: 56, height: 56 }}>
                        {icon}
                    </Avatar>
                </Box>
            </CardContent>
        </Card>
    );

    const getStatusChip = (status: string) => {
        switch (status) {
            case 'done':
                return <Chip label="Đã kết thúc" size="small" icon={<CheckCircle sx={{ fontSize: '14px !important' }} />} sx={{ bgcolor: 'action.disabledBackground', color: 'text.secondary', fontWeight: 600 }} />;
            case 'ongoing':
                return <Chip label="Đang chiếu" size="small" sx={{ bgcolor: 'success.light', color: 'success.dark', fontWeight: 600 }} />;
            case 'upcoming':
                return <Chip label="Sắp chiếu" size="small" icon={<RadioButtonUnchecked sx={{ fontSize: '14px !important' }} />} sx={{ bgcolor: 'primary.light', color: 'primary.dark', fontWeight: 600 }} />;
            default: return null;
        }
    };

    return (
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h3" component="h1" fontWeight="800" sx={{ mb: 0.5 }}>
                        {THEATER_NAME}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Thống kê hoạt động rạp chiếu phim theo {getFilterLabel().toLowerCase()}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
                    <FormControl sx={{ minWidth: 180 }} size="small">
                        <InputLabel id="mgr-time-filter-label">Kỳ báo cáo</InputLabel>
                        <Select
                            labelId="mgr-time-filter-label"
                            id="mgr-time-filter"
                            value={timeFilter}
                            label="Kỳ báo cáo"
                            onChange={handleTimeChange}
                            sx={{ borderRadius: 2, bgcolor: 'background.paper' }}
                        >
                            <MenuItem value="today">Hôm nay</MenuItem>
                            <MenuItem value="week">Tuần qua</MenuItem>
                            <MenuItem value="month">Tháng này</MenuItem>
                            <MenuItem value="year">Năm nay</MenuItem>
                            <MenuItem value="custom">Tùy chỉnh</MenuItem>
                        </Select>
                    </FormControl>
                    <Collapse in={timeFilter === 'custom'} orientation="horizontal">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <TextField
                                id="mgr-from-date"
                                label="Từ ngày"
                                type="date"
                                size="small"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ max: toDate || undefined }}
                                sx={{ bgcolor: 'background.paper', borderRadius: 2, minWidth: 155 }}
                            />
                            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>—</Typography>
                            <TextField
                                id="mgr-to-date"
                                label="Đến ngày"
                                type="date"
                                size="small"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ min: fromDate || undefined }}
                                sx={{ bgcolor: 'background.paper', borderRadius: 2, minWidth: 155 }}
                            />
                            <Button
                                variant="contained"
                                size="small"
                                disabled={!fromDate || !toDate}
                                sx={{ borderRadius: 2, whiteSpace: 'nowrap', height: 40 }}
                            >
                                Áp dụng
                            </Button>
                        </Box>
                    </Collapse>
                </Box>
            </Box>

            {/* KPI Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    {renderKpiCard('Tổng Doanh Thu', formatCurrency(125200000), <AttachMoney fontSize="large" />, 'primary', '+11.4%')}
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    {renderKpiCard('Vé Đã Bán', '8,485', <LocalPlay fontSize="large" />, 'info', '+6.7%')}
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    {renderKpiCard('Combo Đã Bán', '2,130', <Fastfood fontSize="large" />, 'warning', '+9.2%')}
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    {renderKpiCard('Công Suất TB', '73%', <EventSeat fontSize="large" />, 'success', '-2.1%', false)}
                </Grid>
            </Grid>

            {/* Charts Row 1 */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" mb={3}>
                                Biến Động Doanh Thu & Vé ({getFilterLabel()} — {getChartGranularityLabel()})
                            </Typography>
                            <Box sx={{ height: 320 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={getChartData()} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="mgrColorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} />
                                        <YAxis yAxisId="left" axisLine={false} tickLine={false} tickFormatter={formatCurrencyShort} />
                                        <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
                                        <Tooltip
                                            formatter={(value: number, name: string) => [
                                                name === 'revenue' ? formatCurrency(value) : value,
                                                name === 'revenue' ? 'Doanh thu' : 'Số vé'
                                            ]}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend iconType="circle" />
                                        <Area yAxisId="left" type="monotone" dataKey="revenue" name="Doanh thu" stroke={theme.palette.primary.main} strokeWidth={3} fillOpacity={1} fill="url(#mgrColorRevenue)" />
                                        <Bar yAxisId="right" dataKey="tickets" name="Số vé" fill={theme.palette.warning.main} radius={[4, 4, 0, 0]} barSize={18} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Typography variant="h6" fontWeight="bold" mb={1}>Cơ Cấu Doanh Thu</Typography>
                            <Box sx={{ flexGrow: 1, height: 280 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={revenueSourceData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {revenueSourceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value: number) => formatCurrency(value)}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend iconType="circle" verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts Row 2 */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Top Phim */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" mb={3}>Top Phim Theo Doanh Thu</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {topMoviesData.map((movie, idx) => (
                                    <Box key={movie.name}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar sx={{ width: 24, height: 24, fontSize: 12, fontWeight: 700, bgcolor: idx === 0 ? 'warning.main' : 'action.disabledBackground', color: idx === 0 ? 'white' : 'text.secondary' }}>
                                                    {idx + 1}
                                                </Avatar>
                                                <Typography variant="body2" fontWeight={600}>{movie.name}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                <Typography variant="caption" color="textSecondary">{movie.tickets.toLocaleString()} vé</Typography>
                                                <Typography variant="body2" fontWeight={700} color="primary.main">
                                                    {formatCurrencyShort(movie.revenue)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={movie.occupancy}
                                                sx={{
                                                    flexGrow: 1,
                                                    height: 6,
                                                    borderRadius: 3,
                                                    bgcolor: 'action.disabledBackground',
                                                    '& .MuiLinearProgress-bar': {
                                                        borderRadius: 3,
                                                        bgcolor: idx === 0 ? 'warning.main' : 'primary.main'
                                                    }
                                                }}
                                            />
                                            <Typography variant="caption" color="textSecondary" sx={{ minWidth: 36 }}>
                                                {movie.occupancy}%
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Hiệu suất phòng chiếu */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" mb={3}>Hiệu Suất Theo Phòng Chiếu</Typography>
                            <Box sx={{ height: 280 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={roomPerformanceData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                        <YAxis yAxisId="left" tickFormatter={formatCurrencyShort} axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                                        <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} tick={{ fontSize: 11 }} domain={[0, 100]} />
                                        <Tooltip
                                            formatter={(value: number, name: string) => [
                                                name === 'revenue' ? formatCurrency(value) : `${value}%`,
                                                name === 'revenue' ? 'Doanh thu' : 'Công suất'
                                            ]}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend iconType="circle" />
                                        <Bar yAxisId="left" dataKey="revenue" name="Doanh thu" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} barSize={28} />
                                        <Bar yAxisId="right" dataKey="occupancy" name="Công suất" fill={theme.palette.warning.light} radius={[4, 4, 0, 0]} barSize={28} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Today's Showtimes */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Schedule color="primary" />
                                    <Typography variant="h6" fontWeight="bold">Lịch Chiếu Hôm Nay</Typography>
                                </Box>
                                <Chip
                                    label={`${todayShowtimes.filter(s => s.status === 'ongoing').length} đang chiếu`}
                                    size="small"
                                    sx={{ bgcolor: 'success.light', color: 'success.dark', fontWeight: 700 }}
                                />
                            </Box>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Giờ chiếu</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Phim</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Phòng</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Vé bán được</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Lấp đầy</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Trạng thái</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {todayShowtimes.map((show, idx) => {
                                            const pct = Math.round((show.sold / show.total) * 100);
                                            return (
                                                <TableRow key={idx} sx={{ '&:hover': { bgcolor: 'action.hover' }, opacity: show.status === 'done' ? 0.6 : 1 }}>
                                                    <TableCell>
                                                        <Typography fontWeight={700} color={show.status === 'ongoing' ? 'success.main' : 'text.primary'}>
                                                            {show.time}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight={600}>{show.movie}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <MeetingRoom sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                            <Typography variant="body2">{show.room}</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">{show.sold}/{show.total}</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 150 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={pct}
                                                                sx={{
                                                                    flexGrow: 1,
                                                                    height: 6,
                                                                    borderRadius: 3,
                                                                    bgcolor: 'action.disabledBackground',
                                                                    '& .MuiLinearProgress-bar': {
                                                                        borderRadius: 3,
                                                                        bgcolor: pct >= 80 ? 'success.main' : pct >= 50 ? 'warning.main' : 'primary.main'
                                                                    }
                                                                }}
                                                            />
                                                            <Typography variant="caption" sx={{ minWidth: 32 }}>{pct}%</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{getStatusChip(show.status)}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}