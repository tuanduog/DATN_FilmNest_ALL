import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Footer.module.css";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className="row g-4">
          {/* Logo & About */}
          <div className="col-12 col-lg-4 pe-lg-5">
            <span className={styles.logoText}>FILMNEST</span>
            <p className={styles.footerText}>
              {t('footerAbout')}
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
            <h5 className={styles.footerTitle}>{t('services')}</h5>
            <a href="#" className={styles.footerLink}>{t('movieSchedule')}</a>
            <a href="#" className={styles.footerLink}>{t('cinemaSystem')}</a>
            <a href="#" className={styles.footerLink}>{t('promotions')}</a>
            <a href="#" className={styles.footerLink}>{t('memberCard')}</a>
          </div>

          {/* Quick Links 2 */}
          <div className="col-6 col-lg-2">
            <h5 className={styles.footerTitle}>{t('support')}</h5>
            <a href="#" className={styles.footerLink}>{t('contact')}</a>
            <a href="#" className={styles.footerLink}>{t('recruitment')}</a>
            <a href="#" className={styles.footerLink}>{t('termsOfUse')}</a>
            <a href="#" className={styles.footerLink}>{t('faq')}</a>
          </div>

          {/* Contact Info */}
          <div className="col-12 col-lg-4 ps-lg-5">
            <h5 className={styles.footerTitle}>{t('contactInfoTitle')}</h5>
            <div className={styles.contactInfo}>
              <i className={`bi bi-geo-alt-fill ${styles.contactIcon}`}></i>
              <span className={styles.footerText}>{t('footerAddress')}</span>
            </div>
            <div className={styles.contactInfo}>
              <i className={`bi bi-telephone-fill ${styles.contactIcon}`}></i>
              <span className={styles.footerText}>{t('footerHotline')}</span>
            </div>
            <div className={styles.contactInfo}>
              <i className={`bi bi-envelope-fill ${styles.contactIcon}`}></i>
              <span className={styles.footerText}>{t('footerEmail')}</span>
            </div>
          </div>
        </div>

        <div className={styles.copyrightSection}>
          <p className="mb-0">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
