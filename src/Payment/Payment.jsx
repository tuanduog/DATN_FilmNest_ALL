import React from "react";
import styles from './Payment.module.css'; 
import momoQR from '../assets/MoMo_Logo.png'; 
import betaLogo from '../assets/vite-vite-logo.png';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Payment = () => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(() => {
        const storedTime = localStorage.getItem('timeLeft');
        return storedTime ? parseInt(storedTime, 10) : 600;
    });
    const handleBack = () => {
        navigate(-1);
    }
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };
    useEffect(() => {
              if (timeLeft <= 0) {
                  localStorage.removeItem("timeLeft");
                  navigate("/");
              } else {
                  localStorage.setItem('timeLeft', timeLeft);
              }
      
              const interval = setInterval(() => {
                  setTimeLeft(prev => prev - 1);
              }, 1000);
      
              return () => clearInterval(interval); 
        }, [timeLeft]);
  return (
    <div className={styles.paymentContainer}>
      {/* Thông tin đơn hàng */}
      <div className={styles.orderInfo}>
        <h5>Thông tin đơn hàng</h5>
        <div className={styles.row}>
          <span>Nhà cung cấp</span>
          <div className="d-flex align-items-center gap-2">
            <img src={betaLogo} alt="Beta Cinemas" style={{ width: '20px' }} />
            <strong>LUCKY CINEMA</strong>
          </div>
        </div>
        <div className={styles.row}>
          <span>Mã đơn hàng</span>
          {/* <strong>278450c6-3b5b-4ee4c</strong> */}
          <strong></strong>
        </div>
        <div className={styles.row}>
          <span>Nội dung thanh toán</span>
          <strong>Thanh toan don hang </strong>
        </div>
        <div className={styles.row}>
          <span>Số tiền</span>
          <strong> VNĐ</strong>
        </div>

        <div className={styles.expireBox}>
          <p>Đơn hàng sẽ hết hạn sau:</p>
          <div className={styles.countdown}>
            <div>
              <strong>0{formatTime(timeLeft).split(':')[0]}</strong>
              <small> Phút</small>
            </div>
            <div>
              <strong>{formatTime(timeLeft).split(':')[1]}</strong>
              <small> Giây</small>
            </div>
          </div>
          <p className={styles.backLink} onClick={handleBack}>Quay về</p>
        </div>
      </div>

      {/* Mã QR thanh toán */}
      <div className={styles.qrSection}>
        <h5>Quét mã QR để thanh toán</h5>
        <div className={styles.paymentChannels}>
        </div>
        <img src={momoQR} alt="QR Code" className={styles.qrImage} />

        <p style={{ marginTop: '12px' }}>
          Sử dụng <strong>App MoMo</strong> hoặc <strong>ứng dụng ngân hàng</strong> để quét mã
        </p>
        <p className={styles.guide}>
          Gặp khó khăn khi thanh toán? <a href="#">Xem Hướng dẫn</a>
        </p>
      </div>
    </div>
  );
};

export default Payment;
