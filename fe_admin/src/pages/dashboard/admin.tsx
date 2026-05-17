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
    CircularProgress,
    Alert
} from '@mui/material';
import {
    AttachMoney,
    LocalPlay,
    EventSeat,
    Fastfood,
    TrendingUp,
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
    Line,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    getTicketChart,
    getRevenueStructureChart,
    getMovieChart,
    getTheaterChart,
    getLastSummary,
} from 'api/report';
import { useIntl } from 'react-intl';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

/** Map UI timeFilter → backend filterType string */
const toFilterType = (timeFilter: string): string => {
    switch (timeFilter) {
        case 'today': return 'TODAY';
        case 'week': return 'WEEK';
        case 'month': return 'MONTH';
        case 'year': return 'YEAR';
        default: return 'WEEK';
    }
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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
}

interface TheaterChartItem {
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

// ---------------------------------------------------------------------------
// Custom Tooltip
// ---------------------------------------------------------------------------

const CustomTooltip = ({ active, payload, label, intl }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <Box sx={{ bgcolor: 'background.paper', p: 1.5, borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" fontWeight="bold" mb={1} color="text.primary">
                    {data.date || data.name || label}
                </Typography>
                <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    {intl.formatMessage({ id: 'revenue' })}: {formatCurrency(data.revenue ?? 0)}
                </Typography>
                {data.tickets !== undefined && (
                    <Typography variant="body2" sx={{ color: 'warning.main', fontWeight: 600, mt: 0.5 }}>
                        {intl.formatMessage({ id: 'ticket-count' })}: {data.tickets}
                    </Typography>
                )}
                {data.occupancy !== undefined && (
                    <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600, mt: 0.5 }}>
                        {intl.formatMessage({ id: 'occupancy' })}: {data.occupancy}%
                    </Typography>
                )}
            </Box>
        );
    }
    return null;
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function AdminDashboard() {
    const theme = useTheme();
    const intl = useIntl();

    // --- Filters ---
    const [timeFilter, setTimeFilter] = useState('today');

    // --- API data ---
    const [ticketChart, setTicketChart] = useState<TicketChartItem[]>([]);
    const [revenueSource, setRevenueSource] = useState<RevenueSourceItem[]>([]);
    const [movieChart, setMovieChart] = useState<MovieChartItem[]>([]);
    const [theaterChart, setTheaterChart] = useState<TheaterChartItem[]>([]);
    const [lastSummary, setLastSummary] = useState<LastSummary | null>(null);

    // --- Loading / error ---
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ---------------------------------------------------------------------------
    // Derived KPIs from ticketChart
    // ---------------------------------------------------------------------------

    const totalTicketRevenue = ticketChart.reduce((sum, d) => sum + (d.revenue ?? 0), 0);
    const totalTickets = ticketChart.reduce((sum, d) => sum + (d.tickets ?? 0), 0);

    const comboSource = revenueSource.find(s => s.name?.toLowerCase().includes('combo'));
    const totalCombos = comboSource?.value ?? 0;
    const totalComboCount = comboSource?.count ?? 0;

    const totalMembership = revenueSource.find(s => {
        const name = s.name?.toLowerCase() || '';
        return name.includes('hội viên') || name.includes('membership');
    })?.value ?? 0;

    const totalRevenue = totalTicketRevenue + totalCombos + totalMembership;

    const avgOccupancy = theaterChart.length
        ? Math.round(theaterChart.reduce((s, t) => s + (t.occupancy ?? 0), 0) / theaterChart.length)
        : 0;

    // ---------------------------------------------------------------------------
    // Fetch helpers
    // ---------------------------------------------------------------------------

    const fetchAll = useCallback(async (filterType: string) => {
        setLoading(true);
        setError(null);
        try {
            const [ticket, source, movie, theater, lastSum] = await Promise.all([
                getTicketChart(null, filterType),
                getRevenueStructureChart(null, filterType),
                getMovieChart(null, filterType),
                getTheaterChart(filterType),
                getLastSummary(null, filterType),
            ]);

            setTicketChart(Array.isArray(ticket?.data) ? ticket?.data : []);
            setRevenueSource(Array.isArray(source?.data) ? source?.data : []);
            setMovieChart(Array.isArray(movie?.data) ? movie?.data : []);
            setTheaterChart(Array.isArray(theater?.data) ? theater?.data : []);
            setLastSummary(lastSum?.data || null);
        } catch (err: any) {
            setError(intl.formatMessage({ id: 'fetch-error' }));
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch when standard filter changes
    useEffect(() => {
        fetchAll(toFilterType(timeFilter));
    }, [timeFilter, fetchAll]);

    // ---------------------------------------------------------------------------
    // Event handlers
    // ---------------------------------------------------------------------------

    const handleTimeChange = (event: SelectChangeEvent) => {
        setTimeFilter(event.target.value);
    };

    // ---------------------------------------------------------------------------
    // Label helpers
    // ---------------------------------------------------------------------------

    const getChartGranularityLabel = () => {
        switch (timeFilter) {
            case 'today': return intl.formatMessage({ id: 'hourly' });
            case 'week': return intl.formatMessage({ id: 'daily' });
            case 'month': return intl.formatMessage({ id: 'weekly' });
            case 'year': return intl.formatMessage({ id: 'monthly' });
            default: return intl.formatMessage({ id: 'daily' });
        }
    };

    const getFilterLabel = () => {
        switch (timeFilter) {
            case 'today': return intl.formatMessage({ id: 'today' });
            case 'week': return intl.formatMessage({ id: 'this-week' });
            case 'month': return intl.formatMessage({ id: 'this-month' });
            case 'year': return intl.formatMessage({ id: 'this-year' });
            default: return '';
        }
    };

    // ---------------------------------------------------------------------------
    // Sub-components
    // ---------------------------------------------------------------------------

    const renderKpiCard = (
        title: string,
        value: string | number,
        icon: React.ReactNode,
        color: string,
        trend: string | null = null
    ) => {
        const trendUp = trend && trend.startsWith('+');
        return (
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary" fontWeight="bold" gutterBottom>
                                {title.toUpperCase()}
                            </Typography>
                            <Typography variant="h4" fontWeight="800" sx={{ mt: 1, mb: 1 }}>
                                {loading ? <CircularProgress size={28} /> : value}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {trend ? (
                                    <>
                                        {trendUp ? <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} /> : <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />}
                                        <Typography variant="body2" color={trendUp ? 'success.main' : 'error.main'} fontWeight="bold">
                                            {trend}
                                        </Typography>
                                    </>
                                ) : (
                                    <>
                                        <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />
                                        <Typography variant="body2" color="success.main" fontWeight="bold">
                                            —
                                        </Typography>
                                    </>
                                )}
                                <Typography variant="body2" color="textSecondary">
                                    {trend ? intl.formatMessage({ id: 'vs-previous-period' }) : getFilterLabel()}
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

    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------

    const calculateTrend = (current: number, last: number | undefined) => {
        if (last === undefined || last === null) return null;
        if (last === 0) return current > 0 ? '+100%' : '0%';
        const diff = current - last;
        const percent = (diff / last) * 100;
        const sign = percent > 0 ? '+' : '';
        return `${sign}${percent.toFixed(1)}%`;
    };

    const revTrend = calculateTrend(totalRevenue, lastSummary?.totalRevenue);
    const tickTrend = calculateTrend(totalTickets, lastSummary?.tickets);
    const comboTrend = calculateTrend(totalComboCount, lastSummary?.combos);
    const occTrend = calculateTrend(avgOccupancy, lastSummary?.avgOccupancy);

    return (
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h3" component="h1" fontWeight="800" sx={{ mb: 0.5 }}>
                        {intl.formatMessage({ id: 'system-stats' })}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        {intl.formatMessage({ id: 'system-stats-desc' })}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
                    <FormControl sx={{ minWidth: 180 }} size="small">
                        <InputLabel id="time-filter-label">{intl.formatMessage({ id: 'report-period' })}</InputLabel>
                        <Select
                            labelId="time-filter-label"
                            id="time-filter"
                            value={timeFilter}
                            label={intl.formatMessage({ id: 'report-period' })}
                            onChange={handleTimeChange}
                            sx={{ borderRadius: 2, bgcolor: 'background.paper' }}
                        >
                            <MenuItem value="today">{intl.formatMessage({ id: 'today' })}</MenuItem>
                            <MenuItem value="week">{intl.formatMessage({ id: 'this-week' })}</MenuItem>
                            <MenuItem value="month">{intl.formatMessage({ id: 'this-month' })}</MenuItem>
                            <MenuItem value="year">{intl.formatMessage({ id: 'this-year' })}</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {/* Error banner */}
            {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}

            {/* KPI Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    {renderKpiCard(intl.formatMessage({ id: 'total-revenue' }), formatCurrency(totalRevenue), <AttachMoney fontSize="large" />, 'primary', revTrend)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    {renderKpiCard(intl.formatMessage({ id: 'tickets-sold' }), totalTickets.toLocaleString('vi-VN'), <LocalPlay fontSize="large" />, 'info', tickTrend)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    {renderKpiCard(intl.formatMessage({ id: 'combos-sold' }), totalComboCount.toLocaleString('vi-VN'), <Fastfood fontSize="large" />, 'warning', comboTrend)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    {renderKpiCard(intl.formatMessage({ id: 'avg-occupancy' }), `${avgOccupancy}%`, <EventSeat fontSize="large" />, 'error', occTrend)}
                </Grid>
            </Grid>

            {/* Charts Row 1 */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Revenue & Ticket Trend */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" mb={3}>
                                {intl.formatMessage({ id: 'revenue-ticket-trend' })} ({getFilterLabel()} — {getChartGranularityLabel()})
                            </Typography>
                            <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {loading ? (
                                    <CircularProgress />
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={ticketChart} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} />
                                            <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000000}M`} />
                                            <Tooltip content={<CustomTooltip intl={intl} />} cursor={{ strokeDasharray: '3 3' }} />
                                            <Legend iconType="circle" />
                                            <Area type="monotone" dataKey="revenue" name={intl.formatMessage({ id: 'revenue' })} stroke={theme.palette.primary.main} strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Revenue Structure Pie */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Typography variant="h6" fontWeight="bold" mb={1}>{intl.formatMessage({ id: 'revenue-structure' })}</Typography>
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
                                                innerRadius={80}
                                                outerRadius={110}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {revenueSource.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value: number | undefined) => formatCurrency(value ?? 0)}
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
            <Grid container spacing={3}>
                {/* Top Movies */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold">{intl.formatMessage({ id: 'top-revenue-movies' })}</Typography>
                                <Button size="small" variant="text">{intl.formatMessage({ id: 'view-all' })}</Button>
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
                                            <Tooltip content={<CustomTooltip intl={intl} />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                                            <Bar dataKey="revenue" name={intl.formatMessage({ id: 'revenue' })} fill={theme.palette.primary.main} radius={[0, 4, 4, 0]} barSize={24} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Theater Performance */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" mb={3}>{intl.formatMessage({ id: 'performance-by-theater' })}</Typography>
                            <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {loading ? (
                                    <CircularProgress />
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={theaterChart} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                            <YAxis tickFormatter={(v) => `${v / 1000000}M`} axisLine={false} tickLine={false} />
                                            <Tooltip content={<CustomTooltip intl={intl} />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                                            <Legend iconType="circle" />
                                            <Bar dataKey="revenue" name={intl.formatMessage({ id: 'revenue' })} fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} barSize={36} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}