import React, { useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import '../Movies/Movie_detail.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { Client } from "@stomp/stompjs";
import CommentItem from './CommentItem';

function Movie_detail() {
    const [showModal, setShowModal] = useState(false);
    const [confirmPopup, setConfirmPopup] = useState(false);
    const [movieInfo, setMovieInfo] = useState([]);
    const [showTrailer, setShowTrailer] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [showDates, setShowDates] = useState([]);
    const [showTime, setShowTime] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState([]);
    const [rating, setRating] = useState(0); // Số sao được chọn
    const [hover, setHover] = useState(0); 
    const savedTheater = JSON.parse(localStorage.getItem('theater'));
    const [showChoseLocation, setShowChoseLocation] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(""); // địa điểm đã chọn
    const [selectedTheater, setselectedTheater] = useState(""); // thông tin các rạp
    const[theater, setTheater] = useState([]);
    const[locations, setLocation] = useState([]);
    
    const hasScroll = useRef(false);
    const [message, setMessage] = useState("");
    const [messSub, setMessSub] = useState("");
    const [messWtag, setMesWtag] = useState("");
    const [dataCmt, setDataCmt] = useState([]);
    const [dataCmtAfterBuild, setDataCmtAfterBuild] = useState([]);
    const client = useRef(null);
    // const trailerUrl = "https://www.youtube.com/watch?v=BGS4l3xEc-0";
    // const embedUrl = trailerUrl.replace("watch?v=", "embed/"); // đổei sang link nhúng
    const handleCloseModal = () => {
        setShowModal(false);
    }
    const handleOpenModal = () => {
        if(localStorage.getItem('theater') === null){
            setShowChoseLocation(true);
            return;
        }
        const select = generateAvailableShowDates(movieInfo.releaseDate, movieInfo.dateShow);
        setShowDates(select);
        setSelectedIndex(0);
        setSelectedDate(select[0]);
        fetchShowTime(movieInfo.movieId);
        setShowModal(true);
    }
    const handleCloseConfirm = () => {
        setConfirmPopup(false);
    }
    const handleOpenConfirm = () => {
        setConfirmPopup(true);
    }
    const handleCloseTrailer = () => {
        setShowTrailer(false);
    }
    const handleBooking = (movieInfo, date, time) => {
        // console.log('Booking:', { movieInfo, date, time });
        const user = sessionStorage.getItem('state');
        const bookingInfo = {
            movieInfo, date, time
        };
        localStorage.setItem('bookingInfo', JSON.stringify(bookingInfo));
        if(!user){
            navigate("/Login");
        } else {
            localStorage.removeItem('timeLeft');
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
    const fetchShowTime = async (movieId) => {
            try {
                const res = await axios.get(`http://localhost:8099/auth/get-showtime/${movieId}`);
    
                console.log('showtime:',res.data);
                setShowTime(res.data);
            } catch (error){
                console.error("Lỗi khi lấy phim", error);
            }
    }
    const updateOrCreateRate = async (starValue, movieId) => { //
        const userStr = sessionStorage.getItem('user');
        if(userStr){
            const user = JSON.parse(userStr);
            try {
            const res = await axios.put(`http://localhost:8099/reviews/update-Rate/${movieId}/${user.userId}`, 
                {starValue},
                { withCredentials: true }
            )
                console.log(res.data);
                setRating(starValue);
            } catch(error){
                console.error("Update rate that bai", error);
            }
        } else {
            navigate("/Login");
        }
    }
    const fetchReview = async () => {
        const userStr = sessionStorage.getItem('user');
        if(userStr){
            try {
                const movieId = location.state?.id;
                const user = JSON.parse(userStr);
                const res = await axios.get(`http://localhost:8099/reviews/get-Review/${movieId}/${user.userId}`,
                    { withCredentials: true }
            )
                setRating(res.data.point);
                
            } catch (error) {
                console.error("fetch review that bai", error);
            }
        } else {
            console.log("Chưa đăng nhập");
        }
    }

    useEffect(() => {
        fetchReview();
    },[]);
    const fetchMovie = async () => {
        try {
            const id = location.state?.id;

            const res = await axios.get(`http://localhost:8099/movie/get-movie/${id}`);
            setMovieInfo(res.data);
            console.log(res.data);
        } catch (error){
            console.error("Lỗi khi lấy thông tin phim:", error);
        }
    }
    useEffect(() => {
        fetchMovie();
        if(!hasScroll.current){
            window.scrollTo(0, 0);
            hasScroll.current = true;
        }
    },[]);

    
    const BuildCommentTree = (comments) => {
        const map = {};
        const roots = [];
        comments.forEach(cmt => {
            map[cmt.commentId] = {...cmt, children: []}
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

    useEffect(() => {
        const movieId = location.state?.id;
        const fetchCmt = async () => {
            const res = await axios.get(`http://localhost:8099/comments/getAll-Comments/${movieId}`);
            console.log("all cmt:",res.data);
            setDataCmtAfterBuild(res.data);
            const tree = BuildCommentTree(res.data);
            console.log("part cmt:", tree );
            setDataCmt(tree);
        }

        fetchCmt();
    },[]);

    useEffect(() => {
        if(client.current){
            client.current.deactivate();
        }

        const movieId = location.state?.id;

        client.current = new Client({
            brokerURL: "ws://localhost:8099/wsocket",
            debug: (str) => console.log("STOMP:", str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log("Connected to WS!");
                client.current.subscribe(
                    `/topic/comment/${movieId}`,
                    (message) => {
                        const res = JSON.parse(message.body);
                        console.log(res);
                        setDataCmtAfterBuild((prev) => {
                            const updated = [...prev, res];
                            const tree = BuildCommentTree(updated);
                            setDataCmt(tree);
                            return updated;
                        })
                    }
                )
            }
        });

        client.current.activate();

    },[]);

    const handleCmt = (level, parentId) => {
        const userStr = sessionStorage.getItem('user');
        if(!userStr){
            navigate("/Login");
            return;
        }
        const user = JSON.parse(userStr);
        const movieId = location.state?.id;
        let content = null;
        if(level === 0){
            content = message;
        }
        if(level === 1){
            content = messSub;
        }
        if(level === 2){
            content = messWtag;
        }
        const mess = {
            content: content,
            level: level,
            parentId: parentId,
            userId: user.userId,
            movieId: movieId,
            userName: user.username
        }
        if(client.current){
            client.current.publish({ destination: "/app/push-cmt", body: JSON.stringify(mess)});
            setMessSub("");
            setMesWtag("");
            setMessage("");
        }
    }
    
    return (
        <div className="container mt-5">
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
                            style={{ fontSize: '14px'}}
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
                                if(selectedObj){
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
            {showTrailer && (
            <div className="modal-overlay" onClick={handleCloseTrailer}>
                {/* <span className="close-btn fs-3" onClick={handleCloseTrailer}>&times;</span> */}
                <div
                className="modal-box p-3 rounded shadow"
                style={{ maxWidth: '800px', width: '90%' }}
                onClick={(e) => e.stopPropagation()}
                >
                <div className="ratio ratio-16x9">
                    <iframe // nhúng youtube
                    width="100%"
                    height="400"
                    // src={embedUrl}
                    src={movieInfo.trailerUrl}
                    title="YouTube Trailer"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    ></iframe>
                </div>
                </div>
            </div>
            )}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-box p-4 rounded shadow" onClick={(e) => e.stopPropagation()}>
                        <span className="close-btn fs-3" onClick={handleCloseModal}>&times;</span>

                        <h3 className="text-uppercase text-center fw-bold mb-3" style={{ color: '#0d6efd' }}>
                        LỊCH CHIẾU - {movieInfo.movieName}
                        </h3>

                        <h5 className="text-center mb-4 text-secondary">{savedTheater.theaterName}</h5>

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
                                        className="showtime"
                                        onClick={() => {
                                            handleOpenConfirm();
                                            setSelectedTime(time);
                                        }}
                                    >
                                        <div className="time fw-bold fs-5 mb-1">
                                            {time.startTime.slice(0, 5)} {/* Format HH:mm */}
                                        </div>
                                        <div className="seats text-muted" style={{fontSize: '13px'}}>91 ghế ngồi</div>
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
                        <td><strong>{savedTheater.theaterName}</strong></td>
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

            <div className="row">
                <div className="col-md-3">
                    <img src={movieInfo.image} alt="Poster phim" className="img-fluid rounded shadow" />
                </div>

                <div className="col-md-9">
                    <h2 className="mb-3">Tên phim: {movieInfo.movieName}</h2>
                    <p><strong>Thể loại:</strong> {movieInfo.genre}</p>
                    <p><strong>Thời lượng:</strong> {movieInfo.duration}</p>
                    <p><strong>Khởi chiếu:</strong> {new Date(movieInfo.releaseDate).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })}</p>
                    <p><strong>Đạo diễn:</strong> {movieInfo.director}</p>

                    <div>
                        <strong>Nội dung:</strong><br />
                        <p style={{fontSize: '15px', paddingTop: '4px'}}>{movieInfo.movieDescription}</p>
                    </div>
                    <div style={{ display: "inline-block" }}>
                    <span
                        style={{
                        fontWeight: "600",
                        fontSize: "16px",
                        color: "#333",
                        marginRight: "10px",
                        }}
                    >
                        Đánh giá phim:
                    </span>
                    {[...Array(5)].map((_, index) => {
                        const starValue = index + 1;
                        const isFilled = starValue <= (hover || rating);

                        return (
                        <i
                            key={index}
                            className={`fa-${isFilled ? "solid" : "regular"} fa-star`}
                            style={{
                            fontSize: "22px",
                            marginRight: "5px",
                            cursor: "pointer",
                            color: isFilled ? "gold" : "gray",
                            }}
                            onClick={() => updateOrCreateRate(starValue, movieInfo.movieId)}
                            onMouseEnter={() => setHover(starValue)}
                            onMouseLeave={() => setHover(0)}
                        ></i>
                        );
                    })}
                    </div>

                    <div className="mt-4 d-flex gap-3">
                        <button className="btn btn-primary" onClick={handleOpenModal}>
                            Đặt vé ngay
                        </button>
                        <a className="btn btn-outline-danger" onClick={() => setShowTrailer(true)}>
                            🎬 Xem trailer
                        </a>
                    </div>
                </div>
            </div>
            
            <div className="mt-5 p-4 rounded shadow" style={{ backgroundColor: '#f8f9fa' }}>
                <h3 className="mb-3">Bình luận</h3>
                
                {dataCmt.map((cmt => (
                    <CommentItem
                        key={cmt.commentId}
                        cmt={cmt}
                        handleCmt={handleCmt}
                        messSub={messSub}
                        setMessSub={setMessSub}
                        messWtag={messWtag}
                        setMesWtag={setMesWtag}
                    ></CommentItem>
                )))}

                <hr className='mt-4 ms-5 me-5'></hr>
                <form className='mt-4 ps-5 pe-5'>
                    <div className="mb-3">
                        <textarea
                            className="form-control ps-3 pt-2"
                            // style={{ height: '110px', resize: 'none' }}
                            rows="3"
                            placeholder="Viết bình luận của bạn..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        ></textarea>
                    </div>
                    <div className='d-flex justify-content-end'>
                        <button type="button" className="btn btn-primary" onClick={() => handleCmt(0)}>
                        <i className="fas fa-paper-plane me-1" style={{fontSize: '14px'}}></i> Gửi bình luận</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Movie_detail;
