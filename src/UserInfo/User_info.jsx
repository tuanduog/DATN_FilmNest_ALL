import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import styles from '../UserInfo/User_info.module.css';
import { Modal, Button, Dropdown } from "react-bootstrap";
import { UserCircle, Key, LogOut } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function UserInfo() {
    const { t } = useTranslation();
    const user = JSON.parse(sessionStorage.getItem('user'));
    const [userName, setUserName] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [nationality, setNationality] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showDoiMK, setShowDoiMK] = useState(false);
    const [textAlert, setTextAlert] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [showOk, setShowOk] = useState(false);
    const [textOk, setTextOk] = useState("");

    const navigate = useNavigate();
    const handleClose = () => {
        setShowDoiMK(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
    }

    const handleOpen = () => {
        setShowDoiMK(true);
        setShowOk(false);
    }

    const [countries, setCountries] = useState([]);

    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all?fields=name,flags,cca2')
            .then((res) => res.json())
            .then((data) => {
                const countryData = data.map((country) => ({
                    code: country.cca2,
                    label: country.name.common,
                    flag: country.flags?.png
                }));
                setCountries(countryData.sort((a, b) => a.label.localeCompare(b.label)));
            })
            .catch((error) => console.error('Error fetching countries:', error));
    }, []);

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.warning(t('fillAllPasswordFields') || "Vui lòng điền đầy đủ thông tin đổi mật khẩu!");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error(t('passwordMismatch') || "Mật khẩu xác nhận không khớp!");
            return;
        }

        try {
            await axios.put("http://localhost:8099/api/user/v1/change-password", {
                oldPassword,
                newPassword
            }, { withCredentials: true });

            toast.success(t('passwordChangeSuccess') || "Đổi mật khẩu thành công!");
            handleClose();
        } catch (error) {
            console.error("Đổi mật khẩu thất bại", error);
            toast.error(error.response?.data?.message);
        }
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                toast.warning(t('invalidEmail') || "Email không hợp lệ!");
                return;
            }
        }

        if (phoneNumber) {
            const phoneRegex = /^0\d{9}$/;
            if (!phoneRegex.test(phoneNumber)) {
                toast.warning(t('invalidPhone') || "Số điện thoại không hợp lệ! (10 số, bắt đầu bằng 0)");
                return;
            }
        }

        try {
            const updateData = {
                username: userName,
                fullname: fullName,
                email: email,
                phone: phoneNumber,
                dob: dob || null,
                gender: gender || null,
                nationality: nationality || null,
            };
            const res = await axios.put("http://localhost:8099/api/user/v1/profile", updateData,
                { withCredentials: true }
            );

            toast.success(t('profileUpdateSuccess') || "Cập nhật thông tin thành công!");
            fetchUserProfile();
        } catch (error) {
            console.error("Cập nhật profile thất bại", error);
            toast.error(error.response?.data?.message || "Cập nhật thông tin thất bại!");
        }
    }

    const handleCancel = () => {
        fetchUserProfile();
        toast.info(t('changesCanceled') || "Đã hủy các thay đổi.");
    }
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8099/auth/logout', {}, {
                withCredentials: true
            });

            console.log("Logout successful");
            sessionStorage.removeItem('state');
            sessionStorage.removeItem('user');


            navigate('/Login');

        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    const fetchUserProfile = async () => {
        try {
            const res = await axios.get(`http://localhost:8099/api/user/v1/profile`,
                { withCredentials: true }
            )
            const data = res.data.data;
            setDob(data.dob ? data.dob.split('T')[0] : "");
            setEmail(data.email || "");
            setGender(data.gender ? data.gender.toUpperCase() : "");
            setNationality(data.nationality || "");
            setPhoneNumber(data.phone || "");
            setUserName(data.username || "");
            setFullName(data.fullname || "");
        } catch (error) {
            console.error("Lỗi lấy thông tin người dùng!", error);
        }
    }
    useEffect(() => {
        if (!user) {
            navigate('/Login');
            return;
        }
        fetchUserProfile();
    }, []);

    return (
        <div className={styles.pageContainer}>
            <div className="container">
                <div className={styles.profileCard}>
                    {/* Sidebar */}
                    <div className={styles.sidebar}>
                        <div className={styles.avatarWrapper}>
                            <div className={styles.avatar}>
                                <UserCircle size={100} strokeWidth={1} />
                            </div>
                        </div>
                        <h5 className="fw-bold mb-1 text-dark text-center">{fullName}</h5>
                        <p className="text-muted small mb-4">@{userName}</p>

                        <ul className={styles.sideNav}>
                            <li className={`${styles.navItem} ${styles.navItemActive}`}>
                                <UserCircle size={20} />
                                {t('accountInfo')}
                            </li>
                            <li className={`${styles.navItem} ${styles.navItemLogout}`} onClick={handleLogout}>
                                <LogOut size={20} />
                                {t('logout')}
                            </li>
                        </ul>
                    </div>

                    {/* Main Content */}
                    <div className={styles.contentArea}>
                        <h2 className={styles.sectionTitle}>{t('accountInfo')}</h2>
                        <form className="row g-4" onSubmit={handleUpdateProfile}>
                            <div className="col-md-6">
                                <label className={styles.formLabel}>{t('fullname')}</label>
                                <input
                                    type="text"
                                    className={`form-control ${styles.formControl}`}
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>

                            <div className="col-md-6">
                                <label className={styles.formLabel}>{t('username')}</label>
                                <input
                                    type="text"
                                    className={`form-control ${styles.formControl}`}
                                    value={userName}
                                    readOnly
                                    style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                                />
                            </div>

                            <div className="col-md-6">
                                <label className={styles.formLabel}>{t('email')}</label>
                                <input
                                    type="text"
                                    className={`form-control ${styles.formControl}`}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className={styles.formLabel}>{t('phone')}</label>
                                <input
                                    type="text"
                                    className={`form-control ${styles.formControl}`}
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className={styles.formLabel}>{t('gender')}</label>
                                <Dropdown onSelect={(val) => setGender(val)} className="w-100">
                                    <Dropdown.Toggle
                                        as="div"
                                        className={`form-select d-flex align-items-center justify-content-between ${styles.customToggle}`}
                                        style={{ cursor: 'pointer', height: '45px' }}
                                    >
                                        <span style={{ fontSize: '15px' }}>
                                            {gender === "MALE" ? t('male') : gender === "FEMALE" ? t('female') : gender === "OTHER" ? t('other') : t('selectGender')}
                                        </span>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="w-100 shadow-lg border-0 rounded-4">
                                        <Dropdown.Item eventKey="">{t('selectGender')}</Dropdown.Item>
                                        <Dropdown.Item eventKey="MALE" className="py-2 px-3">{t('male')}</Dropdown.Item>
                                        <Dropdown.Item eventKey="FEMALE" className="py-2 px-3">{t('female')}</Dropdown.Item>
                                        <Dropdown.Item eventKey="OTHER" className="py-2 px-3">{t('other')}</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <div className="col-md-6">
                                <label className={styles.formLabel}>{t('dob')}</label>
                                <input
                                    type="date"
                                    className={`form-control ${styles.formControl}`}
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    style={{ height: '45px' }}
                                />
                            </div>

                            <div className="col-md-6">
                                <label className={styles.formLabel}>{t('nationality')}</label>
                                <Dropdown onSelect={(val) => setNationality(val)} className="w-100">
                                    <Dropdown.Toggle
                                        as="div"
                                        className={`form-select d-flex align-items-center justify-content-between ${styles.customToggle}`}
                                        style={{ cursor: 'pointer', height: '45px' }}
                                    >
                                        <div className="d-flex align-items-center overflow-hidden">
                                            {nationality && countries.find(c => c.label === nationality)?.flag && (
                                                <img
                                                    src={countries.find(c => c.label === nationality).flag}
                                                    alt=""
                                                    style={{ width: 22, height: 14, marginRight: 10, borderRadius: 2, objectFit: 'cover' }}
                                                />
                                            )}
                                            <span className="text-truncate" style={{ fontSize: '15px' }}>
                                                {nationality || t('selectNationality')}
                                            </span>
                                        </div>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="w-100 shadow-lg border-0 rounded-4" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                        <Dropdown.Item eventKey="">{t('selectNationality')}</Dropdown.Item>
                                        {countries.map((c) => (
                                            <Dropdown.Item
                                                key={c.code}
                                                eventKey={c.label}
                                                className="d-flex align-items-center py-2"
                                            >
                                                <img
                                                    src={c.flag}
                                                    alt=""
                                                    style={{ width: 22, height: 14, marginRight: 12, borderRadius: 2, objectFit: 'cover' }}
                                                />
                                                <span style={{ fontSize: '14px' }}>{c.label}</span>
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>

                            <div className="col-12 d-flex justify-content-between align-items-center mt-3">
                                <div className="text-success small italic">
                                    {showOk && textOk}
                                </div>
                                <button type="button" className={`btn btn-link ${styles.doimk}`} onClick={handleOpen}>
                                    <Key size={18} /> {t('changePassword')}
                                </button>
                            </div>

                            <div className="col-12 mt-5 pt-4 border-top d-flex gap-3">
                                <button type="submit" className={`btn btn-primary ${styles.btnPrimary}`}>
                                    {t('saveChanges')}
                                </button>
                                <button type="button" className="btn btn-outline-secondary px-4 rounded-3 fw-bold" onClick={handleCancel}>
                                    {t('cancel')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <Modal show={showDoiMK} onHide={handleClose} centered className="border-0">
                <Modal.Header closeButton className="border-0 pb-0 pt-4 px-4">
                    <Modal.Title className="fw-bold">{t('changePassword')}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <div className="mb-3">
                        <label className={styles.formLabel}>{t('oldPasswordLabel')}</label>
                        <input
                            type="password"
                            className={`form-control ${styles.formControl}`}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className={styles.formLabel}>{t('newPasswordLabel')}</label>
                        <input
                            type="password"
                            className={`form-control ${styles.formControl}`}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className={styles.formLabel}>{t('confirmPasswordLabel')}</label>
                        <input
                            type="password"
                            className={`form-control ${styles.formControl}`}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    {showAlert && <p className="text-danger small mt-2">{textAlert}</p>}
                </Modal.Body>
                <Modal.Footer className="border-0 p-4 pt-0">
                    <Button variant="light" className="px-4 fw-bold text-muted" onClick={handleClose}>
                        {t('close')}
                    </Button>
                    <Button className={`btn btn-primary ${styles.btnPrimary}`} onClick={handleChangePassword}>
                        {t('confirm')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default UserInfo;
