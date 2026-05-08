import {
    Box,
    InputLabel,
    Typography,
    Paper,
    Button,
    Stack,
    Grid,
    Snackbar,
    Alert,
    CircularProgress,
    Divider
} from '@mui/material';
import { useEffect, useState } from 'react';
import AnimateButton from 'components/@extended/AnimateButton';
import { useParams, useNavigate } from 'react-router-dom';
import { getById } from 'api/voucher';
import { HttpStatusCode } from 'axios';
import formatDate from 'utils/formatDateTime';
import { Voucher } from 'types/voucher';

export default function VoucherDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [voucher, setVoucher] = useState<Voucher | null>(null);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    useEffect(() => {
        const fetchVoucher = async () => {
            try {
                const response = await getById(Number(id));

                if (response.status === HttpStatusCode.Ok) {
                    response.data.type = response.data.type.toUpperCase();
                    response.data.status = response.data.status.toUpperCase();
                    setVoucher(response.data);
                } else {
                    setAlert({ open: true, message: 'Không thể tải thông tin khuyến mãi', severity: 'error' });
                }
            } catch (err: any) {
                setAlert({ open: true, message: err.message || 'Lỗi hệ thống', severity: 'error' });
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchVoucher();
    }, [id]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!voucher) {
        return (
            <Box p={3}>
                <Alert severity="error">Không tìm thấy thông tin khuyến mãi</Alert>
                <Button onClick={() => navigate('/admin/voucher')} sx={{ mt: 2 }}>Quay lại danh sách</Button>
            </Box>
        );
    }

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 20 }, mr: { xs: 0, lg: 20 }, borderRadius: 2 }}>
                <Box mb={4}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                        Chi tiết khuyến mãi
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack spacing={1}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>Mã khuyến mãi</InputLabel>
                                <Typography variant="body1">{voucher.code}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack spacing={1}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>Loại khuyến mãi</InputLabel>
                                <Typography variant="body1">
                                    {voucher.type === 'PUBLIC' ? 'Chung (Công khai)' : 'Cá nhân (Gói hội viên)'}
                                </Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Stack spacing={1}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>Mô tả</InputLabel>
                                <Typography variant="body1">{voucher.description}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack spacing={1}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>Ngày bắt đầu</InputLabel>
                                <Typography variant="body1">
                                    {voucher.startDate ? formatDate(voucher.startDate) : 'Không giới hạn'}
                                </Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack spacing={1}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>Ngày kết thúc</InputLabel>
                                <Typography variant="body1">
                                    {voucher.endDate ? formatDate(voucher.endDate) : 'Không giới hạn'}
                                </Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: voucher.type === 'PUBLIC' ? 6 : 12 }}>
                            <Stack spacing={1}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>Mức giảm giá (%)</InputLabel>
                                <Typography variant="body1">{voucher.discount}%</Typography>
                            </Stack>
                        </Grid>

                        {voucher.type === 'PUBLIC' && (
                            <>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Stack spacing={1}>
                                        <InputLabel sx={{ fontWeight: 'bold' }}>Số lượng</InputLabel>
                                        <Typography variant="body1">{voucher.quantity}</Typography>
                                    </Stack>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Stack spacing={1}>
                                        <InputLabel sx={{ fontWeight: 'bold' }}>Đơn tối thiểu</InputLabel>
                                        <Typography variant="body1">
                                            {voucher.minOrderValue ? `${voucher.minOrderValue.toLocaleString()} VNĐ` : '0 VNĐ'}
                                        </Typography>
                                    </Stack>
                                </Grid>
                            </>
                        )}

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack spacing={1}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>Trạng thái</InputLabel>
                                <Typography variant="body1" color={voucher.status === 'ACTIVE' ? 'success.main' : 'error.main'}>
                                    {voucher.status === 'ACTIVE' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Stack direction="row" justifyContent="space-between" spacing={2}>
                    <Button variant="outlined" color="secondary" onClick={() => navigate('/admin/voucher')}>
                        Quay lại
                    </Button>
                    <AnimateButton>
                        <Button variant="contained" color="primary" onClick={() => navigate(`/admin/voucher/edit/${id}`)}>
                            Chỉnh sửa
                        </Button>
                    </AnimateButton>
                </Stack>
            </Paper>

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
        </Box>
    );
}
