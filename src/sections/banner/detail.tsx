import {
    Box,
    InputLabel,
    Typography,
    Paper,
    Button,
    Stack,
    Grid,
    Snackbar,
    Alert
} from '@mui/material';
import { useEffect, useState } from 'react';
import AnimateButton from 'components/@extended/AnimateButton';
import { useParams } from 'react-router';
import { getById } from 'api/banner';
import { HttpStatusCode } from 'axios';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';

export default function BannerDetail() {
    const { id } = useParams<{ id: string }>();
    const intl = useIntl();
    const [banner, setBanner] = useState<any>(null);
    const navigate = useNavigate();
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const response = await getById(Number(id));

                if (response.status === HttpStatusCode.Ok) {
                    setBanner(response.data);
                } else if (response.status === HttpStatusCode.BadRequest) {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'invalid-form' }), severity: 'error' });
                } else {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'unknown-error' }), severity: 'error' });
                }
            } catch (err: any) {
                setAlert({ open: true, message: err.message, severity: 'error' });
            }
        }
        fetchBanner();
    }, [id]);

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 30 }, mr: { xs: 0, lg: 30 }, borderRadius: 2 }}>
                <Box mb={4}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                        Thông tin banner
                    </Typography>

                    <Grid container spacing={2}>
                        {banner?.image && (
                            <Grid size={12}>
                                <Box sx={{ width: '100%', mb: 2 }}>
                                    <InputLabel sx={{ mb: 1 }}>Hình ảnh banner</InputLabel>
                                    <img
                                        src={banner.image}
                                        alt="banner"
                                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                    />
                                </Box>
                            </Grid>
                        )}

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="name" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                Tên banner
                            </InputLabel>

                            <Typography>{banner?.name}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="createdAt" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                Ngày tạo
                            </InputLabel>

                            <Typography>{banner?.createdAt}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="updatedAt" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                Ngày cập nhật
                            </InputLabel>

                            <Typography>{banner?.updatedAt}</Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Grid size={12} sx={{ p: 0, m: 0 }}>
                    <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
                        <AnimateButton>
                            <Button variant="contained" sx={{ my: 3, ml: 1 }} onClick={() => navigate(`/admin/banner/edit/${id}`)}>
                                Cập nhật
                            </Button>
                        </AnimateButton>
                    </Stack>
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
