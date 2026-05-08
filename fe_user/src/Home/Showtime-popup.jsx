import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

const ShowtimePopup = ({ show, movie, onClose, savedTheater }) => {
    const navigate = useNavigate();
    const [showDates, setShowDates] = useState([]);
    const [showTime, setShowTime] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState(null);
    const [confirmPopup, setConfirmPopup] = useState(false);

    useEffect(() => {
        if (show && movie) {
            const dates = generateAvailableShowDates(movie.releaseDate, movie.dateShow);
            setShowDates(dates);
            setSelectedIndex(0);
            if (dates.length > 0) {
                setSelectedDate(dates[0].full);
            }
            fetchShowTime(movie.id);
        }
    }, [show, movie, savedTheater]);

    const generateAvailableShowDates = (releasedDateStr, numberOfDays) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const releasedDate = new Date(releasedDateStr);
        releasedDate.setHours(0, 0, 0, 0);

        const showDates = [];
        const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

        let current = new Date(Math.max(today, releasedDate));

        // Luôn hiển thị 7 ngày tới để người dùng chọn
        for (let i = 0; i < 7; i++) {
            const formatted = `${current.getDate().toString().padStart(2, '0')}/${(current.getMonth() + 1)
                .toString()
                .padStart(2, '0')}`;
            showDates.push({
                full: formatted,
                day: current.getDate(),
                month: current.getMonth() + 1,
                dayName: daysOfWeek[current.getDay()]
            });
            current.setDate(current.getDate() + 1);
        }
        return showDates;
    };

    const fetchShowTime = async (movieId) => {
        try {
            const res = await axios.get(`http://localhost:8099/api/showtime/v1/movie/${savedTheater?.id}/${movieId}`);
            setShowTime(res.data.data);
            console.log(res.data.data);
        } catch (error) {
            console.error("Lỗi khi lấy lịch chiếu", error);
            setShowTime([]);
        }
    };

    const handleBooking = (movieInfo, date, time) => {
        const user = sessionStorage.getItem('state');

        // Đảm bảo có showTimeId và roomid cho màn Booking
        const timeWithIds = {
            ...time,
            showTimeId: time.showTimeId || time.id,
            roomid: time.roomid || time.roomId || (time.room && time.room.id),
            surcharge: time.surcharge || 0
        };


        const bookingInfo = {
            movieInfo,
            date,
            time: timeWithIds,
            movieId: movieInfo.id,
            theaterId: savedTheater?.id
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
    };


    const getGroupedShowtimes = () => {
        const filtered = showTime.filter(time => {
            if (!time.showDate) return true;
            const date = new Date(time.showDate);
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            return formattedDate === selectedDate;
        });

        return filtered.reduce((acc, time) => {
            const roomName = time.roomName || (time.room && (time.room.roomName)) || "Phòng chiếu";
            if (!acc[roomName]) acc[roomName] = [];
            acc[roomName].push(time);
            return acc;
        }, {});
    };

    const groupedShowtimes = getGroupedShowtimes();

    if (!show || !movie) return null;

    return (
        <>
            {/* Lịch Chiếu Popup */}
            <div className={styles.overlay} onClick={onClose}>
                <div className={styles.popup} style={{ maxWidth: '850px', width: '95%', overflow: 'hidden', padding: '0', borderRadius: '20px' }} onClick={(e) => e.stopPropagation()}>

                    {/* Header Section */}
                    <div className="p-4 bg-white border-bottom position-relative">
                        <button
                            className={styles.closeBtn}
                            onClick={onClose}
                            style={{ top: '15px', right: '15px', zIndex: 100 }}
                        >
                            &times;
                        </button>

                        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-center gap-5 gap-md-5">
                            <div style={{ maxWidth: '60%' }}>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <span className="badge bg-primary text-uppercase" style={{ fontSize: '10px', padding: '4px 10px', borderRadius: '4px' }}>FilmNest Cinema</span>
                                    <div className="vr opacity-25" style={{ height: '12px' }}></div>
                                    <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '11px' }}>Lịch chiếu phim</span>
                                </div>
                                <h2 className="fw-bold text-dark mb-0" style={{ fontSize: '26px', letterSpacing: '-0.5px', lineHeight: '1.2' }}>
                                    {movie.name}
                                </h2>
                            </div>

                            <div className="d-none d-md-block opacity-10" style={{ width: '1px', height: '40px', backgroundColor: '#000' }}></div>

                            <div className="d-flex align-items-center gap-3 text-primary bg-primary-subtle px-3 py-2 rounded-3 border border-primary-subtle shadow-sm">
                                <i className="bi bi-geo-alt-fill fs-5"></i>
                                <div className="text-start">
                                    <div className="text-muted" style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', opacity: 0.7 }}>Rạp đang chọn</div>
                                    <div className="fw-bold" style={{ fontSize: '14px', lineHeight: '1.2' }}>{savedTheater?.name}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                        {/* Date Timeline */}
                        <div className="d-flex gap-2 mb-4 overflow-x-auto pb-3 scrollbar-hide justify-content-start justify-content-md-center">
                            {showDates.map((dateObj, i) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        setSelectedIndex(i);
                                        setSelectedDate(dateObj.full);
                                    }}
                                    className="d-flex flex-column align-items-center justify-content-center rounded-3 cursor-pointer transition-all"
                                    style={{
                                        minWidth: '65px',
                                        height: '80px',
                                        cursor: 'pointer',
                                        transition: 'all 0.25s ease',
                                        backgroundColor: i === selectedIndex ? '#0d6efd' : '#fff',
                                        color: i === selectedIndex ? '#fff' : '#444',
                                        border: i === selectedIndex ? '1px solid #0d6efd' : '1px solid #dee2e6',
                                        boxShadow: i === selectedIndex ? '0 8px 16px -4px rgba(13, 110, 253, 0.4)' : 'none',
                                        transform: i === selectedIndex ? 'translateY(-3px)' : 'none'
                                    }}
                                >
                                    <span style={{ fontSize: '11px', fontWeight: '700', marginBottom: '2px', opacity: 0.8 }}>{dateObj.dayName}</span>
                                    <span style={{ fontSize: '22px', fontWeight: '800', lineHeight: '1' }}>{dateObj.day}</span>
                                    <span style={{ fontSize: '10px', fontWeight: '600', marginTop: '2px', opacity: 0.7 }}>Th.{dateObj.month}</span>
                                </div>
                            ))}
                        </div>

                        {/* Room & Showtimes Area */}
                        <div className="pe-1" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                            {Object.keys(groupedShowtimes).length === 0 ? (
                                <div className="text-center py-5 bg-white rounded-4 border border-dashed">
                                    <div className="bg-light d-inline-flex p-3 rounded-circle mb-3">
                                        <i className="bi bi-calendar-x text-muted fs-2"></i>
                                    </div>
                                    <h6 className="text-muted fw-bold">Hiện chưa có lịch chiếu cho ngày này</h6>
                                    <p className="text-secondary small mb-0">Vui lòng quay lại sau hoặc chọn một ngày khác.</p>
                                </div>
                            ) : (
                                Object.entries(groupedShowtimes).map(([room, times], idx) => (
                                    <div key={idx} className="mb-4 bg-white p-4 rounded-4 border shadow-sm">
                                        <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom border-light">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-primary text-white p-2 rounded-3 me-3 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                                                    <i className="bi bi-display fs-5"></i>
                                                </div>
                                                <div>
                                                    <h6 className="fw-bold mb-0 text-dark text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '14px' }}>
                                                        {room}
                                                    </h6>
                                                    <div className="text-muted" style={{ fontSize: '11px' }}>Phòng chiếu {times[0]?.roomType?.toUpperCase() || "TIÊU CHUẨN"}</div>
                                                </div>
                                            </div>
                                            <span className="badge bg-light text-primary border border-primary-subtle fw-bold" style={{ fontSize: '10px', padding: '5px 10px' }}>
                                                {times[0]?.roomType?.toUpperCase() || "2D DIGITAL"}
                                            </span>
                                        </div>

                                        <div className="d-flex flex-wrap gap-3">
                                            {times.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((time, tIdx) => (
                                                <div
                                                    key={tIdx}
                                                    onClick={() => {
                                                        setSelectedTime(time);
                                                        setConfirmPopup(true);
                                                    }}
                                                    className="px-3 py-2 rounded-3 border text-center cursor-pointer transition-all position-relative overflow-hidden"
                                                    style={{
                                                        minWidth: '100px',
                                                        backgroundColor: '#fff',
                                                        transition: 'all 0.2s ease',
                                                        border: '1px solid #e9ecef',
                                                        cursor: 'pointer'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.borderColor = '#0d6efd';
                                                        e.currentTarget.style.backgroundColor = '#f8fbff';
                                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(13, 110, 253, 0.1)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.borderColor = '#e9ecef';
                                                        e.currentTarget.style.backgroundColor = '#fff';
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    }}
                                                >
                                                    <div className="fw-bold text-dark fs-5 mb-0" style={{ lineHeight: '1.2' }}>{time.startTime.slice(0, 5)}</div>
                                                    <div className="text-muted fw-medium" style={{ fontSize: '11px', marginTop: '2px' }}>{time.capacity || 0} ghế</div>
                                                    {time.surcharge > 0 && (
                                                        <div className="text-danger fw-bold" style={{ fontSize: '10px' }}>+{time.surcharge.toLocaleString()}đ</div>
                                                    )}

                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Xác Nhận Popup */}
            {confirmPopup && (
                <div className={styles.overlay} onClick={() => setConfirmPopup(false)}>
                    <div className={styles.popup} style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setConfirmPopup(false)}>&times;</button>

                        <h6 className="text-center text-uppercase mt-2 mb-2 text-muted fw-bold" style={{ letterSpacing: '0.5px' }}>
                            Xác nhận đặt vé
                        </h6>
                        <h4 className="text-center text-primary fw-bold mb-4">
                            {movie.name || "Tên phim"}
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
                                        <td className="py-3 text-dark fw-bold">{savedTheater?.name}</td>
                                        <td className="py-3 text-dark fw-bold">{selectedDate}/2026</td>
                                        <td className="py-3 text-primary fw-bold">{selectedTime?.startTime.slice(0, 5)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="text-center">
                            <button
                                className={`btn btn-success px-5 py-2 w-100 ${styles.btnBook}`}
                                onClick={() => handleBooking(movie, selectedDate, selectedTime)}
                            >
                                ĐỒNG Ý
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ShowtimePopup;
