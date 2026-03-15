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
        description: 'Thanh toán đơn hàng',
        price: price, // price
        returnUrl: "http://localhost:5173/Member",
        cancelUrl: "http://localhost:5173",
      }, { withCredentials: true });
      console.log("res.data:", res.data);
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
        try {
            const res = await axios.get(`http://localhost:8099/auth/get-Membership/${user.userId}`, 
                { withCredentials: true}
            )
            setMembership(res.data.membership);
            setStartDate(res.data.startDate);
            setTotalDay(res.data.expired);
        } catch (error) {   
            console.error("Khong lay duoc membership", error);
        }
    }

    useEffect(() => {
        if(user){
            fetchMember();
        }
    },[user]);

    useEffect(() => {
      if(startDate && totalDay){
        const today = new Date();
        const start = new Date(startDate);
        const passDay = Math.floor((today - start) / (1000 * 60 * 60 * 24));
        const dayLeft = totalDay - passDay;

          if(dayLeft <= 0){
            setMembership("no membership");
            
            axios.put(`http://localhost:8099/auth/update-Membership/${user.userId}`,
            {
              vip: 'no membership',
              startDate: null,
              expired: null
            }, { withCredentials: true})
            .then(() => {
              console.log("Cập nhật trạng thái membership về no membership");
            })
            .catch((error) => {
              console.error("Lỗi cập nhật membership:", error);
            });

          } else {
            setDayLeft(dayLeft); 
          }
        }
      },[startDate])

  useEffect(() => {
    const updateMembership = async () => {
      if(status === "PAID" && cancel === "false" && code === "00"){
        try {
          const member = JSON.parse(localStorage.getItem('member'));
          const res = await axios.put(`http://localhost:8099/auth/update-Membership/${user.userId}`, 
            member,
          {withCredentials: true}
          )
          console.log(res.data);
          toast.success(`Đăng ký gói ${member.vip} thành công`);
        } catch (error) {
          console.error("Cập nhật membership thất bại", error);
        }
      }
    }
    updateMembership();
  },[]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title} style={{ paddingBottom: "5px" }}>
        Các gói hội viên
      </h2>
      <div className={styles.cardContainer}>
        {/* Gói VIP Tháng */}
        <div className={`${styles.card} ${styles.vipMonth}`}>
          <h3 className={styles.name}>Gói VIP Tháng</h3>
          <p className={styles.price}>99.000đ/30 ngày</p>
          <ul className={styles.benefitList}>
            <li>✓ Xem không giới hạn</li>
            <li>✓ Ưu tiên đặt vé</li>
            <li>✓ Combo bắp nước giảm 15%</li>
          </ul>
          <div className={styles.buttonWrapper}>
          <button
            className={`${styles.subscribeBtn} ${membership === "vip tháng" ? styles.disabled : ""}`}
            onClick={membership === "vip tháng" ? null : handleVipThang}
            disabled={membership === "vip tháng"}
            style={{display: 'inline'}}
          >
            Đăng ký
          </button>
          {membership === "vip tháng" && <p>Còn {dayLeft} ngày</p>}
        </div>
        </div>

        {/* Gói VIP Năm */}
        <div className={`${styles.card} ${styles.vipYear}`}>
          <h3 className={styles.name}>Gói VIP Năm</h3>
          <p className={styles.price}>899.000đ/365 ngày</p>
          <ul className={styles.benefitList}>
            <li>✓ Tất cả quyền lợi VIP Tháng</li>
            <li>✓ Miễn phí vé gửi xe 2 tháng</li>
            <li>✓ Giảm 20% combo bắp nước</li>
            <li>✓ Quà sinh nhật đặc biệt</li>
          </ul>
          <div className={styles.buttonWrapper}>
          <button
            className={`${styles.subscribeBtn} ${membership === "vip năm" ? styles.disabled : ""}`}
            onClick={membership === "vip năm" ? null : handleVipNam}
            disabled={membership === "vip năm"}
            style={{display: 'inline'}}
          >
            Đăng ký
          </button>
          {membership === "vip năm" && <p>Còn {dayLeft} ngày</p>}
        </div>
        </div>
      </div>

      {/* Popup xác nhận */}
      {showConfirm && (
        <div className={styles.overlay}>
          <div className={styles.confirmBox}>
            <h4>Xác nhận đăng ký</h4>
            <p>Bạn có chắc chắn muốn đăng ký gói {selectedPlan === "vip tháng" ? "VIP Tháng" : "VIP Năm"} không?</p>
            <div className={styles.terms}>
              <div style={{ textAlign: "justify", fontSize: "14px", lineHeight: "1.6" }}>
                <p>
                  <strong>Điều khoản dịch vụ</strong>
                </p>

                <p>
                  Khi đăng ký gói hội viên, bạn đồng ý với các chính sách và điều kiện sau:
                </p>

                <ul style={{ paddingLeft: "20px", marginTop: "10px", marginBottom: "10px" }}>
                  <li>
                    Gói <strong>VIP Tháng</strong> có thời hạn sử dụng 30 ngày kể từ ngày thanh toán thành công và sẽ <strong>không tự động gia hạn</strong>.
                  </li>
                  <li>
                    Gói <strong>VIP Năm</strong> có thời hạn 12 tháng và đi kèm các ưu đãi bổ sung như <em>vé miễn phí hàng tháng</em> và <em>quà sinh nhật</em>.
                  </li>
                  <li>
                    Quyền lợi của hội viên <strong>chỉ áp dụng cho tài khoản đã đăng ký</strong> và <strong>không thể chuyển nhượng</strong>.
                  </li>
                  <li>
                    Mọi thông tin thanh toán và sử dụng sẽ được lưu trữ để đảm bảo quyền lợi cho bạn trong suốt thời gian sử dụng dịch vụ.
                  </li>
                  <li>
                    <strong>Không hoàn tiền</strong> sau khi đã đăng ký gói thành công, trừ trường hợp hệ thống gặp sự cố nghiêm trọng gây gián đoạn dịch vụ kéo dài.
                  </li>
                  <li>
                    Bạn đồng ý <strong>không chia sẻ tài khoản</strong> cho bên thứ ba và không sử dụng dịch vụ vào mục đích thương mại hoặc vi phạm pháp luật.
                  </li>
                  <li>
                    Việc <strong>vi phạm điều khoản</strong> có thể dẫn đến việc khóa tài khoản mà không hoàn lại chi phí đã thanh toán.
                  </li>
                </ul>

                <p>
                  Vui lòng đọc kỹ các điều khoản trên trước khi xác nhận. Bằng việc nhấn <strong>“Tôi đồng ý”</strong>, bạn xác nhận đã hiểu và chấp nhận toàn bộ điều kiện sử dụng dịch vụ.
                </p>
              </div>
              <label style={{display: 'flex', justifyContent: 'left'}}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span style={{ marginLeft: "8px" }}>Tôi đồng ý với điều khoản dịch vụ</span>
              </label>
            </div>
            <div className={styles.buttonGroup}>
              <button onClick={handleClose} className={styles.cancelBtn}>Hủy</button>
              <button
                onClick={handleConfirm}
                disabled={!agreed}
                className={styles.confirmBtn}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Member;
