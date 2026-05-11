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
    Button
} from '@mui/material';
import {
    AttachMoney,
    LocalPlay,
    Movie,
    Fastfood,
    TrendingUp
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
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';

// --- Mock Data ---

const revenueTrendData = [
    { date: '01/05', revenue: 12000000, tickets: 150 },
    { date: '02/05', revenue: 19000000, tickets: 220 },
    { date: '03/05', revenue: 15000000, tickets: 180 },
    { date: '04/05', revenue: 22000000, tickets: 280 },
    { date: '05/05', revenue: 28000000, tickets: 350 },
    { date: '06/05', revenue: 35000000, tickets: 450 },
    { date: '07/05', revenue: 42000000, tickets: 550 },
];

const topMoviesData = [
    { name: 'Lật Mặt 7', revenue: 85000000, tickets: 8500 },
    { name: 'Godzilla x Kong', revenue: 62000000, tickets: 6200 },
    { name: 'Mai', revenue: 45000000, tickets: 4500 },
    { name: 'Kung Fu Panda 4', revenue: 31000000, tickets: 3100 },
    { name: 'Exhuma', revenue: 28000000, tickets: 2800 },
];

const theaterPerformanceData = [
    { name: 'FilmNest HN', revenue: 125000000 },
    { name: 'FilmNest HCM', revenue: 150000000 },
    { name: 'FilmNest ĐN', revenue: 85000000 },
    { name: 'FilmNest CT', revenue: 45000000 },
];

const revenueSourceData = [
    { name: 'Vé Xem Phim', value: 251000000 },
    { name: 'Combo Đồ Ăn', value: 85000000 },
    { name: 'Ghế VIP', value: 45000000 },
    { name: 'Khác', value: 12000000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// --- Components ---

export default function AdminDashboard() {
    const theme = useTheme();
    const [timeFilter, setTimeFilter] = useState('week');

    const handleTimeChange = (event: SelectChangeEvent) => {
        setTimeFilter(event.target.value);
    };

    const renderKpiCard = (title: string, value: string | number, icon: React.ReactNode, color: string, trend: string) => (
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
                            <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />
                            <Typography variant="body2" color="success.main" fontWeight="bold">
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

    return (
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h3" component="h1" fontWeight="800" sx={{ mb: 0.5 }}>
                        Thống kê hệ thống
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Theo dõi hiệu suất kinh doanh rạp chiếu phim FilmNest
                    </Typography>
                </Box>
                <FormControl sx={{ minWidth: 180 }} size="small">
                    <InputLabel id="time-filter-label">Kỳ báo cáo</InputLabel>
                    <Select
                        labelId="time-filter-label"
                        id="time-filter"
                        value={timeFilter}
                        label="Kỳ báo cáo"
                        onChange={handleTimeChange}
                        sx={{ borderRadius: 2, bgcolor: 'background.paper' }}
                    >
                        <MenuItem value="today">Hôm nay</MenuItem>
                        <MenuItem value="week">7 ngày qua</MenuItem>
                        <MenuItem value="month">Tháng này</MenuItem>
                        <MenuItem value="year">Năm nay</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* KPI Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    {renderKpiCard('Tổng Doanh Thu', formatCurrency(393000000), <AttachMoney fontSize="large" />, 'primary', '+15.2%')}
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    {renderKpiCard('Vé Đã Bán', '25,100', <LocalPlay fontSize="large" />, 'info', '+8.4%')}
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    {renderKpiCard('Combo Đã Bán', '8,500', <Fastfood fontSize="large" />, 'warning', '+12.5%')}
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    {renderKpiCard('Phim Đang Chiếu', '24', <Movie fontSize="large" />, 'error', '+2')}
                </Grid>
            </Grid>

            {/* Charts Row 1 */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" mb={3}>Biến Động Doanh Thu & Vé (7 Ngày Qua)</Typography>
                            <Box sx={{ height: 350 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueTrendData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} />
                                        <YAxis yAxisId="left" axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000000}M`} />
                                        <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
                                        <Tooltip
                                            formatter={(value: number, name: string) => [name === 'revenue' ? formatCurrency(value) : value, name === 'revenue' ? 'Doanh thu' : 'Số vé']}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend iconType="circle" />
                                        <Area yAxisId="left" type="monotone" dataKey="revenue" name="Doanh thu" stroke={theme.palette.primary.main} strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                        <Line yAxisId="right" type="monotone" dataKey="tickets" name="Số vé" stroke={theme.palette.warning.main} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
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
                            <Box sx={{ flexGrow: 1, height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={revenueSourceData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={110}
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
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold">Top Phim Doanh Thu Cao Nhất</Typography>
                                <Button size="small" variant="text">Xem tất cả</Button>
                            </Box>
                            <Box sx={{ height: 350 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={topMoviesData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} tick={{ fontWeight: 500 }} />
                                        <Tooltip
                                            formatter={(value: number, name: string) => [name === 'revenue' ? formatCurrency(value) : value, name === 'revenue' ? 'Doanh thu' : 'Số vé']}
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)' }}
                                        />
                                        <Bar dataKey="revenue" name="Doanh thu" fill={theme.palette.primary.main} radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, lg: 6 }}>
                    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" mb={3}>Hiệu Suất Theo Rạp Chiếu</Typography>
                            <Box sx={{ height: 350 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={theaterPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis tickFormatter={(value) => `${value / 1000000}M`} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            formatter={(value: number) => formatCurrency(value)}
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)' }}
                                        />
                                        <Bar dataKey="revenue" name="Doanh thu" fill={theme.palette.secondary.main} radius={[4, 4, 0, 0]} barSize={40}>
                                            {theaterPerformanceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index === 1 ? theme.palette.primary.main : theme.palette.secondary.light} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}