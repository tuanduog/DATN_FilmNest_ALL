import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className="row g-4">
          {/* Logo & About */}
          <div className="col-12 col-lg-4 pe-lg-5">
            <span className={styles.logoText}>FILMNEST</span>
            <p className={styles.footerText}>
              Trải nghiệm điện ảnh đỉnh cao tại FilmNest. Chúng tôi mang đến hệ thống âm thanh, hình ảnh hiện đại nhất cùng dịch vụ chuyên nghiệp hàng đầu.
            </p>
            <div className={styles.socialContainer}>
              <a href="#" className={styles.socialIcon} title="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className={styles.socialIcon} title="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className={styles.socialIcon} title="Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#" className={styles.socialIcon} title="Youtube">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-lg-2">
            <h5 className={styles.footerTitle}>Dịch vụ</h5>
            <a href="#" className={styles.footerLink}>Lịch chiếu phim</a>
            <a href="#" className={styles.footerLink}>Hệ thống rạp</a>
            <a href="#" className={styles.footerLink}>Ưu đãi</a>
            <a href="#" className={styles.footerLink}>Thẻ thành viên</a>
          </div>

          {/* Quick Links 2 */}
          <div className="col-6 col-lg-2">
            <h5 className={styles.footerTitle}>Hỗ trợ</h5>
            <a href="#" className={styles.footerLink}>Liên hệ</a>
            <a href="#" className={styles.footerLink}>Tuyển dụng</a>
            <a href="#" className={styles.footerLink}>Điều khoản sử dụng</a>
            <a href="#" className={styles.footerLink}>Câu hỏi thường gặp</a>
          </div>

          {/* Contact Info */}
          <div className="col-12 col-lg-4 ps-lg-5">
            <h5 className={styles.footerTitle}>Thông tin liên hệ</h5>
            <div className={styles.contactInfo}>
              <i className={`bi bi-geo-alt-fill ${styles.contactIcon}`}></i>
              <span className={styles.footerText}>123 Đường Điện Ảnh, Quận 1, TP. Hồ Chí Minh</span>
            </div>
            <div className={styles.contactInfo}>
              <i className={`bi bi-telephone-fill ${styles.contactIcon}`}></i>
              <span className={styles.footerText}>Hotline: 1900 6868</span>
            </div>
            <div className={styles.contactInfo}>
              <i className={`bi bi-envelope-fill ${styles.contactIcon}`}></i>
              <span className={styles.footerText}>Email: contact@filmnest.vn</span>
            </div>
          </div>
        </div>

        <div className={styles.copyrightSection}>
          <p className="mb-0">© 2025 FilmNest Cinema. Bản quyền thuộc về FilmNest Team.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
