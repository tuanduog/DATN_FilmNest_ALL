import React, { useState, useEffect, useCallback } from 'react';
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
    LinearProgress,
    CircularProgress,
    Alert
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

import useAuth from 'hooks/useAuth';
import {
    getTicketChart,
    getRevenueStructureChart,
    getMovieChart,
    getRoomChart,
    getLastSummary,
    getShowTimeToday
} from 'api/report';

// --- Types ---

interface TicketChartItem {
    date: string;
    revenue: number;
    tickets: number;
}

interface RevenueSourceItem {
    name: string;
    value: number;
    count: number;
}

interface MovieChartItem {
    name: string;
    revenue: number;
    tickets: number;
    occupancy: number;
}

interface RoomChartItem {
    name: string;
    revenue: number;
    occupancy: number;
}

interface LastSummary {
    totalRevenue: number;
    tickets: number;
    combos: number;
    avgOccupancy: number;
}

interface ShowtimeItem {
    startTime: string;
    movieName: string;
    roomName: string;
    capacity: number;
    tickets: number;
    showingStatus: string;
}

// --- Helpers ---

const COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#ec4899', '#8b5cf6'];

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const formatCurrencyShort = (value: number) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
    return String(value);
};

// --- Tooltip ---

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <Box sx={{ bgcolor: 'background.paper', p: 1.5, borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" fontWeight="bold" mb={1} color="text.primary">
                    {data.date || data.name || label}
                </Typography>
                <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    Doanh thu: {formatCurrency(data.revenue ?? 0)}
                </Typography>
                {data.tickets !== undefined && (
                    <Typography variant="body2" sx={{ color: 'warning.main', fontWeight: 600, mt: 0.5 }}>
                        Số vé: {data.tickets}
                    </Typography>
                )}
                {data.occupancy !== undefined && (
                    <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600, mt: 0.5 }}>
                        Công suất: {data.occupancy}%
                    </Typography>
                )}
            </Box>
        );
    }
    return null;
};

const toFilterType = (timeFilter: string): string => {
    switch (timeFilter) {
        case 'today': return 'TODAY';
        case 'week': return 'WEEK';
        case 'month': return 'MONTH';
        case 'year': return 'YEAR';
        default: return 'WEEK';
    }
};

const calculateTrend = (current: number, last: number | undefined) => {
    if (last === undefined || last === null || last === 0) {
        return current > 0 ? '+100%' : '0%';
    }
    const diff = current - last;
    const percent = (diff / last) * 100;
    const sign = percent > 0 ? '+' : '';
    return `${sign}${percent.toFixed(1)}%`;
};

// --- Components ---

