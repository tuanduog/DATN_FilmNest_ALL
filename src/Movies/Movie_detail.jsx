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
import { useTranslation } from 'react-i18next';

function Movie_detail() {
    const { t, i18n } = useTranslation();
    const { id } = useParams();

    const [showModal, setShowModal] = useState(false);
    const [movieInfo, setMovieInfo] = useState({});
    const [showTrailer, setShowTrailer] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [savedTheater, setSavedTheater] = useState(JSON.parse(localStorage.getItem('theater')));
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
    const [dataCmtAfterBuild, setDataCmtAfterBuild] = useState([]);
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
        const handleTheaterChange = () => {
            setSavedTheater(JSON.parse(localStorage.getItem('theater')));
        };
        window.addEventListener('theaterChange', handleTheaterChange);
        return () => window.removeEventListener('theaterChange', handleTheaterChange);
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

    const BuildCommentTree = (comments) => {
        const map = {};
        const roots = [];
        comments.forEach(cmt => {
            map[cmt.commentId] = { ...cmt, children: [] }
        });

        comments.forEach(cmt => {
            if (cmt.parentId === 0) {
                roots.push(map[cmt.commentId]); // comment gốc
            } else if (map[cmt.parentId]) {
                map[cmt.parentId].children.push(map[cmt.commentId]);
            }
        });
        return roots;
    }

    const fetchComments = async (movieId) => {
        try {
            const res = await axios.get(`http://localhost:8099/api/comment/v1/${movieId}`, { withCredentials: true });
            const rawList = Array.isArray(res.data.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
            setDataCmtAfterBuild(rawList);
            const tree = BuildCommentTree(rawList);
            setDataCmt(tree);
        } catch (error) {
            console.error("Lỗi lấy comment", error);
        }
    }

    const handleCmt = (level, parentId) => {
        const userStr = sessionStorage.getItem('user');
        if (!userStr) {
            navigate("/Login");
            return;
        }
        const user = JSON.parse(userStr);
        let content = null;
        if (level === 0) content = message;
        else if (level === 1) content = messSub;
        else if (level === 2) content = messWtag;

        if (!content || !content.trim()) return;

        const mess = {
            content: content,
            level: level,
            parentId: parentId,
            userId: user.userId,
            movieId: id,
            userName: user.username
        };
        if (client.current && client.current.connected) {
            client.current.publish({ destination: "/app/push-cmt", body: JSON.stringify(mess) });
            setMessSub("");
            setMesWtag("");
            setMessage("");
        } else {
            console.error("WebSocket chưa kết nối!");
        }
    };

    useEffect(() => {
        fetchMovie();
        fetchReview();
        if (!hasScroll.current) {
            window.scrollTo(0, 0);
            hasScroll.current = true;
        }

        if (client.current) {
            client.current.deactivate();
        }

        const stompClient = new Client({
            brokerURL: "ws://localhost:8099/wsocket",
            debug: (str) => console.log("STOMP:", str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log("Connected to WS!");
                stompClient.subscribe(`/topic/comment/${id}`, (msg) => {
                    const res = JSON.parse(msg.body);
                    setDataCmtAfterBuild((prev) => {
                        const updated = [...prev, res];
                        const tree = BuildCommentTree(updated);
                        setDataCmt(tree);
                        return updated;
                    });
                });
                stompClient.subscribe(`/topic/reaction/${id}`, (msg) => {
                    const res = JSON.parse(msg.body);
                    setDataCmtAfterBuild((prev) => {
                        const updated = prev.map(cmt =>
                            cmt.commentId === res.commentId
                                ? { ...cmt, likeCount: res.likeCount, dislikeCount: res.dislikeCount, myReaction: res.myReaction }
                                : cmt
                        );
                        setDataCmt(BuildCommentTree(updated));
                        return updated;
                    });
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
                <h3 className="text-danger">{t('movieNotFound')}</h3>
                <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>{t('backHome')}</button>
            </div>
        );
    }

    if (!movieInfo || Object.keys(movieInfo).length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">{t('loading')}</span>
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
                        <h3 className="section-title mb-4">{t('chooseCinemaTitle')}</h3>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="fw-bold mb-2">{t('province')}</label>
                                <select className="form-select form-select-custom" value={selectedLocation} onChange={(e) => {
                                    const code = e.target.value;
                                    setSelectedLocation(code);
                                    setTheater(allTheaters.filter(t => t.provinceCode === code));
                                    setselectedTheater("");
                                }}>
                                    <option value="">{t('selectLocation')}</option>
                                    {locations.map((loc, i) => <option key={i} value={loc.code}>{loc.name}</option>)}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="fw-bold mb-2">{t('cinemaName')}</label>
                                <select className="form-select form-select-custom" value={selectedTheater} onChange={(e) => {
                                    const val = e.target.value;
                                    setselectedTheater(val);
                                    const selected = theater.find(t => t.id && t.id.toString() === val);
                                    if (selected) {
                                        localStorage.setItem('theater', JSON.stringify({ id: selected.id, name: selected.name, theaterLocation: selected.theaterLocation }));
                                        window.dispatchEvent(new Event('theaterChange'));
                                    }
                                }}>
                                    <option value="">{t('selectCinema')}</option>
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
                                <div className="meta-item"><i className="bi bi-tag-fill meta-icon"></i><strong>{t('genre')}:</strong> {movieInfo.genre}</div>
                                <div className="meta-item"><i className="bi bi-clock-fill meta-icon"></i><strong>{t('duration')}:</strong> {movieInfo.duration}</div>
                            </div>
                            <div className="col-md-6">
                                <div className="meta-item"><i className="bi bi-calendar-event-fill meta-icon"></i><strong>{t('releaseDate')}:</strong> {movieInfo.releaseDate ? new Date(movieInfo.releaseDate).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'vi-VN') : t('notUpdated')}</div>
                                <div className="meta-item"><i className="bi bi-person-badge-fill meta-icon"></i><strong>{t('director')}:</strong> {movieInfo.director}</div>
                            </div>
                        </div>

                        <div className="d-flex gap-3">
                            <button className="btn btn-primary btn-book" onClick={handleOpenModal}>{t('bookNow')}</button>
                            <button className="btn btn-outline-danger btn-trailer" onClick={() => setShowTrailer(true)}>
                                <i className="bi bi-play-circle-fill me-2"></i>{t('watchTrailer')}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-lg-8">
                        <h3 className="section-title">{t('synopsis')}</h3>
                        <p className="description-text mt-3">{movieInfo.description}</p>

                        <div className="comment-section">
                            <h3 className="section-title">{t('comments')}</h3>

                            {/* Comment list */}
                            <div className="mt-4">
                                {Array.isArray(dataCmt) && dataCmt.length > 0 ? (
                                    dataCmt.map((cmt) => (
                                        <CommentItem
                                            key={cmt.commentId}
                                            cmt={cmt}
                                            handleCmt={handleCmt}
                                            messSub={messSub}
                                            setMessSub={setMessSub}
                                            messWtag={messWtag}
                                            setMesWtag={setMesWtag}
                                            client={client}
                                        />
                                    ))
                                ) : (
                                    <div className="no-comment">
                                        <i className="bi bi-chat-square-text" style={{ fontSize: 40, opacity: 0.3 }}></i>
                                        <p className="mt-2">{t('noComments') || 'Chưa có bình luận nào. Hãy là người đầu tiên!'}</p>
                                    </div>
                                )}
                            </div>

                            {/* Write comment */}
                            <div className="comment-input-wrapper mt-4">
                                <div className="d-flex gap-3">
                                    <div style={{
                                        flexShrink: 0, width: 42, height: 42, borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#fff', fontWeight: 700, fontSize: 16,
                                        boxShadow: '0 3px 8px rgba(102,126,234,0.35)'
                                    }}>
                                        {(JSON.parse(sessionStorage.getItem('user') || '{}')?.username || '?').charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <textarea
                                            style={{
                                                width: '100%', border: '1px solid #e0e4f0', borderRadius: 12,
                                                padding: '12px 16px', fontSize: 14, resize: 'none',
                                                background: '#f7f8fc', color: '#333', outline: 'none',
                                                transition: 'border-color 0.2s, box-shadow 0.2s'
                                            }}
                                            rows="3"
                                            placeholder={t('commentPlaceholder')}
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onFocus={e => { e.target.style.borderColor = '#0d6efd'; e.target.style.boxShadow = '0 0 0 3px rgba(13,110,253,0.1)'; e.target.style.background = '#fff'; }}
                                            onBlur={e => { e.target.style.borderColor = '#e0e4f0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f7f8fc'; }}
                                        />
                                        <div className="d-flex justify-content-end mt-2">
                                            <button
                                                style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: 8,
                                                    padding: '8px 22px', background: 'linear-gradient(135deg, #0d6efd, #6610f2)',
                                                    color: '#fff', border: 'none', borderRadius: 20,
                                                    fontSize: 14, fontWeight: 600, cursor: 'pointer',
                                                    transition: 'all 0.2s ease', boxShadow: '0 3px 10px rgba(13,110,253,0.25)'
                                                }}
                                                onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 18px rgba(13,110,253,0.4)'; }}
                                                onMouseLeave={e => { e.target.style.transform = ''; e.target.style.boxShadow = '0 3px 10px rgba(13,110,253,0.25)'; }}
                                                onClick={() => handleCmt(0, 0)}
                                            >
                                                <i className="bi bi-send-fill"></i>
                                                {t('sendComment')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="col-lg-4">
                        {/* Sidebar content */}
                        <div className="p-4 bg-light rounded-4 sticky-top" style={{ top: '100px' }}>
                            <h5 className="fw-bold mb-3">{t('sidebarTitle')}</h5>
                            <p className="small text-muted mb-0">{t('sidebarContent')}</p>
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

