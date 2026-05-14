import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Avatar,
    Divider,
    useTheme,
    Chip,
    CircularProgress,
    Alert,
    Paper
} from '@mui/material';
import {
    Location,
    Call,
    Clock,
    InfoCircle,
    Edit,
    Global,
    Buildings,
    Map
} from 'iconsax-reactjs';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import useAuth from 'hooks/useAuth';
import { getById as getTheaterById } from 'api/theater';
import AnimateButton from 'components/@extended/AnimateButton';
import { Theater } from 'types/theater';

// ==============================|| MANAGER THEATER PROFILE ||============================== //

export default function ManagerTheaterProfile() {
    const theme = useTheme();
    const intl = useIntl();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [theater, setTheater] = useState<Theater | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const theaterId = user?.theaterId ? Number(user.theaterId) : null;

    useEffect(() => {
        const fetchTheater = async () => {
            if (!theaterId) {
                setLoading(false);
                return;
            }
            try {
                const response = await getTheaterById(theaterId);
                if (response.status === 200) {
                    setTheater(response.data);
                } else {
                    setError('Không tìm thấy thông tin rạp.');
                }
            } catch (err: any) {
                setError(err.message || 'Có lỗi xảy ra khi tải thông tin.');
            } finally {
                setLoading(false);
            }
        };

        fetchTheater();
    }, [theaterId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !theater) {
        return (
            <Box p={3}>
                <Alert severity="error">
                    {error || <FormattedMessage id="theater-not-found" defaultMessage="Theater information not found." />}
                </Alert>
            </Box>
        );
    }

    const InfoRow = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color?: string }) => (
        <Stack direction="row" spacing={2} sx={{ mb: 2.5, alignItems: 'flex-start' }}>
            <Avatar variant="rounded" sx={{ bgcolor: color || 'primary.lighter', color: color ? 'white' : 'primary.main', width: 40, height: 40 }}>
                <Icon size={20} variant="Bold" />
            </Avatar>
            <Box>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>
                    {label}
                </Typography>
                <Typography variant="body1" fontWeight="600">
                    {value || '---'}
                </Typography>
            </Box>
        </Stack>
    );

    return (
        <Box sx={{ flexGrow: 1, p: { xs: 1, md: 3 } }}>
            {/* Header Banner Section */}
            <Card sx={{
                mb: 4,
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 10px 30px 0 rgba(0,0,0,0.08)'
            }}>
                <Box sx={{
                    height: 180,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    p: 4
                }}>
                    <Box sx={{
                        position: 'absolute',
                        top: -50,
                        right: -50,
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        zIndex: 0
                    }} />
                    <Box sx={{
                        position: 'absolute',
                        bottom: 20,
                        right: 100,
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.05)',
                        zIndex: 0
                    }} />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ zIndex: 1, width: '100%' }}>
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                border: '4px solid white',
                                boxShadow: theme.customShadows.z1,
                                bgcolor: 'white',
                                color: 'primary.main'
                            }}
                        >
                            <Buildings size={50} variant="Bold" />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h2" color="white" fontWeight="800">
                                {theater.name}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                                <Location size={16} color="white" />
                                <Typography variant="body1" color="rgba(255,255,255,0.9)">
                                    {theater.provinceName}, Việt Nam
                                </Typography>
                                <Chip
                                    label="Đang hoạt động"
                                    size="small"
                                    sx={{ bgcolor: 'success.main', color: 'white', fontWeight: 600, ml: 1 }}
                                />
                            </Stack>
                        </Box>
                    </Stack>
                </Box>
            </Card>

            <Grid container spacing={4}>
                {/* Left Column: Details */}
                <Grid size={{ xs: 12, lg: 7 }}>
                    <Card sx={{ borderRadius: 4, height: '100%', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h5" fontWeight="bold" sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <InfoCircle size={24} color={theme.palette.primary.main} variant="Bold" />
                                {intl.formatMessage({ id: 'theater-info' })}
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <InfoRow
                                        icon={Call}
                                        label={intl.formatMessage({ id: 'hotline' })}
                                        value={theater.hotline}
                                        color={theme.palette.warning.main}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <InfoRow
                                        icon={Clock}
                                        label="Giờ hoạt động"
                                        value={`${theater.openTime} - ${theater.closeTime}`}
                                        color={theme.palette.info.main}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, mt: 1 }}>
                                        Mô tả rạp
                                    </Typography>
                                    <Paper sx={{ p: 3, bgcolor: 'action.hover', borderRadius: 3, border: 'none' }}>
                                        <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                                            {theater.description || 'Chưa có mô tả cho rạp chiếu này.'}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right Column: Location & Services */}
                <Grid size={{ xs: 12, lg: 5 }}>
                    <Stack spacing={4}>
                        {/* Location Card */}
                        <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h5" fontWeight="bold" sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Map size={24} color={theme.palette.secondary.main} variant="Bold" />
                                    Vị trí & Địa chỉ
                                </Typography>

                                <InfoRow
                                    icon={Buildings}
                                    label="Phường / Xã"
                                    value={theater.communeName}
                                />
                                <InfoRow
                                    icon={Global}
                                    label="Tỉnh / Thành phố"
                                    value={theater.provinceName}
                                />
                                <InfoRow
                                    icon={Location}
                                    label="Địa chỉ chi tiết"
                                    value={theater.address}
                                />

                                {theater.latitude && theater.longitude && (
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<Map />}
                                        sx={{ mt: 2, borderRadius: 2 }}
                                        href={`https://www.google.com/maps/search/?api=1&query=${theater.latitude},${theater.longitude}`}
                                        target="_blank"
                                    >
                                        Xem trên Google Maps
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Status Card */}
                        <Card sx={{
                            borderRadius: 4,
                            background: `linear-gradient(45deg, ${theme.palette.secondary.lighter} 0%, #ffffff 100%)`,
                            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
                            border: '1px solid',
                            borderColor: 'secondary.lighter'
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }}>
                                        <InfoCircle variant="Bold" size={32} />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">Trạng thái hệ thống</Typography>
                                        <Typography variant="body2" color="textSecondary">Rạp đang được quản lý trực tuyến</Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}
