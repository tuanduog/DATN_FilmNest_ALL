import {
    Box,
    InputLabel,
    TextField,
    Typography,
    Paper,
    Button,
    Stack,
    Grid,
    FormHelperText,
    Select,
    MenuItem,
    FormControl,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AnimateButton from 'components/@extended/AnimateButton';
import { Voucher } from 'types/voucher';
import { useIntl } from 'react-intl';

interface VoucherFormProps {
    handleNext: (values: Voucher) => void;
    setVoucher: (voucher: Voucher) => void;
    voucher: Voucher;
}

export default function VoucherForm({ handleNext, setVoucher, voucher }: VoucherFormProps) {
    const intl = useIntl();

    const validationSchema = Yup.object({
        code: Yup.string().required(intl.formatMessage({ id: 'voucher-code-required' })).max(20, intl.formatMessage({ id: 'voucher-code-max' })),
        type: Yup.string().required(intl.formatMessage({ id: 'voucher-type-required' })),
        description: Yup.string().required(intl.formatMessage({ id: 'description-required' })),
        isUnlimited: Yup.boolean(),
        startDate: Yup.date().when('isUnlimited', {
            is: false,
            then: (schema) => schema.required(intl.formatMessage({ id: 'start-date-required' })),
            otherwise: (schema) => schema.nullable()
        }),
        endDate: Yup.date().when('isUnlimited', {
            is: false,
            then: (schema) => schema.required(intl.formatMessage({ id: 'end-date-required' })).min(Yup.ref('startDate'), intl.formatMessage({ id: 'end-date-min' })),
            otherwise: (schema) => schema.nullable()
        }),
        discount: Yup.number().required(intl.formatMessage({ id: 'discount-required' })).min(1, intl.formatMessage({ id: 'discount-min' })),
        quantity: Yup.number().when('type', {
            is: 'PUBLIC',
            then: (schema) => schema.required(intl.formatMessage({ id: 'quantity-required' })).min(1, intl.formatMessage({ id: 'quantity-min' })),
            otherwise: (schema) => schema.nullable()
        }),
        minOrderValue: Yup.number().when('type', {
            is: 'PUBLIC',
            then: (schema) => schema.required(intl.formatMessage({ id: 'min-order-value-required' })).min(0, intl.formatMessage({ id: 'min-order-value-min' })),
            otherwise: (schema) => schema.nullable().min(0, intl.formatMessage({ id: 'min-order-value-min' }))
        })
    });
    const formik = useFormik<Voucher & { isUnlimited?: boolean }>({
        initialValues: {
            ...voucher,
            isUnlimited: !voucher.startDate && !voucher.endDate && voucher.id !== 0
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const { isUnlimited, ...rest } = values;
            if (isUnlimited) {
                rest.startDate = undefined;
                rest.endDate = undefined;
            }
            if (rest.type === 'PERSONAL') {
                rest.minOrderValue = 0;
                rest.quantity = 0;
            }
            setVoucher(rest);
            handleNext(rest);
        }
    });

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 20 }, mr: { xs: 0, lg: 20 }, borderRadius: 2 }}>
                <form onSubmit={formik.handleSubmit} noValidate>
                    <Box mb={4}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                            {intl.formatMessage({ id: 'voucher-info' })}
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="code" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'voucher-code' })}
                                </InputLabel>
                                <TextField
                                    id="code"
                                    name="code"
                                    placeholder={intl.formatMessage({ id: 'voucher-code-example' })}
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
                                    {intl.formatMessage({ id: 'voucher-type' })}
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
                                                {intl.formatMessage({ id: 'select-voucher-type' })}
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value="PUBLIC">{intl.formatMessage({ id: 'public-voucher' })}</MenuItem>
                                        <MenuItem value="PERSONAL">{intl.formatMessage({ id: 'personal-voucher' })}</MenuItem>
                                    </Select>
                                    {formik.touched.type && formik.errors.type && (
                                        <FormHelperText>{formik.errors.type}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <InputLabel htmlFor="description" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    {intl.formatMessage({ id: 'description' })}
                                </InputLabel>
                                <TextField
                                    id="description"
                                    name="description"
                                    placeholder={intl.formatMessage({ id: 'voucher-description-placeholder' })}
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

                            {formik.values.type && (
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
                                        label={intl.formatMessage({ id: 'unlimited-time' })}
                                    />
                                </Grid>
                            )}

                            {formik.values.type && !formik.values.isUnlimited && (
                                <>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <InputLabel htmlFor="startDate" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                            {intl.formatMessage({ id: 'start-date' })}
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
                                            {intl.formatMessage({ id: 'end-date' })}
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
                                    {intl.formatMessage({ id: 'discount-value' })} (%)
                                </InputLabel>
                                <TextField
                                    id="discount"
                                    name="discount"
                                    type="number"
                                    placeholder={intl.formatMessage({ id: 'discount-value-placeholder' })}
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
                                        {intl.formatMessage({ id: 'quantity' })}
                                    </InputLabel>
                                    <TextField
                                        id="quantity"
                                        name="quantity"
                                        type="number"
                                        placeholder={intl.formatMessage({ id: 'quantity-placeholder' })}
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
                                <Grid size={{ xs: 12 }}>
                                    <InputLabel
                                        htmlFor="minOrderValue"
                                        required={formik.values.type === 'PUBLIC'}
                                        sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}
                                    >
                                        {intl.formatMessage({ id: 'min-order-value-label' })}
                                    </InputLabel>
                                    <TextField
                                        id="minOrderValue"
                                        name="minOrderValue"
                                        type="number"
                                        placeholder={intl.formatMessage({ id: 'min-order-value-placeholder' })}
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
                        </Grid>
                    </Box>

                    <Stack direction="row" justifyContent="flex-end">
                        <AnimateButton>
                            <Button variant="contained" type="submit" sx={{ my: 3 }}>
                                {intl.formatMessage({ id: 'continue' })}
                            </Button>
                        </AnimateButton>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}
