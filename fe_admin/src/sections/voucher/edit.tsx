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
    FormControlLabel,
    Checkbox,
    IconButton,
    Tooltip
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Voucher } from 'types/voucher';
import AnimateButton from 'components/@extended/AnimateButton';
import { useParams } from 'react-router';
import { HttpStatusCode } from 'axios';
import { getById, update } from 'api/voucher';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
    code: Yup.string().required('Mã khuyến mãi là bắt buộc').max(20, 'Mã không được quá 20 ký tự'),
    type: Yup.string().required('Loại khuyến mãi là bắt buộc'),
    description: Yup.string().required('Mô tả là bắt buộc'),
    isUnlimited: Yup.boolean(),
    startDate: Yup.date().when('isUnlimited', {
        is: false,
        then: (schema) => schema.required('Ngày bắt đầu là bắt buộc'),
        otherwise: (schema) => schema.nullable()
    }),
    endDate: Yup.date().when('isUnlimited', {
        is: false,
        then: (schema) => schema.required('Ngày kết thúc là bắt buộc').min(Yup.ref('startDate'), 'Ngày kết thúc phải sau ngày bắt đầu'),
        otherwise: (schema) => schema.nullable()
    }),
    discount: Yup.number().required('Mức giảm giá là bắt buộc').min(1, 'Mức giảm giá phải lớn hơn 0').max(100, 'Mức giảm giá không quá 100%'),
    quantity: Yup.number().when('type', {
        is: 'PUBLIC',
        then: (schema) => schema.required('Số lượng là bắt buộc').min(1, 'Số lượng phải lớn hơn 0'),
        otherwise: (schema) => schema.nullable()
    }),
    minOrderValue: Yup.number().when('type', {
        is: 'PUBLIC',
        then: (schema) => schema.required('Giá trị đơn hàng tối thiểu là bắt buộc').min(0, 'Giá trị không được âm'),
        otherwise: (schema) => schema.nullable().min(0, 'Giá trị không được âm')
    })
});

