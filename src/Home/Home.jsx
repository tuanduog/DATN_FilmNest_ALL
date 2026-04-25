import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Home.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import { useEffect } from 'react';
import ShowtimePopup from './Showtime-popup';

function Homepage() {
    const [nowShowing, setNowShowing] = useState(true);
    const navigate = useNavigate();

    const [showingNow, setShowingNow] = useState([]);
    const [commingSoon, setCommingSoon] = useState([]);
    const [movieInfo, setMovieInfo] = useState(null);
    const [showShowtime, setShowShowtime] = useState(false);
    const savedTheater = JSON.parse(localStorage.getItem('theater'));
    const [showChoseLocation, setShowChoseLocation] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedTheater, setselectedTheater] = useState(savedTheater?.id || "");
    const [banners, setBanners] = useState([]);
    const [theater, setTheater] = useState([]);
    const [allTheaters, setAllTheaters] = useState([]);
    const [locations, setLocation] = useState([]);
    const handleOpenModal = (movie) => {
        if (localStorage.getItem('theater') === null) {
            setShowChoseLocation(true);
            return;
        }
        setMovieInfo(movie);
        setShowShowtime(true);
    }

    const handleMovieDetails = (id) => {
        navigate(`/movie/detail/${id}`);
        window.scrollTo(0, 0);
    }



    const [pageRequest, setPageRequest] = useState({
        page: 0,
        size: 8,
        sort: '',
        keyword: '',
        status: 'ACTIVE'
    });

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await axios.get("http://localhost:8099/api/banner/v1", {
                    params: pageRequest
                });
                const data = res.data.data;
                setBanners(Array.isArray(data.content) ? data.content : []);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách banner", error);
                setBanners([]);
            }
        };
        fetchBanners();
    }, [pageRequest])

    const handleTheaters = async () => {
        const url = `http://localhost:8099/api/theater/v1/all`;
        try {
            const res = await axios.get(url, {
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
                        uniqueProvinces.push({
                            code: t.provinceCode,
                            name: t.provinceName
                        });
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



    const settings = {
        dots: true,
        infinite: true,
        speed: 600,
        autoplay: true,
        autoplaySpeed: 4000,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
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
                                    <label>Tỉnh/Thành phố</label>
                                    <select
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
                                    <select
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
                show={showShowtime}
                movie={movieInfo}
                onClose={() => setShowShowtime(false)}
                savedTheater={savedTheater}
            />
            <div className={styles.banner}>
                <Slider {...settings}>
                    {Array.isArray(banners) && banners.map((item) => (
                        <div key={item.id} style={{ outline: 'none' }}>
                            <img
                                src={item.image}
                                alt={`Banner ${item.id}`}
                            />
                        </div>
                    ))}
                </Slider>
            </div>

            <div className="container-fluid px-3 px-md-5 mt-2">
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
                            <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2" key={movie.id}>
                                <div className={styles.movieCard}>
                                    <img
                                        src={movie.image}
                                        alt={movie.name}
                                        onClick={() => handleMovieDetails(movie.id)}
                                    />
                                    <div className={styles.cardBody}>
                                        <h6 className={`${styles.cardTitleCustom} ${styles.ellipsis}`} onClick={() => handleMovieDetails(movie.id)} title={movie.name}>
                                            {movie.name}
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
                            <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2" key={movie.id}>
                                <div className={styles.movieCard}>
                                    <img
                                        src={movie.image}
                                        alt={movie.name}
                                        onClick={() => handleMovieDetails(movie.id)}
                                    />
                                    <div className={styles.cardBody}>
                                        <h6 className={`${styles.cardTitleCustom} ${styles.ellipsis}`} onClick={() => handleMovieDetails(movie.id)} title={movie.name}>
                                            {movie.name}
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
