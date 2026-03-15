import React, { useEffect, useState } from "react";
import styles from '../Payment/Payment_info.module.css';
import { FaPlus, FaMinus, FaUser } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
// import vnpay_logo from '../assets/vnpay_logo.png';
// import momo_logo from '../assets/MoMo_Logo.png';
import { useLocation } from "react-router-dom";
import pic1 from '../assets/familycombo.png';
import pic2 from '../assets/sweetcombo.png';
import pic3 from '../assets/betacombo.png';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GiConsoleController } from "react-icons/gi";
import { toast } from "react-toastify";

function PaymentInfo() {
  const userInfo = JSON.parse(sessionStorage.getItem('user'));
  const [membership, setMembership] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const { total, selectedSeats, seatTypes } = location.state;
  const [totalPrice, setTotalPrice] = useState(total);
  const [voucher, setVoucher] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [text, setText] = useState("");
  const [textOk, setTextOk] = useState("");
  const [discount, setDiscount] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => {
          const storedTime = localStorage.getItem('timeLeft');
          return storedTime ? parseInt(storedTime, 10) : 600;
      });
  const seatsWithType = selectedSeats.map((seat, index) => ({
    seat,
    type: seatTypes[index]
  }));

  const vipSeats = seatsWithType.filter(item => item.type === "vip");
  const normalSeats = seatsWithType.filter(item => item.type === "normal");
  const coupleSeats = seatsWithType.filter(item => item.type === "couple");
  const [comboCounts, setComboCounts] = useState({
    family: 0,
    sweet: 0,
    beta: 0
  });

  const handleIncrement = (key) => {
  setComboCounts(prev => ({
    ...prev,
    [key]: prev[key] + 1
  }));
};

const handleDecrement = (key) => {
  setComboCounts(prev => ({
    ...prev,
    [key]: Math.max(0, prev[key] - 1)
  }));
};
useEffect(() => {
  const comboPrices = {
    family: 113000,
    sweet: 80000,
    beta: 60000
  }
  let vipDiscount = 1;
  if(membership.membership === "vip tháng") vipDiscount = 0.85;
  if(membership.membership === "vip năm") vipDiscount = 0.8;

  const res = comboPrices.family * comboCounts.family
  + comboPrices.sweet * comboCounts.sweet + comboPrices.beta * comboCounts.beta;

  const newTotal = total + res * vipDiscount;
  setTotalPrice(newTotal);
},[comboCounts, membership, total]);

