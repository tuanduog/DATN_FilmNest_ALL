import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Login.module.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

function Login() {
  const { t } = useTranslation();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('login');

  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    retypePassword: '',
    phone: ''
  });
  
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});

  let navigate = useNavigate();

  const handleLoginChange = e => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    if (loginErrors[e.target.name]) {
      setLoginErrors({ ...loginErrors, [e.target.name]: '' });
    }
  };

  const handleRegisterChange = e => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    if (registerErrors[e.target.name]) {
      setRegisterErrors({ ...registerErrors, [e.target.name]: '' });
    }
  };

  const validateLogin = () => {
    const errors = {};
    if (!loginData.username.trim()) {
      errors.username = t('usernameRequired') || 'Vui lòng nhập tên đăng nhập';
    }
    if (!loginData.password) {
      errors.password = t('passwordRequired') || 'Vui lòng nhập mật khẩu';
    }
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegister = () => {
    const errors = {};
    
    if (!registerData.username.trim()) {
      errors.username = t('usernameRequired') || 'Vui lòng nhập tên đăng nhập';
    } else if (registerData.username.length < 3) {
      errors.username = t('usernameTooShort') || 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }
    
    if (!registerData.email.trim()) {
      errors.email = t('emailRequired') || 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      errors.email = t('emailInvalid') || 'Email không hợp lệ';
    }
    
    if (!registerData.password) {
      errors.password = t('passwordRequired') || 'Vui lòng nhập mật khẩu';
    } else if (registerData.password.length < 6) {
      errors.password = t('passwordTooShort') || 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (!registerData.retypePassword) {
      errors.retypePassword = t('retypePasswordRequired') || 'Vui lòng nhập lại mật khẩu';
    } else if (registerData.password !== registerData.retypePassword) {
      errors.retypePassword = t('passwordsDoNotMatch') || 'Mật khẩu không khớp';
    }
    
    const phoneRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
    if (!registerData.phone.trim()) {
      errors.phone = t('phoneRequired') || 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(registerData.phone)) {
      errors.phone = t('phoneInvalid') || 'Số điện thoại không hợp lệ';
    }
    
    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = async e => {
    e.preventDefault();
    if (!validateLogin()) return;
    try {
      const res = await axios.post('http://localhost:8099/auth/login', loginData, {
        withCredentials: true
      });

      if (res.data.status === 200) {
        const verify = await axios.get("http://localhost:8099/auth/introspect", {
          withCredentials: true
        });
        if (verify.data.data.role === "User") {
          toast.success(t('loginSuccess'));
          window.dispatchEvent(new Event('authChange'));
          navigate('/');
        } else {
          toast.error(t('loginFail'));
        }
        sessionStorage.setItem('state', 'Login successful');
      } else {
        toast.error(t('checkAccountOrPassword'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegisterSubmit = async e => {
    e.preventDefault();

    if (!validateRegister()) return;

    try {
      const res = await axios.post('http://localhost:8099/auth/register', registerData, {
        withCredentials: true
      });
      if (res.data.status === 200) {
        toast.success(t('registerSuccess'));
        setActiveTab('login');
        setRegisterData({ username: '', email: '', password: '', retypePassword: '', phone: '' });
      } else {
        toast.error(t(res.data.message));
      }
    } catch (err) {
      toast.error(t(err.response?.data?.message || 'Error occurred'));
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
            {t('login')}
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'register' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('register')}
          >
            {t('register')}
          </button>
        </div>

        <div className={styles.formContent}>
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              <h2 className={styles.title}>{t('login')}</h2>
              <div className={styles.socialContainer}>
                <a href="#" className={styles.social}><i className="fab fa-facebook-f"></i></a>
                <a href="#" className={styles.social}><i className="fab fa-google-plus-g"></i></a>
                <a href="#" className={styles.social}><i className="fab fa-linkedin-in"></i></a>
              </div>
              <span className={styles.subtitle}>{t('orUseYourAccount')}</span>

              <div className={styles.inputGroup}>
                <input type="text" name="username" placeholder={t('username')} value={loginData.username} onChange={handleLoginChange} className={loginErrors.username ? styles.inputError : ''} />
                {loginErrors.username && <span className={styles.errorText}>{loginErrors.username}</span>}
              </div>
              <div className={styles.inputGroup}>
                <input type="password" name="password" placeholder={t('password')} value={loginData.password} onChange={handleLoginChange} className={loginErrors.password ? styles.inputError : ''} />
                {loginErrors.password && <span className={styles.errorText}>{loginErrors.password}</span>}
              </div>

              <div className="d-flex justify-content-end mb-3">
                <a href="#" className={styles.forgotPassword}>{t('forgotPassword')}</a>
              </div>

              <button type="submit" className={styles.btnSubmit}>{t('login')}</button>
            </form>
          )}

          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit}>
              <h2 className={styles.title}>{t('createAccount')}</h2>
              <div className={styles.socialContainer}>
                <a href="#" className={styles.social}><i className="fab fa-facebook-f"></i></a>
                <a href="#" className={styles.social}><i className="fab fa-google-plus-g"></i></a>
                <a href="#" className={styles.social}><i className="fab fa-linkedin-in"></i></a>
              </div>
              <span className={styles.subtitle}>{t('orUseEmailForRegister')}</span>

              <div className={styles.inputGroup}>
                <input type="text" name="username" placeholder={t('username')} value={registerData.username} onChange={handleRegisterChange} className={registerErrors.username ? styles.inputError : ''} />
                {registerErrors.username && <span className={styles.errorText}>{registerErrors.username}</span>}
              </div>
              <div className={styles.inputGroup}>
                <input type="text" name="email" placeholder={t('email')} value={registerData.email} onChange={handleRegisterChange} className={registerErrors.email ? styles.inputError : ''} />
                {registerErrors.email && <span className={styles.errorText}>{registerErrors.email}</span>}
              </div>
              <div className={styles.inputGroup}>
                <input type="password" name="password" placeholder={t('password')} value={registerData.password} onChange={handleRegisterChange} className={registerErrors.password ? styles.inputError : ''} />
                {registerErrors.password && <span className={styles.errorText}>{registerErrors.password}</span>}
              </div>
              <div className={styles.inputGroup}>
                <input type="password" name="retypePassword" placeholder={t('retypePassword')} value={registerData.retypePassword} onChange={handleRegisterChange} className={registerErrors.retypePassword ? styles.inputError : ''} />
                {registerErrors.retypePassword && <span className={styles.errorText}>{registerErrors.retypePassword}</span>}
              </div>
              <div className={styles.inputGroup}>
                <input type="text" name="phone" placeholder={t('phone')} value={registerData.phone} onChange={handleRegisterChange} className={registerErrors.phone ? styles.inputError : ''} />
                {registerErrors.phone && <span className={styles.errorText}>{registerErrors.phone}</span>}
              </div>

              <button type="submit" className={styles.btnSubmit}>{t('register')}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;