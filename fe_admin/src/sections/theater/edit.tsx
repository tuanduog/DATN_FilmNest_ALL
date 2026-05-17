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
    MenuItem,
    Select,
    FormControl,
    FormHelperText
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { Theater } from 'types/theater';
import AnimateButton from 'components/@extended/AnimateButton';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLng } from 'leaflet';
import { HttpStatusCode } from 'axios';
import { getById, update } from 'api/theater';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

interface MapClickHandlerProps {
    onClick: (latlng: LatLng) => void;
}

function MapClickHandler({ onClick }: MapClickHandlerProps) {
    useMapEvents({
        click(e) {
            onClick(e.latlng);
        }
    });
    return null;
}

const validationSchema = (intl: any) => Yup.object({
    name: Yup.string().required(intl.formatMessage({ id: 'theater-name-required' })),
    address: Yup.string().required(intl.formatMessage({ id: 'address-required' })),
    provinceCode: Yup.string().required(intl.formatMessage({ id: 'province-required' })),
    communeCode: Yup.string().required(intl.formatMessage({ id: 'commune-required' })),
    description: Yup.string().required(intl.formatMessage({ id: 'description-required' })),
    hotline: Yup.string().required(intl.formatMessage({ id: 'hotline-required' })),
    openTime: Yup.string().required(intl.formatMessage({ id: 'open-time-required' })),
    closeTime: Yup.string().required(intl.formatMessage({ id: 'close-time-required' })),
});

