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
    FormControl,
    Select,
    MenuItem,
    FormHelperText,
    Grid
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { Membership } from 'types/membership';
import { CloseCircle } from 'iconsax-reactjs';
import AnimateButton from 'components/@extended/AnimateButton';
import ImageDropZone from 'components/ImageDropZone';

interface MembershipFormProps {
    handleNext: () => void;
    setMembership: (membership: Membership) => void;
    membership: Membership;
}

const validationSchema = Yup.object({
    name: Yup.string().required('Tên gói thành viên là bắt buộc'),
    type: Yup.string().required('Loại gói thành viên là bắt buộc'),
    price: Yup.number().required('Giá tiền là bắt buộc').min(1, 'Giá tiền phải lớn hơn 0'),
    discount: Yup.number().required('Tỷ lệ giảm giá là bắt buộc').min(1, 'Tỷ lệ giảm giá phải lớn hơn 0').max(100, 'Tỷ lệ giảm giá phải nhỏ hơn hoặc bằng 100'),
    duration: Yup.number().required('Thời hạn là bắt buộc').min(1, 'Thời hạn phải lớn hơn 0'),
    description: Yup.string().required('Mô tả là bắt buộc')
});

export default function MembershipForm({ handleNext, setMembership, membership }: MembershipFormProps) {
    const [image, setImage] = useState<File | null>(membership.image!);
    const [preview, setPreview] = useState<string | null>('');

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    const formik = useFormik<Membership>({
        initialValues: membership,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setMembership({ ...values, image: image });
            handleNext();
        }
    });

    const handleGetFileUrl = (e: any) => {
        const selectedFile = e.target.files[0];
        setImage(selectedFile);
        return URL.createObjectURL(selectedFile);
    };

    const handleDeleteImage = async () => {
        setImage(null);
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
                                    <InputLabel sx={{ mb: 1 }}>Hình ảnh combo</InputLabel>
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

                            <Grid size={12}>
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

                            <Grid size={12}>
                                <InputLabel htmlFor="discount" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    Tỷ lệ giảm giá (%)
                                </InputLabel>

                                <TextField
                                    id="discount"
                                    name="discount"
                                    placeholder="Nhập tỷ lệ giảm giá (%)"
                                    size="small"
                                    type='number'
                                    fullWidth
                                    value={formik.values.discount}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.discount && Boolean(formik.errors.discount)}
                                    helperText={formik.touched.discount && formik.errors.discount}
                                />
                            </Grid>

                            <Grid size={12}>
                                <InputLabel htmlFor="duration" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    Thời hạn (tháng)
                                </InputLabel>

                                <TextField
                                    id="duration"
                                    name="duration"
                                    placeholder="Nhập thời hạn (tháng)"
                                    size="small"
                                    type='number'
                                    fullWidth
                                    value={formik.values.duration}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.duration && Boolean(formik.errors.duration)}
                                    helperText={formik.touched.duration && formik.errors.duration}
                                />
                            </Grid>

                            <Grid size={12}>
                                <InputLabel htmlFor="description" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    Mô tả
                                </InputLabel>

                                <TextField
                                    id="description"
                                    name="description"
                                    placeholder="Nhập mô tả"
                                    size="small"
                                    fullWidth
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
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
