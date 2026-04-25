import React from "react";
import styles from "./Ranking.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Ranking() {
  const navigate = useNavigate();
  const [top5, setTop5] = useState([]);

  const fetchRanking = async () => {
    try {
      const res = await axios.get("http://localhost:8099/api/review/get-Top5Movies");
      console.log('ranking', res.data);
      setTop5(res.data);
    } catch (error) {
      console.error("Không fetch được ranking", error);
    }
  }
  useEffect(() => {
    fetchRanking();
  }, []);

  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return index + 1;
  }

  const handleMovieDetail = (id) => {
    navigate("/Movie_detail", { state: { id } });
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>🎬 BẢNG XẾP HẠNG PHIM HOT</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Poster</th>
            <th>Tên Phim</th>
            <th>Đánh giá ⭐</th>
          </tr>
        </thead>
        <tbody>
          {top5.map((movie, index) => (
            <tr className={styles.row} key={index}>
              <td className={styles.rank}>{getMedal(index)}</td>
              <td><img src={movie[1]} alt={movie[2]} className={styles.poster} /></td>
              <td className={styles.name} onClick={() => handleMovieDetail(movie[0])}>{movie[2]}</td>
              <td className={styles.rating}>{movie[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Ranking;
