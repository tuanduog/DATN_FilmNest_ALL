import { useState, useEffect } from 'react';
import { HttpStatusCode } from 'axios';
import { useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import { Alert, Box, Divider, Grid, Paper, Snackbar, Stack, Typography } from '@mui/material';

// project-imports
import { useIntl } from 'react-intl';
import useAuth from 'hooks/useAuth';
import { Employee } from 'types/employee';
import AnimateButton from 'components/@extended/AnimateButton';
import formatDate from 'utils/formatDateTime';
import { create } from 'api/employee';

interface ConfirmProps {
    handleBack: () => void;
    employee: Employee;
}

export default function AddConfirmForm({ handleBack, employee }: ConfirmProps) {
    const { logout } = useAuth();
    const intl = useIntl();
    const navigate = useNavigate();

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    const [countries, setCountries] = useState<{ code: string; label: string; flag: string }[]>([]);

    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all?fields=name,flags,cca2')
            .then((res) => res.json())
            .then((data) => {
                const countryData = data.map((country: any) => ({
                    code: country.cca2,
                    label: country.name.common,
                    flag: country.flags?.png
                }));
                setCountries(countryData.sort((a: any, b: any) => a.label.localeCompare(b.label)));
            })
            .catch((error) => console.error('Error fetching countries:', error));
    }, []);

    const handleSubmit = async () => {

        try {
            const response = await create(employee as any);

            if (response.status === HttpStatusCode.Ok) {
                navigate('/admin/employee', {
                    state: { alert: { open: true, severity: 'success', message: intl.formatMessage({ id: 'add-employee-success' }) } }
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
                        {intl.formatMessage({ id: 'confirm-employee-info' })}
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'username' })}</InputLabel>
                                <Typography>{employee.username}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'code' })}</InputLabel>
                                <Typography>{employee.code}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'fullname' })}</InputLabel>
                                <Typography>{employee.fullname}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'email' })}</InputLabel>
                                <Typography>{employee.email}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'phone' })}</InputLabel>
                                <Typography>{employee.phone}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'gender' })}</InputLabel>
                                <Typography>{employee.gender === 'MALE' ? intl.formatMessage({ id: 'male' }) : employee.gender === 'FEMALE' ? intl.formatMessage({ id: 'female' }) : intl.formatMessage({ id: 'other' })}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'dob' })}</InputLabel>
                                <Typography>{formatDate(employee.dob)}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'nationality' })}</InputLabel>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    {employee.nationality && countries.find((c) => c.code === employee.nationality) && (
                                        <img
                                            loading="lazy"
                                            width="24"
                                            src={countries.find((c) => c.code === employee.nationality)?.flag}
                                            alt=""
                                            style={{ border: '1px solid #eee' }}
                                        />
                                    )}
                                    <Typography>
                                        {countries.find((c) => c.code === employee.nationality)?.label || employee.nationality}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'salary' })}</InputLabel>
                                <Typography>{employee.salary.toLocaleString()} VNĐ</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'hire-at' })}</InputLabel>
                                <Typography>{formatDate(employee.hireAt)}</Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel sx={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'role' })}</InputLabel>
                                <Typography>{employee.role === 'USER' ? intl.formatMessage({ id: 'user-role' }) : employee.role === 'MANAGER' ? intl.formatMessage({ id: 'manager' }) : intl.formatMessage({ id: 'staff' })}</Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
                    <Button variant="contained" sx={{ my: 3 }} color="secondary" onClick={handleBack}>
                        {intl.formatMessage({ id: 'back' })}
                    </Button>

                    <AnimateButton>
                        <Button variant="contained" type="button" sx={{ my: 3 }} color="primary" onClick={handleSubmit}>
                            {intl.formatMessage({ id: 'confirm' })}
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
