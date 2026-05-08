import { useState } from 'react';
import { HttpStatusCode } from 'axios';
import { useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import { Alert, Box, Divider, Grid, Paper, Snackbar, Stack, Typography } from '@mui/material';

// project-imports
import { create } from 'api/membership';
import { useIntl } from 'react-intl';
import useAuth from 'hooks/useAuth';
import { Membership, MembershipBenefit } from 'types/membership';
import { getList as getListCombo } from 'api/combo';
import { getList as getListVoucher } from 'api/voucher';
import { Combo } from 'types/combo';
import { Voucher } from 'types/voucher';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useEffect } from 'react';
import AnimateButton from 'components/@extended/AnimateButton';
import { uploadImage } from 'api/file';

interface ConfirmProps {
    handleBack: () => void;
    membership: Membership;
}

export default function AddConfirmForm({ handleBack, membership }: ConfirmProps) {
    const { logout } = useAuth();
    const intl = useIntl();
    const navigate = useNavigate();

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    const [combos, setCombos] = useState<Combo[]>([]);
    const [vouchers, setVouchers] = useState<Voucher[]>([]);

    useEffect(() => {
        const fetchBenefits = async () => {
            try {
                const resCombo = await getListCombo({ page: 0, size: 100, keyword: '', sort: '', status: 'ACTIVE' });
                if (resCombo?.data?.content) setCombos(resCombo.data.content);

                const resVoucher = await getListVoucher({ page: 0, size: 100, keyword: '', sort: '', status: 'ACTIVE' });
                if (resVoucher?.data?.content) setVouchers(resVoucher.data.content);
            } catch (error) {
                console.error('Failed to fetch benefits', error);
            }
        };
        fetchBenefits();
    }, []);

    const getBenefitName = (benefit: MembershipBenefit) => {
        if (benefit.type === 'voucher') {
            const v = vouchers.find(x => x.id === benefit.benefitRefId);
            return v ? `Voucher: ${v.code}` : 'Voucher (Không tìm thấy)';
        }
        if (benefit.type === 'combo') {
            const c = combos.find(x => x.id === benefit.benefitRefId);
            return c ? `Combo: ${c.name}` : 'Combo (Không tìm thấy)';
        }
        return benefit.description || 'Trực tiếp';
    };

    const handleSubmit = async () => {
        let imageUrl = '';

        if (membership.image) {
            const formData = new FormData();
            formData.append('file', membership.image);
            formData.append('folder', 'membership');
            try {
                const uploadResponse = await uploadImage(formData);

                if (uploadResponse.status === HttpStatusCode.Ok) {
                    if (uploadResponse.data.secure_url) {
                        imageUrl = uploadResponse.data.secure_url;
                    }
                } else if (uploadResponse.status === HttpStatusCode.BadRequest) {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'invalid-form' }), severity: 'error' });
                    return;
                } else if (uploadResponse.status === HttpStatusCode.Unauthorized) {
                    logout();
                    return;
                } else {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'unknown-error' }), severity: 'error' });
                    return;
                }
            } catch (err) {
                setAlert({ open: true, message: 'Lỗi tải ảnh. Gửi form thất bại', severity: 'error' });
                return;
            }
        }

        const payload = {
            image: imageUrl,
            name: membership.name,
            type: membership.type,
            price: membership.price,
            duration: membership.duration,
            benefits: membership.benefits
        };

        try {
            const response = await create(payload as any);

            if (response.status === HttpStatusCode.Ok) {
                navigate('/admin/membership', {
                    state: { alert: { open: true, severity: 'success', message: 'Thêm gói thành viên thành công' } }
                });
            } else if (response.status === HttpStatusCode.BadRequest) {
                setAlert({ open: true, message: intl.formatMessage({ id: 'invalid-form' }), severity: 'error' });
            } else if (response.status === HttpStatusCode.Unauthorized) {
                logout();
            } else if (response.status === HttpStatusCode.UnprocessableEntity) {
                setAlert({ open: true, message: response.message, severity: 'error' });
            } else {
                setAlert({ open: true, message: intl.formatMessage({ id: 'unknown-error' }), severity: 'error' });
            }
        } catch (err: any) {
            setAlert({ open: true, message: err.message, severity: 'error' });
        }
    };

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 30 }, mr: { xs: 0, lg: 30 }, borderRadius: 2 }}>
                <Box mb={4}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                        Xác nhận thông tin gói thành viên
                    </Typography>

                    <Grid container spacing={2}>
                        {membership.image && (
                            <Grid size={12} sx={{ mb: 2 }}>
                                <Box sx={{ width: '100%' }}>
                                    <Box sx={{ position: 'relative', width: '150px' }}>
                                        <Box>
                                            <img
                                                alt="image"
                                                src={URL.createObjectURL(membership.image!)}
                                                style={{ width: '150px', height: '150px', display: 'block', borderRadius: '5px', objectFit: 'cover' }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                        )}

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>Tên gói thành viên</InputLabel>
                                <Typography>{membership.name}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>Loại gói thành viên</InputLabel>
                                <Typography>{membership.type}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>Giá tiền (VND)</InputLabel>
                                <Typography>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(membership.price)}
                                </Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>Thời hạn (tháng)</InputLabel>
                                <Typography>{membership.duration}</Typography>
                            </Stack>
                        </Grid>

                        {membership.benefits && membership.benefits.length > 0 && (
                            <Grid size={12}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                                    Các quyền lợi của gói thành viên
                                </Typography>
                                <List disablePadding>
                                    {membership.benefits.map((benefit: MembershipBenefit, index: number) => (
                                        <ListItem key={index} sx={{ py: 1, px: 0, borderBottom: '1px dashed', borderColor: 'divider' }}>
                                            <ListItemText
                                                primary={getBenefitName(benefit)}
                                                secondary={`Số lượng: ${benefit.quantity}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                        )}
                    </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
                    <Button variant="contained" sx={{ my: 3 }} color="secondary" onClick={handleBack}>
                        Quay lại
                    </Button>

                    <AnimateButton>
                        <Button variant="contained" type="button" sx={{ my: 3 }} color="primary" onClick={handleSubmit}>
                            Xác nhận
                        </Button>
                    </AnimateButton>
                </Grid>
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
