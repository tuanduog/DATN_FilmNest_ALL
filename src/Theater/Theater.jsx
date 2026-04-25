import React, { useEffect, useState } from "react";
import styles from "../Theater/Theater.module.css";
import cinemaImg from "../assets/rap.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLng } from 'leaflet';
import axios from "axios";

// Fix Leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


function Theater() {
  const [theater, setTheater] = useState(JSON.parse(localStorage.getItem('theater')) || {});
  const navigate = useNavigate();
  const [top5, setTop5] = useState([]);

  const fetchRanking = async () => {
    try {
      const res = await axios.get("http://localhost:8099/api/review/v1/top");
      setTop5(res.data);
    } catch (error) {
      console.error("Không fetch được ranking", error);
    }
  }

  const fetchTheater = async () => {
    if (!theater.id) return;
    try {
      const res = await axios.get(`http://localhost:8099/api/theater/v1/${theater.id}`);
      setTheater(res.data.data);
    } catch (error) {
      console.error("Không fetch được theater", error);
    }
  }

  useEffect(() => {
    fetchRanking();
    fetchTheater();
  }, [theater.id]);

  const handleMovieDetail = (id) => {
    navigate(`/movie/detail/${id}`);
    window.scrollTo(0, 0);
  }

  return (
    <div className={styles.theaterPage}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.locationBadge}>
              <i className="bi bi-geo-alt-fill me-2"></i>
              {theater.address}
            </span>
            <h1 className={styles.heroTitle}>{theater.name}</h1>
            <div className={styles.businessHours}>
              <i className="bi bi-clock-fill me-2"></i>
              Giờ mở cửa: {theater.openingTime || "08:00"} - {theater.closingTime || "23:00"}
            </div>
            <div className={styles.heroDivider}></div>

          </div>
        </div>
      </div>

      <div className="container mt-n5">
        <div className="row g-4">
          {/* Left Content: Theater Info */}
          <div className="col-lg-8">
            <div className={styles.infoCard}>
              <div className={styles.imageWrapper}>
                <img src={theater.image || cinemaImg} alt={theater.theaterName} className={styles.cinemaImg} />
                <div className={styles.imageOverlay}></div>
              </div>

              <div className={styles.detailsContent}>
                <h3 className={styles.sectionTitle}>
                  <i className="bi bi-info-circle-fill me-2 text-primary"></i>
                  Giới thiệu rạp
                </h3>
                <div className={styles.descriptionText}>
                  {theater.description && <div dangerouslySetInnerHTML={{ __html: theater.description }} />}
                </div>

                {/* Map Section */}
                <div className={styles.mapSection}>
                  <h3 className={styles.sectionTitle}>
                    <i className="bi bi-map-fill me-2 text-primary"></i>
                    Vị trí rạp
                  </h3>
                  <div className={styles.mapContainer}>
                    {theater.latitude && theater.longitude ? (
                      <MapContainer
                        center={[theater.latitude, theater.longitude]}
                        zoom={15}
                        scrollWheelZoom={false}
                        className={styles.leafletContainer}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[theater.latitude, theater.longitude]}>
                        </Marker>
                      </MapContainer>
                    ) : (
                      <div className={styles.mapPlaceholder}>
                        <i className="bi bi-geo-alt fs-1 mb-2"></i>
                        <p>Thông tin tọa độ đang được cập nhật...</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 d-flex justify-content-between align-items-center">
                    <p className="text-muted small mb-0">
                      <i className="bi bi-pin-map-fill me-1"></i>
                      {theater.address}
                    </p>
                    {theater.latitude && theater.longitude && (
                      <a 
                        href={`https://www.google.com/maps?q=${theater.latitude},${theater.longitude}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.googleMapsBtn}
                      >
                        <i className="bi bi-google me-2"></i>
                        Xem trên Google Maps
                      </a>
                    )}
                  </div>

                </div>

                <div className={styles.featureGrid}>

                  <div className={styles.featureItem}>
                    <i className="bi bi-aspect-ratio"></i>
                    <span>Màn hình lớn</span>
                  </div>
                  <div className={styles.featureItem}>
                    <i className="bi bi-speaker"></i>
                    <span>Âm thanh Dolby</span>
                  </div>
                  <div className={styles.featureItem}>
                    <i className="bi bi-p-square"></i>
                    <span>Bãi đỗ xe rộng</span>
                  </div>
                  <div className={styles.featureItem}>
                    <i className="bi bi-cup-straw"></i>
                    <span>Bắp nước đa dạng</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content: Trending Movies */}
          <div className="col-lg-4">
            <div className={styles.trendingCard}>
              <div className={styles.trendingHeader}>
                <h3 className={styles.trendingTitle}>
                  <i className="bi bi-fire me-2"></i>
                  PHIM ĐANG HOT
                </h3>
                <div className={styles.smallDivider}></div>
              </div>

              <div className={styles.trendingList}>
                {top5.slice(0, 5).map((movie, index) => (
                  <div
                    className={styles.miniMovieCard}
                    key={index}
                    onClick={() => handleMovieDetail(movie[0])}
                  >
                    <div className={styles.miniPosterWrapper}>
                      <img src={movie[1]} alt={movie[2]} className={styles.miniPoster} />
                      <div className={styles.rankBadge}>{index + 1}</div>
                    </div>
                    <div className={styles.miniInfo}>
                      <h4 className={styles.miniName}>{movie[2]}</h4>
                      <div className={styles.miniRating}>
                        <i className="bi bi-star-fill text-warning me-1"></i>
                        <span>{movie[3]?.toFixed(1) || "5.0"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className={styles.viewMoreBtn}
                onClick={() => navigate('/Ranking')}
              >
                Xem tất cả bảng xếp hạng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Theater;


