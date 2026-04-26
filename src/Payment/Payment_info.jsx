import React, { useEffect, useState, useMemo } from "react";
import styles from '../Payment/Payment_info.module.css';
import { FaPlus, FaMinus, FaUser, FaTicketAlt, FaClock, FaTag, FaInfoCircle, FaHourglassHalf } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function PaymentInfo() {
  const userInfo = useMemo(() => JSON.parse(sessionStorage.getItem('user')) || {}, []);
  const bookingInfo = useMemo(() => JSON.parse(localStorage.getItem('bookingInfo')) || {}, []);
  const savedTheater = useMemo(() => JSON.parse(localStorage.getItem('theater')) || {}, []);

  const [membership, setMembership] = useState({});
  const [combos, setCombos] = useState([]);
  const [comboCounts, setComboCounts] = useState({}); // Use ID as key

  const location = useLocation();
  const navigate = useNavigate();

  // Get data from location state or fallback
  const { total = 0, selectedSeats = [], seatTypes = [] } = location.state || {};

  const [totalPrice, setTotalPrice] = useState(total);
  const [voucher, setVoucher] = useState("");
  const [voucherStatus, setVoucherStatus] = useState({ show: false, ok: false, text: "" });
  const [discount, setDiscount] = useState(false);

  const [timeLeft, setTimeLeft] = useState(() => {
    const storedTime = localStorage.getItem('timeLeft');
    return storedTime ? parseInt(storedTime, 10) : 600;
  });

  const seatsWithType = useMemo(() => selectedSeats.map((seat, index) => ({
    seat,
    type: seatTypes[index] || "normal"
  })), [selectedSeats, seatTypes]);

  const handleIncrement = (id) => {
    setComboCounts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleDecrement = (id) => {
    setComboCounts(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) - 1) }));
  };

  useEffect(() => {
    let comboDiscountRate = 1;
    if (membership.membership === "vip tháng") comboDiscountRate = 0.85;
    if (membership.membership === "vip năm") comboDiscountRate = 0.8;

    const comboTotal = combos.reduce((acc, combo) => {
      const count = comboCounts[combo.id] || 0;
      return acc + (combo.price * count);
    }, 0) * comboDiscountRate;

    setTotalPrice(total + comboTotal);
  }, [comboCounts, membership, total, combos]);

  const handleVoucher = () => {
    if (voucher === 'DHDT01') {
      if (totalPrice < 200000) {
        setVoucherStatus({ show: true, ok: false, text: "Voucher chỉ áp dụng cho đơn hàng từ 200.000 VNĐ" });
        setDiscount(false);
      } else {
        setVoucherStatus({ show: true, ok: true, text: "Áp dụng voucher thành công! Giảm 15%" });
        setDiscount(true);
      }
    } else {
      setVoucherStatus({ show: true, ok: false, text: "Mã voucher không hợp lệ" });
      setDiscount(false);
    }
  };

  const handlePayment = async () => {
    const finalPrice = discount ? totalPrice * 0.85 : totalPrice;
    localStorage.setItem('price', finalPrice);

    try {
      const paymentId = localStorage.getItem('paymentId') ||
        'xxxxxxxx-xxxx-xxxx'.replace(/[x]/g, () => Math.floor(Math.random() * 16).toString(16));
      localStorage.setItem('paymentId', paymentId);

      const res = await axios.post("http://localhost:8099/Order/create", {
        productName: 'Đơn hàng: ' + paymentId,
        description: 'Thanh toán vé xem phim FilmNest',
        price: finalPrice,
        returnUrl: "http://localhost:5173/Booking_history",
        cancelUrl: "http://localhost:5173",
      }, { withCredentials: true });

      const payUrl = res.data?.data?.checkoutUrl;
      if (payUrl) {
        window.location.href = payUrl;
      } else {
        toast.error("Không lấy được link thanh toán!");
      }
    } catch (error) {
      console.error("Tạo đơn thanh toán thất bại:", error);
      toast.error("Tạo đơn thanh toán thất bại!");
    }
  };

  useEffect(() => {
    const fetchCombo = async () => {
      try {
        const res = await axios.get("http://localhost:8099/api/combo/v1", {
          params: { page: 0, size: 100, status: 'ACTIVE' }
        });
        setCombos(res.data.data.content);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách combo", error);
      }
    };
    fetchCombo();
  }, []);

  useEffect(() => {
    const selectedCombosStr = combos
      .filter(combo => comboCounts[combo.id] > 0)
      .map(combo => `${combo.name} x${comboCounts[combo.id]}`)
      .join(', ');
    localStorage.setItem('selectedCombos', selectedCombosStr);
  }, [comboCounts, combos]);

  useEffect(() => {
    if (timeLeft <= 0) {
      localStorage.removeItem("timeLeft");
      navigate("/");
    } else {
      localStorage.setItem('timeLeft', timeLeft);
    }
    const interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, navigate]);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await axios.get(`http://localhost:8099/auth/get-Membership/${userInfo.userId}`, { withCredentials: true });
        setMembership(res.data);
      } catch (error) {
        console.error("Không lấy được membership", error);
      }
    };
    if (userInfo.userId) fetchMember();
  }, [userInfo.userId]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!location.state) {
    return (
      <div className="container py-5 text-center">
        <h3>Không tìm thấy thông tin thanh toán!</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>Quay lại trang chủ</button>
      </div>
    );
  }

  const finalAmount = discount ? totalPrice * 0.85 : totalPrice;
  const comboTotalCalculated = combos.reduce((acc, combo) => acc + (combo.price * (comboCounts[combo.id] || 0)), 0);

  return (
    <div className={styles.paymentPage}>
      <div className={styles.container}>
        <div className={styles.layout}>

          {/* Main Content Area */}
          <main className={styles.mainContent}>

            {/* User Info Section */}
            <section className={styles.sectionBox}>
              <h2 className={styles.sectionTitle}><FaUser /> THÔNG TIN KHÁCH HÀNG</h2>
              <div className={styles.userInfoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Họ và tên</span>
                  <span className={styles.infoValue}>{userInfo.username}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Số điện thoại</span>
                  <span className={styles.infoValue}>{userInfo.phoneNumber}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email</span>
                  <span className={styles.infoValue}>{userInfo.email}</span>
                </div>
              </div>
            </section>

            {/* Combos Section */}
            <section className={styles.sectionBox}>
              <h2 className={styles.sectionTitle}>
                <img src="https://img.icons8.com/ios/24/ff4d4f/popcorn.png" alt="" style={{ width: 24 }} />
                COMBO ƯU ĐÃI
                {membership.membership && (
                  <span className={styles.membershipBadge}>
                    Hội viên {membership.membership} - Giảm {membership.membership === "vip tháng" ? "15%" : "20%"} combo
                  </span>
                )}
              </h2>

              <div className={styles.comboGrid}>
                {combos.map((combo) => (
                  <div className={styles.comboCard} key={combo.id}>
                    <img src={combo.image} alt={combo.name} className={styles.comboImage} />
                    <div className={styles.comboDetails}>
                      <div className={styles.comboName}>{combo.name}</div>
                      <div className={styles.comboDesc}>{combo.description}</div>
                    </div>
                    <div className={styles.comboActions}>
                      <div className={styles.pricePerCombo}>{combo.price.toLocaleString()}đ</div>
                      <div className={styles.quantityControl}>
                        <button className={styles.quantityBtn} onClick={() => handleDecrement(combo.id)}><FaMinus /></button>
                        <span className={styles.quantityValue}>{comboCounts[combo.id] || 0}</span>
                        <button className={styles.quantityBtn} onClick={() => handleIncrement(combo.id)}><FaPlus /></button>
                      </div>
                    </div>
                  </div>
                ))}
                {combos.length === 0 && <p className="text-muted text-center py-4">Đang tải danh sách combo...</p>}
              </div>
            </section>

            {/* Voucher Section */}
            <section className={styles.sectionBox}>
              <h2 className={styles.sectionTitle}><FaTag /> MÃ GIẢM GIÁ</h2>
              <div className={styles.voucherInputGroup}>
                <input
                  type="text"
                  placeholder="Nhập mã voucher (ví dụ: DHDT01)"
                  className={styles.voucherInput}
                  value={voucher}
                  onChange={(e) => setVoucher(e.target.value)}
                />
                <button className={styles.voucherApplyBtn} onClick={handleVoucher}>ÁP DỤNG</button>
              </div>
              {voucherStatus.show && (
                <p style={{ color: voucherStatus.ok ? '#52c41a' : '#ff4d4f', fontSize: '0.9rem', marginTop: -10, marginBottom: 15 }}>
                  <FaInfoCircle /> {voucherStatus.text}
                </p>
              )}

              <div className="table-responsive">
                <table className="table table-sm table-borderless align-middle" style={{ fontSize: '0.9rem' }}>
                  <thead className="table-light">
                    <tr>
                      <th>Mã voucher</th>
                      <th>Ưu đãi</th>
                      <th>Hạn dùng</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fw-bold text-primary">DHDT01</td>
                      <td>Giảm 15% cho đơn từ 200K</td>
                      <td className="text-muted">31/12/2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </main>

          {/* Sidebar Area */}
          <aside className={styles.sidebar}>
            <div className={styles.sectionBox}>
              <div className={styles.timerBox}>
                <FaHourglassHalf className={styles.timerIcon} />
                <span>Thời gian giữ ghế: {formatTime(timeLeft)}</span>
              </div>

              <h2 className={styles.summaryTitle}>ĐƠN HÀNG</h2>

              {/* Movie Info Recap */}
              <div className="mb-4 text-center">
                <img
                  src={bookingInfo.movieInfo?.image}
                  alt=""
                  style={{ width: '100%', borderRadius: 12, marginBottom: 15, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                />
                <h4 className="fw-bold mb-1">{bookingInfo.movieInfo?.movieName}</h4>
                <p className="text-muted small">{bookingInfo.movieInfo?.genre} • {bookingInfo.movieInfo?.duration} Phút</p>
              </div>

              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}><FaTicketAlt /> Rạp</span>
                <span className={styles.summaryValue}>{savedTheater.name}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}><FaClock /> Suất chiếu</span>
                <span className={styles.summaryValue}>{bookingInfo.time?.startTime?.slice(0, 5)} • {bookingInfo.date}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Ghế ({selectedSeats.length})</span>
                <span className={styles.summaryValue}>{selectedSeats.join(', ')}</span>
              </div>

              <div className={styles.summaryDivider}></div>

              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Tạm tính vé</span>
                <span className={styles.summaryValue}>{total.toLocaleString()}đ</span>
              </div>

              {comboTotalCalculated > 0 && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Combo {membership.membership && <span className="text-danger">(-{membership.membership === "vip tháng" ? "15%" : "20%"})</span>}</span>
                  <span className={styles.summaryValue}>{(totalPrice - total).toLocaleString()}đ</span>
                </div>
              )}

              {discount && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Voucher giảm giá (15%)</span>
                  <span className={styles.summaryValue} style={{ color: '#52c41a' }}>-{(totalPrice * 0.15).toLocaleString()}đ</span>
                </div>
              )}

              <div className={styles.summaryDivider}></div>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Tổng cộng</span>
                <span className={styles.totalAmount}>{Math.round(finalAmount).toLocaleString()}đ</span>
              </div>

              <button
                className={styles.checkoutBtn}
                onClick={handlePayment}
                disabled={timeLeft <= 0}
              >
                THANH TOÁN NGAY
              </button>

              <p className="text-center text-muted small mt-3">
                Nhấn "Thanh toán ngay" đồng nghĩa với việc bạn đồng ý với Điều khoản dịch vụ của chúng tôi.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default PaymentInfo;
