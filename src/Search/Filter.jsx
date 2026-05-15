import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './Filter.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Filter() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    // Search & filter states
    const [searchInput, setSearchInput] = useState('');
    const [keyword, setKeyword] = useState('');
    const [showingStatus, setShowingStatus] = useState('');

    // Data states
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    // Pagination states
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 8;

    // Initialize keyword from navigation state
    useEffect(() => {
        if (location.state?.name) {
            setSearchInput(location.state.name);
            setKeyword(location.state.name);
        }
    }, [location.state?.name]);

    // Fetch movies from API
    const fetchMovies = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page: page,
                size: pageSize,
                status: 'ACTIVE',
            };
            if (keyword) params.keyword = keyword;
            if (showingStatus) params.showingStatus = showingStatus;

            const res = await axios.get('http://localhost:8099/api/movie/v1', { params });
            const data = res.data.data;

            if (data && data.content) {
                setMovies(data.content);
                setTotalPages(data.totalPages || 0);
                setTotalElements(data.totalElements || 0);
            } else {
                setMovies([]);
                setTotalPages(0);
                setTotalElements(0);
            }
        } catch (err) {
            console.error("Fetch movies failed:", err);
            setMovies([]);
            setTotalPages(0);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
    }, [page, keyword, showingStatus]);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    // Reset page when filters change
    useEffect(() => {
        setPage(0);
    }, [keyword, showingStatus]);

    const handleSearch = (e) => {
        e.preventDefault();
        setKeyword(searchInput);
    };

    const handleMovieDetails = (id) => {
        navigate(`/movie/detail/${id}`);
        window.scrollTo(0, 0);
    };

    const handleStatusFilter = (status) => {
        setShowingStatus(prev => prev === status ? '' : status);
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'now_showing': return t('nowShowing');
            case 'coming_soon': return t('comingSoon');
            default: return status;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'now_showing': return styles.statusNowShowing;
            case 'coming_soon': return styles.statusComingSoon;
            default: return styles.statusStopped;
        }
    };

    // Build page numbers array
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(0, page - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible);
        if (end - start < maxVisible) {
            start = Math.max(0, end - maxVisible);
        }
        for (let i = start; i < end; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className={styles.pageWrapper}>
            {/* Hero Search Section */}
            <div className={styles.heroSearch}>
                <div className={styles.heroInner}>
                    <h1 className={styles.heroTitle}>
                        <i className="bi bi-search me-2" style={{ fontSize: '24px' }}></i>
                        {t('searchMovies')}
                    </h1>
                    <p className={styles.heroSubtitle}>
                        {t('searchSubtitle')}
                    </p>

                    <form onSubmit={handleSearch} className={styles.searchBar}>
                        <i className={`bi bi-search ${styles.searchIcon}`}></i>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder={t('searchPlaceholder')}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <button type="submit" className={styles.searchBtn}>
                            <i className="bi bi-search"></i>
                            {t('searchBtn')}
                        </button>
                    </form>
                </div>
            </div>

            {/* Filter Bar */}
            <div className={styles.filterBar}>
                <div className={styles.filterGroup}>
                    <span className={styles.filterLabel}>
                        <i className="bi bi-funnel me-1"></i>
                        {t('filterByStatus')}:
                    </span>
                    <span
                        className={`${styles.filterChip} ${showingStatus === '' ? styles.filterChipActive : ''}`}
                        onClick={() => setShowingStatus('')}
                    >
                        {t('all')}
                    </span>
                    <span
                        className={`${styles.filterChip} ${showingStatus === 'now_showing' ? styles.filterChipActive : ''}`}
                        onClick={() => handleStatusFilter('now_showing')}
                    >
                        <i className="bi bi-play-circle me-1"></i>
                        {t('nowShowing')}
                    </span>
                    <span
                        className={`${styles.filterChip} ${showingStatus === 'coming_soon' ? styles.filterChipActive : ''}`}
                        onClick={() => handleStatusFilter('coming_soon')}
                    >
                        <i className="bi bi-clock me-1"></i>
                        {t('comingSoon')}
                    </span>
                </div>

                <div className={styles.resultCount}>
                    {!loading && (
                        <>
                            {t('found')} <strong>{totalElements}</strong> {t('moviesFound')}
                            {keyword && (
                                <span> {t('forKeyword')} "<strong>{keyword}</strong>"</span>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className={styles.loadingWrapper}>
                    <div className={styles.spinner}></div>
                    <span className={styles.loadingText}>{t('loading')}</span>
                </div>
            ) : movies.length > 0 ? (
                <>
                    {/* Movie Grid */}
                    <div className={styles.movieGrid}>
                        {movies.map((movie) => (
                            <article className={styles.movieCard} key={movie.id}>
                                <img
                                    src={movie.image}
                                    alt={movie.name}
                                    onClick={() => handleMovieDetails(movie.id)}
                                />
                                <div className={styles.cardBody}>
                                    <h6
                                        className={styles.cardTitle}
                                        onClick={() => handleMovieDetails(movie.id)}
                                        title={movie.name}
                                    >
                                        {movie.name}
                                    </h6>

                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>{t('genre')}</span>
                                        <span className={styles.ellipsis}>{movie.genre}</span>
                                    </div>

                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>{t('duration')}</span>
                                        <span>{movie.duration} {t('minutes')}</span>
                                    </div>

                                    {movie.showingStatus && (
                                        <div className={styles.infoRow} style={{ marginBottom: '12px' }}>
                                            <span className={`${styles.statusBadge} ${getStatusClass(movie.showingStatus)}`}>
                                                <i className={`bi ${movie.showingStatus === 'now_showing' ? 'bi-circle-fill' : 'bi-clock'}`}
                                                    style={{ fontSize: '7px' }}></i>
                                                {getStatusLabel(movie.showingStatus)}
                                            </span>
                                        </div>
                                    )}

                                    <button
                                        className={styles.btnBook}
                                        onClick={() => handleMovieDetails(movie.id)}
                                    >
                                        {t('view-detail')}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                className={styles.pageArrow}
                                onClick={() => setPage(prev => Math.max(0, prev - 1))}
                                disabled={page === 0}
                            >
                                <i className="bi bi-chevron-left"></i>
                            </button>

                            {getPageNumbers().map((p) => (
                                <button
                                    key={p}
                                    className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
                                    onClick={() => setPage(p)}
                                >
                                    {p + 1}
                                </button>
                            ))}

                            <button
                                className={styles.pageArrow}
                                onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                                disabled={page >= totalPages - 1}
                            >
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <i className="bi bi-film"></i>
                    </div>
                    <h5 className={styles.emptyTitle}>
                        {t('noMoviesFound')}
                    </h5>
                    <p className={styles.emptyText}>
                        {t('tryAnotherSearch')}
                    </p>
                </div>
            )}
        </div>
    );
}

export default Filter;