import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../Footer/Footer.module.css";

function Footer() {
  return (
    <footer className="text-dark mt-5 pt-4 pb-3 px-3 shadow" style={{backgroundColor: '#e4e4e4ff', borderTop: '1px solid black'}}>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-10 mx-auto">
            <div className="row text-start mt-3" style={{paddingLeft: '130px'}}>
              {/* Cột trái */}
              <div className="col-md-6 mb-4 ps-md-5">
                <h5 className={styles.footerTitle}>🎬 LUCKY CINEMA</h5>
                <p className={styles.footerText}>Mang đến trải nghiệm điện ảnh tuyệt vời nhất cho bạn.</p>
                <p className={styles.footerText}>Địa chỉ: 123 Đường Chiếu Phim, Quận 7, TP. HCM</p>
                <p className={styles.footerText}>Hotline: 1900 1234</p>
                <p className={styles.footerText}>Email: support@luckycinema.vn</p>
              </div>

              {/* Cột phải */}
              <div className="col-md-6 mb-4" style={{paddingLeft: '90px'}}>
                <h5 className={styles.footerTitle}>Liên kết & Mạng xã hội</h5>
                <div className="mb-3">
                  <a href="" className={styles.linkHoverEffect}>Điều khoản</a>
                  <a href="" className={styles.linkHoverEffect}>Chính sách bảo mật</a>
                  <a href="" className={styles.linkHoverEffect}>Hỏi đáp</a>
                </div>
                <div className="d-flex">
                  <a href="" className={styles.socialIcon}>
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href=""  className={styles.socialIcon}>
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href=""  className={styles.socialIcon}>
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-muted pt-3" style={{ fontSize: "0.9rem" }}>
          © 2025 LUCKY CINEMA. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