export default function EditVoucher() {
    const { id } = useParams<{ id: string }>();
    const intl = useIntl();
    const navigate = useNavigate();

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    const formatDate = (date?: string) => {
        if (!date) return '';
        return date.split('T')[0];
    };

    const [voucher, setVoucher] = useState<Voucher & { isUnlimited?: boolean }>({
        code: '',
        type: 'PUBLIC',
        description: '',
        startDate: '',
        endDate: '',
        discount: 0,
        quantity: 0,
        minOrderValue: 0,
        status: 'ACTIVE',
        isUnlimited: false
    });

    useEffect(() => {
        const fetchVoucher = async () => {
            try {
                const response = await getById(Number(id));

                if (response.status === HttpStatusCode.Ok) {
                    const data = response.data;
                    data.type = data.type.toUpperCase();
                    data.status = data.status.toUpperCase();
                    setVoucher({
                        ...data,
                        startDate: formatDate(data.startDate),
                        endDate: formatDate(data.endDate),
                        isUnlimited: !data.startDate && !data.endDate
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
        fetchVoucher();
    }, [id]);

    const formik = useFormik<Voucher & { isUnlimited?: boolean }>({
        initialValues: voucher,
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const { isUnlimited, ...rest } = values;
            const submitData = { ...rest };
            if (isUnlimited) {
                submitData.startDate = undefined;
                submitData.endDate = undefined;
            }
            if (submitData.type === 'PERSONAL') {
                submitData.minOrderValue = 0;
                submitData.quantity = 0;
            }

            try {
                const response = await update(Number(id), submitData as Voucher);

                if (response.status === HttpStatusCode.Ok) {
                    navigate('/admin/voucher', {
                        state: { alert: { open: true, severity: 'success', message: 'Cập nhật khuyến mãi thành công' } }
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
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Typography variant="h3">Chỉnh sửa khuyến mãi</Typography>
            </Box>

            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 20 }, mr: { xs: 0, lg: 20 }, borderRadius: 2 }}>
                <form onSubmit={formik.handleSubmit} noValidate>
                    <Box mb={4}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                            Thông tin khuyến mãi
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="code" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    Mã khuyến mãi
                                </InputLabel>
                                <TextField
                                    id="code"
                                    name="code"
                                    placeholder="Ví dụ: GIAM20"
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
                                <InputLabel htmlFor="type" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    Loại khuyến mãi
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
                                            <Box component="span" sx={{ color: 'text.secondary' }}>Chọn loại khuyến mãi</Box>
                                        </MenuItem>
                                        <MenuItem value="PUBLIC">Chung (Công khai)</MenuItem>
                                        <MenuItem value="PERSONAL">Cá nhân (Gói hội viên)</MenuItem>
                                    </Select>
                                    {formik.touched.type && formik.errors.type && (
                                        <FormHelperText>{formik.errors.type}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <InputLabel htmlFor="description" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    Mô tả
                                </InputLabel>
                                <TextField
                                    id="description"
                                    name="description"
                                    placeholder="Nhập mô tả chi tiết về khuyến mãi"
                                    size="small"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formik.values.isUnlimited}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                formik.setFieldValue('isUnlimited', checked);
                                                if (checked) {
                                                    formik.setFieldValue('startDate', '');
                                                    formik.setFieldValue('endDate', '');
                                                }
                                            }}
                                            name="isUnlimited"
                                        />
                                    }
                                    label="Không giới hạn thời gian"
                                />
                            </Grid>

                            {!formik.values.isUnlimited && (
                                <>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <InputLabel htmlFor="startDate" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                            Ngày bắt đầu
                                        </InputLabel>
                                        <TextField
                                            id="startDate"
                                            name="startDate"
                                            type="date"
                                            size="small"
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            value={formik.values.startDate}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                                            helperText={formik.touched.startDate && formik.errors.startDate}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <InputLabel htmlFor="endDate" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                            Ngày kết thúc
                                        </InputLabel>
                                        <TextField
                                            id="endDate"
                                            name="endDate"
                                            type="date"
                                            size="small"
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            value={formik.values.endDate}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                                            helperText={formik.touched.endDate && formik.errors.endDate}
                                        />
                                    </Grid>
                                </>
                            )}

                            <Grid size={{ xs: 12, md: formik.values.type === 'PUBLIC' ? 6 : 12 }}>
                                <InputLabel htmlFor="discount" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    Mức giảm giá (%)
                                </InputLabel>
                                <TextField
                                    id="discount"
                                    name="discount"
                                    type="number"
                                    placeholder="Nhập số tiền giảm"
                                    size="small"
                                    fullWidth
                                    value={formik.values.discount}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.discount && Boolean(formik.errors.discount)}
                                    helperText={formik.touched.discount && formik.errors.discount}
                                />
                            </Grid>

                            {formik.values.type === 'PUBLIC' && (
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <InputLabel htmlFor="quantity" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                        Số lượng
                                    </InputLabel>
                                    <TextField
                                        id="quantity"
                                        name="quantity"
                                        type="number"
                                        placeholder="Nhập số lượng phát hành"
                                        size="small"
                                        fullWidth
                                        value={formik.values.quantity}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                                        helperText={formik.touched.quantity && formik.errors.quantity}
                                    />
                                </Grid>
                            )}

                            {formik.values.type === 'PUBLIC' && (
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <InputLabel
                                        htmlFor="minOrderValue"
                                        required={formik.values.type === 'PUBLIC'}
                                        sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}
                                    >
                                        Giá trị đơn tối thiểu (VNĐ)
                                    </InputLabel>
                                    <TextField
                                        id="minOrderValue"
                                        name="minOrderValue"
                                        type="number"
                                        placeholder="Giá trị đơn hàng tối thiểu"
                                        size="small"
                                        fullWidth
                                        value={formik.values.minOrderValue}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.minOrderValue && Boolean(formik.errors.minOrderValue)}
                                        helperText={formik.touched.minOrderValue && formik.errors.minOrderValue}
                                    />
                                </Grid>
                            )}

                            <Grid size={{ xs: 12, md: formik.values.type === 'PUBLIC' ? 6 : 12 }}>
                                <InputLabel htmlFor="status" sx={{ mb: 1 }}>
                                    Trạng thái
                                </InputLabel>
                                <FormControl fullWidth size="small">
                                    <Select
                                        id="status"
                                        name="status"
                                        value={formik.values.status}
                                        onChange={formik.handleChange}
                                    >
                                        <MenuItem value="ACTIVE">Hoạt động</MenuItem>
                                        <MenuItem value="INACTIVE">Không hoạt động</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>

                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                        <Button variant="outlined" color="secondary" onClick={() => navigate('/admin/voucher')}>
                            Hủy
                        </Button>
                        <AnimateButton>
                            <Button variant="contained" type="submit">
                                Lưu thay đổi
                            </Button>
                        </AnimateButton>
                    </Stack>
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
