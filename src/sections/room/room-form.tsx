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
    FormHelperText,
    Select,
    MenuItem,
    FormControl
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import AnimateButton from 'components/@extended/AnimateButton';
import TheaterDialog from './theater-dialog';
import { Theater } from 'types/theater';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Room } from 'types/room';

interface RoomFormProps {
    handleNext: () => void;
    setRoom: (room: Room) => void;
    room: Room;
}

const validationSchema = Yup.object({
    name: Yup.string().required('Tên phòng là bắt buộc'),
    type: Yup.string().required('Loại phòng là bắt buộc'),
    theaterId: Yup.number().required('Rạp chiếu là bắt buộc')
});


export default function RoomForm({ handleNext, setRoom, room }: RoomFormProps) {
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });
    const [openTheaterDialog, setOpenTheaterDialog] = useState<boolean>(false);

    const formik = useFormik<Room>({
        initialValues: room,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setRoom(values);
            handleNext();
        }
    });

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 20 }, mr: { xs: 0, lg: 20 }, borderRadius: 2 }}>
                <form onSubmit={formik.handleSubmit} noValidate>
                    <Box mb={4}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                            Thông tin phòng chiếu
                        </Typography>

                        <Grid container spacing={2}>
                            {/* Tên phòng chiếu */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="name" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    Tên phòng chiếu
                                </InputLabel>
                                <TextField
                                    id="name"
                                    name="name"
                                    placeholder="Nhập tên phòng chiếu"
                                    size="small"
                                    fullWidth
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>

                            {/* Loại phòng chiếu */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="type" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    Loại phòng chiếu
                                </InputLabel>
                                <FormControl fullWidth size="small" error={formik.touched.type && Boolean(formik.errors.type)}>
                                    <Select
                                        id="type"
                                        name="type"
                                        value={formik.values.type}
                                        displayEmpty
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <MenuItem value="" disabled sx={{ display: 'none' }}>
                                            <Box component="span" sx={{ color: 'text.secondary' }}>Chọn loại phòng</Box>
                                        </MenuItem>
                                        <MenuItem value="STANDARD">Tiêu chuẩn (2D)</MenuItem>
                                        <MenuItem value="IMAX">IMAX</MenuItem>
                                        <MenuItem value="THREE_D">3D</MenuItem>
                                    </Select>
                                    <FormHelperText>{formik.touched.type && formik.errors.type}</FormHelperText>
                                </FormControl>
                            </Grid>
                            {/* Rạp chiếu */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="theaterId" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    Thuộc rạp chiếu
                                </InputLabel>
                                <Box
                                    onClick={() => setOpenTheaterDialog(true)}
                                    sx={{
                                        border: formik.touched.theaterId && formik.errors.theaterId
                                            ? '1px solid #d32f2f'
                                            : '1px solid rgba(0, 0, 0, 0.23)',
                                        borderRadius: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        px: 1,
                                        py: 0.5,
                                        cursor: 'pointer',
                                        fontSize: 12,
                                        height: 36.3,
                                        userSelect: 'none'
                                    }}
                                >
                                    {formik.values.theaterName ? (
                                        <span style={{ color: 'rgba(0, 0, 0, 0.87)' }}>{formik.values.theaterName}</span>
                                    ) : (
                                        <span style={{ color: 'rgba(0, 0, 0, 0.38)' }}>Chọn rạp chiếu</span>
                                    )}
                                    <ArrowDropDownIcon sx={{ color: 'rgba(0, 0, 0, 0.54)' }} />
                                </Box>
                                {formik.touched.theaterId && formik.errors.theaterId && (
                                    <FormHelperText error>
                                        {formik.errors.theaterId as string}
                                    </FormHelperText>
                                )}
                            </Grid>
                        </Grid>
                    </Box>

                    <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
                        <AnimateButton>
                            <Button variant="contained" type="submit" sx={{ my: 3, ml: 1 }}>
                                Tiếp tục
                            </Button>
                        </AnimateButton>
                    </Stack>
                </form>
            </Paper>

            <TheaterDialog
                open={openTheaterDialog}
                id={formik.values.theaterId!}
                onClose={() => setOpenTheaterDialog(false)}
                onConfirm={(theater: Theater) => {
                    formik.setFieldValue('theaterName', theater.name);
                    formik.setFieldValue('theaterId', theater.id);
                    setOpenTheaterDialog(false);
                }}
            />

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
