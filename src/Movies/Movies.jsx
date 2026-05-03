import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Movies.module.css';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import ShowtimePopup from '../Home/Showtime-popup';
import { useTranslation } from 'react-i18next';


function Movies() {
    const { t, i18n } = useTranslation();
    const [nowShowing, setNowShowing] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const [showingNow, setShowingNow] = useState([]);
    const [commingSoon, setCommingSoon] = useState([]);
    const [showModal1, setShowModal1] = useState(false);
    const [movieInfo, setMovieInfo] = useState([]);
    const [savedTheater, setSavedTheater] = useState(JSON.parse(localStorage.getItem('theater')));

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
        const handleTheaterChange = () => {
            setSavedTheater(JSON.parse(localStorage.getItem('theater')));
        };
        window.addEventListener('theaterChange', handleTheaterChange);
        return () => window.removeEventListener('theaterChange', handleTheaterChange);
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
        <div className={styles.pageWrapper}>
            {/* Modal Chọn Rạp */}
            {showChoseLocation && (
                <div className={styles.overlay}>
                    <div className={styles.popup}>
                        <button className={styles.closeBtn} onClick={() => setShowChoseLocation(false)}>
                            <i className="bi bi-x-lg"></i>
                        </button>

                        <div className={styles.content}>
                            <h4 className="text-center fw-bold mb-4">{t('chooseCinema')}</h4>
                            <div className={styles.formGroup}>
                                <label>{t('province')}</label>
                                <select
                                    value={selectedLocation}
                                    onChange={e => {
                                        const provCode = e.target.value;
                                        setSelectedLocation(provCode);
                                        const filtered = allTheaters.filter(t => t.provinceCode === provCode);
                                        setTheater(filtered);
                                        setselectedTheater("");
                                    }}
                                >
                                    <option value="">{t('selectProvince')}</option>
                                    {Array.isArray(locations) &&
                                        locations.map((loc, idx) => (
                                            <option key={idx} value={loc.code}>{loc.name}</option>
                                        ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>{t('cinemaName')}</label>
                                <select
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
                                            window.dispatchEvent(new Event('theaterChange'));
                                        }
                                    }}
                                >
                                    <option value="">{t('selectCinema')}</option>
                                    {Array.isArray(theater) &&
                                        theater.map((theaterItem, idx) => (
                                            <option key={idx} value={theaterItem.id}>{theaterItem.name}</option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Popup Suất Chiếu */}
            <ShowtimePopup
                show={showModal1}
                movie={{ ...movieInfo, name: movieInfo.movieName, id: movieInfo.movieId || movieInfo.id }}
                onClose={handleCloseModal}
                savedTheater={savedTheater}
            />

            {/* Hero Section */}
            <header className={styles.heroSection}>
                <div className="container">
                    <h1 className={styles.heroTitle}>{t('heroTitle')}</h1>
                    <p className={styles.heroSubtitle}>{t('heroSubtitle')}</p>
                </div>
            </header>

            <div className="container-fluid px-3 px-md-5">
                {/* Tab Navigation */}
                <div className={styles['tab-wrapper']}>
                    <div
                        className={`${styles.tab} ${nowShowing ? styles.active : ''}`}
                        onClick={() => setNowShowing(true)}
                    >
                        {t('nowShowing')}
                    </div>
                    <div
                        className={`${styles.tab} ${!nowShowing ? styles.active : ''}`}
                        onClick={() => setNowShowing(false)}
                    >
                        {t('comingSoon')}
                    </div>
                </div>

                {/* Movie Grid */}
                <div className="row g-4 justify-content-center mx-auto" style={{ maxWidth: '1440px' }}>
                    {(nowShowing ? showingNow : commingSoon).map((movie) => (
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2" key={movie.movieId || movie.id}>
                            <article className={styles.movieCard}>
                                <div className={styles.imageContainer}>
                                    <img
                                        src={movie.image}
                                        className={styles.movieImage}
                                        alt={movie.movieName || movie.name}
                                        onClick={() => handleMovieDetails(movie.movieId || movie.id)}
                                    />
                                </div>

                                <div className={styles.cardBody}>
                                    <h6
                                        className={styles.movieTitle}
                                        onClick={() => handleMovieDetails(movie.movieId || movie.id)}
                                        title={movie.movieName || movie.name}
                                    >
                                        {movie.movieName || movie.name}
                                    </h6>

                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>{t('genre')}</span>
                                        <span className={styles.ellipsis}>{movie.genre}</span>
                                    </div>

                                    {nowShowing ? (
                                        <div className={styles.infoRow}>
                                            <span className={styles.infoLabel}>{t('duration')}</span>
                                            <span>{movie.duration} {t('minutes')}</span>
                                        </div>
                                    ) : (
                                        <div className={styles.infoRow}>
                                            <span className={styles.infoLabel}>{t('releaseDate')}</span>
                                            <span>
                                                {new Date(movie.releaseDate).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'vi-VN', {
                                                    day: '2-digit', month: '2-digit', year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    )}

                                    <button className={styles.btnBooking} onClick={() => handleOpenModal(movie)}>
                                        {t('bookNow')}
                                    </button>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>

                {(nowShowing ? showingNow : commingSoon).length === 0 && (
                    <div className="text-center py-5">
                        <i className="bi bi-film text-muted fs-1 mb-3"></i>
                        <h5 className="text-muted">{t('noMoviesInCategory')}</h5>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Movies;
