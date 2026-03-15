import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import styles from '../UserInfo/User_info.module.css';
import { Modal, Button } from "react-bootstrap";
import { UserCircle } from 'lucide-react';
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";

function UserInfo() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [nationality, setNationality] = useState("");
    const [password, setPassword] = useState("");
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
        setNewPassword(null);
        setConfirmPassword(null);
        setShowOk(false);
    }

    const handleOpen = () => {
        setShowDoiMK(true);
        setShowOk(false);
    }

    const handleChangePassword = async () => {
        if(!oldPassword || !newPassword || !confirmPassword){
            setTextAlert("Vui lòng điền đầy đủ thông tin!");
            setShowAlert(true);
            return;
        }

        if(newPassword !== confirmPassword){
            setTextAlert("Mật khẩu xác nhận không khớp!");
            setShowAlert(true);
            return;
        }
        const isMatch = await bcrypt.compare(oldPassword, password);
        if(isMatch){
            setShowAlert(false);
            setShowDoiMK(false);
            return;
        } else {
            setTextAlert("Mật khẩu cũ không chính xác!");
            setShowAlert(true);
            return;
        }
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
                username: userName,
                email: email,
                phone: phoneNumber,
                dob: dob || null,
                gender: gender || null,
                nationality: nationality || null,
            };
            if (newPassword && newPassword.trim() !== "") {
                updateData.password = newPassword;
            }
            const res = await axios.put("http://localhost:8099/auth/update-Userprofile", updateData, 
                {withCredentials: true}
            );
            console.log(res.data);
            
            setTextOk("Cập nhật thông tin thành công!!");
            setShowOk(true);
        } catch (error) {
            console.error("Cập nhật profile thất bại", error);
        }
    }

    const handleDeny = () => {
        window.location.reload();
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
            const res = await axios.get(`http://localhost:8099/auth/get-Userprofile/${user.username}`, 
                {withCredentials: true}
            )
            console.log(res.data);
            setDob(res.data.dob);
            setEmail(res.data.email);
            setGender(res.data.gender);
            setNationality(res.data.nationality);
            setPhoneNumber(res.data.phone);
            setUserName(res.data.username);
            setPassword(res.data.password);
        } catch (error){
            console.error("Lỗi lấy thông tin người dùng!", error);
        }
    }
    useEffect(() => {
        fetchUserProfile();
    },[]);
    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-md-3 text-center mt-4">
                    {/* <i className="fa fa-circle-user" style={{fontSize: '100px'}}></i> */}

                    <UserCircle size={110} strokeWidth={1.7} className="text-secondary" />

                    <ul className="list-unstyled mt-4">
                        <li className="mb-3 fw-bold">Thông tin tài khoản</li>
                        <li className={`mb-3 ${styles.dx}`} onClick={handleLogout}>Đăng xuất</li>
                    </ul>
                </div>

                <div className="col-md-9">
                    <h3 className="mb-4">Thông tin tài khoản</h3>
                    <form className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Tên tài khoản</label>
                            <input type="text" className="form-control" value={userName} onChange={(e) => setUserName(e.target.value)} readOnly/>
                        </div>
                        
                        <div className="col-md-6">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Số điện thoại</label>
                            <input type="text" className="form-control" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Giới tính</label>
                            <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)}>
                                <option value="">---</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                        <label className="form-label">Ngày sinh</label>
                        <input
                            type="date"
                            className="form-control"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                        />
                        </div>

                        <div className="col-md-6">
                        <label className="form-label">Ngôn ngữ</label>
                        <select className="form-select" value={nationality} onChange={(e) => setNationality(e.target.value)}>
                            <option value="">---</option>
                            <option value="Tiếng Việt">Tiếng Việt</option>
                            <option value="Tiếng Anh">Tiếng Anh</option>
                            <option value="Tiếng Nhật">Tiếng Nhật</option>
                            <option value="Tiếng Hàn">Tiếng Hàn</option>
                            <option value="Tiếng Pháp">Tiếng Pháp</option>
                            <option value="Tiếng Đức">Tiếng Đức</option>
                            <option value="Tiếng Tây Ban Nha">Tiếng Tây Ban Nha</option>
                            <option value="Tiếng Nga">Tiếng Nga</option>
                        </select>
                        </div>
                        <div className="col-9">
                            {showOk ? <p style={{color: 'green', fontSize: '14px', fontStyle: 'italic'}}>{textOk}</p> : <></>}
                        </div>
                        <div className="col-3 d-flex justify-content-end mt-2">
                        <button type="button" className={`btn btn-link text-primary px-0 ${styles.doimk}`} onClick={handleOpen}>
                            Đổi mật khẩu
                        </button>
                        </div>
                        <div className="col-12">
                            <button type="submit" className="btn btn-primary" onClick={handleUpdateProfile}>Lưu thay đổi</button>
                            <button className="btn btn-secondary ms-3" onClick={handleDeny}>Hủy</button>
                        </div>
                    </form>
                </div>
            </div>
            <Modal show={showDoiMK} onHide={handleClose} centered>
    <Modal.Header closeButton>
        <Modal.Title>Đổi mật khẩu</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        
        <div className="row mb-3">
            <div className="col-4 mt-1">
                <label>Mật khẩu cũ: </label>
            </div>
            <div className="col-7">
                <input type="password" className="form-control" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}/>
            </div>
        </div>
        <div className="row mb-3">
            <div className="col-4 mt-1">
                <label>Mật khẩu mới: </label>
            </div>
            <div className="col-7">
                <input type="password"className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
            </div>
        </div>
        <div className="row mb-3">
            <div className="col-4 mt-1">
                <label>Xác nhận mật khẩu: </label>
            </div>
            <div className="col-7">
                <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
            </div>
        </div>
        {showAlert ? <p style={{color: 'red', fontSize: '14px', fontStyle: 'italic'}}>{textAlert}</p> : <></>}
    </Modal.Body>
    <Modal.Footer>
        <Button variant="primary" onClick={handleChangePassword}>
            Xác nhận
        </Button>
        <Button variant="secondary" onClick={handleClose}>
            Đóng
        </Button>
    </Modal.Footer>
</Modal>
        </div>
    );
}

export default UserInfo;