const handleVoucher = () => {
  setShowAlert(true);
  if(voucher === 'DHDT01'){
    if(totalPrice < 200000){
      setText("Voucher không áp dụng được với đơn hàng của bạn!!");
      setTextOk("");
      setDiscount(false);
    } else {
      setTextOk("Áp dụng voucher thành công!!");
      setText("");
      setDiscount(true);
    }
  } else {
    setText("Nhập sai voucher!!");
    setTextOk("");
    setDiscount(false);
  }
}
  const generatePaymentId = () => {
      return 'xxxxxxxx-xxxx-xxxx'.replace(/[x]/g, () =>
        Math.floor(Math.random() * 16).toString(16)
      );
    }
    const [paymentId, setPaymentId] = useState(() => {
      const storedId = localStorage.getItem('paymentId');
      if(storedId) return storedId;
      const newId = generatePaymentId();
      localStorage.setItem('paymentId', newId);
      return newId;
    })
  const handlePayment = async () => {
    const finalPrice = discount ? totalPrice * 0.85 : totalPrice;
    localStorage.setItem('price', finalPrice);
    try {
      const res = await axios.post("http://localhost:8099/Order/create", {
        productName: 'Đơn hàng: ' + paymentId,
        description: 'Thanh toán đơn hàng',
        price: finalPrice,
        returnUrl: "http://localhost:5173/Booking_history",
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
      toast.error("Tạo đơn thanh toán thất bại!");
    }
  };
  useEffect(() => {
  const selectedCombos = [];

  if (comboCounts.family > 0) {
    selectedCombos.push(`Family Combo x${comboCounts.family}`);
  }
  if (comboCounts.sweet > 0) {
    selectedCombos.push(`Sweet Combo x${comboCounts.sweet}`);
  }
  if (comboCounts.beta > 0) {
    selectedCombos.push(`Beta Combo x${comboCounts.beta}`);
  }

  const comboString = selectedCombos.join(', ');
  localStorage.setItem('selectedCombos', comboString); 
}, [comboCounts]);

  useEffect(() => {
    if(totalPrice < 200000){
      setDiscount(false);
    }
  });
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

  const fetchMember = async () => {
        try {
            const res = await axios.get(`http://localhost:8099/auth/get-Membership/${userInfo.userId}`, 
                { withCredentials: true}
            )
            setMembership(res.data);
            console.log(res.data);
        } catch (error) {   
            console.error("Khong lay duoc membership", error);
        }
    }
    useEffect(() => {
      fetchMember();
    },[]);

  return (
    <div className={styles.container}>
      {/* Thông tin thanh toán */}
      <div className={styles.box}>
        <h5 className={styles.title}>
          <FaUser className={styles.icon} /> THÔNG TIN THANH TOÁN
        </h5>
        <div className={styles.infoRow}>
          <div><strong>Họ Tên:</strong> {userInfo.username}</div>
          <div><strong>Số điện thoại:</strong> {userInfo.phoneNumber}</div>
          <div><strong>Email:</strong> {userInfo.email}</div>
        </div>
        <hr />
        {vipSeats.length > 0 && (
          <div className={styles.infoRow}>
            <h6><strong>GHẾ VIP</strong></h6>
            <p className={styles.priceRow}>{vipSeats.length} x 100000 = {vipSeats.length * 100000} VNĐ</p>
          </div>
        )}
        {normalSeats.length > 0 && (
          <div className={styles.infoRow}>
            <h6><strong>GHẾ THƯỜNG</strong></h6>
            <p className={styles.priceRow}>{normalSeats.length} x 70000 = {normalSeats.length * 70000} VNĐ</p>
          </div>
        )}
        {coupleSeats.length > 0 && (
          <div className={styles.infoRow}>
            <h6><strong>GHẾ COUPLE</strong></h6>
            <p className={styles.priceRow}>{coupleSeats.length} x 130000 = {coupleSeats.length * 130000} VNĐ</p>
          </div>
        )}
      </div>

      {/* Combo ưu đãi */}
      <div className={styles.box}>
        <h5 className={styles.title}>
          <img
            src="https://img.icons8.com/ios/24/000000/popcorn.png"
            alt="combo"
            className={styles.icon}
          />
          COMBO ƯU ĐÃI 
          {membership.membership === "vip tháng" ?
          <span style={{fontWeight: 'normal', fontSize: '15px', color: 'red'}}>
            <span style={{textTransform: 'uppercase', fontWeight: 'bold'}}>{membership.membership}</span> giảm giá 15%</span> : <></>}
          {membership.membership === "vip năm" ?
          <span style={{fontWeight: 'normal', fontSize: '15px', color: 'red'}}>
            <span style={{textTransform: 'uppercase', fontWeight: 'bold'}}>{membership.membership}</span> giảm giá 20%</span> : <></>}
        </h5>

        <table className={styles.comboTable}>
          <thead>
            <tr>
              <th>Tên Combo</th>
              <th>Mô tả</th>
              <th>Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {/* Combo 1 */}
            <tr>
              <td className={styles.comboInfo}>
                <img src={pic1} alt="Combo" className={styles.comboImg} />
                <span>Family Combo 113K</span>
              </td>
              <td>
                <span className={styles.discount}>TIẾT KIỆM 65K!!!</span><br />
                Gồm: 2 Bắp (69oz) + 4 Nước có gaz (22oz) + 2 Snack Oishi (80g) (22oz)
              </td>
              <td>
                <div className={styles.quantityControl}>
                  <button onClick={() => handleDecrement("family", membership.membership)}> <FaMinus /> </button>
                  <span>{comboCounts.family}</span>
                  <button onClick={() => handleIncrement("family", membership.membership)}> <FaPlus /> </button>
                </div>
              </td>
            </tr>

            {/* Combo 2 */}
            <tr>
              <td className={styles.comboInfo}>
                <img src={pic2} alt="Sweet Combo" className={styles.comboImg} />
                <span>Sweet Combo 80K</span>
              </td>
              <td>
                <span className={styles.discount}>TIẾT KIỆM 42K!!!</span><br />
                Gồm: 1 Bắp (69oz) + 2 Nước có gaz (22oz)
              </td>
              <td>
                <div className={styles.quantityControl}>
                  <button onClick={() => handleDecrement("sweet")}> <FaMinus /> </button>
                  <span>{comboCounts.sweet}</span>
                  <button onClick={() => handleIncrement("sweet")}> <FaPlus /> </button>
                </div>
              </td>
            </tr>
            {/* Combo 3 */}
            <tr>
              <td className={styles.comboInfo}>
                <img src={pic3} alt="Beta Combo" className={styles.comboImg} />
                <span>Beta Combo 60K</span>
              </td>
              <td>
                <span className={styles.discount}>TIẾT KIỆM 28K!!!</span><br />
                Gồm: 1 Bắp (69oz) + 1 Nước có gaz (22oz)
              </td>
              <td>
                <div className={styles.quantityControl}>
                  <button onClick={() => handleDecrement("beta")}> <FaMinus /> </button>
                  <span>{comboCounts.beta}</span>
                  <button onClick={() => handleIncrement("beta")}> <FaPlus /> </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* mã giảm giá */}
       <div className={styles.box}>
        <h5 className={styles.title}>
          <FaUser className={styles.icon} /> MÃ GIẢM GIÁ
        </h5>
        <div className={styles.voucherInputRow}>
          <input type="text" placeholder="Mã Voucher" className={styles.voucherInput} value={voucher} onChange={(e) => setVoucher(e.target.value)}/>
          <button className={styles.voucherButton} onClick={handleVoucher}>ÁP DỤNG</button>
        </div>
        {showAlert && (
          <p style={{color: textOk ? 'green' : 'red', fontSize: '14px', marginTop: '-9px', fontStyle: 'italic'}}>
            {textOk || text}
          </p>
        )}
        <h6 className={styles.sectionLabel}>VOUCHER CỦA BẠN</h6>

        <table className={styles.voucherTable}>
          <thead>
            <tr>
              <th>Mã voucher</th>
              <th>Nội dung voucher</th>
              <th>Ngày hết hạn</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>DHDT01</td>
              <td>Giảm giá 10% cho đơn hàng trên 200K</td>
              <td>31/12/2025</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.box} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  {/* Bên trái: Thông tin thanh toán */}
  <div>
    <strong style={{ display: 'block', marginBottom: '10px' }}>
      Tổng tiền: <span style={{ color: 'red' }}>{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
    </strong>

    <strong style={{ display: 'block', marginBottom: '10px' }}>
      Số tiền được giảm:  
      <span style={{ color: 'red' }}>
        {discount ? (totalPrice * 0.15).toLocaleString('vi-VN') : ' 0'} VNĐ
      </span>
    </strong>

    <strong style={{ display: 'block' }}>
      Số tiền cần thanh toán: <span style={{ color: 'red' }}>
         {(discount ? (totalPrice * 0.85) : totalPrice).toLocaleString('vi-VN')} VNĐ
      </span>
    </strong>
  </div>

  {/* Bên phải: Thời gian còn lại */}
  <div style={{ textAlign: 'right' }}>
    <p className="fw-bold mb-1">⏳ Thời gian còn lại</p>
    <h5 className="text-success mb-0">{formatTime(timeLeft)}</h5>
  </div>
  </div>


        {/* phương thức thanh toán */}
        {/* <div className={styles.box}>
        <h5 className={styles.title}>
            <FaUser className={styles.icon} /> PHƯƠNG THỨC THANH TOÁN
        </h5>

        <div className={styles.paymentMethods}>
            <label className={styles.paymentOption}>
            <input type="radio" name="payment" />
            <img src={payos_logo} alt="PayOS" />
            <span>Thanh toán qua PayOS</span>
            </label>

            <label className={styles.paymentOption}>
            <input type="radio" name="payment" />
            <img src={vnpay_logo} alt="VNPay" />
            <span>Thanh toán qua VNPay</span>
            </label>
        </div>
        </div> */}

        <div className="d-flex justify-content-center">
            <button className="btn btn-primary w-75 mt-2" onClick={handlePayment}>TIẾP TỤC</button>
        </div>
    </div>
  );
}

export default PaymentInfo;
