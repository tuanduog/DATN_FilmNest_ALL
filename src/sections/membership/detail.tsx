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
import { getById } from 'api/membership';
import { HttpStatusCode } from 'axios';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { getList as getListCombo } from 'api/combo';
import { getList as getListVoucher } from 'api/voucher';
import { Combo } from 'types/combo';
import { Voucher } from 'types/voucher';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { MembershipBenefit } from 'types/membership';

export default function MembershipDetail() {
    const { id } = useParams<{ id: string }>();
    const intl = useIntl();
    const [membership, setMembership] = useState<any>(null);
    const navigate = useNavigate();
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    useEffect(() => {
        const fetchMembership = async () => {
            try {
                const response = await getById(Number(id));

                if (response.status === HttpStatusCode.Ok) {
                    setMembership(response.data);
                } else if (response.status === HttpStatusCode.BadRequest) {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'invalid-form' }), severity: 'error' });
                } else {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'unknown-error' }), severity: 'error' });
                }
            } catch (err: any) {
                setAlert({ open: true, message: err.message, severity: 'error' });
            }
        };
        fetchMembership();
    }, [id]);

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

    const getBenefitName = (benefit: any) => {
        const type = benefit.type?.toUpperCase();
        if (type === 'VOUCHER') {
            return benefit.voucher ? `Voucher: ${benefit.voucher.code}` : `Voucher (${intl.formatMessage({ id: 'not-found' })})`;
        }
        if (type === 'COMBO') {
            return benefit.combo ? `Combo: ${benefit.combo.name}` : `Combo (${intl.formatMessage({ id: 'not-found' })})`;
        }
        if (type === 'DIRECT') {
            return `${intl.formatMessage({ id: 'direct-benefit' })}: ${benefit.description}`;
        }
    };

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 30 }, mr: { xs: 0, lg: 30 }, borderRadius: 2 }}>
                <Box mb={4}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                        {intl.formatMessage({ id: 'membership-info' })}
                    </Typography>

                    <Grid container spacing={2}>
                        {membership?.image && (
                            <Grid size={12}>
                                <Box sx={{ width: '100%', mb: 2 }}>
                                    <img
                                        src={membership.image}
                                        alt="combo"
                                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                    />
                                </Box>
                            </Grid>
                        )}

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="name" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'membership-name' })}
                            </InputLabel>

                            <Typography>{membership?.name}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="type" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'membership-type' })}
                            </InputLabel>

                            <Typography>{membership?.type}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="price" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'price' })} (VND)
                            </InputLabel>

                            <Typography>{membership?.price}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="duration" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'duration' })} ({intl.formatMessage({ id: 'month' })})
                            </InputLabel>

                            <Typography>{membership?.duration}</Typography>
                        </Grid>
                        {membership?.benefits && membership.benefits.length > 0 && (
                            <Grid size={12}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                                    {intl.formatMessage({ id: 'membership-benefits' })}
                                </Typography>
                                <List disablePadding>
                                    {membership.benefits.map((benefit: MembershipBenefit, index: number) => (
                                        <ListItem key={index} sx={{ py: 1, px: 0, borderBottom: '1px dashed', borderColor: 'divider' }}>
                                            <ListItemText
                                                primary={getBenefitName(benefit)}
                                                secondary={`${intl.formatMessage({ id: 'quantity' })}: ${benefit.quantity}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                        )}
                    </Grid>
                </Box>

                <Grid size={12} sx={{ p: 0, m: 0 }}>
                    <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
                        <AnimateButton>
                            <Button variant="contained" sx={{ my: 3, ml: 1 }} onClick={() => navigate(`/admin/membership/edit/${id}`)}>
                                {intl.formatMessage({ id: 'update' })}
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
