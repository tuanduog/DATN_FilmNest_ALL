import React, { useEffect, useState } from "react"
import styles from "../Member/Member.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Member() {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [price, setPrice] = useState(null);
    const [agreed, setAgreed] = useState(false);
    const status = query.get('status');
    const code = query.get('code');
    const cancel = query.get('cancel');
    const user = JSON.parse(sessionStorage.getItem('user')) || null;
    const [membership, setMembership] = useState("");
    const [totalDay, setTotalDay] = useState(0);
    const [dayLeft, setDayLeft] = useState(0);
    const [startDate, setStartDate] = useState("");
    const today = new Date();

    const handleVipThang = () => {
        if (sessionStorage.getItem('state') === 'Login successful') {
            setSelectedPlan("vip tháng");
            setPrice(99000);
            const member = {
                vip: 'vip tháng',
                startDate: today.toISOString(),
                expire: 30
            }
            localStorage.setItem('member', JSON.stringify(member));
            setShowConfirm(true);
        } else {
            navigate("/Login");
        }
    };

    const handleVipNam = () => {
        if (sessionStorage.getItem('state') === 'Login successful') {
            setSelectedPlan("vip năm");
            setPrice(899000);
            const member = {
                vip: 'vip năm',
                startDate: today.toISOString(),
                expire: 365
            }
            localStorage.setItem('member', JSON.stringify(member));
            setShowConfirm(true);
        } else {
            navigate("/Login");
        }
    };

    const handlePayment = async () => {
        try {
            const res = await axios.post("http://localhost:8099/Order/create", {
                productName: "Gói " + selectedPlan,
                description: 'Thanh toán đơn hàng FilmNest',
                price: price,
                returnUrl: "http://localhost:5173/Member",
                cancelUrl: "http://localhost:5173/Member",
            }, { withCredentials: true });
            
            const payUrl = res.data?.data?.checkoutUrl;
            if (payUrl) {
                window.location.href = payUrl;
            } else {
                toast.error("Không lấy được link thanh toán!");
            }
        } catch (error) {
            console.error("Tạo đơn thanh toán thất bại:", error);
            toast.warning("Tạo đơn thanh toán thất bại!");
        }
    };

    const handleConfirm = () => {
        if (agreed) {
            handlePayment();
        }
    };

    const handleClose = () => {
        setShowConfirm(false);
        setAgreed(false);
        setSelectedPlan(null);
    };

    const fetchMember = async () => {
        if (!user) return;
        try {
            const res = await axios.get(`http://localhost:8099/auth/get-Membership/${user.userId}`,
                { withCredentials: true }
            )
            setMembership(res.data.membership);
            setStartDate(res.data.startDate);
            setTotalDay(res.data.expired);
        } catch (error) {
            console.error("Khong lay duoc membership", error);
        }
    }

    useEffect(() => {
        if (user) {
            fetchMember();
        }
    }, [user]);

    useEffect(() => {
        if (startDate && totalDay) {
            const today = new Date();
            const start = new Date(startDate);
            const passDay = Math.floor((today - start) / (1000 * 60 * 60 * 24));
            const dayLeft = totalDay - passDay;

            if (dayLeft <= 0) {
                setMembership("no membership");
                axios.put(`http://localhost:8099/auth/update-Membership/${user.userId}`,
                    {
                        vip: 'no membership',
                        startDate: null,
                        expired: null
                    }, { withCredentials: true })
                    .catch((error) => {
                        console.error("Lỗi cập nhật membership:", error);
                    });

            } else {
                setDayLeft(dayLeft);
            }
        }
    }, [startDate, totalDay, user?.userId])

    useEffect(() => {
        const updateMembership = async () => {
            if (status === "PAID" && cancel === "false" && code === "00") {
                try {
                    const member = JSON.parse(localStorage.getItem('member'));
                    if (!member) return;
                    
                    await axios.put(`http://localhost:8099/auth/update-Membership/${user.userId}`,
                        member,
                        { withCredentials: true }
                    )
                    toast.success(`Đăng ký gói ${member.vip} thành công!`);
                    localStorage.removeItem('member');
                    // Refresh data
                    fetchMember();
                    // Clear URL params
                    navigate('/Member', { replace: true });
                } catch (error) {
                    console.error("Cập nhật membership thất bại", error);
                    toast.error("Có lỗi xảy ra khi cập nhật gói hội viên.");
                }
            }
        }
        updateMembership();
    }, [status, cancel, code, user?.userId, navigate]);

    return (
        <div className={styles.container}>
            <div className={styles.headerContent}>
                <h2 className={styles.title}>TRỞ THÀNH HỘI VIÊN</h2>
                <p className={styles.subtitle}>Mở khóa toàn bộ đặc quyền cao cấp và tận hưởng trải nghiệm điện ảnh xứng tầm tại FilmNest.</p>
            </div>

            <div className={styles.cardContainer}>
                {/* Gói VIP Tháng */}
                <div className={`${styles.card} ${styles.vipMonth}`}>
                    <h3 className={styles.name}>THÀNH VIÊN BẠC</h3>
                    <div className={styles.priceContainer}>
                        <p className={styles.price}>99.000<span className={styles.priceCurrency}>đ</span></p>
                        <p className={styles.duration}>Sử dụng trong 30 ngày</p>
                    </div>
                    <ul className={styles.benefitList}>
                        <li><span className={styles.checkIcon}><i className="bi bi-check-lg"></i></span> Xem không giới hạn phim 2D</li>
                        <li><span className={styles.checkIcon}><i className="bi bi-check-lg"></i></span> Quầy thanh toán ưu tiên</li>
                        <li><span className={styles.checkIcon}><i className="bi bi-check-lg"></i></span> Giảm 15% khi mua bắp nước</li>
                        <li><span className={styles.checkIcon}><i className="bi bi-check-lg"></i></span> Tích luỹ điểm thưởng x1.5</li>
                    </ul>
                    <div className={styles.buttonWrapper}>
                        <button
                            className={`${styles.subscribeBtn} ${membership === "vip tháng" ? styles.disabled : ""}`}
                            onClick={membership === "vip tháng" ? null : handleVipThang}
                            disabled={membership === "vip tháng"}
                        >
                            {membership === "vip tháng" ? "Đang sử dụng" : "Nâng cấp ngay"}
                        </button>
                        {membership === "vip tháng" && (
                            <p className={styles.dayLeftText}>
                                <i className="bi bi-clock-history"></i> Còn {dayLeft} ngày
                            </p>
                        )}
                    </div>
                </div>

                {/* Gói VIP Năm */}
                <div className={`${styles.card} ${styles.vipYear}`}>
                    <div className={styles.ribbon}>Đề xuất</div>
                    <h3 className={styles.name}>THÀNH VIÊN VIP</h3>
                    <div className={styles.priceContainer}>
                        <p className={styles.price}>899.000<span className={styles.priceCurrency}>đ</span></p>
                        <p className={styles.duration}>Sử dụng trong 365 ngày</p>
                    </div>
                    <ul className={styles.benefitList}>
                        <li><span className={styles.checkIcon}><i className="bi bi-check-lg"></i></span> Toàn quyền của Thành viên Bạc</li>
                        <li><span className={styles.checkIcon}><i className="bi bi-check-lg"></i></span> Tặng 4 vé xem phim 2D/IMAX</li>
                        <li><span className={styles.checkIcon}><i className="bi bi-check-lg"></i></span> Giảm 25% khi mua bắp nước</li>
                        <li><span className={styles.checkIcon}><i className="bi bi-check-lg"></i></span> Quà tặng sinh nhật đặc biệt</li>
                        <li><span className={styles.checkIcon}><i className="bi bi-check-lg"></i></span> Ưu tiên đặt chỗ hàng ghế VIP</li>
                    </ul>
                    <div className={styles.buttonWrapper}>
                        <button
                            className={`${styles.subscribeBtn} ${membership === "vip năm" ? styles.disabled : ""}`}
                            onClick={membership === "vip năm" ? null : handleVipNam}
                            disabled={membership === "vip năm"}
                        >
                            {membership === "vip năm" ? "Đang sử dụng" : "Đăng ký ngay"}
                        </button>
                        {membership === "vip năm" && (
                            <p className={styles.dayLeftText}>
                                <i className="bi bi-clock-history"></i> Còn {dayLeft} ngày
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Popup xác nhận */}
            {showConfirm && (
                <div className={styles.overlay}>
                    <div className={styles.confirmBox}>
                        <h4>Xác nhận nâng cấp</h4>
                        <p>Bạn đang chọn đăng ký gói {selectedPlan === "vip tháng" ? "Hội viên Bạc" : "Hội viên VIP"}.</p>
                        
                        <div className={styles.terms}>
                            <p className="fw-bold mb-3 text-white">Điều khoản và Chính sách Hội viên</p>
                            <ul className="list-unstyled">
                                <li className="mb-2">• Gói dịch vụ có hiệu lực ngay sau khi thanh toán thành công.</li>
                                <li className="mb-2">• Các ưu đãi giảm giá bắp nước áp dụng trực tiếp tại quầy hoặc ứng dụng.</li>
                                <li className="mb-2">• Vé tặng (đối với gói VIP) sẽ được gửi vào mục "Quà của tôi" trong tài khoản.</li>
                                <li className="mb-2">• Dịch vụ không áp dụng hoàn tiền dưới mọi hình thức sau khi đã kích hoạt.</li>
                                <li className="mb-2">• FilmNest có quyền thay đổi các ưu đãi nhưng sẽ thông báo trước 7 ngày.</li>
                            </ul>
                            <p className="mt-3 small">Bằng cách nhấn xác nhận, bạn đồng ý với toàn bộ quy định trên của FilmNest Cinema.</p>
                        </div>

                        <label className={styles.agreeContainer}>
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                            />
                            Tôi đã đọc và đồng ý với điều khoản dịch vụ
                        </label>

                        <div className={styles.buttonGroup}>
                            <button onClick={handleClose} className={styles.cancelBtn}>Quay lại</button>
                            <button
                                onClick={handleConfirm}
                                disabled={!agreed}
                                className={styles.confirmBtn}
                            >
                                Thanh toán ngay
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Member;
