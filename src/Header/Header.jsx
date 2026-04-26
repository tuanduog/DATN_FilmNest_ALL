import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Header.css';
import logo from '../assets/logo.png';

function Header() {
    const { t, i18n } = useTranslation();
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
    const [allTheaters, setAllTheaters] = useState([]);
    const [locations, setLocation] = useState([]);

    const handleTheaters = async () => {
        try {
            const res = await axios.get('http://localhost:8099/api/theater/v1/all', {
                withCredentials: true
            });

            if (res.data.status === 200 && Array.isArray(res.data.data)) {
                const data = res.data.data;
                setAllTheaters(data);

                const uniqueProvinces = [];
                const provinceMap = new Map();
                data.forEach(t => {
                    if (t.provinceCode && !provinceMap.has(t.provinceCode)) {
                        provinceMap.set(t.provinceCode, t.provinceName);
                        uniqueProvinces.push({ code: t.provinceCode, name: t.provinceName });
                    }
                });
                setLocation(uniqueProvinces);

                // Restore selection from localStorage
                const theaterSaved = JSON.parse(localStorage.getItem("theater") || '{}');
                if (theaterSaved.id) {
                    const found = data.find(t => t.id.toString() === theaterSaved.id.toString());
                    if (found) {
                        setSelectedLocation(found.provinceCode);
                        const filtered = data.filter(t => t.provinceCode === found.provinceCode);
                        setTheater(filtered);
                        setselectedTheater(found.id.toString());
                    }
                }
            } else {
                setAllTheaters([]);
                setLocation([]);
            }
        } catch (err) {
            console.error("Fetch theaters failed:", err);
        }
    };



    const handleAuth = useCallback(async () => {
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
    }, []);

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
                window.dispatchEvent(new Event('authChange'));
            }, 100);
        } catch (err) {
            console.error("Logout failed", err);
        }
    };
    const [selectedLocation, setSelectedLocation] = useState(""); // địa điểm đã chọn
    const [selectedTheater, setselectedTheater] = useState(""); // thông tin các rạp
    useEffect(() => {
        handleTheaters();
        if (!justLoggedOut) {
            handleAuth();
        } else {
            setJustLoggedOut(false);
        }
    }, [location.pathname, handleAuth, justLoggedOut]);

    useEffect(() => {
        window.addEventListener('authChange', handleAuth);
        
        const handleTheaterChange = () => {
            const theaterSaved = JSON.parse(localStorage.getItem("theater") || '{}');
            if (theaterSaved.id) {
                setselectedTheater(theaterSaved.id.toString());
                const found = allTheaters.find(t => t.id.toString() === theaterSaved.id.toString());
                if (found) {
                    setSelectedLocation(found.provinceCode);
                    const filtered = allTheaters.filter(t => t.provinceCode === found.provinceCode);
                    setTheater(filtered);
                }
            } else {
                setselectedTheater("");
                setSelectedLocation("");
                setTheater([]);
            }
        };
        window.addEventListener('theaterChange', handleTheaterChange);

        return () => {
            window.removeEventListener('authChange', handleAuth);
            window.removeEventListener('theaterChange', handleTheaterChange);
        };
    }, [handleAuth, allTheaters]);

    const handleNavigate = (path) => () => navigate(path);

    const handleHistory = () => {
        if (!user) {
            navigate("/Login");
        } else {
            navigate("/Booking_history");
        }
    }

    const handleLoc = () => {
        const theaterSaved = JSON.parse(localStorage.getItem("theater") || 'null');
        if (theaterSaved) {
            navigate("/Theater");
        } else {
            setShowChoseLocation(true);
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
                                            const provCode = e.target.value;
                                            setSelectedLocation(provCode);
                                            // Filter theaters by province code
                                            const filtered = allTheaters.filter(t => t.provinceCode === provCode);
                                            setTheater(filtered);
                                        }}
                                    >
                                        <option value="">Chọn Tỉnh/ Thành phố</option>
                                        {Array.isArray(locations) &&
                                            locations.map((loc, idx) => (
                                                <option key={idx} value={loc.code}>
                                                    {loc.name}
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

                                            const selectedObj = theater.find(t => t.id && t.id.toString() === selectedValue);
                                            if (selectedObj) {
                                                localStorage.setItem('theater', JSON.stringify({
                                                    id: selectedObj.id,
                                                    name: selectedObj.name,
                                                    theaterLocation: selectedObj.theaterLocation
                                                }));
                                                setShowChoseLocation(false);
                                                window.dispatchEvent(new Event('theaterChange'));
                                            }

                                        }}>
                                        <option value="">Chọn rạp</option>
                                        {Array.isArray(theater) &&
                                            theater.map((theaterItem, idx) => (
                                                <option key={idx} value={theaterItem.id}>
                                                    {theaterItem.name}
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
                    {/* Language Switcher */}
                    <div className="d-flex align-items-center me-4">
                        <span
                            className={`mx-1 cursor-pointer ${i18n.language === 'vi' ? 'text-warning fw-bold' : 'text-white-50'}`}
                            onClick={() => i18n.changeLanguage('vi')}
                            style={{ cursor: 'pointer' }}
                        >
                            VN
                        </span>
                        <span className="text-white-50">|</span>
                        <span
                            className={`mx-1 cursor-pointer ${i18n.language === 'en' ? 'text-warning fw-bold' : 'text-white-50'}`}
                            onClick={() => i18n.changeLanguage('en')}
                            style={{ cursor: 'pointer' }}
                        >
                            EN
                        </span>
                    </div>

                    {!user ? (
                        <>
                            <p className="mb-0 me-2 top-link" style={{ cursor: 'pointer' }} onClick={() => handleLogin('login')}>{t('login')}</p>
                            <p className="mb-0">|</p>
                            <p className="mb-0 ms-2 top-link" style={{ cursor: 'pointer' }} onClick={() => handleLogin('register')}>{t('register')}</p>
                        </>
                    ) : (
                        <div className='d-flex align-items-center'>

                            {membership ? <span className='px-2 rounded border border-warning text-warning me-2 fw-bold'
                                style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', fontSize: '12px' }}>
                                VIP
                            </span> : <></>}
                            <div className="dropdown">
                                <span className="mb-0 me-2 fs-6 top-link" style={{ cursor: 'pointer' }} data-bs-toggle="dropdown">
                                    {t('hello')} {user && user.data && user.data.username ? user.data.username : 'Tài khoản'}! <i className="bi bi-caret-down-fill"></i>
                                </span>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><button className="dropdown-item" onClick={handleNavigate('/Profile')}>{t('profile')}</button></li>
                                    <li><button className="dropdown-item" onClick={handleLogout}>{t('logout')}</button></li>
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
                        {selectedTheater ? (
                            /* Khi đã chọn rạp: Chỉ hiện 1 nhãn tên rạp */
                            <div
                                className="d-flex align-items-center py-1 px-3 border rounded bg-white shadow-sm"
                                onClick={() => setShowChoseLocation(true)}
                                style={{
                                    cursor: 'pointer',
                                    minWidth: '200px',
                                    height: '38px',
                                    border: '1px solid #333 !important',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <div className="d-flex align-items-center overflow-hidden">
                                    <i className="bi bi-geo-alt-fill text-danger me-2" style={{ fontSize: '16px' }}></i>
                                    <span className="text-dark fw-bold text-truncate" style={{ fontSize: '14px', lineHeight: 'normal' }}>
                                        {allTheaters.find(t => t.id.toString() === selectedTheater.toString())?.name || "Đang tải..."}
                                    </span>
                                </div>
                                <i className="bi bi-caret-down-fill ms-2 text-muted" style={{ fontSize: '12px' }}></i>
                            </div>
                        ) : (
                            /* Khi chưa chọn rạp: Hiện 2 dropdown */
                            <>
                                <div className='me-2 shadow-sm rounded'>
                                    <select
                                        className="form-select"
                                        style={{ 
                                            width: '160px', 
                                            height: '38px', 
                                            border: '1px solid #333 !important', 
                                            fontSize: '14px', 
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}
                                        value={selectedLocation}
                                        onChange={e => {
                                            const locCode = e.target.value;
                                            setSelectedLocation(locCode);
                                            setselectedTheater("");
                                            const filtered = allTheaters.filter(t => t.provinceCode === locCode);
                                            setTheater(filtered);
                                        }}
                                    >
                                        <option value="">Chọn địa điểm</option>
                                        {Array.isArray(locations) &&
                                            locations.map((loc, idx) => (
                                                <option key={idx} value={loc.code}>
                                                    {loc.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                {theater.length > 0 && (
                                    <div className='shadow-sm rounded'>
                                        <select
                                            className="form-select"
                                            style={{ 
                                                width: '180px', 
                                                height: '38px', 
                                                border: '1px solid #333 !important', 
                                                fontSize: '14px', 
                                                cursor: 'pointer',
                                                fontWeight: 'bold'
                                            }}
                                            value={selectedTheater}
                                            onChange={e => {
                                                const selectedValue = e.target.value;
                                                setselectedTheater(selectedValue);

                                                const selectedObj = theater.find(t => t.id && t.id.toString() === selectedValue);
                                                if (selectedObj) {
                                                    localStorage.setItem('theater', JSON.stringify({
                                                        id: selectedObj.id,
                                                        name: selectedObj.name,
                                                        theaterLocation: selectedObj.theaterLocation
                                                    }));
                                                    window.dispatchEvent(new Event('theaterChange'));
                                                }
                                            }}
                                        >
                                            <option value="">Chọn rạp</option>
                                            {Array.isArray(theater) &&
                                                theater.map((theaterItem, idx) => (
                                                    <option key={idx} value={theaterItem.id}>
                                                        {theaterItem.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                )}
                            </>
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
