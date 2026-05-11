import {
    Box,
    InputLabel,
    TextField,
    Typography,
    Paper,
    Snackbar,
    Alert,
    Button,
    Stack,
    Grid,
    FormControl,
    FormHelperText,
    Select,
    MenuItem,
    Autocomplete
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Employee } from 'types/employee';
import AnimateButton from 'components/@extended/AnimateButton';
import { useParams } from 'react-router';
import { HttpStatusCode } from 'axios';
import { getById, update } from 'api/employee';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TheaterDialog from './theater-dialog';
import ManagerDialog from './manager-dialog';
import { Theater } from 'types/theater';

const phoneRegExp = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

const validationSchema = (intl: any) => Yup.object({
    username: Yup.string().required(intl.formatMessage({ id: 'username-required' })),
    fullname: Yup.string().required(intl.formatMessage({ id: 'fullname-required' })),
    code: Yup.string().required(intl.formatMessage({ id: 'code-required' })),
    email: Yup.string().required(intl.formatMessage({ id: 'email-required' })).email(intl.formatMessage({ id: 'email-invalid' })),
    phone: Yup.string().required(intl.formatMessage({ id: 'phone-required' })).matches(phoneRegExp, intl.formatMessage({ id: 'phone-invalid' })),
    gender: Yup.string().required(intl.formatMessage({ id: 'gender-required' })),
    dob: Yup.string().required(intl.formatMessage({ id: 'dob-required' })),
    nationality: Yup.string().required(intl.formatMessage({ id: 'nationality-required' })),
    role: Yup.string().required(intl.formatMessage({ id: 'role-required' })),
    salary: Yup.number().typeError(intl.formatMessage({ id: 'salary-type-error' })).nullable(),
    hireAt: Yup.string().required(intl.formatMessage({ id: 'hire-at-required' })),
    theaterId: Yup.number().required(intl.formatMessage({ id: 'theater-required' })).min(1, intl.formatMessage({ id: 'theater-required' })),
    managerId: Yup.number().nullable().when('role', {
        is: 'STAFF',
        then: (schema) => schema.required(intl.formatMessage({ id: 'manager-required' })).min(1, intl.formatMessage({ id: 'manager-required' })),
        otherwise: (schema) => schema.nullable()
    })
});

