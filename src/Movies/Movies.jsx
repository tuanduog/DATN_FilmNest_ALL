import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Movies.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import ShowtimePopup from '../Home/Showtime-popup';


function Movies() {
    const [nowShowing, setNowShowing] = useState(true);
    const navigate = useNavigate();

    const [showingNow, setShowingNow] = useState([]);
    const [commingSoon, setCommingSoon] = useState([]);
    const [showModal1, setShowModal1] = useState(false);
    const [movieInfo, setMovieInfo] = useState([]);
    const savedTheater = JSON.parse(localStorage.getItem('theater'));

    const [showChoseLocation, setShowChoseLocation] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedTheater, setselectedTheater] = useState("");
    const [theater, setTheater] = useState([]);
    const [allTheaters, setAllTheaters] = useState([]);
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
        setShowModal1(true);
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

    const handleMovieDetails = (id) => {
        navigate(`/movie/detail/${id}`);
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
                                            const filtered = allTheaters.filter(t => t.provinceCode === provCode);
                                            setTheater(filtered);
                                            setselectedTheater("");
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
            <ShowtimePopup
                show={showModal1}
                movie={{ ...movieInfo, name: movieInfo.movieName, id: movieInfo.movieId || movieInfo.id }}
                onClose={handleCloseModal}
                savedTheater={savedTheater}
            />


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
                            <div className="col-md-2 mb-4" key={movie.id}>
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
                                        alt={movie.name}
                                        style={{
                                            height: '300px',
                                            objectFit: 'cover',
                                            borderRadius: '12px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleMovieDetails(movie.id)}
                                    />
                                    <div className="card-body px-3 py-2 pe-0 ps-0" style={{ minWidth: 0 }}>
                                        <h6 className={`card-title pb-2 fw-bold ${styles.ellipsis} `} style={{ color: '#0d6efd', cursor: 'pointer' }} onClick={() => handleMovieDetails(movie.movieId)}>
                                            {movie.name}
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
