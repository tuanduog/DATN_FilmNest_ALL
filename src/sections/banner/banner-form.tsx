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
    FormHelperText
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { Banner } from 'types/banner';
import { CloseCircle } from 'iconsax-reactjs';
import AnimateButton from 'components/@extended/AnimateButton';
import ImageDropZone from 'components/ImageDropZone';

interface BannerFormProps {
    handleNext: () => void;
    setBanner: (banner: Banner) => void;
    banner: Banner;
}

const validationSchema = Yup.object({
    name: Yup.string().required('Tên banner là bắt buộc'),
    image: Yup.mixed().required('Hình ảnh banner là bắt buộc')
});

export default function BannerForm({ handleNext, setBanner, banner }: BannerFormProps) {
    const [image, setImage] = useState<File | null>(banner.image!);
    const [preview, setPreview] = useState<string | null>(banner.imageUrl || (banner.image ? URL.createObjectURL(banner.image as File) : ''));

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    const formik = useFormik<Banner>({
        initialValues: banner,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setBanner(values);
            handleNext();
        }
    });

    const handleGetFileUrl = (e: any) => {
        const selectedFile = e.target.files[0];
        setImage(selectedFile);
        formik.setFieldValue('image', selectedFile);
        formik.setFieldTouched('image', true);
        return URL.createObjectURL(selectedFile);
    };

    const handleDeleteImage = async () => {
        setImage(null);
        setPreview('');
        formik.setFieldValue('image', null);
        formik.setFieldTouched('image', true);
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
                                    {(formik.touched.image || formik.submitCount > 0) && formik.errors.image && (
                                        <FormHelperText error sx={{ mt: 1 }}>
                                            {formik.errors.image as string}
                                        </FormHelperText>
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
                                    Tiếp tục
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
