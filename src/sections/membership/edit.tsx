import {
    Box,
    InputLabel,
    TextField,
    Typography,
    Paper,
    Snackbar,
    Alert,
    Button,
    IconButton,
    Stack,
    Grid,
    FormControl,
    Select,
    MenuItem,
    FormHelperText
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Membership } from 'types/membership';
import { CloseCircle } from 'iconsax-reactjs';
import AnimateButton from 'components/@extended/AnimateButton';
import ImageDropZone from 'components/ImageDropZone';
import { useParams } from 'react-router';
import { HttpStatusCode } from 'axios';
import { getById, update } from 'api/membership';
import { uploadImage } from 'api/file';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { getList as getListCombo } from 'api/combo';
import { getList as getListVoucher } from 'api/voucher';
import { Combo } from 'types/combo';
import { Voucher } from 'types/voucher';
import Divider from '@mui/material/Divider';

export default function EditMembership() {
    const { id } = useParams<{ id: string }>();
    const intl = useIntl();
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        name: Yup.string().required(intl.formatMessage({ id: 'membership-name-required' })),
        type: Yup.string().required(intl.formatMessage({ id: 'membership-type-required' })),
        price: Yup.number().required(intl.formatMessage({ id: 'price-required' })).min(1, intl.formatMessage({ id: 'discount-min' })),
        duration: Yup.number().required(intl.formatMessage({ id: 'duration-required' })).min(1, intl.formatMessage({ id: 'discount-min' }))
    });
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>('');

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    const initialValues = {
        id: 0,
        name: '',
        type: '',
        price: 0,
        discount: 0,
        duration: 0,
        description: '',
        status: 'active',
        image: null,
        benefits: []
    };
    const [membership, setMembership] = useState<Membership>(initialValues);

    useEffect(() => {
        const fetchMembership = async () => {
            try {
                const response = await getById(Number(id));

                if (response.status === HttpStatusCode.Ok) {
                    const data = response.data;
                    if (data.type) {
                        data.type = data.type.toUpperCase();
                    }
                    if (data.benefits) {
                        data.benefits = data.benefits.map((b: any) => ({
                            ...b,
                            type: b.type ? b.type.toUpperCase() : '',
                            benefitRefId: b.voucher?.id || b.combo?.id || 0
                        }));
                    }
                    setMembership(data);
                    setPreview(data.image || '');
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

                const resVoucher = await getListVoucher({ page: 0, size: 100, keyword: '', sort: '', type: 'PERSONAL', status: 'ACTIVE' });
                if (resVoucher?.data?.content) setVouchers(resVoucher.data.content);
            } catch (error) {
                console.error('Failed to fetch benefits', error);
            }
        };
        fetchBenefits();
    }, []);

    const formik = useFormik<Membership>({
        initialValues: membership,
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            let currentImageUrl = preview;

            if (image && image instanceof File) {
                const formData = new FormData();
                formData.append('file', image);
                formData.append('folder', 'membership');
                try {
                    const uploadResponse = await uploadImage(formData);
                    if (uploadResponse.status === HttpStatusCode.Ok) {
                        if (uploadResponse.data.secure_url) {
                            currentImageUrl = uploadResponse.data.secure_url;
                        } else if (uploadResponse.data.url) {
                            currentImageUrl = uploadResponse.data.url;
                        }
                    }
                } catch (err) {
                    setAlert({ open: true, message: intl.formatMessage({ id: 'upload-image-error' }), severity: 'error' });
                    return;
                }
            }

            const payload = {
                ...values,
                image: currentImageUrl
            };

            try {
                const response = await update(Number(id), payload);

                if (response.status === HttpStatusCode.Ok) {
                    navigate('/admin/membership', {
                        state: { alert: { open: true, severity: 'success', message: intl.formatMessage({ id: 'update-membership-success' }) } }
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

    const handleGetFileUrl = (e: any) => {
        const selectedFile = e.target.files[0];
        setImage(selectedFile);
        return URL.createObjectURL(selectedFile);
    };

    const handleDeleteImage = async () => {
        setImage(null);
        setPreview('');
    };

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 30 }, mr: { xs: 0, lg: 30 }, borderRadius: 2 }}>
                <form onSubmit={formik.handleSubmit} noValidate>
                    <Box mb={4}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                            {intl.formatMessage({ id: 'membership-info' })}
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <Box sx={{ width: '100%', mb: 2 }}>
                                    <InputLabel sx={{ mb: 1 }}>{intl.formatMessage({ id: 'membership-image' })}</InputLabel>
                                    {!preview ? (
                                        <ImageDropZone
                                            value={preview ?? ''}
                                            onGetFile={(files) => handleGetFileUrl(files)}
                                            onChange={(url) => {
                                                setPreview(url);
                                            }}
                                            width="150px"
                                            height="150px"
                                        />
                                    ) : (
                                        <Box sx={{ position: 'relative', width: '150px' }}>
                                            <Box>
                                                <img
                                                    alt="image"
                                                    src={preview}
                                                    style={{ width: '150px', height: '150px', display: 'block', borderRadius: '5px', objectFit: 'cover' }}
                                                />
                                            </Box>

                                            <IconButton
                                                onClick={handleDeleteImage}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 4,
                                                    right: 4,
                                                    zIndex: 10,
                                                    '&:hover': { backgroundColor: 'transparent' }
                                                }}
                                                size="small"
                                            >
                                                <CloseCircle
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        fontWeight: 'bold',
                                                        color: 'white',
                                                        backgroundColor: 'black',
                                                        borderRadius: '50%'
                                                    }}
                                                />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="name" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'membership-name' })}
                                </InputLabel>

                                <TextField
                                    id="name"
                                    name="name"
                                    placeholder={intl.formatMessage({ id: 'membership-name-placeholder' })}
                                    size="small"
                                    fullWidth
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="type" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'membership-type' })}
                                </InputLabel>

                                <FormControl
                                    fullWidth
                                    size="small"
                                    error={formik.touched.type && Boolean(formik.errors.type)}
                                >
                                    <Select
                                        id="type"
                                        name="type"
                                        value={formik.values.type}
                                        displayEmpty
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <MenuItem value="" disabled sx={{ display: 'none' }}>
                                            <Box component="span" sx={{ color: 'text.secondary' }}>
                                                {intl.formatMessage({ id: 'select-membership-type' })}
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value="PLATINUM">{intl.formatMessage({ id: 'platinum' })}</MenuItem>
                                        <MenuItem value="GOLD">{intl.formatMessage({ id: 'gold' })}</MenuItem>
                                        <MenuItem value="SILVER">{intl.formatMessage({ id: 'silver' })}</MenuItem>
                                    </Select>

                                    <FormHelperText>
                                        {formik.touched.type && formik.errors.type}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="price" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'price' })}
                                </InputLabel>

                                <TextField
                                    id="price"
                                    name="price"
                                    placeholder={intl.formatMessage({ id: 'price-placeholder' })}
                                    size="small"
                                    type='number'
                                    fullWidth
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.price && Boolean(formik.errors.price)}
                                    helperText={formik.touched.price && formik.errors.price}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="duration" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'duration' })} ({intl.formatMessage({ id: 'month' })})
                                </InputLabel>

                                <TextField
                                    id="duration"
                                    name="duration"
                                    type="number"
                                    placeholder={intl.formatMessage({ id: 'duration-placeholder' })}
                                    size="small"
                                    fullWidth
                                    value={formik.values.duration}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.duration && Boolean(formik.errors.duration)}
                                    helperText={formik.touched.duration && formik.errors.duration}
                                />
                            </Grid>

                            <Grid size={12}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                    {intl.formatMessage({ id: 'membership-benefits' })}
                                </Typography>

                                {(formik.values.benefits || []).map((benefit, index) => (
                                    <Grid container spacing={2} key={index} sx={{ mb: 2, alignItems: 'center' }}>
                                        <Grid size={{ xs: 12, md: 3 }}>
                                            <FormControl fullWidth size="small">
                                                <Select
                                                    value={benefit.type || ''}
                                                    displayEmpty
                                                    onChange={(e) => {
                                                        const newBenefits = [...(formik.values.benefits || [])];
                                                        newBenefits[index].type = e.target.value as string;
                                                        newBenefits[index].benefitRefId = 0;
                                                        formik.setFieldValue('benefits', newBenefits);
                                                    }}
                                                >
                                                    <MenuItem value="" disabled sx={{ display: 'none' }}>
                                                        {intl.formatMessage({ id: 'select-benefit-type' })}
                                                    </MenuItem>
                                                    <MenuItem value="VOUCHER">Voucher</MenuItem>
                                                    <MenuItem value="COMBO">Combo</MenuItem>
                                                    <MenuItem value="DIRECT">Trực tiếp</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        {(benefit.type === 'VOUCHER' || benefit.type === 'COMBO') && (
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                {benefit.type === 'VOUCHER' ? (
                                                    <FormControl fullWidth size="small">
                                                        <Select
                                                            value={benefit.benefitRefId || ''}
                                                            displayEmpty
                                                            onChange={(e) => {
                                                                const newBenefits = [...(formik.values.benefits || [])];
                                                                newBenefits[index].benefitRefId = Number(e.target.value);
                                                                formik.setFieldValue('benefits', newBenefits);
                                                            }}
                                                        >
                                                            <MenuItem value="" disabled sx={{ display: 'none' }}>
                                                                {intl.formatMessage({ id: 'select-voucher' })}
                                                            </MenuItem>
                                                            {vouchers.map(v => <MenuItem key={v.id} value={v.id}>{v.code}</MenuItem>)}
                                                        </Select>
                                                    </FormControl>
                                                ) : (
                                                    <FormControl fullWidth size="small">
                                                        <Select
                                                            value={benefit.benefitRefId || ''}
                                                            displayEmpty
                                                            onChange={(e) => {
                                                                const newBenefits = [...(formik.values.benefits || [])];
                                                                newBenefits[index].benefitRefId = Number(e.target.value);
                                                                formik.setFieldValue('benefits', newBenefits);
                                                            }}
                                                        >
                                                            <MenuItem value="" disabled sx={{ display: 'none' }}>
                                                                {intl.formatMessage({ id: 'select-combo' })}
                                                            </MenuItem>
                                                            {combos.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                                                        </Select>
                                                    </FormControl>
                                                )}
                                            </Grid>
                                        )}
                                        {benefit.type !== 'VOUCHER' && benefit.type !== 'COMBO' && (
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    placeholder={intl.formatMessage({ id: 'benefit-description-placeholder' })}
                                                    size="small"
                                                    fullWidth
                                                    value={benefit.description || ''}
                                                    onChange={(e) => {
                                                        const newBenefits = [...(formik.values.benefits || [])];
                                                        newBenefits[index].description = e.target.value;
                                                        formik.setFieldValue('benefits', newBenefits);
                                                    }}
                                                />
                                            </Grid>
                                        )}
                                        <Grid size={{ xs: 12, md: 2 }}>
                                            <TextField
                                                type="number"
                                                placeholder={intl.formatMessage({ id: 'quantity' })}
                                                size="small"
                                                fullWidth
                                                value={benefit.quantity || ''}
                                                onChange={(e) => {
                                                    const newBenefits = [...(formik.values.benefits || [])];
                                                    newBenefits[index].quantity = Number(e.target.value);
                                                    formik.setFieldValue('benefits', newBenefits);
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 1 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <IconButton color="error" onClick={() => {
                                                const newBenefits = formik.values.benefits?.filter((_, i) => i !== index);
                                                formik.setFieldValue('benefits', newBenefits);
                                            }}>
                                                <CloseCircle />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                ))}

                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        const newBenefits = [...(formik.values.benefits || []), { type: '', description: '', quantity: 1, benefitRefId: 0 }];
                                        formik.setFieldValue('benefits', newBenefits);
                                    }}
                                >
                                    {intl.formatMessage({ id: 'add-benefit' })}
                                </Button>
                            </Grid>
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