export default function EditTheater() {
    const { id } = useParams<{ id: string }>();
    const intl = useIntl();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [provinces, setProvinces] = useState<any[]>([]);
    const [communes, setCommunes] = useState<any[]>([]);

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    const initialValues: Theater = {
        name: '',
        address: '',
        provinceCode: '',
        provinceName: '',
        communeCode: '',
        communeName: '',
        description: '',
        hotline: '',
        openTime: '',
        closeTime: '',
        latitude: undefined,
        longitude: undefined,
    };

    const [theater, setTheater] = useState<Theater>(initialValues);

    const fetchCommunes = async (provinceCode: string) => {
        try {
            const res = await fetch(
                `https://production.cas.so/address-kit/latest/provinces/${provinceCode}/communes`
            );
            const data = await res.json();
            setCommunes(data.communes);
        } catch (err) {
            console.error('Could not fetch communes', err);
        }
    };

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await fetch('https://production.cas.so/address-kit/latest/provinces');
                const data = await res.json();
                setProvinces(data.provinces);
            } catch (err) {
                console.error('Could not fetch provinces', err);
            }
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        const fetchTheater = async () => {
            try {
                const response = await getById(Number(id));

                if (response.status === HttpStatusCode.Ok) {
                    setTheater(response.data);
                    if (response.data?.provinceCode) {
                        await fetchCommunes(response.data.provinceCode);
                    }
                } else if (response.status === HttpStatusCode.BadRequest) {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'invalid-form' }), severity: 'error' });
                } else {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'unknown-error' }), severity: 'error' });
                }
            } catch (err: any) {
                setAlert({ open: true, message: err.message, severity: 'error' });
            }
        };
        fetchTheater();
    }, [id]);

    const formik = useFormik<Theater>({
        initialValues: theater,
        enableReinitialize: true,
        validationSchema: validationSchema(intl),
        onSubmit: async (values) => {
            try {
                const response = await update(Number(id), values);

                if (response.status === HttpStatusCode.Ok) {
                    navigate('/admin/theater', {
                        state: { alert: { open: true, severity: 'success', message: intl.formatMessage({ id: 'update-theater-success' }) } }
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
        }
    });

    const handleProvinceChange = (e: any) => {
        const code = e.target.value;
        const currentProvince = provinces.find((p: any) => p.code === code);
        formik.setFieldValue('provinceCode', code);
        formik.setFieldValue('provinceName', currentProvince?.name || '');
        formik.setFieldValue('communeCode', 0);
        formik.setFieldValue('communeName', '');
        fetchCommunes(code);
    };

    const handleCommuneChange = (e: any) => {
        const code = e.target.value;
        const currentCommune = communes.find((d: any) => d.code === code);
        formik.setFieldValue('communeCode', code);
        formik.setFieldValue('communeName', currentCommune?.name || '');
    };

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 15 }, mr: { xs: 0, lg: 15 }, borderRadius: 2 }}>
                <form onSubmit={formik.handleSubmit} noValidate>
                    <Box mb={4}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                            {intl.formatMessage({ id: 'edit-theater-info' })}
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="name" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'theater-name' })}
                                </InputLabel>

                                <TextField
                                    id="name"
                                    name="name"
                                    placeholder={intl.formatMessage({ id: 'search-theater-placeholder' })}
                                    size="small"
                                    fullWidth
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name as string}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="hotline" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'hotline' })}
                                </InputLabel>

                                <TextField
                                    id="hotline"
                                    name="hotline"
                                    placeholder={intl.formatMessage({ id: 'hotline-placeholder' })}
                                    size="small"
                                    fullWidth
                                    value={formik.values.hotline}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.hotline && Boolean(formik.errors.hotline)}
                                    helperText={formik.touched.hotline && formik.errors.hotline as string}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'province-city' })}
                                </InputLabel>

                                <FormControl fullWidth size="small" error={formik.touched.provinceCode && Boolean(formik.errors.provinceCode)}>
                                    <Select
                                        id="provinceCode"
                                        name="provinceCode"
                                        value={formik.values.provinceCode || ''}
                                        onChange={handleProvinceChange}
                                        onBlur={formik.handleBlur}
                                        displayEmpty
                                    >
                                        <MenuItem value={0} disabled>{intl.formatMessage({ id: 'select-province-city' })}</MenuItem>
                                        {provinces.map((p) => (
                                            <MenuItem key={p.code} value={p.code}>{p.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {formik.touched.provinceCode && formik.errors.provinceCode && (
                                        <FormHelperText>{formik.errors.provinceCode as string}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'commune-ward' })}
                                </InputLabel>
                                <FormControl fullWidth size="small" error={formik.touched.communeCode && Boolean(formik.errors.communeCode)}>
                                    <Select
                                        id="communeCode"
                                        name="communeCode"
                                        value={formik.values.communeCode || ''}
                                        onChange={handleCommuneChange}
                                        onBlur={formik.handleBlur}
                                        displayEmpty
                                        disabled={!formik.values.provinceCode}
                                    >
                                        <MenuItem value={0} disabled>{intl.formatMessage({ id: 'select-commune-ward' })}</MenuItem>
                                        {communes.map((c) => (
                                            <MenuItem key={c.code} value={c.code}>{c.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {formik.touched.communeCode && formik.errors.communeCode && (
                                        <FormHelperText>{formik.errors.communeCode as string}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="openTime" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'open-time' })}
                                </InputLabel>

                                <TextField
                                    id="openTime"
                                    name="openTime"
                                    type="time"
                                    size="small"
                                    fullWidth
                                    value={formik.values.openTime}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.openTime && Boolean(formik.errors.openTime)}
                                    helperText={formik.touched.openTime && formik.errors.openTime as string}
                                    inputProps={{ step: 300 }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="closeTime" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'close-time' })}
                                </InputLabel>

                                <TextField
                                    id="closeTime"
                                    name="closeTime"
                                    type="time"
                                    size="small"
                                    fullWidth
                                    value={formik.values.closeTime}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.closeTime && Boolean(formik.errors.closeTime)}
                                    helperText={formik.touched.closeTime && formik.errors.closeTime as string}
                                    inputProps={{ step: 300 }}
                                />
                            </Grid>

                            <Grid size={12}>
                                <InputLabel sx={{ mb: 1 }}>{intl.formatMessage({ id: 'select-location-on-map' })}</InputLabel>
                                <MapContainer
                                    center={
                                        formik.values.latitude && formik.values.longitude
                                            ? [formik.values.latitude, formik.values.longitude]
                                            : [21.0285, 105.8542]
                                    }
                                    zoom={15}
                                    style={{ width: '100%', height: '400px', borderRadius: '8px' }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />

                                    <MapClickHandler
                                        onClick={async (latlng: LatLng) => {
                                            formik.setFieldValue('latitude', latlng.lat);
                                            formik.setFieldValue('longitude', latlng.lng);

                                            try {
                                                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
                                                const data = await res.json();
                                                if (data && data.display_name) {
                                                    formik.setFieldValue('address', data.display_name);
                                                }
                                            } catch (err) {
                                                console.error('Failed to fetch address', err);
                                            }
                                        }}
                                    />

                                    {formik.values.latitude && formik.values.longitude && (
                                        <Marker position={[formik.values.latitude, formik.values.longitude]} />
                                    )}
                                </MapContainer>
                            </Grid>

                            <Grid size={12}>
                                <InputLabel htmlFor="address" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'address' })}
                                </InputLabel>

                                <TextField
                                    id="address"
                                    name="address"
                                    placeholder={intl.formatMessage({ id: 'address-placeholder' })}
                                    size="small"
                                    fullWidth
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.address && Boolean(formik.errors.address)}
                                    helperText={formik.touched.address && formik.errors.address as string}
                                />
                            </Grid>

                            <Grid size={12}>
                                <InputLabel htmlFor="description" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'description' })}
                                </InputLabel>

                                <TextField
                                    id="description"
                                    name="description"
                                    placeholder={intl.formatMessage({ id: 'description-placeholder' })}
                                    size="small"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description as string}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Grid size={12} sx={{ p: 0, m: 0 }}>
                        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{ my: 3 }}
                                onClick={() => navigate('/admin/theater')}
                            >
                                {intl.formatMessage({ id: 'back' })}
                            </Button>

                            <AnimateButton>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    sx={{ my: 3, ml: 1 }}
                                    disabled={formik.isSubmitting}
                                >
                                    {formik.isSubmitting ? intl.formatMessage({ id: 'saving' }) : intl.formatMessage({ id: 'confirm' })}
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
