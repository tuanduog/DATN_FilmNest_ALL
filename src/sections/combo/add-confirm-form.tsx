import { useState } from 'react';
import { HttpStatusCode } from 'axios';
import { useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import { Alert, Box, Divider, Grid, Paper, Snackbar, Stack, Typography } from '@mui/material';

// project-imports
import { create } from 'api/combo';
import { useIntl } from 'react-intl';
import useAuth from 'hooks/useAuth';
import { Combo } from 'types/combo';
import AnimateButton from 'components/@extended/AnimateButton';
// import { create as getFile } from 'api/file';

interface ConfirmProps {
    handleBack: () => void;
    combo: Combo & { file?: File | null, avatar?: string };
}

export default function AddConfirmForm({ handleBack, combo }: ConfirmProps) {
    const { logout } = useAuth();
    const intl = useIntl();
    const navigate = useNavigate();

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    const handleSubmit = async () => {
        let imageUrl = '';

        if (combo.file) {
            // const formData = new FormData();
            // formData.append('file', combo.file);
            // try {
            //     const uploadResponse = await getFile(formData);

            //     if (uploadResponse.statusCode === HttpStatusCode.Ok) {
            //         if (uploadResponse.data && uploadResponse.data.url) {
            //             imageUrl = uploadResponse.data.url;
            //         }
            //     } else if (uploadResponse.statusCode === HttpStatusCode.BadRequest) {
            //         setAlert({ open: true, message: intl.formatMessage({ id: 'invalid-form' }), severity: 'error' });
            //         return;
            //     } else if (uploadResponse.statusCode === HttpStatusCode.Unauthorized) {
            //         logout();
            //         return;
            //     } else if (uploadResponse.statusCode === HttpStatusCode.UnprocessableEntity) {
            //         setAlert({ open: true, message: uploadResponse.message, severity: 'error' });
            //         return;
            //     } else {
            //         setAlert({ open: true, message: intl.formatMessage({ id: 'unknown-error' }), severity: 'error' });
            //         return;
            //     }
            // } catch (err) {
            //     setAlert({ open: true, message: 'Lỗi tải ảnh. Gửi form thất bại', severity: 'error' });
            //     return;
            // }
        }

        const payload = {
            name: combo.name,
            price: combo.price,
            description: combo.description,
            status: combo.status,
            image: imageUrl // Gửi hình ảnh nếu có, server có thể sẽ nhận ảnh tại field image hoặc thumbnail tùy thiết kế BE
        };

        const response = await create(payload as any);

        if (response.statusCode === HttpStatusCode.Ok) {
            navigate('/admin/combo', {
                state: { alert: { open: true, severity: 'success', message: 'Thêm combo ưu đãi thành công' } }
            });
        } else if (response.statusCode === HttpStatusCode.BadRequest) {
            setAlert({ open: true, message: intl.formatMessage({ id: 'invalid-form' }), severity: 'error' });
        } else if (response.statusCode === HttpStatusCode.Unauthorized) {
            logout();
        } else if (response.statusCode === HttpStatusCode.UnprocessableEntity) {
            setAlert({ open: true, message: response.message, severity: 'error' });
        } else {
            setAlert({ open: true, message: intl.formatMessage({ id: 'unknown-error' }), severity: 'error' });
        }
    };

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 30 }, mr: { xs: 0, lg: 30 }, borderRadius: 2 }}>
                <Box mb={4}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                        Xác nhận thông tin combo ưu đãi
                    </Typography>

                    <Grid container spacing={3}>
                        {combo.avatar && combo.avatar.trim() !== '' && (
                            <Grid size={12} sx={{ mb: 2 }}>
                                <Box sx={{ width: '100%' }}>
                                    <Box sx={{ position: 'relative', width: '150px' }}>
                                        <Box>
                                            <img
                                                alt="image"
                                                src={combo.avatar}
                                                style={{ width: '150px', height: '150px', display: 'block', borderRadius: '5px', objectFit: 'cover' }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                        )}

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>Tên combo</InputLabel>
                                <Typography>{combo.name}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>Giá tiền (VND)</InputLabel>
                                <Typography>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(combo.price)}
                                </Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>Trạng thái</InputLabel>
                                <Typography>{combo.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 12 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>Mô tả</InputLabel>
                                <Typography sx={{ whiteSpace: 'pre-wrap' }}>{combo.description}</Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
                    <Button variant="contained" sx={{ my: 3 }} color="secondary" onClick={handleBack}>
                        Quay lại
                    </Button>

                    <AnimateButton>
                        <Button variant="contained" type="button" sx={{ my: 3 }} color="primary" onClick={handleSubmit}>
                            Xác nhận & Thêm
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
