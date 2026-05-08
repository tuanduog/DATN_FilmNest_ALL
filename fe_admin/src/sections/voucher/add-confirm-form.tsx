import { useState } from 'react';
import { HttpStatusCode } from 'axios';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
    Button,
    InputLabel,
    Alert,
    Box,
    Divider,
    Grid,
    Paper,
    Snackbar,
    Stack,
    Typography
} from '@mui/material';

// project-imports
import { create } from 'api/voucher';
import { Voucher } from 'types/voucher';
import AnimateButton from 'components/@extended/AnimateButton';
import formatDate from 'utils/formatDateTime';

interface ConfirmProps {
    handleBack: () => void;
    voucher: Voucher;
}

export default function AddConfirmForm({ handleBack, voucher }: ConfirmProps) {
    const navigate = useNavigate();

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    const handleSubmit = async () => {
        try {
            const response = await create(voucher);

            if (response.status === HttpStatusCode.Ok || response.status === HttpStatusCode.Created || !response.status) {
                navigate('/admin/voucher', {
                    state: { alert: { open: true, severity: 'success', message: 'Thêm khuyến mãi thành công' } }
                });
            } else {
                setAlert({ open: true, message: 'Có lỗi xảy ra khi thêm khuyến mãi', severity: 'error' });
            }
        } catch (err: any) {
            setAlert({ open: true, message: err.message || 'Lỗi hệ thống', severity: 'error' });
        }
    };

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 20 }, mr: { xs: 0, lg: 20 }, borderRadius: 2 }}>
                <Box mb={4}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                        Xác nhận thông tin khuyến mãi
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

                        <Grid size={{ xs: 12, sm: voucher.type === 'PUBLIC' ? 4 : 12 }}>
                            <Stack spacing={1}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>Mức giảm giá (%)</InputLabel>
                                <Typography variant="body1">{voucher.discount}%</Typography>
                            </Stack>
                        </Grid>

                        {voucher.type === 'PUBLIC' && (
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Stack spacing={1}>
                                    <InputLabel sx={{ fontWeight: 'bold' }}>Số lượng</InputLabel>
                                    <Typography variant="body1">{voucher.quantity}</Typography>
                                </Stack>
                            </Grid>
                        )}

                        {voucher.type === 'PUBLIC' && (
                            <Grid size={{ xs: 12 }}>
                                <Stack spacing={1}>
                                    <InputLabel sx={{ fontWeight: 'bold' }}>Giá trị đơn tối thiểu để áp dụng (VNĐ)</InputLabel>
                                    <Typography variant="body1">
                                        {voucher.minOrderValue && voucher.minOrderValue > 0
                                            ? `${voucher.minOrderValue.toLocaleString()} VNĐ`
                                            : '0 VNĐ'}
                                    </Typography>
                                </Stack>
                            </Grid>
                        )}
                    </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Stack direction="row" justifyContent="space-between">
                    <Button variant="outlined" color="secondary" onClick={handleBack}>
                        Quay lại
                    </Button>

                    <AnimateButton>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Xác nhận & Lưu
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
