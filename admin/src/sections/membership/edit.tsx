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

const validationSchema = Yup.object({
    name: Yup.string().required('Tên gói thành viên là bắt buộc'),
    type: Yup.string().required('Loại gói thành viên là bắt buộc'),
    price: Yup.number().required('Giá tiền là bắt buộc').min(1, 'Giá tiền phải lớn hơn 0'),
    duration: Yup.number().required('Thời hạn là bắt buộc').min(1, 'Thời hạn phải lớn hơn 0')
});

export default function EditMembership() {
    const { id } = useParams<{ id: string }>();
    const intl = useIntl();
    const navigate = useNavigate();
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

                const resVoucher = await getListVoucher({ page: 0, size: 100, keyword: '', sort: '', status: 'ACTIVE' });
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
                    setAlert({ open: true, message: 'Lỗi tải ảnh', severity: 'error' });
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
                        state: { alert: { open: true, severity: 'success', message: 'Cập nhật gói thành viên thành công' } }
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
                            Thông tin gói thành viên
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <Box sx={{ width: '100%', mb: 2 }}>
                                    <InputLabel sx={{ mb: 1 }}>Hình ảnh gói thành viên</InputLabel>
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
                                    Tên gói thành viên
                                </InputLabel>

                                <TextField
                                    id="name"
                                    name="name"
                                    placeholder="Nhập tên gói thành viên"
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
                                    Loại gói thành viên
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
                                            <Box component="span" sx={{ color: 'text.secondary' }}>Chọn loại gói thành viên</Box>
                                        </MenuItem>
                                        <MenuItem value="PREMIUM">Premium</MenuItem>
                                        <MenuItem value="GOLD">Gold</MenuItem>
                                        <MenuItem value="SILVER">Silver</MenuItem>
                                    </Select>

                                    <FormHelperText>
                                        {formik.touched.type && formik.errors.type}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="price" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    Giá tiền
                                </InputLabel>

                                <TextField
                                    id="price"
                                    name="price"
                                    placeholder="Nhập giá tiền"
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
                                    Thời hạn (tháng)
                                </InputLabel>

                                <TextField
                                    id="duration"
                                    name="duration"
                                    type="number"
                                    placeholder="Nhập thời hạn (tháng)"
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
                                    Các quyền lợi của gói thành viên
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
                                                    <MenuItem value="" disabled sx={{ display: 'none' }}>Chọn loại quyền lợi</MenuItem>
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
                                                            <MenuItem value="" disabled sx={{ display: 'none' }}>Chọn Voucher</MenuItem>
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
                                                            <MenuItem value="" disabled sx={{ display: 'none' }}>Chọn Combo</MenuItem>
                                                            {combos.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                                                        </Select>
                                                    </FormControl>
                                                )}
                                            </Grid>
                                        )}
                                        {benefit.type !== 'VOUCHER' && benefit.type !== 'COMBO' && (
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    placeholder="Mô tả quyền lợi"
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
                                                placeholder="Số lượng"
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
                                    Thêm quyền lợi
                                </Button>
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
