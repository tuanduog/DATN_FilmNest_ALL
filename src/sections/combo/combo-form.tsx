import {
    Box,
    InputLabel,
    TextField,
    Typography,
    Paper,
    Snackbar,
    Alert,
    FormControl,
    Select,
    MenuItem,
    Button,
    IconButton,
    Stack,
    Grid
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { Combo } from 'types/combo';
import { CloseCircle } from 'iconsax-reactjs';
import AnimateButton from 'components/@extended/AnimateButton';
import ImageDropZone from 'components/ImageDropZone';

interface ComboFormProps {
    handleNext: () => void;
    setCombo: (combo: Combo & { file?: File | null, avatar?: string }) => void;
    combo: Combo & { file?: File | null, avatar?: string };
}

const validationSchema = Yup.object({
    name: Yup.string().required('Tên combo là bắt buộc'),
    price: Yup.number().required('Giá tiền là bắt buộc').min(0, 'Giá tiền không được âm'),
    description: Yup.string().required('Mô tả là bắt buộc'),
    status: Yup.string().required('Trạng thái là bắt buộc')
});

export default function ComboForm({ handleNext, setCombo, combo }: ComboFormProps) {
    const [avatar, setAvatar] = useState<string | undefined>(combo.avatar);
    const [file, setFile] = useState<File | null | undefined>(combo.file);

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    const formik = useFormik<Combo>({
        initialValues: combo,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setCombo({
                ...values,
                avatar: avatar,
                file: file
            });
            handleNext();
        }
    });

    const handleGetFileUrl = (e: any) => {
        const selectedFile = e.target.files[0];
        setAvatar(URL.createObjectURL(selectedFile));
        setFile(selectedFile);

        return URL.createObjectURL(selectedFile);
    };

    const handleDeleteAvatar = async () => {
        setAvatar('');
        setFile(null);
    };

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 30 }, mr: { xs: 0, lg: 30 }, borderRadius: 2 }}>
                <form onSubmit={formik.handleSubmit} noValidate>
                    <Box mb={4}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                            Thông tin combo
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid size={12}>
                                <Box sx={{ width: '100%', mb: 2 }}>
                                    <InputLabel sx={{ mb: 1 }}>Hình ảnh combo</InputLabel>
                                    {!avatar ? (
                                        <ImageDropZone
                                            value={avatar ?? ''}
                                            onGetFile={(files) => handleGetFileUrl(files)}
                                            onChange={(url) => {
                                                setAvatar(url);
                                            }}
                                            width="150px"
                                            height="150px"
                                        />
                                    ) : (
                                        <Box sx={{ position: 'relative', width: '150px' }}>
                                            <Box>
                                                <img
                                                    alt="image"
                                                    src={avatar}
                                                    style={{ width: '150px', height: '150px', display: 'block', borderRadius: '5px', objectFit: 'cover' }}
                                                />
                                            </Box>

                                            <IconButton
                                                onClick={handleDeleteAvatar}
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
                                    Tên combo
                                </InputLabel>

                                <TextField
                                    id="name"
                                    name="name"
                                    placeholder="Nhập tên combo"
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
                                <InputLabel htmlFor="price" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    Giá tiền (VND)
                                </InputLabel>

                                <TextField
                                    id="price"
                                    name="price"
                                    type="number"
                                    placeholder="Nhập giá tiền"
                                    size="small"
                                    fullWidth
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.price && Boolean(formik.errors.price)}
                                    helperText={formik.touched.price && formik.errors.price}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 12 }}>
                                <InputLabel htmlFor="status" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    Trạng thái
                                </InputLabel>

                                <FormControl fullWidth size="small" error={formik.touched.status && Boolean(formik.errors.status)}>
                                    <Select
                                        id="status"
                                        name="status"
                                        value={formik.values.status}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <MenuItem value="active">Hoạt động</MenuItem>
                                        <MenuItem value="inactive">Không hoạt động</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={12}>
                                <InputLabel htmlFor="description" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    Mô tả
                                </InputLabel>

                                <TextField
                                    id="description"
                                    name="description"
                                    placeholder="Nhập mô tả combo"
                                    size="small"
                                    multiline
                                    rows={4}
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
