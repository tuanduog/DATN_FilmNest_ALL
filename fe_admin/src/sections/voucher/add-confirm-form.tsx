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
import { useIntl } from 'react-intl';

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
    const intl = useIntl();

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
                    state: { alert: { open: true, severity: 'success', message: intl.formatMessage({ id: 'add-voucher-success' }) } }
                });
            } else {
                setAlert({ open: true, message: intl.formatMessage({ id: 'add-voucher-error' }), severity: 'error' });
            }
        } catch (err: any) {
            setAlert({ open: true, message: err.message || intl.formatMessage({ id: 'system-error' }), severity: 'error' });
        }
    };

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 20 }, mr: { xs: 0, lg: 20 }, borderRadius: 2 }}>
                <Box mb={4}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                        {intl.formatMessage({ id: 'confirm-voucher-info' })}
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack spacing={1}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'voucher-code' })}</InputLabel>
                                <Typography variant="body1">{voucher.code}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack spacing={1}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'voucher-type' })}</InputLabel>
                                <Typography variant="body1">
                                    {voucher.type === 'PUBLIC' ? intl.formatMessage({ id: 'public-voucher' }) : intl.formatMessage({ id: 'personal-voucher' })}
                                </Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Stack spacing={1}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'description' })}</InputLabel>
                                <Typography variant="body1">{voucher.description}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack spacing={1}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'start-date' })}</InputLabel>
                                <Typography variant="body1">
                                    {voucher.startDate ? formatDate(voucher.startDate) : intl.formatMessage({ id: 'unlimited' })}
                                </Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack spacing={1}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'end-date' })}</InputLabel>
                                <Typography variant="body1">
                                    {voucher.endDate ? formatDate(voucher.endDate) : intl.formatMessage({ id: 'unlimited' })}
                                </Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: voucher.type === 'PUBLIC' ? 4 : 12 }}>
                            <Stack spacing={1}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'discount-value' })} (%)</InputLabel>
                                <Typography variant="body1">{voucher.discount}%</Typography>
                            </Stack>
                        </Grid>

                        {voucher.type === 'PUBLIC' && (
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Stack spacing={1}>
                                    <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'quantity' })}</InputLabel>
                                    <Typography variant="body1">{voucher.quantity}</Typography>
                                </Stack>
                            </Grid>
                        )}

                        {voucher.type === 'PUBLIC' && (
                            <Grid size={{ xs: 12 }}>
                                <Stack spacing={1}>
                                    <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'min-order-value-label' })}</InputLabel>
                                    <Typography variant="body1">
                                        {voucher.minOrderValue && voucher.minOrderValue > 0
                                            ? `${voucher.minOrderValue.toLocaleString()} VNĐ`
                                            : `0 VNĐ`}
                                    </Typography>
                                </Stack>
                            </Grid>
                        )}
                    </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Stack direction="row" justifyContent="space-between">
                    <Button variant="outlined" color="secondary" onClick={handleBack}>
                        {intl.formatMessage({ id: 'back' })}
                    </Button>

                    <AnimateButton>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            {intl.formatMessage({ id: 'confirm-and-save' })}
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
