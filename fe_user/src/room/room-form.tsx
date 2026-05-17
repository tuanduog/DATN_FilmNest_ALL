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
import { useState, useEffect } from 'react';
import AnimateButton from 'components/@extended/AnimateButton';
import TheaterDialog from './theater-dialog';
import { Theater } from 'types/theater';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Room } from 'types/room';
import { useIntl, FormattedMessage } from 'react-intl';
import useAuth from 'hooks/useAuth';
import { getById as getTheaterById } from 'api/theater';

interface RoomFormProps {
    handleNext: () => void;
    setRoom: (room: Room) => void;
    room: Room;
}

export default function RoomForm({ handleNext, setRoom, room }: RoomFormProps) {
    const intl = useIntl();
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });
    const [openTheaterDialog, setOpenTheaterDialog] = useState<boolean>(false);
    const { user } = useAuth();
    const isManager = user?.role?.toUpperCase() === 'MANAGER';

    const validationSchema = Yup.object({
        name: Yup.string().required(intl.formatMessage({ id: 'room-name-required' })),
        type: Yup.string().required(intl.formatMessage({ id: 'room-type-required' })),
        theaterId: Yup.number().required(intl.formatMessage({ id: 'theater-required' }))
    });

    const formik = useFormik<Room>({
        initialValues: room,
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setRoom(values);
            handleNext();
        }
    });

    useEffect(() => {
        const fetchDefaultTheater = async () => {
            if (isManager && user?.theaterId && !formik.values.theaterId) {
                const response = await getTheaterById(Number(user.theaterId));
                if (response.status === 200) {
                    formik.setFieldValue('theaterId', response.data.id);
                    formik.setFieldValue('theaterName', response.data.name);
                }
            }
        };
        fetchDefaultTheater();
    }, [isManager, user?.theaterId, formik]);

    if (Object.keys(formik.errors).length > 0 && formik.submitCount > 0) {
        console.log('Validation Errors:', formik.errors);
    }

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ml: { xs: 0, lg: 20 }, mr: { xs: 0, lg: 20 }, borderRadius: 2 }}>
                <form onSubmit={formik.handleSubmit} noValidate>
                    <Box mb={4}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                            <FormattedMessage id="room-info" />
                        </Typography>

                        <Grid container spacing={2}>
                            {/* Tên phòng chiếu */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="name" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    <FormattedMessage id="room-name" />
                                </InputLabel>
                                <TextField
                                    id="name"
                                    name="name"
                                    placeholder={intl.formatMessage({ id: 'room-name-placeholder' })}
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
                                    <FormattedMessage id="room-type" />
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
                                            <Box component="span" sx={{ color: 'text.secondary' }}><FormattedMessage id="select-room-type" /></Box>
                                        </MenuItem>
                                        <MenuItem value="STANDARD"><FormattedMessage id="standard-2d" /></MenuItem>
                                        <MenuItem value="IMAX"><FormattedMessage id="IMAX" /></MenuItem>
                                        <MenuItem value="THREE_D"><FormattedMessage id="3D" /></MenuItem>
                                    </Select>
                                    <FormHelperText>{formik.touched.type && formik.errors.type}</FormHelperText>
                                </FormControl>
                            </Grid>
                            {/* Rạp chiếu */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <InputLabel htmlFor="theaterId" required sx={{ '& .MuiInputLabel-asterisk': { color: 'error.main' }, mb: 1 }}>
                                    <FormattedMessage id="belong-to-theater" />
                                </InputLabel>
                                <Box
                                    onClick={() => !isManager && setOpenTheaterDialog(true)}
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
                                        cursor: isManager ? 'default' : 'pointer',
                                        fontSize: 12,
                                        height: 36.3,
                                        userSelect: 'none',
                                        bgcolor: isManager ? 'action.hover' : 'inherit',
                                        opacity: isManager ? 0.8 : 1
                                    }}
                                >
                                    {formik.values.theaterName ? (
                                        <span style={{ color: 'rgba(0, 0, 0, 0.87)' }}>{formik.values.theaterName}</span>
                                    ) : (
                                        <span style={{ color: 'rgba(0, 0, 0, 0.38)' }}><FormattedMessage id="select-theater" /></span>
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
                                <FormattedMessage id="continue" />
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
                open={alert.open || (Object.keys(formik.errors).length > 0 && formik.submitCount > 0)}
                autoHideDuration={3000}
                onClose={() => setAlert({ ...alert, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setAlert({ ...alert, open: false })}
                    severity={Object.keys(formik.errors).length > 0 ? "error" : alert.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {Object.keys(formik.errors).length > 0 ? <FormattedMessage id="check-info-again" /> : alert.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
