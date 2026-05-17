import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./History.module.css";
import { FaMapMarkerAlt, FaChair, FaClock, FaGift, FaTicketAlt, FaCheckCircle, FaFilm } from "react-icons/fa";

function History() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const user = JSON.parse(sessionStorage.getItem('user') || "null");
    const bookingInfo = JSON.parse(localStorage.getItem('bookingInfo') || "null");
    const combos = localStorage.getItem('selectedCombos') || '';
    const totalPrice = localStorage.getItem("price");
    const chair = localStorage.getItem('chairString');
    const status = query.get("status");
    const cancel = query.get("cancel");
    const code = query.get("code");

    const [bookings, setBookings] = useState([]);

    let showTimeId = null;
    let date = null;
    let formattedDate = null;
    if(bookingInfo){
        showTimeId = bookingInfo.time?.showTimeId;
        date = bookingInfo.date;
        const [day, month] = date.split("/").map(Number);
        const year = new Date().getFullYear();
        formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    const new_booking = user && bookingInfo ? {
        chair: chair,
        totalPrice: totalPrice,
        combo: combos,
        date: formattedDate,
        user: {
            userId: user.userId
        },
        showTime: {
            showTimeId: showTimeId
        }
    } : null;

    const [hasAdded, setHasAdded] = useState(false);

    useEffect(() => {
        const addBooking = async () => {
            if (hasAdded && !new_booking) return;
            if (status === "PAID" && cancel === "false" && code === "00") {
                try {
                    const checkRes = await axios.get(`http://localhost:8099/booking/check-booking`, {
                        params: {
                            userId: user.userId,
                            showTimeId: showTimeId,
                            chair: chair
                        },
                        withCredentials: true
                    });

                    if (checkRes.data === false) {
                        const res = await axios.post(
                            "http://localhost:8099/booking/add-booking",
                            new_booking,
                            { withCredentials: true }
                        );
                        if (res.status === 200) {
                            console.log("Đặt vé thành công:", res.data);
                            setHasAdded(true);
                            window.location.reload();
                        }
                    } else {
                        console.warn("Vé đã được đặt trước đó.");
                    }
                } catch (error) {
                    console.error("Add booking failed:", error);
                }
            } else {
                console.warn("Thanh toán không hợp lệ, không thêm booking.");
            }
        };

        addBooking();
    }, [hasAdded]);


    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await axios.get(`http://localhost:8099/booking/get-userbooking/${user.userId}`,
                    { withCredentials: true }
                );
                setBookings(res.data);
            } catch (error) {
                console.error("Get user booking failed", error);
            }
        };

        fetchBooking();
    }, []);

    return (
        <div className={styles.pageContainer}>
            {/* Hero Section */}
            <div className={styles.heroSection}>
                <div className="container">
                    <p className={styles.pageSubtitle}>{t('yourActivity')}</p>
                    <h1 className={styles.pageTitle}>{t('bookingHistory')}</h1>
                </div>
            </div>

            <div className={`${styles.historyContent} container`} style={{paddingBottom: (bookings.length === 1 || bookings.length === 0) ? '120px' : '40px'}}>
                {bookings.length === 0 ? (
                    <div className={styles.emptyState}>
                        <FaTicketAlt className={styles.emptyIcon} />
                        <p className="fs-4 fw-bold text-muted">{t('noBookings')}</p>
                        <p className="text-muted">{t('startBookingToday')}</p>
                    </div>
                ) : null}
                
                {bookings.map((booking) => (
                    <div key={booking.bookingId} className={styles.ticketCard}>
                        <div className={styles.ticketImageWrapper}>
                            <img
                                src={booking.movieImage}
                                alt="movie poster"
                                className={styles.ticketImage}
                            />
                        </div>

                        <div className={styles.ticketContent}>
                            <h5 className={styles.movieTitle}>
                                <FaFilm color="#0d6efd" /> {booking.movieName}
                            </h5>
                            
                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <FaMapMarkerAlt className={styles.infoIcon} />
                                    <div className={styles.infoText}>
                                        <span className={styles.infoLabel}>{t('cinemaLabel')}</span>
                                        <span className={styles.infoValue}>{booking.theaterName}</span>
                                    </div>
                                </div>
                                
                                <div className={styles.infoItem}>
                                    <FaClock className={styles.infoIcon} />
                                    <div className={styles.infoText}>
                                        <span className={styles.infoLabel}>{t('showtimeLabel')}</span>
                                        <span className={styles.infoValue}>
                                            {booking.startTime} • {new Date(booking.date).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'vi-VN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.infoItem}>
                                    <FaChair className={styles.infoIcon} />
                                    <div className={styles.infoText}>
                                        <span className={styles.infoLabel}>{t('roomLabel')} & {t('chairLabel')}</span>
                                        <span className={styles.infoValue}>{booking.roomName} • {booking.chair}</span>
                                    </div>
                                </div>
                                
                                <div className={styles.infoItem}>
                                    <FaGift className={styles.infoIcon} />
                                    <div className={styles.infoText}>
                                        <span className={styles.infoLabel}>{t('comboLabel')}</span>
                                        <span className={styles.infoValue}>{booking.combo || t('none')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.ticketDivider}></div>

                        <div className={styles.ticketAction}>
                            <div className="text-center w-100">
                                <div className={styles.bookingCode}>
                                    #{booking.code || booking.bookingId}
                                </div>
                                <div className={styles.priceLabel}>{t('totalPrice')}</div>
                                <div className={styles.priceValue}>
                                    {booking.totalPrice.toLocaleString(i18n.language === 'en' ? 'en-US' : 'vi-VN')}đ
                                </div>
                                <div className="d-flex justify-content-center">
                                    <div className={styles.statusBadge}>
                                        <FaCheckCircle /> {t('paidStatus')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default History;
