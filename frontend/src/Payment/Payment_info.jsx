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

  const [combos, setCombos] = useState([]);
  const [comboCounts, setComboCounts] = useState({}); // Use ID as key

  const location = useLocation();
  const navigate = useNavigate();

  // Get data from location state or fallback
  const { total = 0, selectedSeats = [], seatTypes = [] } = location.state || {};

  const [totalPrice, setTotalPrice] = useState(total);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [giftComboCounts, setGiftComboCounts] = useState({});
  const [benefits, setBenefits] = useState({ vouchers: [], combos: [] });

  const [timeLeft, setTimeLeft] = useState(() => {
    const storedTime = localStorage.getItem('timeLeft');
    return storedTime ? parseInt(storedTime, 10) : 600;
  });

  const handleIncrement = (id) => {
    setComboCounts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleDecrement = (id) => {
    setComboCounts(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) - 1) }));
  };

  useEffect(() => {
    const comboTotal = combos.reduce((acc, combo) => {
      const count = comboCounts[combo.id] || 0;
      return acc + (combo.price * count);
    }, 0);

    setTotalPrice(total + comboTotal);
  }, [comboCounts, total, combos]);

  const handlePayment = async () => {
    const finalPrice = Math.round(finalAmount);
    localStorage.setItem('price', finalPrice);

    try {
      const paymentId = localStorage.getItem('paymentId') ||
        'xxxxxxxx-xxxx-xxxx'.replace(/[x]/g, () => Math.floor(Math.random() * 16).toString(16));
      localStorage.setItem('paymentId', paymentId);

      const res = await axios.post("http://localhost:8099/api/order/v1/create", {
        productName: "Thanh toan ve xem phim",
        description: `TT${paymentId.slice(0, 10)}`, // Max 25 chars for PayOS description
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
        const data = res.data.data;
        setCombos(Array.isArray(data) ? data : (data.content || []));
      } catch (error) {
        console.error("Lỗi khi lấy danh sách combo", error);
      }
    };
    fetchCombo();
  }, []);

  useEffect(() => {
    const purchased = combos
      .filter(combo => comboCounts[combo.id] > 0)
      .map(combo => `${combo.name} x${comboCounts[combo.id]}`);

    const free = benefits.combos
      ?.filter(combo => giftComboCounts[combo.id] > 0)
      .map(combo => `${combo.name} x${giftComboCounts[combo.id]} (FREE)`) || [];

    const selectedCombosStr = [...purchased, ...free].join(', ');
    localStorage.setItem('selectedCombos', selectedCombosStr);
  }, [comboCounts, combos, giftComboCounts, benefits.combos]);

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
    const fetchBenefit = async () => {
      try {
        const res = await axios.get(`http://localhost:8099/api/user/v1/benefit`, {
          withCredentials: true
        });
        setBenefits(res.data.data || { vouchers: [], combos: [] });
      } catch (error) {
        console.error('Error fetching benefits:', error);
      }
    }
    fetchBenefit();
  }, []);

  const handleSelectVoucher = (v) => {
    if (v.minOrderValue && totalPrice < v.minOrderValue) {
      toast.warning(`Đơn hàng tối thiểu ${v.minOrderValue.toLocaleString()}đ để áp dụng mã này!`);
      return;
    }
    if (appliedVoucher?.code === v.code) {
      setAppliedVoucher(null);
    } else {
      setAppliedVoucher(v);
      toast.success(`Đã áp dụng mã ${v.code}!`);
    }
  };

  const handleIncrementGift = (combo) => {
    setGiftComboCounts(prev => {
      const current = prev[combo.id] || 0;
      if (current < combo.quantity) return { ...prev, [combo.id]: current + 1 };
      return prev;
    });
  };

  const handleDecrementGift = (combo) => {
    setGiftComboCounts(prev => {
      const current = prev[combo.id] || 0;
      if (current > 0) return { ...prev, [combo.id]: current - 1 };
      return prev;
    });
  };

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

  const discountAmount = useMemo(() => {
    if (!appliedVoucher) return 0;
    if (appliedVoucher.minOrderValue && totalPrice < appliedVoucher.minOrderValue) return 0;
    const discountPercent = appliedVoucher.discount || 0;
    return (totalPrice * discountPercent) / 100;
  }, [appliedVoucher, totalPrice]);

  const finalAmount = totalPrice - discountAmount;
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

            {/* Benefits & Vouchers Section */}
            <section className={styles.sectionBox}>
              <h2 className={styles.sectionTitle}><FaTag /> ƯU ĐÃI & QUÀ TẶNG CỦA BẠN</h2>

              {/* Gift Combos */}
              {benefits.combos && benefits.combos.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-3 text-success">
                    <img src="https://img.icons8.com/ios/20/52c41a/gift.png" alt="" style={{ width: 20, marginRight: 8, verticalAlign: 'text-bottom' }} />
                    Combo Được Tặng
                  </h6>
                  <div className="table-responsive">
                    <table className="table table-sm table-borderless align-middle" style={{ fontSize: '0.9rem' }}>
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: '60px' }}></th>
                          <th>Combo</th>
                          <th>Số lượng</th>
                          <th style={{ width: '50px', textAlign: 'center' }}>Chọn</th>
                        </tr>
                      </thead>
                      <tbody>
                        {benefits.combos.map((combo) => {
                          const count = giftComboCounts[combo.id] || 0;
                          return (
                            <tr key={combo.id} style={{ opacity: count > 0 ? 1 : 0.8 }}>
                              <td>
                                <img src={combo.image} alt={combo.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                              </td>
                              <td>
                                <div className="fw-bold text-success">{combo.name}</div>
                                <div className="text-muted" style={{ fontSize: '0.8rem' }}>{combo.description}</div>
                              </td>
                              <td>x{combo.quantity}</td>
                              <td className="text-center">
                                <div className={styles.quantityControl} style={{ justifyContent: 'center' }}>
                                  <button className={styles.quantityBtn} onClick={() => handleDecrementGift(combo)}><FaMinus /></button>
                                  <span className={styles.quantityValue}>{count}</span>
                                  <button className={styles.quantityBtn} onClick={() => handleIncrementGift(combo)}><FaPlus /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Vouchers Table */}
              <div>
                <h6 className="fw-bold mb-3 text-primary">
                  <FaTag style={{ marginRight: 8 }} />
                  Mã Giảm Giá Của Bạn
                </h6>
                <div className="table-responsive">
                  <table className="table table-sm table-borderless align-middle" style={{ fontSize: '0.9rem' }}>
                    <thead className="table-light">
                      <tr>
                        <th>Mã voucher</th>
                        <th>Ưu đãi</th>
                        <th>Hạn dùng</th>
                        <th style={{ width: '50px', textAlign: 'center' }}>Chọn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {benefits.vouchers?.map((v, idx) => {
                        const isEligible = totalPrice >= (v.minOrderValue || 0);
                        return (
                          <tr key={idx} style={{ opacity: isEligible ? 1 : 0.6 }}>
                            <td className="fw-bold text-primary">
                              {v.code}
                              {v.quantity > 0 && (
                                <span className="badge bg-info-subtle text-info ms-2" style={{ fontSize: '0.7rem', fontWeight: 'normal' }}>
                                  Còn {v.quantity} lượt
                                </span>
                              )}
                              {!isEligible && <div className="text-danger" style={{ fontSize: '0.75rem' }}>Đơn tối thiểu {v.minOrderValue?.toLocaleString()}đ</div>}
                            </td>
                            <td>{v.description || `Giảm ${v.discount}%`}</td>
                            <td className="text-muted">{v.endDate ? new Date(v.endDate).toLocaleDateString('vi-VN') : 'Không thời hạn'}</td>
                            <td className="text-center">
                              <input
                                type="radio"
                                name="voucherSelection"
                                checked={appliedVoucher?.code === v.code}
                                disabled={!isEligible}
                                onChange={() => handleSelectVoucher(v)}
                                style={{ cursor: isEligible ? 'pointer' : 'not-allowed', transform: 'scale(1.2)' }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                      {(!benefits.vouchers || benefits.vouchers.length === 0) && (
                        <tr>
                          <td colSpan="4" className="text-center text-muted">Bạn chưa có mã giảm giá nào.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {appliedVoucher && (
                  <div className="text-end mt-2">
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setAppliedVoucher(null)}>Bỏ chọn voucher</button>
                  </div>
                )}
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

              {(comboTotalCalculated > 0 || Object.values(giftComboCounts).some(c => c > 0)) && (
                <div className={styles.summaryItem} style={{ alignItems: 'flex-start' }}>
                  <div className={styles.summaryLabel} style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>Combo</span>
                    {benefits.combos?.filter(c => giftComboCounts[c.id] > 0).map((combo, idx) => (
                      <span key={`free-${idx}`} style={{ fontSize: '0.85em', color: '#52c41a', marginTop: 4 }}>
                        + {combo.name} x{giftComboCounts[combo.id]} (FREE)
                      </span>
                    ))}
                  </div>
                  <span className={styles.summaryValue} style={{ marginTop: 2 }}>{(totalPrice - total).toLocaleString()}đ</span>
                </div>
              )}

              {appliedVoucher && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Voucher giảm giá ({appliedVoucher.discount}%)</span>
                  <span className={styles.summaryValue} style={{ color: '#52c41a' }}>-{discountAmount.toLocaleString()}đ</span>
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
