import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from './Filter.module.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function Filter() {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const navigate = useNavigate();

    const location = useLocation();

    const [searchName, setSearchName] = useState('');
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    useEffect(() => {
        if (location.state?.name) {
            setSearchName(location.state.name);
        }
    }, [location.state?.name]);

    useEffect(() => {
        axios.get('http://localhost:8099/movies/getGenres')
            .then(res => {
                if (res.data.status === 200) {
                    setGenres(res.data.data || []);
                } else {
                    setGenres([]);
                }
            })
            .catch(() => setGenres([]));
    }, []);

    const handleMovieDetails = (id) => {
        navigate("/Movie_detail", { state: { id } });
    }

    // Xử lý lọc phim khi thay đổi form
    useEffect(() => {
        let url = 'http://localhost:8099/movies/get-products-multiple-searching-col?pageNo=0&pageSize=10';
        if (selectedGenre) url += `&search=genre:${encodeURIComponent(selectedGenre)}`;
        if (searchName) url += `&search=movieName:${encodeURIComponent(searchName)}`;
        // if (selectedLanguage) url += `language=${encodeURIComponent(selectedLanguage)}&`;

        axios.get(url)
            .then(res => {
                if (res.data.status === 200) {
                    setMovies(res.data.data.items || []);
                    console.log("Movies fetched successfully:", res.data.items);
                } else {
                    setMovies([]);
                }
            })
            .catch(() => setMovies([]));
    }, [selectedGenre, searchName]);

    // ...existing code...
    return (
        <div>
            <div className="container mt-5">
                {/* Form lọc phim */}
                <form className="mb-4" onSubmit={e => e.preventDefault()}>
                    <div className="row g-2 align-items-center">
                        <div className="col-auto">
                            <label htmlFor="nameInput" className="col-form-label">Tên phim:</label>
                        </div>
                        <div className="col-auto">
                            <input
                                id="nameInput"
                                type="text"
                                className="form-control"
                                value={searchName}
                                onChange={e => setSearchName(e.target.value)}
                                placeholder="Nhập tên phim"
                            />
                        </div>
                        <div className="col-auto">
                            <label htmlFor="genreSelect" className="col-form-label">Thể loại:</label>
                        </div>
                        <div className="col-auto">
                            <select
                                id="genreSelect"
                                value={selectedGenre}
                                onChange={e => setSelectedGenre(e.target.value)}
                                className="form-select"
                            >
                                <option value="">Tất cả</option>
                                {genres.map((genre) => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-auto">
                            <label htmlFor="languageSelect" className="col-form-label">Ngôn ngữ:</label>
                        </div>
                        <div className="col-auto">
                            <select
                                id="languageSelect"
                                value={selectedLanguage}
                                onChange={e => setSelectedLanguage(e.target.value)}
                                className="form-select"
                            >
                                <option value="">Tất cả</option>
                                {languages.map((lang) => (
                                    <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </form>
                <div className="row">
                    {movies && movies.length > 0 ? (
                        movies.map((movie, i) => (
                            <div className="col-md-2 mb-4" key={movie.movieId}    >
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
                                        }}
                                    />
                                    <div className="card-body px-3 py-2 ps-0 pe-0">

                                        <h6 className={`card-title pb-2 fw-bold ${style.ellipsis} `} style={{ color: '#0d6efd', cursor: 'pointer' }} onClick={() => handleMovieDetails(movie.movieId)}>
                                            {movie.movieName}
                                        </h6>
                                        <p className={`mb-1 ${style.ellipsis}`} style={{ fontSize: '14px' }}>
                                            <strong>Thể loại:</strong> {movie.genre}
                                        </p>
                                        <p className="mb-2" style={{ fontSize: '14px' }}>
                                            <strong>Thời lượng:</strong> {movie.duration}
                                        </p>
                                        <a href="#" className="btn btn-primary btn-sm w-100 rounded" >
                                            Đặt vé
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center">
                            <p style={{ margin: "140px", fontSize: '25px' }}>Không có phim nào phù hợp.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}

export default Filter;