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
        <div className="container py-5">
            <div className="row">
                <div className="col-md-3 text-center mt-4">
                    {/* <i className="fa fa-circle-user" style={{fontSize: '100px'}}></i> */}

                    <UserCircle size={110} strokeWidth={1.7} className="text-secondary" />

                    <ul className="list-unstyled mt-4">
                        <li className="mb-3 fw-bold text-primary">
                            <UserCircle size={18} className="me-2" />
                            {t('accountInfo')}
                        </li>
                        <li className={`mb-3 ${styles.dx}`} onClick={handleLogout}>
                            <LogOut size={18} className="me-2" />
                            {t('logout')}
                        </li>
                    </ul>
                </div>

                <div className="col-md-9">
                    <h3 className="mb-4">{t('accountInfo')}</h3>
                    <form className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">{t('fullname')}</label>
                            <input type="text" className="form-control" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">{t('username')}</label>
                            <input type="text" className="form-control" value={userName} onChange={(e) => setUserName(e.target.value)} readOnly />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">{t('email')}</label>
                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">{t('phone')}</label>
                            <input type="text" className="form-control" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">{t('gender')}</label>
                            <Dropdown onSelect={(val) => setGender(val)} className="w-100">
                                <Dropdown.Toggle
                                    as="div"
                                    className={`form-select d-flex align-items-center justify-content-between ${styles.customToggle}`}
                                    style={{ cursor: 'pointer', height: '38px' }}
                                >
                                    <span style={{ fontSize: '15px' }}>
                                        {gender === "MALE" ? t('male') : gender === "FEMALE" ? t('female') : gender === "OTHER" ? t('other') : t('selectGender')}
                                    </span>
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="w-100 shadow-sm border">
                                    <Dropdown.Item eventKey="">{t('selectGender')}</Dropdown.Item>
                                    <Dropdown.Item eventKey="MALE" className="py-2 px-3" style={{ fontSize: '14px' }}>{t('male')}</Dropdown.Item>
                                    <Dropdown.Item eventKey="FEMALE" className="py-2 px-3" style={{ fontSize: '14px' }}>{t('female')}</Dropdown.Item>
                                    <Dropdown.Item eventKey="OTHER" className="py-2 px-3" style={{ fontSize: '14px' }}>{t('other')}</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">{t('dob')}</label>
                            <input
                                type="date"
                                className="form-control"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">{t('nationality')}</label>
                            <Dropdown onSelect={(val) => setNationality(val)} className="w-100">
                                <Dropdown.Toggle
                                    as="div"
                                    className={`form-select d-flex align-items-center justify-content-between ${styles.customToggle}`}
                                    style={{ cursor: 'pointer', height: '38px' }}
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

                                <Dropdown.Menu className="w-100 shadow-sm border" style={{ maxHeight: '250px', overflowY: 'auto' }}>
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
                        <div className="col-9">
                            {showOk ? <p style={{ color: 'green', fontSize: '14px', fontStyle: 'italic' }}>{textOk}</p> : <></>}
                        </div>
                        <div className="col-3 d-flex justify-content-end mt-2">
                            <button type="button" className={`btn btn-link text-primary px-0 ${styles.doimk}`} onClick={handleOpen}>
                                <Key size={16} className="me-1" /> {t('changePassword')}
                            </button>
                        </div>
                        <div className="col-12 mt-4 pt-2 border-top">
                            <button type="submit" className="btn btn-primary px-4 fw-bold" onClick={handleUpdateProfile}>{t('saveChanges')}</button>
                            <button type="button" className="btn btn-outline-secondary ms-3 px-4" onClick={handleCancel}>{t('cancel')}</button>
                        </div>
                    </form>
                </div>
            </div>
            <Modal show={showDoiMK} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{t('changePassword')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className="row mb-3">
                        <div className="col-4 mt-1">
                            <label>{t('oldPasswordLabel')} </label>
                        </div>
                        <div className="col-7">
                            <input type="password" className="form-control" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-4 mt-1">
                            <label>{t('newPasswordLabel')} </label>
                        </div>
                        <div className="col-7">
                            <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-4 mt-1">
                            <label>{t('confirmPasswordLabel')} </label>
                        </div>
                        <div className="col-7">
                            <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                    </div>
                    {showAlert ? <p style={{ color: 'red', fontSize: '14px', fontStyle: 'italic' }}>{textAlert}</p> : <></>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {t('close')}
                    </Button>
                    <Button variant="primary" onClick={handleChangePassword}>
                        {t('confirm')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default UserInfo;
