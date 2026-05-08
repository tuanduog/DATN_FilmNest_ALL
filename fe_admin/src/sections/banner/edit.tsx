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
    Grid
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Banner } from 'types/banner';
import { CloseCircle } from 'iconsax-reactjs';
import AnimateButton from 'components/@extended/AnimateButton';
import ImageDropZone from 'components/ImageDropZone';
import { useParams } from 'react-router';
import { HttpStatusCode } from 'axios';
import { getById, update } from 'api/banner';
import { uploadImage } from 'api/file';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
    name: Yup.string().required('Tên banner là bắt buộc'),
    image: Yup.mixed().required('Hình ảnh banner là bắt buộc')
});

export default function EditBanner() {
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
        name: ''
    };
    const [banner, setBanner] = useState<Banner>(initialValues);

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const response = await getById(Number(id));

                if (response.status === HttpStatusCode.Ok) {
                    setBanner(response.data);
                    setPreview(response.data.imageUrl || response.data.image || '');
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

    const formik = useFormik<Banner>({
        initialValues: banner,
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            let currentImageUrl = preview;

            if (image && image instanceof File) {
                const formData = new FormData();
                formData.append('file', image);
                formData.append('folder', 'banner');
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
                    navigate('/admin/banner', {
                        state: { alert: { open: true, severity: 'success', message: 'Cập nhật banner thành công' } }
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
        formik.setFieldValue('image', selectedFile);
        return URL.createObjectURL(selectedFile);
    };

    const handleDeleteImage = async () => {
        setImage(null);
        setPreview('');
        formik.setFieldValue('image', null);
    };

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 30 }, mr: { xs: 0, lg: 30 }, borderRadius: 2 }}>
                <form onSubmit={formik.handleSubmit} noValidate>
                    <Box mb={4}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                            Thông tin banner
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <Box sx={{ width: '100%', mb: 2 }}>
                                    <InputLabel sx={{ mb: 1 }}>Hình ảnh banner</InputLabel>
                                    {!preview ? (
                                        <ImageDropZone
                                            value={preview ?? ''}
                                            onGetFile={(files) => handleGetFileUrl(files)}
                                            onChange={(url) => {
                                                setPreview(url);
                                            }}
                                            width="100%"
                                            height="250px"
                                        />
                                    ) : (
                                        <Box sx={{ position: 'relative', width: '100%' }}>
                                            <Box>
                                                <img
                                                    alt="image"
                                                    src={preview}
                                                    style={{ width: '100%', height: '250px', display: 'block', borderRadius: '5px', objectFit: 'cover' }}
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
                                    Tên banner
                                </InputLabel>

                                <TextField
                                    id="name"
                                    name="name"
                                    placeholder="Nhập tên banner"
                                    size="small"
                                    fullWidth
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
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
