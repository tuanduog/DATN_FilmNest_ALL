import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Header.css';
import logo from '../assets/logo.png';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [membership, setMembership] = useState(false);

    const [user, setUser] = useState(null);

    const [name, setName] = useState('');
    const [justLoggedOut, setJustLoggedOut] = useState(false);
    const [showChoseLocation, setShowChoseLocation] = useState(false);

    const handleLogin = (type) => {
        navigate("/Login", { state: { type } });
    };

    const handleFilter = (e) => {
        e.preventDefault();
        navigate("/Filter", { state: { name } });
    };

    const [theater, setTheater] = useState([]);
    const [locations, setLocation] = useState([]);
    const handleTheater = async (location) => {
        const url = `http://localhost:8099/theaters/getTheaterByLocation?Location=${encodeURIComponent(location)}`;
        try {
            const res = await axios.get(url, {
                withCredentials: true
            });
            if (res.data.status === 200) {
                setTheater(res.data.data);
                // thông tin rạp
            } else {
                setTheater([]);
            }
        } catch (err) {
            setTheater([]);
            console.error("Fetch theaters failed:", err);
        }
    };

    const handleLoc = () => {
        const theaterSaved = JSON.parse(localStorage.getItem("theater") || null);
        if (theaterSaved) {
            navigate("/Theater");
        } else {
            setShowChoseLocation(true);
        }
    }

    const handleLocations = async () => {
        try {
            const res = await axios.get('http://localhost:8099/theaters/getLocations', {
                withCredentials: true
            });
            if (res.data.status === 200) {
                setLocation(Array.isArray(res.data.data) ? res.data.data : []);
                // địa điểm rạp
                console.log(res.data.data);
            } else {
                setLocation([]);
            }
        } catch (err) {
            setUser(null);
            console.error("Fetch locations failed:", err);
        }
    };

    useEffect(() => {
        const theaterSaved = JSON.parse(localStorage.getItem("theater") || '{}');
        if (theaterSaved.theaterLocation) {
            setSelectedLocation(theaterSaved.theaterLocation);
        }
        if (theaterSaved.theaterId) {
            setselectedTheater(theaterSaved.theaterId);
            handleTheater(theaterSaved.theaterLocation);
        }
    }, [location.pathname]);

    const handleAuth = async () => {
        try {
            const res = await axios.get('http://localhost:8099/auth/introspect', {
                withCredentials: true
            });
            console.log("Auth response:", res.data);

            if (res.data.status === 200) {
                setUser(res.data);
                sessionStorage.setItem('user', JSON.stringify(res.data.data));
            } else {
                setUser(null);
            }
        } catch (err) {
            setUser(null);
            console.error("Auth failed:", err);
        }
    };

    const fetchMember = async () => {
        try {
            const res = await axios.get(`http://localhost:8099/auth/get-Membership/${user.data.userId}`,
                { withCredentials: true }
            )
            if (res.data.membership != "no membership") {
                setMembership(true);
            } else {
                setMembership(false);
            }
        } catch (error) {
            console.error("Khong lay duoc membership", error);
        }
    }

    useEffect(() => {
        if (user) {
            fetchMember();
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8099/auth/logout', {}, {
                withCredentials: true
            });

            console.log("Logout successful");
            sessionStorage.removeItem('state');
            sessionStorage.removeItem('user');
            setMembership(false);
            setUser(null);
            setJustLoggedOut(true);
            localStorage.removeItem('theater');
            navigate('/');
            setTimeout(() => {
                handleAuth();
            }, 100);
        } catch (err) {
            console.error("Logout failed", err);
        }
    };
    const [selectedLocation, setSelectedLocation] = useState(""); // địa điểm đã chọn
    const [selectedTheater, setselectedTheater] = useState(""); // thông tin các rạp
    useEffect(() => {
        if (!justLoggedOut) {
            handleAuth();
        } else {
            setJustLoggedOut(false);
        }

        handleLocations();
    }, [location.pathname]);

    const handleNavigate = (path) => () => navigate(path);

    const handleHistory = () => {
        if (!user) {
            navigate("/Login");
        } else {
            navigate("/Booking_history");
        }
    }

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/' ? 'active-nav' : '';
        }
        return location.pathname.startsWith(path) ? 'active-nav' : '';
    };

    return (
        <div>
            {showChoseLocation && (
                <div className="overlay">
                    <div className="popup">
                        {/* Nút đóng */}
                        <button className="closeBtn" onClick={() => setShowChoseLocation(false)}>
                            &times;
                        </button>

                        {/* Nội dung */}
                        <div className="content">
                            <div className="formRow" style={{ marginBottom: '35px', marginLeft: '20px', marginRight: '20px' }}>
                                <div className="formGroup">
                                    <label>Tỉnh/ Thành phố</label>
                                    <select
                                        style={{ fontSize: '14px' }}
                                        value={selectedLocation}
                                        onChange={e => {
                                            const loc = e.target.value;
                                            setSelectedLocation(loc);
                                            handleTheater(loc);
                                        }}
                                    >
                                        <option value="">Chọn Tỉnh/ Thành phố</option>
                                        {Array.isArray(locations) &&
                                            locations.map((loc, idx) => (
                                                <option key={idx} value={loc}>
                                                    {loc}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div className="formGroup">
                                    <label>Tên rạp</label>
                                    <select style={{ fontSize: '14px' }}
                                        value={selectedTheater}
                                        onChange={e => {
                                            const selectedValue = e.target.value;
                                            setselectedTheater(selectedValue);

                                            const selectedObj = theater.find(t => t.theaterId.toString() === selectedValue);
                                            if (selectedObj) {
                                                localStorage.setItem('theater', JSON.stringify({
                                                    theaterId: selectedObj.theaterId,
                                                    theaterName: selectedObj.theaterName,
                                                    theaterLocation: selectedObj.theaterLocation
                                                }));
                                                setShowChoseLocation(false);
                                                window.location.reload();
                                            }

                                        }}>
                                        <option value="">Chọn rạp</option>
                                        {Array.isArray(theater) &&
                                            theater.map((theaterItem, idx) => (
                                                <option key={idx} value={theaterItem.theaterId}>
                                                    {theaterItem.theaterName}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Topbar */}
            <div className="topblack">
                <div className="d-flex justify-content-end align-items-center text-white pe-4" style={{ height: '40px', fontSize: '14px' }}>
                    {!user ? (
                        <>
                            <p className="mb-0 me-2 top-link" style={{ cursor: 'pointer' }} onClick={() => handleLogin('login')}>Đăng nhập</p>
                            <p className="mb-0">|</p>
                            <p className="mb-0 ms-2 top-link" style={{ cursor: 'pointer' }} onClick={() => handleLogin('register')}>Đăng ký</p>
                        </>
                    ) : (
                        <div className='d-flex align-items-center'>

                            {membership ? <span className='px-2 rounded border border-warning text-warning me-2 fw-bold'
                                style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', fontSize: '12px' }}>
                                VIP
                            </span> : <></>}
                            <div className="dropdown">
                                <span className="mb-0 me-2 fs-6 top-link" style={{ cursor: 'pointer' }} data-bs-toggle="dropdown">
                                    Xin chào {user && user.data && user.data.username ? user.data.username : 'Tài khoản'}! <i className="bi bi-caret-down-fill"></i>
                                </span>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><button className="dropdown-item" onClick={handleNavigate('/Profile')}>Thông tin cá nhân</button></li>
                                    <li><button className="dropdown-item" onClick={handleLogout}>Đăng xuất</button></li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light shadow">
                <div className="container-fluid d-flex justify-content-start">
                    <span className="navbar-brand ms-3" onClick={handleNavigate('/')}>
                        <img src={logo} className="navbar-logo" alt="Logo" />
                    </span>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="d-flex align-items-center ms-4 me-4">
                        {/* Dropdown chọn location - Ẩn nếu đã chọn rạp */}
                        {!selectedTheater && (
                            <div className='me-2'>
                                <select
                                    className="form-select"
                                    style={{ width: '150px', height: '38px', border: '1px solid black', fontSize: '15px', cursor: 'pointer' }}
                                    value={selectedLocation}
                                    onChange={e => {
                                        const loc = e.target.value;
                                        setSelectedLocation(loc);
                                        setselectedTheater(""); // Reset rạp đã chọn
                                        handleTheater(loc);
                                    }}
                                >
                                    <option value="">Chọn địa điểm</option>
                                    {Array.isArray(locations) &&
                                        locations.map((loc, idx) => (
                                            <option key={idx} value={loc}>
                                                {loc}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        )}

                        {/* Dropdown chọn rạp */}
                        {theater.length > 0 && (
                            <div>
                                <select
                                    className="form-select"
                                    style={{ width: '180px', height: '38px', border: '1px solid black', fontSize: '15px', cursor: 'pointer' }}
                                    value={selectedTheater}
                                    onChange={e => {
                                        const selectedValue = e.target.value;
                                        setselectedTheater(selectedValue);

                                        const selectedObj = theater.find(t => t.theaterId.toString() === selectedValue);
                                        if (selectedObj) {
                                            localStorage.setItem('theater', JSON.stringify({
                                                theaterId: selectedObj.theaterId,
                                                theaterName: selectedObj.theaterName,
                                                theaterLocation: selectedObj.theaterLocation
                                            }))
                                        }
                                    }
                                    }
                                >
                                    <option value="">Chọn rạp</option>
                                    {Array.isArray(theater) &&
                                        theater.map((theaterItem, idx) => (
                                            <option key={idx} value={theaterItem.theaterId}>
                                                {theaterItem.theaterName}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav" style={{ gap: '10px' }}>
                            <span className={`nav-link active ${isActive('/')}`} style={{ cursor: 'pointer' }} onClick={handleNavigate('/')}>TRANG CHỦ</span>
                            <span className={`nav-link active ${isActive('/Movies')}`} style={{ cursor: 'pointer' }} onClick={handleNavigate('/Movies')}>PHIM</span>
                            <span className={`nav-link active ${isActive('/Theater')}`} style={{ cursor: 'pointer' }} onClick={handleLoc}>RẠP</span>
                            <span className={`nav-link active ${isActive('/Ranking')}`} style={{ cursor: 'pointer' }} onClick={handleNavigate('/Ranking')}>XẾP HẠNG PHIM</span>
                            <span className={`nav-link active ${isActive('/Member')}`} style={{ cursor: 'pointer' }} onClick={handleNavigate('/Member')}>HỘI VIÊN</span>
                            <span className={`nav-link active ${isActive('/Booking_history')}`} style={{ cursor: 'pointer' }} onClick={handleHistory}>LỊCH SỬ ĐẶT VÉ</span>
                        </div>
                    </div>

                    <form className="d-flex justify-content-end" role="search" onSubmit={handleFilter}>
                        <input className="form-control me-2" type="search" placeholder="Tìm phim..." aria-label="Search" value={name}
                            onChange={(e) => setName(e.target.value)} />
                        <button className="btn btn-primary" type="submit">Tìm</button>
                    </form>
                </div>
            </nav>
        </div>
    );
}

export default Header;
