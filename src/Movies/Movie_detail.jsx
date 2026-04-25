import React, { useRef, useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import '../Movies/Movie_detail.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import { Client } from "@stomp/stompjs";
import CommentItem from './CommentItem';
import { useParams } from 'react-router-dom';

function Movie_detail() {
    const { id } = useParams();

    const [showModal, setShowModal] = useState(false);
    const [confirmPopup, setConfirmPopup] = useState(false);
    const [movieInfo, setMovieInfo] = useState({});
    const [showTrailer, setShowTrailer] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [showDates, setShowDates] = useState([]);
    const [showTime, setShowTime] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState([]);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const savedTheater = JSON.parse(localStorage.getItem('theater'));
    const [showChoseLocation, setShowChoseLocation] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedTheater, setselectedTheater] = useState("");
    const [theater, setTheater] = useState([]);
    const [allTheaters, setAllTheaters] = useState([]);
    const [locations, setLocation] = useState([]);

    const hasScroll = useRef(false);
    const [message, setMessage] = useState("");
    const [messSub, setMessSub] = useState("");
    const [messWtag, setMesWtag] = useState("");
    const [dataCmt, setDataCmt] = useState([]);
    const client = useRef(null);

    const handleCloseModal = () => setShowModal(false);

    const handleOpenModal = () => {
        if (!localStorage.getItem('theater')) {
            setShowChoseLocation(true);
            return;
        }
        const select = generateAvailableShowDates(movieInfo.releaseDate, movieInfo.dateShow);
        setShowDates(select);
        setSelectedIndex(0);
        setSelectedDate(select[0]);
        fetchShowTime(movieInfo.id);
        setShowModal(true);
    }

    const handleCloseConfirm = () => setConfirmPopup(false);
    const handleOpenConfirm = () => setConfirmPopup(true);
    const handleCloseTrailer = () => setShowTrailer(false);

    const handleBooking = (movieInfo, date, time) => {
        const user = sessionStorage.getItem('state');
        const bookingInfo = { movieInfo, date, time };
        localStorage.setItem('bookingInfo', JSON.stringify(bookingInfo));
        if (!user) {
            navigate("/Login");
        } else {
            localStorage.removeItem('timeLeft');
            navigate('/Booking');
            window.scrollTo(0, 0);
        }
    }

    const handleTheaters = async () => {
        try {
            const res = await axios.get(`http://localhost:8099/api/theater/v1/all`, { withCredentials: true });
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
            }
        } catch (err) {
            console.error("Fetch theaters failed:", err);
        }
    };

    useEffect(() => {
        handleTheaters();
    }, []);

    const generateAvailableShowDates = (releasedDateStr, numberOfDays) => {
        const today = new Date();
        const releasedDate = new Date(releasedDateStr);
        const dates = [];
        const endDate = new Date(releasedDate);
        endDate.setDate(endDate.getDate() + numberOfDays - 1);

        let current = new Date(Math.max(today, releasedDate));
        let count = 0;
        while (current <= endDate && count < 7) {
            dates.push(`${current.getDate().toString().padStart(2, '0')}/${(current.getMonth() + 1).toString().padStart(2, '0')}`);
            current.setDate(current.getDate() + 1);
            count++;
        }
        return dates;
    };

    const fetchShowTime = async (movieId) => {
        try {
            const res = await axios.get(`http://localhost:8099/auth/get-showtime/${movieId}`);
            setShowTime(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy lịch chiếu", error);
        }
    }

    const updateOrCreateRate = async (starValue, movieId) => {
        const userStr = sessionStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            try {
                await axios.put(`http://localhost:8099/api/review/update-Rate/${movieId}/${user.userId}`, { starValue }, { withCredentials: true });
                setRating(starValue);
            } catch (error) {
                console.error("Update rate failed", error);
            }
        } else {
            navigate("/Login");
        }
    }

    const fetchReview = useCallback(async () => {
        const userStr = sessionStorage.getItem('user');
        if (userStr) {
            try {
                const movieId = location.state?.id;
                const user = JSON.parse(userStr);
                const res = await axios.get(`http://localhost:8099/api/review/get-Review/${movieId}/${user.userId}`, { withCredentials: true });
                setRating(res.data.point);
            } catch (error) {
                console.error("Fetch review failed", error);
            }
        }
    }, [id]);

    const fetchMovie = useCallback(async () => {
        try {
            const res = await axios.get(`http://localhost:8099/api/movie/v1/${id}`);
            setMovieInfo(res.data.content);
            fetchComments(id);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin phim:", error);
        }
    }, [id]);

    const fetchComments = async (movieId) => {
        try {
            const res = await axios.get(`http://localhost:8099/auth/get-Comment/${movieId}`);
            setDataCmt(res.data);
        } catch (error) {
            console.error("Lỗi lấy comment", error);
        }
    }

    const handleCmt = async (idCmt) => {
        const userStr = sessionStorage.getItem('user');
        if (!userStr) {
            navigate("/Login");
            return;
        }
        const user = JSON.parse(userStr);
        let content = idCmt === 0 ? message : messSub;
        let cmt = {
            userId: user.userId,
            movieId: movieInfo.id,
            content: content,
            parentId: idCmt,
            tag: messWtag
        };
        client.current.publish({
            destination: `/app/comment/${movieInfo.id}`,
            body: JSON.stringify(cmt),
        });
        setMessage("");
        setMessSub("");
        setMesWtag("");
    };

    useEffect(() => {
        fetchMovie();
        fetchReview();
        if (!hasScroll.current) {
            window.scrollTo(0, 0);
            hasScroll.current = true;
        }

        const stompClient = new Client({
            brokerURL: "ws://localhost:8099/ws",
            onConnect: () => {
                stompClient.subscribe(`/topic/comments/${location.state?.id}`, (msg) => {
                    const newCmt = JSON.parse(msg.body);
                    setDataCmt((prev) => [newCmt, ...prev]);
                });
            },
        });
        stompClient.activate();
        client.current = stompClient;

        return () => stompClient.deactivate();
    }, [fetchMovie, fetchReview, location.state?.id]);

    return (
        <div className="movie-detail-container">
            {/* Modal Trailer */}
            {showTrailer && (
                <div className="modal-overlay" onClick={handleCloseTrailer}>
                    <div className="modal-box p-0 overflow-hidden" style={{ maxWidth: '900px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="ratio ratio-16x9">
                            <iframe src={movieInfo.trailerUrl} title="Trailer" frameBorder="0" allowFullScreen></iframe>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Chọn Rạp */}
            {showChoseLocation && (
                <div className="modal-overlay" onClick={() => setShowChoseLocation(false)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <span className="close-btn" onClick={() => setShowChoseLocation(false)}><i className="bi bi-x-lg"></i></span>
                        <h3 className="section-title mb-4">Chọn rạp chiếu</h3>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="fw-bold mb-2">Tỉnh / Thành phố</label>
                                <select className="form-select form-select-custom" value={selectedLocation} onChange={(e) => {
                                    const code = e.target.value;
                                    setSelectedLocation(code);
                                    setTheater(allTheaters.filter(t => t.provinceCode === code));
                                    setselectedTheater("");
                                }}>
                                    <option value="">Chọn địa điểm</option>
                                    {locations.map((loc, i) => <option key={i} value={loc.code}>{loc.name}</option>)}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="fw-bold mb-2">Tên rạp</label>
                                <select className="form-select form-select-custom" value={selectedTheater} onChange={(e) => {
                                    const val = e.target.value;
                                    setselectedTheater(val);
                                    const selected = theater.find(t => t.id && t.id.toString() === val);
                                    if (selected) {
                                        localStorage.setItem('theater', JSON.stringify({ id: selected.id, name: selected.name, theaterLocation: selected.theaterLocation }));
                                        window.location.reload();
                                    }
                                }}>
                                    <option value="">Chọn rạp</option>
                                    {theater.map((t, i) => <option key={i} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Lịch Chiếu */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <span className="close-btn" onClick={handleCloseModal}><i className="bi bi-x-lg"></i></span>
                        <h3 className="section-title mb-4">Lịch chiếu - {movieInfo.movieName}</h3>
                        <p className="text-muted mb-4"><i className="bi bi-geo-alt-fill me-2"></i>{savedTheater?.name}</p>

                        <div className="date-list d-flex gap-2 overflow-auto pb-3 mb-4">
                            {showDates.map((date, i) => (
                                <div key={i} onClick={() => { setSelectedIndex(i); setSelectedDate(date); }}
                                    className={`px-3 py-2 rounded pointer ${i === selectedIndex ? 'bg-primary text-white shadow' : 'bg-light'}`}
                                    style={{ cursor: 'pointer', minWidth: '75px', textAlign: 'center' }}>
                                    {date}
                                </div>
                            ))}
                        </div>

                        <div className="showtimes d-flex flex-wrap gap-3">
                            {showTime.length === 0 ? <p className="text-muted">Không có lịch chiếu</p> :
                                showTime.map((time, i) => (
                                    <div key={i} className="showtime" onClick={() => { handleOpenConfirm(); setSelectedTime(time); }}>
                                        <div className="fw-bold fs-5">{time.startTime.slice(0, 5)}</div>
                                        <div className="seats small text-muted">91 ghế trống</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            )}

            {/* Backdrop & Info Section */}
            <div className="movie-backdrop" style={{ backgroundImage: `url(${movieInfo.image})` }}>
                <div className="backdrop-overlay"></div>
            </div>

            <div className="container movie-info-wrapper">
                <div className="row g-5">
                    <div className="col-lg-3">
                        <img src={movieInfo.image} alt={movieInfo.movieName} className="poster-img" />
                    </div>
                    <div className="col-lg-9 movie-main-info">
                        <h1 className="movie-title">{movieInfo.movieName}</h1>

                        <div className="star-rating mb-4">
                            {[...Array(5)].map((_, i) => (
                                <i key={i} className={`bi bi-star${(i + 1) <= (hover || rating) ? '-fill' : ''} pointer`}
                                    style={{ color: (i + 1) <= (hover || rating) ? '#ffc107' : '#ccc', cursor: 'pointer' }}
                                    onClick={() => updateOrCreateRate(i + 1, movieInfo.id)}
                                    onMouseEnter={() => setHover(i + 1)}
                                    onMouseLeave={() => setHover(0)}></i>
                            ))}
                            <span className="ms-2 text-muted">({rating}/5)</span>
                        </div>

                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
                                <div className="meta-item"><i className="bi bi-tag-fill meta-icon"></i><strong>Thể loại:</strong> {movieInfo.genre}</div>
                                <div className="meta-item"><i className="bi bi-clock-fill meta-icon"></i><strong>Thời lượng:</strong> {movieInfo.duration}</div>
                            </div>
                            <div className="col-md-6">
                                <div className="meta-item"><i className="bi bi-calendar-event-fill meta-icon"></i><strong>Khởi chiếu:</strong> {new Date(movieInfo.releaseDate).toLocaleDateString('vi-VN')}</div>
                                <div className="meta-item"><i className="bi bi-person-badge-fill meta-icon"></i><strong>Đạo diễn:</strong> {movieInfo.director}</div>
                            </div>
                        </div>

                        <div className="d-flex gap-3">
                            <button className="btn btn-primary btn-book" onClick={handleOpenModal}>ĐẶT VÉ NGAY</button>
                            <button className="btn btn-outline-danger btn-trailer" onClick={() => setShowTrailer(true)}>
                                <i className="bi bi-play-circle-fill me-2"></i>XEM TRAILER
                            </button>
                        </div>
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-lg-8">
                        <h3 className="section-title">Nội dung phim</h3>
                        <p className="description-text mt-3">{movieInfo.description}</p>

                        <div className="comment-section">
                            <h3 className="section-title">Bình luận</h3>
                            <div className="mt-4">
                                {dataCmt.map((cmt) => (
                                    <CommentItem key={cmt.commentId} cmt={cmt} handleCmt={handleCmt} messSub={messSub} setMessSub={setMessSub} messWtag={messWtag} setMesWtag={setMesWtag} />
                                ))}
                            </div>

                            <div className="comment-input-wrapper">
                                <textarea className="form-control border-0 bg-white" rows="3" placeholder="Chia sẻ suy nghĩ của bạn về phim..."
                                    value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                                <div className="d-flex justify-content-end mt-3">
                                    <button className="btn btn-primary px-4" onClick={() => handleCmt(0)}>
                                        <i className="bi bi-send-fill me-2"></i>Gửi bình luận
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        {/* You can add Sidebar content here like Related Movies or Promotions */}
                        <div className="p-4 bg-light rounded-4 sticky-top" style={{ top: '100px' }}>
                            <h5 className="fw-bold mb-3">Lưu ý</h5>
                            <p className="small text-muted mb-0">Vui lòng chọn rạp chiếu để xem lịch và đặt vé. Giá vé có thể thay đổi tùy theo loại ghế và suất chiếu.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Xác Nhận */}
            {confirmPopup && (
                <div className="modal-overlay" onClick={handleCloseConfirm}>
                    <div className="modal-box" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
                        <span className="close-btn" onClick={handleCloseConfirm}><i className="bi bi-x-lg"></i></span>
                        <h4 className="text-center fw-bold mb-4">XÁC NHẬN ĐẶT VÉ</h4>
                        <div className="bg-light p-4 rounded-3 mb-4">
                            <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                                <span className="text-muted">Phim:</span>
                                <span className="fw-bold">{movieInfo.movieName}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                                <span className="text-muted">Rạp:</span>
                                <span className="fw-bold">{savedTheater?.name}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                                <span className="text-muted">Ngày:</span>
                                <span className="fw-bold">{selectedDate}/2025</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Suất chiếu:</span>
                                <span className="fw-bold text-primary fs-5">{selectedTime.startTime?.slice(0, 5)}</span>
                            </div>
                        </div>
                        <button className="btn btn-primary w-100 py-3 fw-bold" onClick={() => handleBooking(movieInfo, selectedDate, selectedTime)}>
                            XÁC NHẬN ĐẶT VÉ
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Movie_detail;