export default function EditEmployee() {
    const { id } = useParams<{ id: string }>();
    const intl = useIntl();
    const navigate = useNavigate();

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    const [countries, setCountries] = useState<{ code: string; label: string; flag: string }[]>([]);
    const [openTheaterDialog, setOpenTheaterDialog] = useState<boolean>(false);
    const [openManagerDialog, setOpenManagerDialog] = useState<boolean>(false);

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

    const initialValues = {
        id: 0,
        username: '',
        email: '',
        fullname: '',
        code: '',
        phone: '',
        gender: '',
        dob: '',
        nationality: '',
        role: '',
        salary: 0,
        hireAt: '',
        status: '',
        userId: null,
        managerId: null,
        theaterId: null,
    };
    const [employee, setEmployee] = useState<Employee>(initialValues);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await getById(Number(id));

                if (response.status === HttpStatusCode.Ok) {
                    const data = response.data;
                    data.gender = data.gender?.toUpperCase() || '';
                    data.role = data.role?.toUpperCase() || '';
                    if (data.dob) data.dob = data.dob.split('T')[0];
                    if (data.hireAt) data.hireAt = data.hireAt.split('T')[0];
                    setEmployee(data);
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

    const formik = useFormik<Employee>({
        initialValues: employee,
        enableReinitialize: true,
        validationSchema: validationSchema(intl),
        onSubmit: async (values) => {
            try {
                const response = await update(Number(id), values);

                if (response.status === HttpStatusCode.Ok) {
                    navigate('/admin/employee', {
                        state: { alert: { open: true, severity: 'success', message: intl.formatMessage({ id: 'update-employee-success' }) } }
                    });
                } else if (response.status === HttpStatusCode.BadRequest) {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'invalid-form' }), severity: 'error' });
                } else {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'unknown-error' }), severity: 'error' });
                }
            } catch (err: any) {
                setAlert({ open: true, message: err.message, severity: 'error' });
            }
        }
    });

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 30 }, mr: { xs: 0, lg: 30 }, borderRadius: 2 }}>
                <form onSubmit={formik.handleSubmit} noValidate>
                    {formik.submitCount > 0 && Object.keys(formik.errors).length > 0 && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            Vui lòng kiểm tra lại các lỗi: {Object.keys(formik.errors).join(', ')}
                        </Alert>
                    )}
                    <Box mb={4}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                            {intl.formatMessage({ id: 'employee-info' })}
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="name" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'username' })}
                                </InputLabel>

                                <TextField
                                    id="username"
                                    name="username"
                                    placeholder={intl.formatMessage({ id: 'username-placeholder' })}
                                    size="small"
                                    fullWidth
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.username && Boolean(formik.errors.username)}
                                    helperText={formik.touched.username && formik.errors.username}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="code" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'code' })}
                                </InputLabel>

                                <TextField
                                    id="code"
                                    name="code"
                                    placeholder={intl.formatMessage({ id: 'code-placeholder' })}
                                    size="small"
                                    fullWidth
                                    value={formik.values.code}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.code && Boolean(formik.errors.code)}
                                    helperText={formik.touched.code && formik.errors.code}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="fullname" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'fullname' })}
                                </InputLabel>

                                <TextField
                                    id="fullname"
                                    name="fullname"
                                    placeholder={intl.formatMessage({ id: 'fullname-placeholder' })}
                                    size="small"
                                    fullWidth
                                    value={formik.values.fullname}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.fullname && Boolean(formik.errors.fullname)}
                                    helperText={formik.touched.fullname && formik.errors.fullname}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="email" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'email' })}
                                </InputLabel>

                                <TextField
                                    id="email"
                                    name="email"
                                    placeholder={intl.formatMessage({ id: 'email-placeholder' })}
                                    size="small"
                                    fullWidth
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="phone" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'phone' })}
                                </InputLabel>

                                <TextField
                                    id="phone"
                                    name="phone"
                                    placeholder={intl.formatMessage({ id: 'phone-placeholder' })}
                                    size="small"
                                    fullWidth
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                                    helperText={formik.touched.phone && formik.errors.phone}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="gender" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'gender' })}
                                </InputLabel>

                                <FormControl
                                    fullWidth
                                    size="small"
                                    error={formik.touched.gender && Boolean(formik.errors.gender)}
                                >
                                    <Select
                                        id="gender"
                                        name="gender"
                                        value={formik.values.gender}
                                        displayEmpty
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <MenuItem value="" disabled sx={{ display: 'none' }}>
                                            <Box component="span" sx={{ color: 'text.secondary' }}>{intl.formatMessage({ id: 'gender-placeholder' })}</Box>
                                        </MenuItem>
                                        <MenuItem value="MALE">{intl.formatMessage({ id: 'male' })}</MenuItem>
                                        <MenuItem value="FEMALE">{intl.formatMessage({ id: 'female' })}</MenuItem>
                                        <MenuItem value="OTHER">{intl.formatMessage({ id: 'other' })}</MenuItem>
                                    </Select>

                                    <FormHelperText>
                                        {formik.touched.gender && formik.errors.gender}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="dob" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'dob' })}
                                </InputLabel>

                                <TextField
                                    id="dob"
                                    name="dob"
                                    type="date"
                                    placeholder={intl.formatMessage({ id: 'dob-placeholder' })}
                                    size="small"
                                    fullWidth
                                    value={formik.values.dob}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.dob && Boolean(formik.errors.dob)}
                                    helperText={formik.touched.dob && formik.errors.dob}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="nationality" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'nationality' })}
                                </InputLabel>

                                <Autocomplete
                                    id="nationality"
                                    options={countries}
                                    getOptionLabel={(option) => option.label}
                                    value={countries.find((c) => c.code === formik.values.nationality) || null}
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('nationality', newValue ? newValue.code : '');
                                    }}
                                    onBlur={formik.handleBlur}
                                    isOptionEqualToValue={(option, value) => option.code === value.code}
                                    renderOption={(props, option) => {
                                        const { key, ...restProps } = props as any;
                                        return (
                                            <Box component="li" key={option.code} sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...restProps}>
                                                <img loading="lazy" width="24" src={option.flag} alt="" style={{ border: '1px solid #eee' }} />
                                                {option.label}
                                            </Box>
                                        );
                                    }}
                                    renderInput={(params) => {
                                        const selectedCountry = countries.find((c) => c.code === formik.values.nationality);
                                        return (
                                            <TextField
                                                {...params}
                                                name="nationality"
                                                placeholder={intl.formatMessage({ id: 'nationality-placeholder' })}
                                                size="small"
                                                fullWidth
                                                error={formik.touched.nationality && Boolean(formik.errors.nationality)}
                                                helperText={formik.touched.nationality && formik.errors.nationality}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <>
                                                            {selectedCountry && (
                                                                <img
                                                                    loading="lazy"
                                                                    width="24"
                                                                    src={selectedCountry.flag}
                                                                    alt=""
                                                                    style={{ marginRight: 8, marginLeft: 8, border: '1px solid #eee' }}
                                                                />
                                                            )}
                                                            {params.InputProps.startAdornment}
                                                        </>
                                                    )
                                                }}
                                            />
                                        );
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="role" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'role' })}
                                </InputLabel>

                                <FormControl
                                    fullWidth
                                    size="small"
                                    error={formik.touched.role && Boolean(formik.errors.role)}
                                >
                                    <Select
                                        labelId="role-label"
                                        id="role"
                                        name="role"
                                        value={formik.values.role}
                                        displayEmpty
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <MenuItem value="" disabled sx={{ display: 'none' }}>
                                            <Box component="span" sx={{ color: 'text.secondary' }}>{intl.formatMessage({ id: 'role-placeholder' })}</Box>
                                        </MenuItem>
                                        <MenuItem value="MANAGER">{intl.formatMessage({ id: 'manager' })}</MenuItem>
                                        <MenuItem value="STAFF">{intl.formatMessage({ id: 'staff' })}</MenuItem>
                                    </Select>

                                    <FormHelperText>
                                        {formik.touched.role && formik.errors.role}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="salary" sx={{ mb: 1 }}>
                                    {intl.formatMessage({ id: 'salary' })}
                                </InputLabel>

                                <TextField
                                    id="salary"
                                    name="salary"
                                    placeholder={intl.formatMessage({ id: 'salary-placeholder' })}
                                    size="small"
                                    fullWidth
                                    value={formik.values.salary}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.salary && Boolean(formik.errors.salary)}
                                    helperText={formik.touched.salary && formik.errors.salary}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="hireAt" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'hire-at' })}
                                </InputLabel>

                                <TextField
                                    id="hireAt"
                                    name="hireAt"
                                    placeholder={intl.formatMessage({ id: 'hire-at-placeholder' })}
                                    size="small"
                                    type="date"
                                    fullWidth
                                    value={formik.values.hireAt}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.hireAt && Boolean(formik.errors.hireAt)}
                                    helperText={formik.touched.hireAt && formik.errors.hireAt}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor='theaterId' required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'theater-responsibility' })}
                                </InputLabel>

                                <Box
                                    onClick={() => {
                                        setOpenTheaterDialog(true);
                                    }}
                                    sx={{
                                        border:
                                            formik.touched.theaterId && formik.errors.theaterId
                                                ? '1px solid #d32f2f'
                                                : '1px solid rgba(0, 0, 0, 0.23)',
                                        borderRadius: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        px: 1,
                                        py: 0.5,
                                        cursor: 'pointer',
                                        fontSize: 12,
                                        height: 36.3,
                                        userSelect: 'none'
                                    }}
                                >
                                    {formik.values.theaterName ? (
                                        <span style={{ color: 'rgba(0, 0, 0, 0.87)' }}>{formik.values.theaterName}</span>
                                    ) : (
                                        <span style={{ color: 'rgba(0, 0, 0, 0.38)' }}>{intl.formatMessage({ id: 'select-theater' })}</span>
                                    )}
                                    <ArrowDropDownIcon sx={{ color: 'rgba(0, 0, 0, 0.54)' }} />
                                </Box>
                                {formik.touched.theaterId && formik.errors.theaterId && (
                                    <FormHelperText error id="standard-weight-helper-text-theaterId">
                                        {formik.errors.theaterId as string}
                                    </FormHelperText>
                                )}
                            </Grid>

                            {formik.values.role == "STAFF" && (
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <InputLabel htmlFor='managerId' required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                        {intl.formatMessage({ id: 'direct-manager' })}
                                    </InputLabel>

                                    <Box
                                        onClick={() => {
                                            setOpenManagerDialog(true);
                                        }}
                                        sx={{
                                            border:
                                                formik.touched.managerId && formik.errors.managerId
                                                    ? '1px solid #d32f2f'
                                                    : '1px solid rgba(0, 0, 0, 0.23)',
                                            borderRadius: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            px: 1,
                                            py: 0.5,
                                            cursor: 'pointer',
                                            fontSize: 12,
                                            height: 36.3,
                                            userSelect: 'none'
                                        }}
                                    >
                                        {formik.values.managerName ? (
                                            <span style={{ color: 'rgba(0, 0, 0, 0.87)' }}>{formik.values.managerName}</span>
                                        ) : (
                                            <span style={{ color: 'rgba(0, 0, 0, 0.38)' }}>{intl.formatMessage({ id: 'select-manager' })}</span>
                                        )}
                                        <ArrowDropDownIcon sx={{ color: 'rgba(0, 0, 0, 0.54)' }} />
                                    </Box>
                                    {formik.touched.managerId && formik.errors.managerId && (
                                        <FormHelperText error id="standard-weight-helper-text-managerId">
                                            {formik.errors.managerId as string}
                                        </FormHelperText>
                                    )}
                                </Grid>
                            )}
                        </Grid>
                    </Box>

                    <Grid size={12} sx={{ p: 0, m: 0 }}>
                        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
                            <AnimateButton>
                                <Button variant="contained" type="submit" sx={{ my: 3, ml: 1 }}>
                                    {intl.formatMessage({ id: 'confirm' })}
                                </Button>
                            </AnimateButton>
                        </Stack>
                    </Grid>
                </form>
            </Paper>

            <TheaterDialog
                open={openTheaterDialog}
                id={formik.values.theaterId!}
                onClose={() => setOpenTheaterDialog(false)}
                onConfirm={(theater: Theater) => {
                    formik.setFieldValue('theaterName', theater.name);
                    formik.setFieldValue('theaterId', theater.id);

                    setOpenTheaterDialog(false);
                }}
            />

            <ManagerDialog
                open={openManagerDialog}
                id={formik.values.managerId!}
                onClose={() => setOpenManagerDialog(false)}
                onConfirm={(manager: Employee) => {
                    formik.setFieldValue('managerName', manager.fullname);
                    formik.setFieldValue('managerId', manager.id);

                    setOpenManagerDialog(false);
                }}
            />

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
