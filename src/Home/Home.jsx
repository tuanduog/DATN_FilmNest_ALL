import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Home.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';
import banner4 from '../assets/banner4.png';
import banner6 from '../assets/banner6.jpg';
import axios from 'axios';
import { useEffect } from 'react';

function Homepage() {
    const [nowShowing, setNowShowing] = useState(true);
    const navigate = useNavigate();

    const [showingNow, setShowingNow] = useState([]);
    const [commingSoon, setCommingSoon] = useState([]);
    const [showModal1, setShowModal1] = useState(false);
    const [confirmPopup, setConfirmPopup] = useState(false);
    const [movieInfo, setMovieInfo] = useState([]);
    const [showDates, setShowDates] = useState([]);
    const [showTime, setShowTime] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState([]);
    const savedTheater = JSON.parse(localStorage.getItem('theater'));
    const [showChoseLocation, setShowChoseLocation] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(""); // địa điểm đã chọn
    const [selectedTheater, setselectedTheater] = useState(""); // thông tin các rạp
    const [theater, setTheater] = useState([]);
    const [locations, setLocation] = useState([]);
    const handleCloseModal = () => {
        setShowModal1(false);
    }
    const handleOpenModal = (movie) => {
        if (localStorage.getItem('theater') === null) {
            setShowChoseLocation(true);
            return;
        }
        setMovieInfo(movie);
        const select = generateAvailableShowDates(movie.releaseDate, movie.dateShow);
        setShowDates(select);
        setSelectedIndex(0);
        setSelectedDate(select[0]);
        fetchShowTime(movie.movieId);
        setShowModal1(true);
    }
    const handleCloseConfirm = () => {
        setConfirmPopup(false);
    }
    const handleOpenConfirm = () => {
        setConfirmPopup(true);
    }
    const handleMovieDetails = (id) => {
        navigate("/Movie_detail", { state: { id } });
    }

    const handleBooking = (movieInfo, date, time) => {
        const user = sessionStorage.getItem('state');
        console.log('Booking:', { movieInfo, date, time });
        const bookingInfo = {
            movieInfo, date, time
        };
        localStorage.setItem('bookingInfo', JSON.stringify(bookingInfo));
        if (!user) {
            navigate('/Login');
        } else {
            localStorage.removeItem('timeLeft');
            localStorage.removeItem('paymentId');
            navigate('/Booking');
            window.scrollTo(0, 0);
        }
    }

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
            console.error("Fetch locations failed:", err);
        }
    };

    useEffect(() => {
        handleLocations();
    }, [location.pathname]);

    const generateAvailableShowDates = (releasedDateStr, numberOfDays) => {
        const today = new Date();
        const releasedDate = new Date(releasedDateStr);
        const showDates = [];

        const endDate = new Date(releasedDate);
        endDate.setDate(endDate.getDate() + numberOfDays - 1);

        let current = new Date(Math.max(today, releasedDate));

        let count = 0;
        while (current <= endDate && count < 7) {
            const formatted = `${current.getDate().toString().padStart(2, '0')}/${(current.getMonth() + 1)
                .toString()
                .padStart(2, '0')}`;
            showDates.push(formatted);
            current.setDate(current.getDate() + 1);
            count++;
        }

        return showDates;
    };

    const banners = [
        {
            id: 1,
            url: banner1,
        },
        {
            id: 2,
            url: banner2,
        },
        {
            id: 3,
            url: banner3,
        },
        {
            id: 4,
            url: banner4,
        }
        , {
            id: 6,
            url: banner6,
        }
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 4000,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
    }
    const fetchShowTime = async (movieId) => {
        try {
            const res = await axios.get(`http://localhost:8099/auth/get-showtime/${movieId}`);

            setShowTime(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy phim", error);
        }
    }
    const fetchMovies = async () => {
        try {
            const res = await axios.get("http://localhost:8099/movie/getAll-movies");
            const movies = res.data;

            const s1 = movies.filter(movie => movie.showing === "Đang chiếu");
            const c1 = movies.filter(movie => movie.showing === "Sắp chiếu");

            setShowingNow(s1);
            setCommingSoon(c1);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phim", error);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    return (
        <div style={{ backgroundColor: '#fdfdfd', paddingBottom: '3rem' }}>
            {showChoseLocation && (
                <div className={styles.overlay}>
                    <div className={styles.popup}>
                        {/* Nút đóng */}
                        <button className={styles.closeBtn} onClick={() => setShowChoseLocation(false)}>
                            &times;
                        </button>

                        {/* Nội dung */}
                        <div className={styles.content}>
                            <h4 className="fw-bold mb-4 text-center">Chọn Khu Vực & Rạp</h4>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Tỉnh/ Thành phố</label>
                                    <select
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

                                <div className={styles.formGroup}>
                                    <label>Tên rạp</label>
                                    <select
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
            {showModal1 && (
                <div className={styles.overlay} onClick={handleCloseModal}>
                    <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={handleCloseModal}>&times;</button>

                        <h3 className="text-uppercase text-center fw-bold mb-2" style={{ color: '#0d6efd' }}>
                            LỊCH CHIẾU - {movieInfo.movieName}
                        </h3>

                        <h6 className="text-center mb-4 text-secondary fw-semibold">{savedTheater.theaterName}</h6>

                        <div className="d-flex justify-content-center gap-2 flex-wrap mb-4">
                            {showDates.map((dateStr, i) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        setSelectedIndex(i);
                                        setSelectedDate(dateStr);
                                    }}
                                    className={`${styles.dateItem} px-3 py-2 rounded ${i === selectedIndex ? styles.activeDate : 'text-dark'}`}
                                >
                                    {dateStr}
                                </div>
                            ))}
                        </div>

                        <h6 className="text-uppercase fw-bold mb-3 text-muted text-center" style={{ letterSpacing: '1px' }}>2D Phụ Đề</h6>

                        <div className="d-flex flex-wrap gap-3 justify-content-center">
                            {showTime.length === 0 ? (
                                <div className="text-muted fst-italic">Không có lịch chiếu</div>
                            ) : (
                                showTime.map((time, index) => (
                                    <div
                                        key={index}
                                        className={styles.showtime}
                                        onClick={() => {
                                            handleOpenConfirm();
                                            setSelectedTime(time);
                                        }}
                                    >
                                        <div className="fw-bold fs-5 mb-1" style={{ color: '#1a1a1a' }}>
                                            {time.startTime.slice(0, 5)}
                                        </div>
                                        <div className="seats text-secondary" style={{ fontSize: '12px', fontWeight: '500' }}>91 ghế ngồi</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
            {confirmPopup && (
                <div className={styles.overlay} onClick={handleCloseConfirm}>
                    <div className={styles.popup} style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={handleCloseConfirm}>&times;</button>

                        <h6 className="text-center text-uppercase mt-2 mb-2 text-muted fw-bold" style={{ letterSpacing: '0.5px' }}>
                            Xác nhận đặt vé
                        </h6>
                        <h4 className="text-center text-primary fw-bold mb-4">
                            {movieInfo.movieName || "Tên phim"}
                        </h4>

                        <div className="table-responsive rounded shadow-sm mb-4 border">
                            <table className="table table-hover text-center align-middle mb-0">
                                <thead className={styles.tableHeader}>
                                    <tr>
                                        <th className="py-3">Rạp chiếu</th>
                                        <th className="py-3">Ngày chiếu</th>
                                        <th className="py-3">Giờ chiếu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-3 text-dark fw-bold">{savedTheater.theaterName}</td>
                                        <td className="py-3 text-dark fw-bold">{selectedDate}/2025</td>
                                        <td className="py-3 text-primary fw-bold">{selectedTime.startTime.slice(0, 5)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="text-center">
                            <button
                                className={`btn btn-success px-5 py-2 w-100 ${styles.btnBook}`}
                                onClick={() => handleBooking(movieInfo, selectedDate, selectedTime)}
                            >
                                ĐỒNG Ý
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className={styles.banner}>
                <Slider {...settings}>
                    {banners.map((item) => (
                        <div key={item.id} style={{ outline: 'none' }}>
                            <img
                                src={item.url}
                                alt={`Banner ${item.id}`}
                            />
                        </div>
                    ))}
                </Slider>
            </div>

            <div className="container-fluid px-3 px-md-5 mt-4">
                <div className={styles.tabWrapper}>
                    <div
                        className={`${styles.tab} ${nowShowing ? styles.active : ''}`}
                        onClick={() => setNowShowing(true)}
                    >
                        Phim đang chiếu
                    </div>
                    <div
                        className={`${styles.tab} ${!nowShowing ? styles.active : ''}`}
                        onClick={() => setNowShowing(false)}
                    >
                        Phim sắp chiếu
                    </div>
                </div>

                {nowShowing ? (
                    <div className="row g-4 justify-content-center mx-auto" style={{ maxWidth: '1440px' }}>
                        {showingNow.map((movie) => (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2" key={movie.movieId}>
                                <div className={styles.movieCard}>
                                    <img
                                        src={movie.image}
                                        alt={movie.movieName}
                                        onClick={() => handleMovieDetails(movie.movieId)}
                                    />
                                    <div className={styles.cardBody}>
                                        <h6 className={`${styles.cardTitleCustom} ${styles.ellipsis}`} onClick={() => handleMovieDetails(movie.movieId)} title={movie.movieName}>
                                            {movie.movieName}
                                        </h6>
                                        <p className={`mb-1 text-secondary ${styles.ellipsis}`} style={{ fontSize: '13.5px' }}>
                                            <span className="fw-semibold">Thể loại:</span> {movie.genre}
                                        </p>
                                        <p className={`mb-3 text-secondary ${styles.ellipsis}`} style={{ fontSize: '13.5px' }}>
                                            <span className="fw-semibold">Thời lượng:</span> {movie.duration}
                                        </p>
                                        <button className={`btn btn-primary w-100 ${styles.btnBook}`} onClick={() => handleOpenModal(movie)}>
                                            Đặt vé
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="row g-4 justify-content-center mx-auto" style={{ maxWidth: '1440px' }}>
                        {commingSoon.map((movie) => (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2" key={movie.movieId}>
                                <div className={styles.movieCard}>
                                    <img
                                        src={movie.image}
                                        alt={movie.movieName}
                                        onClick={() => handleMovieDetails(movie.movieId)}
                                    />
                                    <div className={styles.cardBody}>
                                        <h6 className={`${styles.cardTitleCustom} ${styles.ellipsis}`} onClick={() => handleMovieDetails(movie.movieId)} title={movie.movieName}>
                                            {movie.movieName}
                                        </h6>
                                        <p className={`mb-1 text-secondary ${styles.ellipsis}`} style={{ fontSize: '13.5px' }}>
                                            <span className="fw-semibold">Thể loại:</span> {movie.genre}
                                        </p>
                                        <p className={`mb-3 text-secondary ${styles.ellipsis}`} style={{ fontSize: '13.5px' }}>
                                            <span className="fw-semibold">Khởi chiếu:</span> {new Date(movie.releaseDate).toLocaleDateString("vi-VN", {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </p>
                                        <button className={`btn btn-primary w-100 ${styles.btnBook}`} onClick={() => handleOpenModal(movie)}>
                                            Đặt vé
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Homepage;
