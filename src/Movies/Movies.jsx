import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Movies.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

function Movies() {
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
    const [theater, setTheater] = useState([]); // Filtered list
    const [allTheaters, setAllTheaters] = useState([]); // Raw data
    const [locations, setLocation] = useState([]); // Unique provinces
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

    const handleTheaters = async () => {
        const url = `http://localhost:8099/api/theater/v1/all`;
        try {
            const res = await axios.get(url, {
                withCredentials: true
            });
            if (res.data.status === 200) {
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
            } else {
                setAllTheaters([]);
                setLocation([]);
            }
        } catch (err) {
            setAllTheaters([]);
            setLocation([]);
            console.error("Fetch theaters failed:", err);
        }
    };

    useEffect(() => {
        handleTheaters();
    }, []);

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
    const fetchShowTime = async (movieId) => {
        try {
            const res = await axios.get(`http://localhost:8099/auth/get-showtime/${movieId}`);

            console.log(res.data);
            setShowTime(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy phim", error);
        }
    }
    const fetchMovies = async () => {
        try {
            const res = await axios.get("http://localhost:8099/api/movie/v1/all");
            const movies = res.data.data;

            if (Array.isArray(movies)) {
                const s1 = movies.filter(movie => movie.showingStatus === "now_showing");
                const c1 = movies.filter(movie => movie.showingStatus === "coming_soon");

                setShowingNow(s1);
                setCommingSoon(c1);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phim", error);
        }
    }
    useEffect(() => {
        fetchMovies();
    }, []);
    return (
        <div>
            {showChoseLocation && (
                <div className={styles.overlay}>
                    <div className={styles.popup}>
                        {/* Nút đóng */}
                        <button className={styles.closeBtn} onClick={() => setShowChoseLocation(false)}>
                            &times;
                        </button>

                        {/* Nội dung */}
                        <div className={styles.content}>
                            <div className={styles.formRow} style={{ marginBottom: '35px', marginLeft: '20px', marginRight: '20px' }}>
                                <div className={styles.formGroup}>
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
                                            setselectedTheater(""); // Reset selected theater
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

                                <div className={styles.formGroup}>
                                    <label>Tên rạp</label>
                                    <select style={{ fontSize: '14px' }}
                                        value={selectedTheater}
                                        onChange={e => {
                                            const selectedValue = e.target.value;
                                            setselectedTheater(selectedValue);

                                            const selectedObj = theater.find(t => t.id.toString() === selectedValue);
                                            if (selectedObj) {
                                                localStorage.setItem('theater', JSON.stringify({
                                                    id: selectedObj.id,
                                                    name: selectedObj.name,
                                                    theaterLocation: selectedObj.theaterLocation
                                                }));
                                                setShowChoseLocation(false);
                                                window.location.reload();
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
            {showModal1 && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-box p-4 rounded shadow" onClick={(e) => e.stopPropagation()}>
                        <span className="close-btn fs-3" onClick={handleCloseModal}>&times;</span>

                        <h3 className="text-uppercase text-center fw-bold mb-3" style={{ color: '#0d6efd' }}>
                            LỊCH CHIẾU - {movieInfo.movieName}
                        </h3>

                        <h5 className="text-center mb-4 text-secondary">{savedTheater?.name}</h5>

                        <div className="date-list d-flex justify-content-center gap-2 flex-wrap mb-4">
                            {showDates.map((dateStr, i) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        setSelectedIndex(i);
                                        setSelectedDate(dateStr);
                                    }}
                                    className={`date-item px-3 py-2 rounded ${i === selectedIndex ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                                    style={{ cursor: 'pointer', minWidth: '60px', textAlign: 'center' }}
                                >
                                    {dateStr}
                                </div>
                            ))}
                        </div>


                        <h6 className="text-uppercase fw-bold mb-3 text-muted text-center">2D Phụ Đề</h6>

                        <div className="showtimes d-flex flex-wrap gap-3 justify-content-center">
                            {showTime.length === 0 ? (
                                <div>Không có lịch chiếu</div>
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
                                        <div className="time fw-bold fs-5 mb-1">
                                            {time.startTime.slice(0, 5)} {/* Format HH:mm */}
                                        </div>
                                        <div className="seats text-muted" style={{ fontSize: '13px' }}>91 ghế trống</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
            {confirmPopup && (
                <div className="modal-overlay" onClick={handleCloseConfirm}>
                    <div className="modal-box p-4 rounded shadow" onClick={(e) => e.stopPropagation()}>
                        <span className="close-btn fs-3" onClick={handleCloseConfirm}>&times;</span>

                        <h5 className="text-center text-uppercase mt-3 mb-2 text-muted">
                            Bạn đang đặt vé xem phim
                        </h5>
                        <h3 className="text-center text-primary fw-bold mb-4">
                            {movieInfo.movieName || "Tên phim"}
                        </h3>

                        <table className="table table-bordered text-center align-middle shadow-sm mb-4">
                            <thead className="table-light">
                                <tr>
                                    <th>Rạp chiếu</th>
                                    <th>Ngày chiếu</th>
                                    <th>Giờ chiếu</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>{savedTheater?.name}</strong></td>
                                    <td><strong>{selectedDate}/2025</strong></td>
                                    <td><strong>{selectedTime.startTime.slice(0, 5)}</strong></td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="text-center">
                            <button
                                className="btn btn-success px-5 py-2 fw-bold"
                                onClick={() => handleBooking(movieInfo, selectedDate, selectedTime)}
                            >
                                ĐỒNG Ý
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mt-5">
                <div className={styles['tab-wrapper']}>
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
                    <div className="row d-flex justify-content-center" style={{ maxWidth: '1400px', gap: '24px' }}>
                        {showingNow.map((movie) => (
                            <div className="col-md-2 mb-4" key={movie.movieId}>
                                <div
                                    className="card h-100 shadow-sm border-0"
                                    style={{
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        transition: 'transform 0.3s ease',
                                    }}
                                >
                                    <img
                                        src={movie.image}
                                        className="card-img-top"
                                        alt={movie.movieName}
                                        style={{
                                            height: '320px',
                                            objectFit: 'cover',
                                            borderRadius: '12px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleMovieDetails(movie.movieId)}
                                    />
                                    <div className="card-body px-3 py-2 ps-0 pe-0">
                                        <h6 className={`card-title pb-2 fw-bold ${styles.ellipsis} `} style={{ color: '#0d6efd', cursor: 'pointer' }} onClick={() => handleMovieDetails(movie.movieId)}>
                                            {movie.movieName}
                                        </h6>
                                        <p className={`mb-1 ${styles.ellipsis}`} style={{ fontSize: '14px' }}>
                                            <strong>Thể loại:</strong> {movie.genre}
                                        </p>
                                        <p className={`mb-2 ${styles.ellipsis}`} style={{ fontSize: '14px' }}>
                                            <strong>Thời lượng:</strong> {movie.duration}
                                        </p>
                                        <button className="btn btn-primary btn-sm w-100 rounded" onClick={() => handleOpenModal(movie)}>
                                            Đặt vé
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="row d-flex justify-content-center" style={{ maxWidth: '1400px', gap: '24px' }}>
                        {commingSoon.map((movie) => (
                            <div className="col-md-2 mb-4" key={movie.movieId}>
                                <div
                                    className="card h-100 shadow-sm border-0"
                                    style={{
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        transition: 'transform 0.3s ease',
                                    }}
                                >
                                    <img
                                        src={movie.image}
                                        className="card-img-top"
                                        alt={movie.movieName}
                                        style={{
                                            height: '300px',
                                            objectFit: 'cover',
                                            borderRadius: '12px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleMovieDetails(movie.movieId)}
                                    />
                                    <div className="card-body px-3 py-2 pe-0 ps-0" style={{ minWidth: 0 }}>
                                        <h6 className={`card-title pb-2 fw-bold ${styles.ellipsis} `} style={{ color: '#0d6efd', cursor: 'pointer' }} onClick={() => handleMovieDetails(movie.movieId)}>
                                            {movie.movieName}
                                        </h6>
                                        <p className={`mb-1 ${styles.ellipsis}`} style={{ fontSize: '14px' }}>
                                            <strong>Thể loại:</strong> {movie.genre}
                                        </p>
                                        <p className={`mb-2 ${styles.ellipsis}`} style={{ fontSize: '14px' }}>
                                            <strong>Ngày khởi chiếu:</strong> {new Date(movie.releaseDate).toLocaleDateString('vi-VN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </p>
                                        <button className="btn btn-primary btn-sm w-100 rounded" onClick={() => handleOpenModal(movie)}>
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

export default Movies;
