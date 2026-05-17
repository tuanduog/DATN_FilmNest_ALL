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
import { User } from 'types/user';
import AnimateButton from 'components/@extended/AnimateButton';
import { useParams } from 'react-router';
import { HttpStatusCode } from 'axios';
import { getById, update } from 'api/user';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
    username: Yup.string().required('Tên người dùng là bắt buộc'),
    email: Yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),
    fullname: Yup.string().required('Họ và tên là bắt buộc'),
    phone: Yup.string().required('Số điện thoại là bắt buộc'),
    gender: Yup.string().required('Giới tính là bắt buộc'),
    dob: Yup.string().required('Ngày sinh là bắt buộc'),
    nationality: Yup.string().required('Quốc tịch là bắt buộc'),
    role: Yup.string().required('Vai trò là bắt buộc')
});

export default function EditUser() {
    const { id } = useParams<{ id: string }>();
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

    const initialValues = {
        username: '',
        email: '',
        fullname: '',
        phone: '',
        gender: '',
        dob: '',
        nationality: '',
        role: ''
    };
    const [user, setUser] = useState<User>(initialValues);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getById(Number(id));

                if (response.status === HttpStatusCode.Ok) {
                    const data = response.data;
                    if (data.role) {
                        data.role = data.role.toUpperCase();
                    }
                    if (data.gender) {
                        data.gender = data.gender.toUpperCase();
                    }
                    setUser(data);
                } else if (response.status === HttpStatusCode.BadRequest) {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'invalid-form' }), severity: 'error' });
                } else {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'unknown-error' }), severity: 'error' });
                }
            } catch (err: any) {
                setAlert({ open: true, message: err.message, severity: 'error' });
            }
        }
        fetchUser();
    }, [id]);

    const formik = useFormik<User>({
        initialValues: user,
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await update(Number(id), values);

                if (response.status === HttpStatusCode.Ok) {
                    navigate('/admin/user', {
                        state: { alert: { open: true, severity: 'success', message: 'Cập nhật người dùng thành công' } }
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
                    <Box mb={4}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                            Thông tin người dùng
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="username" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    Tên người dùng
                                </InputLabel>

                                <TextField
                                    id="username"
                                    name="username"
                                    placeholder="Nhập tên người dùng"
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
                                <InputLabel htmlFor="fullname" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    Họ và tên
                                </InputLabel>

                                <TextField
                                    id="fullname"
                                    name="fullname"
                                    placeholder="Nhập họ và tên"
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
                                    Email
                                </InputLabel>

                                <TextField
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Nhập email"
                                    size="small"
                                    fullWidth
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </Grid>

                            <Grid size={12}>
                                <InputLabel htmlFor="phone" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    Số điện thoại
                                </InputLabel>

                                <TextField
                                    id="phone"
                                    name="phone"
                                    placeholder="Nhập số điện thoại"
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
                                    Giới tính
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
                                            <Box component="span" sx={{ color: 'text.secondary' }}>Chọn giới tính</Box>
                                        </MenuItem>
                                        <MenuItem value="MALE">Nam</MenuItem>
                                        <MenuItem value="FEMALE">Nữ</MenuItem>
                                        <MenuItem value="OTHER">Khác</MenuItem>
                                    </Select>

                                    <FormHelperText>
                                        {formik.touched.gender && formik.errors.gender}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="dob" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    Ngày sinh
                                </InputLabel>

                                <TextField
                                    id="dob"
                                    name="dob"
                                    type="date"
                                    placeholder="Nhập ngày sinh"
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
                                    Quốc tịch
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
                                                placeholder="Chọn quốc tịch"
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
                        </Grid>
                    </Box>

                    <Grid size={12} sx={{ p: 0, m: 0 }}>
                        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
                            <AnimateButton>
                                <Button variant="contained" type="submit" sx={{ my: 3, ml: 1 }}>
                                    Xác nhận
                                </Button>
                            </AnimateButton>
                        </Stack>
                    </Grid>
                </form>
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
