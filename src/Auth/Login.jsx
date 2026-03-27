import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Login.module.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    retypePassword: '',
    phone: ''
  });
  
  let navigate = useNavigate();

  const handleLoginChange = e => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = e => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8099/auth/login', loginData, {
        withCredentials: true
      }); 
      
      if (res.data.status === 200) {
        const verify = await axios.get("http://localhost:8099/auth/introspect", {
          withCredentials: true
        });
        if (verify.data.data.role === "Customer") {
          toast.success("Đăng nhập thành công");
          navigate('/');
        } else {
          toast.error("Đăng nhập thất bại");
        }
        sessionStorage.setItem('state', 'Login successful');
      } else {
        toast.error("Vui lòng kiểm tra lại tài khoản hoặc mật khẩu!");
      }
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegisterSubmit = async e => {
    e.preventDefault();
    if (!registerData.email || !registerData.password || !registerData.phone || !registerData.retypePassword || !registerData.username) {
      toast.warning("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (registerData.password.length < 6) {
      toast.warning("Mật khẩu phải có ít nhất 6 kí tự");
      return;
    }
    if (registerData.phone.length !== 10) {
      toast.warning("Nhập sai số điện thoại");
      return;
    }
    if (registerData.password !== registerData.retypePassword) {
      toast.warning("Mật khẩu xác nhận không khớp!");
      return;
    }
    try {
      const res = await axios.post('http://localhost:8099/auth/register', registerData, {
        withCredentials: true
      });
      if (res.status === 200) {
        toast.success("Đăng ký thành công!");
        setActiveTab('login'); // Trở lại màn hình đăng nhập
      } else {
        toast.error("Đăng ký không thành công, vui lòng thử lại");
      }
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (location.state?.type === 'register') {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
  }, [location.state]);

  return (
    <div className={styles.authContainer}>
      <div className={styles.container}>
        {/* Tabs */}
        <div className={styles.tabs}>
          <button 
            type="button"
            className={`${styles.tab} ${activeTab === 'login' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Đăng nhập
          </button>
          <button 
            type="button"
            className={`${styles.tab} ${activeTab === 'register' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Đăng ký
          </button>
        </div>

        <div className={styles.formContent}>
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              <h2 className={styles.title}>Đăng nhập</h2>
              <div className={styles.socialContainer}>
                <a href="#" className={styles.social}><i className="fab fa-facebook-f"></i></a>
                <a href="#" className={styles.social}><i className="fab fa-google-plus-g"></i></a>
                <a href="#" className={styles.social}><i className="fab fa-linkedin-in"></i></a>
              </div>
              <span className={styles.subtitle}>hoặc dùng tài khoản của bạn</span>
              
              <div className={styles.inputGroup}>
                <input type="text" name="username" placeholder="Tên đăng nhập" value={loginData.username} onChange={handleLoginChange} required />
              </div>
              <div className={styles.inputGroup}>
                <input type="password" name="password" placeholder="Mật khẩu" value={loginData.password} onChange={handleLoginChange} required />
              </div>
              
              <div className="d-flex justify-content-end mb-3">
                <a href="#" className={styles.forgotPassword}>Quên mật khẩu?</a>
              </div>
              
              <button type="submit" className={styles.btnSubmit}>Đăng nhập</button>
            </form>
          )}

          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit}>
              <h2 className={styles.title}>Tạo tài khoản</h2>
              <div className={styles.socialContainer}>
                <a href="#" className={styles.social}><i className="fab fa-facebook-f"></i></a>
                <a href="#" className={styles.social}><i className="fab fa-google-plus-g"></i></a>
                <a href="#" className={styles.social}><i className="fab fa-linkedin-in"></i></a>
              </div>
              <span className={styles.subtitle}>hoặc dùng email để đăng ký</span>
              
              <div className={styles.inputGroup}>
                <input type="text" name="username" placeholder="Tên đăng nhập" value={registerData.username} onChange={handleRegisterChange} required />
              </div>
              <div className={styles.inputGroup}>
                <input type="email" name="email" placeholder="Email" value={registerData.email} onChange={handleRegisterChange} required />
              </div>
              <div className={styles.inputGroup}>
                <input type="password" name="password" placeholder="Mật khẩu" value={registerData.password} onChange={handleRegisterChange} required />
              </div>
              <div className={styles.inputGroup}>
                <input type="password" name="retypePassword" placeholder="Nhập lại mật khẩu" value={registerData.retypePassword} onChange={handleRegisterChange} required />
              </div>
              <div className={styles.inputGroup}>
                <input type="text" name="phone" placeholder="Số điện thoại" value={registerData.phone} onChange={handleRegisterChange} required />
              </div>
              
              <button type="submit" className={styles.btnSubmit}>Đăng ký</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;