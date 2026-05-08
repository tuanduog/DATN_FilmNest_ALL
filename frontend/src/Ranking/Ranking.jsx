import React from "react";
import styles from "./Ranking.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Ranking() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [top5, setTop5] = useState([]);

  const fetchRanking = async () => {
    try {
      const res = await axios.get("http://localhost:8099/api/review/v1/top");
      console.log('ranking', res.data);
      setTop5(res.data);
    } catch (error) {
      console.error("Không fetch được ranking", error);
    }
  }

  useEffect(() => {
    fetchRanking();
  }, []);

  const getRankBadge = (index) => {
    if (index === 0) return styles.rankGold;
    if (index === 1) return styles.rankSilver;
    if (index === 2) return styles.rankBronze;
    return styles.rankDefault;
  }

  const handleMovieDetail = (id) => {
    navigate(`/movie/detail/${id}`);
    window.scrollTo(0, 0);
  }

  return (
    <div className={styles.rankingPage}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.headerBadge}>
              <i className="bi bi-trophy-fill me-2"></i>
              {t('topCharts')}
            </div>
            <h1 className={styles.heroTitle}>{t('rankingTitle')}</h1>
            <p className={styles.heroSubtitle}>{t('rankingSubtitle')}</p>
            <div className={styles.heroDivider}></div>
          </div>
        </div>
      </div>

      <div className="container mt-n5">
        <div className={styles.rankingListWrapper}>


        <div className={styles.rankingList}>
          {top5.map((movie, index) => (
            <div 
              className={styles.rankingItem} 
              key={index}
              onClick={() => handleMovieDetail(movie[0])}
            >
              <div className={`${styles.rankBadge} ${getRankBadge(index)}`}>
                {index + 1}
              </div>
              
              <div className={styles.posterWrapper}>
                <img src={movie[1]} alt={movie[2]} className={styles.moviePoster} />
                {index < 3 && <div className={styles.ribbon}>Top {index + 1}</div>}
              </div>

              <div className={styles.movieInfo}>
                <h3 className={styles.movieName}>{movie[2]}</h3>
                <div className={styles.metaInfo}>
                  <span className={styles.genre}>{t('trending')}</span>
                  <span className={styles.dot}>•</span>
                  <span className={styles.reviews}>{t('highVotes')}</span>
                </div>
              </div>

              <div className={styles.scoreSection}>
                <div className={styles.ratingValue}>
                  <span className={styles.currentScore}>{movie[3]?.toFixed(1) || "0.0"}</span>
                  <span className={styles.maxScore}>/5</span>
                </div>
                <div className={styles.starsWrapper}>
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i} 
                      className={`bi bi-star-fill ${i < Math.floor(movie[3]) ? styles.starActive : styles.starInactive}`}
                    ></i>
                  ))}
                </div>
              </div>

              <div className={styles.actionSection}>
                <button className={styles.viewBtn}>
                  {t('details')} <i className="bi bi-chevron-right ms-1"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>

  );
}

export default Ranking;

