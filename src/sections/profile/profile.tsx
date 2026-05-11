import { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    Button,
    Avatar,
    Tabs,
    Tab,
    Divider,
    Alert,
    Snackbar,
    CircularProgress,
    InputLabel,
    FormHelperText,
    FormControl,
    Select,
    MenuItem,
    Stack,
    Chip,
    InputAdornment,
    IconButton
} from '@mui/material';
import {
    Person as PersonIcon,
    Lock as LockIcon,
    Save as SaveIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Cake as CakeIcon,
    Public as PublicIcon,
    Wc as WcIcon,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FormattedMessage, useIntl } from 'react-intl';
import { getProfile, updateProfile, changePassword } from 'api/user';
import { User } from 'types/user';
import { HttpStatusCode } from 'axios';
import formatDate from 'utils/formatDateTime';

// ─── helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string) {
    if (!name) return '?';
    return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

function getRoleColor(role?: string) {
    switch ((role || '').toUpperCase()) {
        case 'ADMIN': return { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', label: 'Admin' };
        case 'MANAGER': return { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', label: 'Manager' };
        case 'STAFF': return { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', label: 'Staff' };
        default: return { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', label: role || 'User' };
    }
}

// ─── TabPanel ────────────────────────────────────────────────────────────────

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
    return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProfilePage() {
    const intl = useIntl();
    const [tab, setTab] = useState(0);
    const [profile, setProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => {
        const fetch = async () => {
            const res = await getProfile();
            if (res?.status === HttpStatusCode.Ok || res?.data) {
                res.data.gender = res.data.gender.toUpperCase();
                setProfile(res.data);
            }
            setLoading(false);
        };
        fetch();
    }, []);

    // ── Info form ─────────────────────────────────────────────────────────────

    const infoFormik = useFormik<User>({
        enableReinitialize: true,
        initialValues: {
            username: profile?.username || '',
            email: profile?.email || '',
            fullname: profile?.fullname || '',
            phone: profile?.phone || '',
            gender: profile?.gender || '',
            dob: profile?.dob || '',
            nationality: profile?.nationality || '',
            role: profile?.role || '',
            status: profile?.status || ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email(intl.formatMessage({ id: 'invalid-email' })).required(intl.formatMessage({ id: 'required-field' })),
            fullname: Yup.string().required(intl.formatMessage({ id: 'required-field' })),
            phone: Yup.string().matches(/^[0-9]{9,11}$/, intl.formatMessage({ id: 'invalid-phone' })).required(intl.formatMessage({ id: 'required-field' }))
        }),
        onSubmit: async (values) => {
            const res = await updateProfile(values);
            if (res?.status === HttpStatusCode.Ok || res?.id) {
                setSnack({ open: true, message: intl.formatMessage({ id: 'update-profile-success' }), severity: 'success' });
                setProfile(values);
            } else {
                setSnack({ open: true, message: res?.message || intl.formatMessage({ id: 'error-occurred' }), severity: 'error' });
            }
        }
    });

    // ── Password form ─────────────────────────────────────────────────────────

    const pwFormik = useFormik({
        initialValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
        validationSchema: Yup.object({
            oldPassword: Yup.string().required(intl.formatMessage({ id: 'required-field' })),
            newPassword: Yup.string().min(6, intl.formatMessage({ id: 'min-password' })).required(intl.formatMessage({ id: 'required-field' })),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword')], intl.formatMessage({ id: 'passwords-not-match' }))
                .required(intl.formatMessage({ id: 'required-field' }))
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const res = await changePassword(values.oldPassword, values.newPassword);
                if (res?.status === HttpStatusCode.Ok) {
                    setSnack({ open: true, message: intl.formatMessage({ id: 'change-password-success' }), severity: 'success' });
                    resetForm();
                }
            } catch (error: any) {
                const httpStatus: number = error?.response?.status ?? error?.status ?? 0;
                if (httpStatus === HttpStatusCode.BadRequest) {
                    setSnack({ open: true, message: intl.formatMessage({ id: 'old-password-not-match' }), severity: 'error' });
                } else {
                    setSnack({ open: true, message: intl.formatMessage({ id: 'error-occurred' }), severity: 'error' });
                }
            }
        }
    });

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress size={48} />
            </Box>
        );
    }

    const roleStyle = getRoleColor(profile?.role);

    return (
        <Box>
            {/* ── Page header ────────────────────────────────────────────────── */}
            <Box mb={4}>
                <Typography variant="h3" fontWeight={700} gutterBottom>
                    <FormattedMessage id="profile-settings" />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <FormattedMessage id="personal-info" />
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* ── Avatar card ──────────────────────────────────────────────── */}
                <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 3,
                            overflow: 'hidden',
                            position: 'sticky',
                            top: 80
                        }}
                    >
                        {/* Gradient banner */}
                        <Box
                            sx={{
                                height: 100,
                                background: roleStyle.bg,
                                position: 'relative'
                            }}
                        />

                        <Box sx={{ px: 3, pb: 3 }}>
                            <Box display="flex" justifyContent="center" mt="-44px" mb={2}>
                                <Avatar
                                    sx={{
                                        width: 88,
                                        height: 88,
                                        fontSize: '2rem',
                                        fontWeight: 700,
                                        background: roleStyle.bg,
                                        border: '4px solid white',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                                    }}
                                >
                                    {getInitials(profile?.fullname || profile?.username || '?')}
                                </Avatar>
                            </Box>

                            <Box textAlign="center">
                                <Typography variant="h5" fontWeight={700} gutterBottom>
                                    {profile?.fullname || profile?.username}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    @{profile?.username}
                                </Typography>
                                <Chip
                                    label={roleStyle.label}
                                    size="small"
                                    sx={{
                                        background: roleStyle.bg,
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        mt: 0.5
                                    }}
                                />
                            </Box>

                            <Divider sx={{ my: 2.5 }} />

                            <Stack spacing={1.5}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                                        {profile?.email || '—'}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {profile?.phone || '—'}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <PublicIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {profile?.nationality || '—'}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <CakeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {profile?.dob ? formatDate(profile?.dob) : '—'}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Box>
                    </Paper>
                </Grid>

                {/* ── Right panel ──────────────────────────────────────────────── */}
                <Grid size={{ xs: 12, md: 8, lg: 9 }}>
                    <Paper
                        elevation={0}
                        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}
                    >
                        {/* Tabs */}
                        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 3 }}>
                            <Tabs
                                value={tab}
                                onChange={(_, v) => setTab(v)}
                                sx={{
                                    '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', minHeight: 56 },
                                    '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' }
                                }}
                            >
                                <Tab
                                    icon={<PersonIcon sx={{ fontSize: 18 }} />}
                                    iconPosition="start"
                                    label={<FormattedMessage id="personal-info" />}
                                />
                                <Tab
                                    icon={<LockIcon sx={{ fontSize: 18 }} />}
                                    iconPosition="start"
                                    label={<FormattedMessage id="change-password" />}
                                />
                            </Tabs>
                        </Box>

                        <Box sx={{ p: 3 }}>
                            {/* ── Tab 0: Personal Info ─────────────────────────────── */}
                            <TabPanel value={tab} index={0}>
                                <form onSubmit={infoFormik.handleSubmit} noValidate>
                                    <Grid container spacing={2.5}>
                                        {/* Username (read-only) */}
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <InputLabel sx={{ mb: 0.75, fontWeight: 600, fontSize: '0.875rem' }}>
                                                <FormattedMessage id="username" />
                                            </InputLabel>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                value={infoFormik.values.username}
                                                disabled
                                                sx={{
                                                    '& .MuiInputBase-input.Mui-disabled': {
                                                        bgcolor: 'action.disabledBackground',
                                                        borderRadius: 1
                                                    }
                                                }}
                                            />
                                        </Grid>

                                        {/* Email */}
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <InputLabel required sx={{ mb: 0.75, fontWeight: 600, fontSize: '0.875rem', '& .MuiInputLabel-asterisk': { color: 'error.main' } }}>
                                                <FormattedMessage id="email" />
                                            </InputLabel>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                name="email"
                                                value={infoFormik.values.email}
                                                onChange={infoFormik.handleChange}
                                                onBlur={infoFormik.handleBlur}
                                                error={infoFormik.touched.email && Boolean(infoFormik.errors.email)}
                                                helperText={infoFormik.touched.email && infoFormik.errors.email}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        </Grid>

                                        {/* Full name */}
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <InputLabel required sx={{ mb: 0.75, fontWeight: 600, fontSize: '0.875rem', '& .MuiInputLabel-asterisk': { color: 'error.main' } }}>
                                                <FormattedMessage id="fullname" />
                                            </InputLabel>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                name="fullname"
                                                value={infoFormik.values.fullname}
                                                onChange={infoFormik.handleChange}
                                                onBlur={infoFormik.handleBlur}
                                                error={infoFormik.touched.fullname && Boolean(infoFormik.errors.fullname)}
                                                helperText={infoFormik.touched.fullname && infoFormik.errors.fullname}
                                            />
                                        </Grid>

                                        {/* Phone */}
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <InputLabel required sx={{ mb: 0.75, fontWeight: 600, fontSize: '0.875rem', '& .MuiInputLabel-asterisk': { color: 'error.main' } }}>
                                                <FormattedMessage id="phone" />
                                            </InputLabel>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                name="phone"
                                                value={infoFormik.values.phone}
                                                onChange={infoFormik.handleChange}
                                                onBlur={infoFormik.handleBlur}
                                                error={infoFormik.touched.phone && Boolean(infoFormik.errors.phone)}
                                                helperText={infoFormik.touched.phone && infoFormik.errors.phone}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        </Grid>

                                        {/* Gender */}
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <InputLabel sx={{ mb: 0.75, fontWeight: 600, fontSize: '0.875rem' }}>
                                                <FormattedMessage id="gender" />
                                            </InputLabel>
                                            <FormControl fullWidth size="small">
                                                <Select
                                                    name="gender"
                                                    value={infoFormik.values.gender}
                                                    onChange={infoFormik.handleChange}
                                                    displayEmpty
                                                >
                                                    <MenuItem value=""><em style={{ color: '#aaa' }}>—</em></MenuItem>
                                                    <MenuItem value="MALE"><FormattedMessage id="male" /></MenuItem>
                                                    <MenuItem value="FEMALE"><FormattedMessage id="female" /></MenuItem>
                                                    <MenuItem value="OTHER"><FormattedMessage id="other-gender" /></MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* Date of birth */}
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <InputLabel sx={{ mb: 0.75, fontWeight: 600, fontSize: '0.875rem' }}>
                                                <FormattedMessage id="dob" />
                                            </InputLabel>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                type="date"
                                                name="dob"
                                                value={infoFormik.values.dob}
                                                onChange={infoFormik.handleChange}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <CakeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        </Grid>

                                        {/* Nationality */}
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <InputLabel sx={{ mb: 0.75, fontWeight: 600, fontSize: '0.875rem' }}>
                                                <FormattedMessage id="nationality" />
                                            </InputLabel>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                name="nationality"
                                                value={infoFormik.values.nationality}
                                                onChange={infoFormik.handleChange}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PublicIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        </Grid>

                                        {/* Submit */}
                                        <Grid size={{ xs: 12 }}>
                                            <Divider sx={{ my: 1 }} />
                                            <Box display="flex" justifyContent="flex-end">
                                                <Button
                                                    variant="contained"
                                                    type="submit"
                                                    startIcon={infoFormik.isSubmitting ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                                                    disabled={infoFormik.isSubmitting}
                                                    sx={{
                                                        px: 4,
                                                        py: 1.25,
                                                        borderRadius: 2,
                                                        fontWeight: 600,
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        '&:hover': { background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4293 100%)' }
                                                    }}
                                                >
                                                    <FormattedMessage id="save-changes" />
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </form>
                            </TabPanel>

                            {/* ── Tab 1: Change Password ───────────────────────────── */}
                            <TabPanel value={tab} index={1}>
                                <Box maxWidth={500}>
                                    <Typography variant="body2" color="text.secondary" mb={3}>
                                        Cập nhật mật khẩu để bảo vệ tài khoản của bạn.
                                    </Typography>

                                    <form onSubmit={pwFormik.handleSubmit} noValidate>
                                        <Stack spacing={2.5}>
                                            {/* Old password */}
                                            <Box>
                                                <InputLabel required sx={{ mb: 0.75, fontWeight: 600, fontSize: '0.875rem', '& .MuiInputLabel-asterisk': { color: 'error.main' } }}>
                                                    <FormattedMessage id="old-password" />
                                                </InputLabel>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    name="oldPassword"
                                                    type={showOld ? 'text' : 'password'}
                                                    value={pwFormik.values.oldPassword}
                                                    onChange={pwFormik.handleChange}
                                                    onBlur={pwFormik.handleBlur}
                                                    error={pwFormik.touched.oldPassword && Boolean(pwFormik.errors.oldPassword)}
                                                    helperText={pwFormik.touched.oldPassword && pwFormik.errors.oldPassword}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton onClick={() => setShowOld(!showOld)} edge="end" size="small">
                                                                    {showOld ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </Box>

                                            {/* New password */}
                                            <Box>
                                                <InputLabel required sx={{ mb: 0.75, fontWeight: 600, fontSize: '0.875rem', '& .MuiInputLabel-asterisk': { color: 'error.main' } }}>
                                                    <FormattedMessage id="new-password" />
                                                </InputLabel>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    name="newPassword"
                                                    type={showNew ? 'text' : 'password'}
                                                    value={pwFormik.values.newPassword}
                                                    onChange={pwFormik.handleChange}
                                                    onBlur={pwFormik.handleBlur}
                                                    error={pwFormik.touched.newPassword && Boolean(pwFormik.errors.newPassword)}
                                                    helperText={pwFormik.touched.newPassword && pwFormik.errors.newPassword}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton onClick={() => setShowNew(!showNew)} edge="end" size="small">
                                                                    {showNew ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </Box>

                                            {/* Confirm password */}
                                            <Box>
                                                <InputLabel required sx={{ mb: 0.75, fontWeight: 600, fontSize: '0.875rem', '& .MuiInputLabel-asterisk': { color: 'error.main' } }}>
                                                    <FormattedMessage id="confirm-new-password" />
                                                </InputLabel>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    name="confirmPassword"
                                                    type={showConfirm ? 'text' : 'password'}
                                                    value={pwFormik.values.confirmPassword}
                                                    onChange={pwFormik.handleChange}
                                                    onBlur={pwFormik.handleBlur}
                                                    error={pwFormik.touched.confirmPassword && Boolean(pwFormik.errors.confirmPassword)}
                                                    helperText={pwFormik.touched.confirmPassword && pwFormik.errors.confirmPassword}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end" size="small">
                                                                    {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </Box>

                                            <Divider />

                                            <Box display="flex" justifyContent="flex-end">
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    type="submit"
                                                    startIcon={pwFormik.isSubmitting ? <CircularProgress size={16} color="inherit" /> : <LockIcon />}
                                                    disabled={pwFormik.isSubmitting}
                                                    sx={{ px: 4, py: 1.25, borderRadius: 2, fontWeight: 600 }}
                                                >
                                                    <FormattedMessage id="change-password" />
                                                </Button>
                                            </Box>
                                        </Stack>
                                    </form>
                                </Box>
                            </TabPanel>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* ── Snackbar ──────────────────────────────────────────────────────── */}
            <Snackbar
                open={snack.open}
                autoHideDuration={3500}
                onClose={() => setSnack({ ...snack, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    severity={snack.severity}
                    variant="filled"
                    onClose={() => setSnack({ ...snack, open: false })}
                    sx={{ width: '100%', borderRadius: 2 }}
                >
                    {snack.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
