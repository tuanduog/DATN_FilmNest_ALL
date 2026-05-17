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
import { getById } from 'api/employee';
import { HttpStatusCode } from 'axios';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import formatDate from 'utils/formatDateTime';

export default function EmployeeDetail() {
    const { id } = useParams<{ id: string }>();
    const intl = useIntl();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState<any>(null);
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

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await getById(Number(id));

                if (response.status === HttpStatusCode.Ok) {
                    setEmployee(response.data);
                } else if (response.status === HttpStatusCode.BadRequest) {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'invalid-form' }), severity: 'error' });
                } else {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'unknown-error' }), severity: 'error' });
                }
            } catch (err: any) {
                setAlert({ open: true, message: err.message, severity: 'error' });
            }
        }
        fetchEmployee();
    }, [id]);

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 30 }, mr: { xs: 0, lg: 30 }, borderRadius: 2 }}>
                <Box mb={4}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                        {intl.formatMessage({ id: 'employee-info' })}
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="code" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'code' })}
                            </InputLabel>

                            <Typography>{employee?.code}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="fullname" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'fullname' })}
                            </InputLabel>

                            <Typography>{employee?.fullname}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="email" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'email' })}
                            </InputLabel>

                            <Typography>{employee?.email}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="phone" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'phone' })}
                            </InputLabel>

                            <Typography>{employee?.phone}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="gender" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'gender' })}
                            </InputLabel>

                            <Typography>{employee?.gender === 'MALE' ? intl.formatMessage({ id: 'male' }) : employee?.gender === 'FEMALE' ? intl.formatMessage({ id: 'female' }) : intl.formatMessage({ id: 'other' })}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="dob" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'dob' })}
                            </InputLabel>

                            <Typography>{formatDate(employee?.dob)}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="nationality" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'nationality' })}
                            </InputLabel>

                            <Stack direction="row" alignItems="center" spacing={1}>
                                {employee?.nationality && countries.find((c) => c.code === employee.nationality) && (
                                    <img
                                        loading="lazy"
                                        width="24"
                                        src={countries.find((c) => c.code === employee.nationality)?.flag}
                                        alt=""
                                        style={{ border: '1px solid #eee' }}
                                    />
                                )}
                                <Typography>
                                    {countries.find((c) => c.code === employee?.nationality)?.label || employee?.nationality}
                                </Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="role" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'role' })}
                            </InputLabel>

                            <Typography>{employee?.role === "manager" ? intl.formatMessage({ id: 'manager' }) : intl.formatMessage({ id: 'staff' })}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="salary" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'salary' })}
                            </InputLabel>

                            <Typography>{employee?.salary}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="hireAt" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'hire-at' })}
                            </InputLabel>

                            <Typography>{formatDate(employee?.hireAt)}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="theaterName" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'theater-responsibility' })}
                            </InputLabel>

                            <Typography>{employee?.theaterName}</Typography>
                        </Grid>

                        {/* <Grid size={{ xs: 12, md: 6 }}>
                            <InputLabel htmlFor="managerName" sx={{ mb: 1 }}>
                                {intl.formatMessage({ id: 'direct-manager' })}
                            </InputLabel>

                            <Typography>{employee?.managerName}</Typography>
                        </Grid> */}
                    </Grid>
                </Box>

                <Grid size={12} sx={{ p: 0, m: 0 }}>
                    <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
                        <AnimateButton>
                            <Button variant="contained" sx={{ my: 3, ml: 1 }} onClick={() => navigate(`/admin/employee/edit/${id}`)}>
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
