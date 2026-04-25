import React, { useRef, useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import '../Movies/Movie_detail.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import { Client } from "@stomp/stompjs";
import CommentItem from './CommentItem';
import { useParams } from 'react-router-dom';
import ShowtimePopup from '../Home/Showtime-popup';

function Movie_detail() {
    const { id } = useParams();

    const [showModal, setShowModal] = useState(false);
    const [movieInfo, setMovieInfo] = useState({});
    const [showTrailer, setShowTrailer] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
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
        setShowModal(true);
    }

    const handleCloseTrailer = () => setShowTrailer(false);

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

    const updateOrCreateRate = async (starValue, movieId) => {
        const userStr = sessionStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            try {
                await axios.put(`http://localhost:8099/api/review/v1/${movieId}/${user.userId}`, { starValue }, { withCredentials: true });
                setRating(starValue);
            } catch (error) {
                console.error("Update rate failed", error);
            }
        } else {
            navigate("/Login");
            window.scrollTo(0, 0);
        }
    }

    const fetchReview = useCallback(async () => {
        const userStr = sessionStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                const res = await axios.get(`http://localhost:8099/api/review/v1/${id}/${user.userId}`, { withCredentials: true });
                const rate = res.data.data ? res.data.data.point : res.data.point;
                setRating(rate || 0);
            } catch (error) {
                console.error("Fetch review failed", error);
            }
        }
    }, [id]);

    const fetchMovie = useCallback(async () => {
        try {
            const res = await axios.get(`http://localhost:8099/api/movie/v1/${id}`);
            if (res.data.status === 200 && res.data.data) {
                setMovieInfo(res.data.data);
                fetchComments(id);
            } else {
                console.error("Lỗi khi lấy thông tin phim hoặc phim không tồn tại:", res.data.message);
                setMovieInfo({ error: true });
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin phim:", error);
            setMovieInfo({ error: true });
        }
    }, [id]);

    const fetchComments = async (movieId) => {
        try {
            const res = await axios.get(`http://localhost:8099/api/comment/v1/${movieId}`);
            setDataCmt(Array.isArray(res.data.data) ? res.data.data : []);
        } catch (error) {
            console.error("Lỗi lấy comment", error);
        }
    }

    const handleCmt = async (type, idCmt) => {
        const userStr = sessionStorage.getItem('user');
        if (!userStr) {
            navigate("/Login");
            return;
        }
        const user = JSON.parse(userStr);
        let content = "";
        if (type === 0) content = message;
        else if (type === 1) content = messSub;
        else content = messWtag;

        let cmt = {
            userId: user.userId,
            movieId: movieInfo.movieId || movieInfo.id,
            content: content,
            parentId: type === 0 ? 0 : idCmt,
            tag: type === 2 ? messWtag.split(' ')[0] : ""
        };

        if (client.current && client.current.connected) {
            client.current.publish({
                destination: `/app/comment/${movieInfo.movieId || movieInfo.id}`,
                body: JSON.stringify(cmt),
            });
        }

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
            brokerURL: "ws://localhost:8099/wsocket",
            onConnect: () => {
                stompClient.subscribe(`/topic/comments/${id}`, (msg) => {
                    const newCmt = JSON.parse(msg.body);
                    setDataCmt((prev) => [newCmt, ...prev]);
                });
            },
        });
        stompClient.activate();
        client.current = stompClient;

        return () => stompClient.deactivate();
    }, [fetchMovie, fetchReview, id]);

    if (movieInfo.error) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <h3 className="text-danger">Không tìm thấy thông tin phim hoặc đã có lỗi xảy ra.</h3>
                <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>Quay lại trang chủ</button>
            </div>
        );
    }

    if (!movieInfo || Object.keys(movieInfo).length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            </div>
        );
    }

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



            {/* Backdrop & Info Section */}
            <div className="movie-backdrop" style={{ backgroundImage: `url(${movieInfo.image})` }}>
                <div className="backdrop-overlay"></div>
            </div>

            <div className="container movie-info-wrapper">
                <div className="row g-5">
                    <div className="col-lg-3">
                        <img src={movieInfo.image} alt={movieInfo.name} className="poster-img" />
                    </div>
                    <div className="col-lg-9 movie-main-info">
                        <h1 className="movie-title">{movieInfo.name}</h1>

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
                                <div className="meta-item"><i className="bi bi-calendar-event-fill meta-icon"></i><strong>Khởi chiếu:</strong> {movieInfo.releaseDate ? new Date(movieInfo.releaseDate).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</div>
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
                                {Array.isArray(dataCmt) && dataCmt.map((cmt) => (
                                    <CommentItem
                                        key={cmt.commentId}
                                        cmt={cmt}
                                        handleCmt={handleCmt}
                                        messSub={messSub}
                                        setMessSub={setMessSub}
                                        messWtag={messWtag}
                                        setMesWtag={setMesWtag}
                                    />
                                ))}
                            </div>

                            <div className="comment-input-wrapper mt-5">
                                <textarea
                                    className="form-control border-0 bg-white"
                                    rows="3"
                                    placeholder="Chia sẻ suy nghĩ của bạn về phim..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                ></textarea>
                                <div className="d-flex justify-content-end mt-3">
                                    <button className="btn btn-primary px-4" onClick={() => handleCmt(0, 0)}>
                                        <i className="bi bi-send-fill me-2"></i>Gửi bình luận
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        {/* Sidebar content */}
                        <div className="p-4 bg-light rounded-4 sticky-top" style={{ top: '100px' }}>
                            <h5 className="fw-bold mb-3">Lưu ý</h5>
                            <p className="small text-muted mb-0">Vui lòng chọn rạp chiếu để xem lịch và đặt vé. Giá vé có thể thay đổi tùy theo loại ghế và suất chiếu.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Showtime Popup */}
            <ShowtimePopup
                show={showModal}
                movie={{ ...movieInfo, name: movieInfo.movieName, id: movieInfo.id }}
                onClose={handleCloseModal}
                savedTheater={savedTheater}
            />
        </div>
    );
}


export default Movie_detail;