export default function ManagerDashboard() {
    const theme = useTheme();
    const { user } = useAuth();
    const theaterId = user?.theaterId ? Number(user.theaterId) : null;

    // --- State ---
    const [timeFilter, setTimeFilter] = useState('today');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [ticketChart, setTicketChart] = useState<TicketChartItem[]>([]);
    const [revenueSource, setRevenueSource] = useState<RevenueSourceItem[]>([]);
    const [movieChart, setMovieChart] = useState<MovieChartItem[]>([]);
    const [roomChart, setRoomChart] = useState<RoomChartItem[]>([]);
    const [lastSummary, setLastSummary] = useState<LastSummary | null>(null);
    const [showtimes, setShowtimes] = useState<ShowtimeItem[]>([]);

    // --- Fetch Data ---
    const fetchAll = useCallback(async (filterType: string) => {
        if (!theaterId) return;
        setLoading(true);
        setError(null);
        try {
            const [ticket, source, movie, room, lastSum, todayShows] = await Promise.all([
                getTicketChart(theaterId, filterType),
                getRevenueStructureChart(theaterId, filterType),
                getMovieChart(theaterId, filterType),
                getRoomChart(theaterId, filterType),
                getLastSummary(theaterId, filterType),
                getShowTimeToday(theaterId)
            ]);

            setTicketChart(Array.isArray(ticket?.data) ? ticket?.data : []);
            setRevenueSource(Array.isArray(source?.data) ? source?.data : []);
            setMovieChart(Array.isArray(movie?.data) ? movie?.data : []);
            setRoomChart(Array.isArray(room?.data) ? room?.data : []);
            setLastSummary(lastSum?.data || null);
            setShowtimes(Array.isArray(todayShows?.data) ? todayShows?.data : []);
        } catch (err: any) {
            console.error(err);
            setError('Không thể tải dữ liệu báo cáo. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    }, [theaterId]);

    useEffect(() => {
        fetchAll(toFilterType(timeFilter));
    }, [timeFilter, fetchAll]);

    const handleTimeChange = (event: SelectChangeEvent) => {
        setTimeFilter(event.target.value);
    };

    // --- Derived Data ---
    const totalTicketRevenue = ticketChart.reduce((sum, d) => sum + (d.revenue ?? 0), 0);
    const totalTickets = ticketChart.reduce((sum, d) => sum + (d.tickets ?? 0), 0);

    const comboSource = revenueSource.find(s => s.name?.toLowerCase().includes('combo'));
    const totalCombosCount = comboSource?.count ?? 0;

    const totalRevenue = revenueSource.reduce((sum, s) => sum + (s.value ?? 0), 0);
    const avgOccupancy = roomChart.length
        ? Math.round(roomChart.reduce((s, r) => s + (r.occupancy ?? 0), 0) / roomChart.length)
        : 0;

    const revTrend = calculateTrend(totalRevenue, lastSummary?.totalRevenue);
    const tickTrend = calculateTrend(totalTickets, lastSummary?.tickets);
    const comboTrend = calculateTrend(totalCombosCount, lastSummary?.combos);
    const occTrend = calculateTrend(avgOccupancy, lastSummary?.avgOccupancy);

    const getChartGranularityLabel = () => {
        switch (timeFilter) {
            case 'today': return 'theo giờ';
            case 'week': return 'theo ngày';
            case 'month': return 'theo tuần';
            case 'year': return 'theo tháng';
            default: return 'theo ngày';
        }
    };

    const getFilterLabel = () => {
        switch (timeFilter) {
            case 'today': return 'Hôm nay';
            case 'week': return 'Tuần này';
            case 'month': return 'Tháng này';
            case 'year': return 'Năm nay';
            default: return '';
        }
    };

    const renderKpiCard = (
        title: string,
        value: string | number,
        icon: React.ReactNode,
        color: string,
        trend: string | null
    ) => {
        const isUp = trend && trend.startsWith('+');
        return (
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary" fontWeight="bold" gutterBottom>
                                {title.toUpperCase()}
                            </Typography>
                            <Typography variant="h4" fontWeight="800" sx={{ mt: 1, mb: 1 }}>
                                {loading ? <CircularProgress size={24} /> : value}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {isUp ? <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} /> : <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />}
                                <Typography variant="body2" color={isUp ? 'success.main' : 'error.main'} fontWeight="bold">
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
    };

    const getStatusChip = (status: string) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'done':
            case 'finished':
                return <Chip label="Đã kết thúc" size="small" icon={<CheckCircle sx={{ fontSize: '14px !important' }} />} sx={{ bgcolor: 'action.disabledBackground', color: 'text.secondary', fontWeight: 600 }} />;
            case 'ongoing':
            case 'playing':
                return <Chip label="Đang chiếu" size="small" sx={{ bgcolor: 'success.light', color: 'success.dark', fontWeight: 600 }} />;
            case 'upcoming':
            case 'scheduled':
                return <Chip label="Sắp chiếu" size="small" icon={<RadioButtonUnchecked sx={{ fontSize: '14px !important' }} />} sx={{ bgcolor: 'primary.light', color: 'primary.dark', fontWeight: 600 }} />;
            default: return <Chip label={status} size="small" />;
        }
    };

    if (!theaterId) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning">Không tìm thấy thông tin rạp. Vui lòng đăng nhập lại với quyền Quản lý rạp.</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h3" component="h1" fontWeight="800" sx={{ mb: 0.5 }}>
                        Báo cáo rạp chiếu {user?.theater?.name || 'Rạp chiếu'}
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
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {/* KPI Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    {renderKpiCard('Tổng Doanh Thu', formatCurrency(totalRevenue), <AttachMoney fontSize="large" />, 'primary', revTrend)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    {renderKpiCard('Vé Đã Bán', totalTickets.toLocaleString(), <LocalPlay fontSize="large" />, 'info', tickTrend)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    {renderKpiCard('Combo Đã Bán', totalCombosCount.toLocaleString(), <Fastfood fontSize="large" />, 'warning', comboTrend)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    {renderKpiCard('Công Suất TB', `${avgOccupancy}%`, <EventSeat fontSize="large" />, 'success', occTrend)}
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
                            <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {loading ? (
                                    <CircularProgress />
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={ticketChart} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="mgrColorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} />
                                            <YAxis axisLine={false} tickLine={false} tickFormatter={formatCurrencyShort} />
                                            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                                            <Legend iconType="circle" />
                                            <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke={theme.palette.primary.main} strokeWidth={3} fillOpacity={1} fill="url(#mgrColorRevenue)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Typography variant="h6" fontWeight="bold" mb={1}>Cơ Cấu Doanh Thu</Typography>
                            <Box sx={{ flexGrow: 1, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {loading ? (
                                    <CircularProgress />
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={revenueSource}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {revenueSource.map((entry, index) => (
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
                                )}
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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold">Top Phim Doanh Thu Cao Nhất</Typography>
                                <Button size="small" variant="text">Xem tất cả</Button>
                            </Box>
                            <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {loading ? (
                                    <CircularProgress />
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={movieChart} layout="vertical" margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={160} tick={{ fontSize: 12, fontWeight: 500 }} />
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                                            <Bar dataKey="revenue" name="Doanh thu" fill={theme.palette.primary.main} radius={[0, 4, 4, 0]} barSize={24} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Hiệu suất phòng chiếu */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" mb={3}>Hiệu Suất Theo Phòng Chiếu</Typography>
                            <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {loading ? (
                                    <CircularProgress />
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={roomChart} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                            <YAxis tickFormatter={formatCurrencyShort} axisLine={false} tickLine={false} />
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                                            <Legend iconType="circle" />
                                            <Bar dataKey="revenue" name="Doanh thu" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} barSize={36} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
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
                                    label={`${showtimes.filter(s => s.showingStatus?.toLowerCase().includes('playing') || s.showingStatus?.toLowerCase() === 'ongoing').length} đang chiếu`}
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
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                                    <CircularProgress size={30} />
                                                </TableCell>
                                            </TableRow>
                                        ) : showtimes.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                                    <Typography variant="body2" color="textSecondary">Không có lịch chiếu nào hôm nay</Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            showtimes.map((show, idx) => {
                                                const pct = show.capacity > 0 ? Math.round((show.tickets / show.capacity) * 100) : 0;
                                                const isDone = show.showingStatus?.toLowerCase() === 'done' || show.showingStatus?.toLowerCase() === 'finished';
                                                return (
                                                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: 'action.hover' }, opacity: isDone ? 0.6 : 1 }}>
                                                        <TableCell>
                                                            <Typography fontWeight={700} color={!isDone ? 'success.main' : 'text.primary'}>
                                                                {show.startTime}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight={600}>{show.movieName}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                <MeetingRoom sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                                <Typography variant="body2">{show.roomName}</Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2">{show.tickets}/{show.capacity}</Typography>
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
                                                        <TableCell>{getStatusChip(show.showingStatus)}</TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
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