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

    if (registerData.password.length < 6) {
      toast.error(t('passwordTooShort'));
      return;
    }

    if (registerData.password !== registerData.retypePassword) {
      toast.error(t('passwordsDoNotMatch'));
      return;
    }

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
                <input type="text" name="username" placeholder={t('username')} value={loginData.username} onChange={handleLoginChange} required />
              </div>
              <div className={styles.inputGroup}>
                <input type="password" name="password" placeholder={t('password')} value={loginData.password} onChange={handleLoginChange} required />
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
                <input type="text" name="username" placeholder={t('username')} value={registerData.username} onChange={handleRegisterChange} required />
              </div>
              <div className={styles.inputGroup}>
                <input type="email" name="email" placeholder={t('email')} value={registerData.email} onChange={handleRegisterChange} required />
              </div>
              <div className={styles.inputGroup}>
                <input type="password" name="password" placeholder={t('password')} value={registerData.password} onChange={handleRegisterChange} required />
              </div>
              <div className={styles.inputGroup}>
                <input type="password" name="retypePassword" placeholder={t('retypePassword')} value={registerData.retypePassword} onChange={handleRegisterChange} required />
              </div>
              <div className={styles.inputGroup}>
                <input type="text" name="phone" placeholder={t('phone')} value={registerData.phone} onChange={handleRegisterChange} required />
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