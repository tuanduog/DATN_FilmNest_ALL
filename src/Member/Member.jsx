import React, { useEffect, useState } from "react"
import styles from "../Member/Member.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function Member() {
    const { t } = useTranslation();
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

    const [pageRequest, setPageRequest] = useState({
        page: 0,
        size: 100,
        sort: '',
        keyword: '',
        status: 'ACTIVE'
    });

    const [memberships, setMemberships] = useState([]);

    useEffect(() => {
        const fetchMemberships = async () => {
            try {
                const res = await axios.get(`http://localhost:8099/api/membership/v1/all`);
                if (res.data && res.data.data) {
                    setMemberships(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch memberships:", error);
            }
        };

        fetchMemberships();
    }, []);

    const handleSelectPlan = (plan) => {
        if (sessionStorage.getItem('state') === 'Login successful') {
            setSelectedPlan(plan.name);
            setPrice(plan.price);
            const member = {
                id: plan.id,
                vip: plan.name,
                startDate: today.toISOString(),
                expire: plan.duration
            }
            localStorage.setItem('member', JSON.stringify(member));
            setShowConfirm(true);
        } else {
            navigate("/Login");
        }
    };

    const handlePayment = async () => {
        try {
            const res = await axios.post("http://localhost:8099/api/order/v1/create", {
                productName: t('membershipPlan') + " " + selectedPlan,
                description: 'Thanh toán FilmNest',
                price: price,
                returnUrl: "http://localhost:5173/Member",
                cancelUrl: "http://localhost:5173/Member",
            }, { withCredentials: true });

            const payUrl = res.data?.data?.checkoutUrl;
            if (payUrl) {
                window.location.href = payUrl;
            } else {
                toast.error(t('paymentLinkError') || "Không lấy được link thanh toán!");
            }
        } catch (error) {
            console.error("Tạo đơn thanh toán thất bại:", error);
            toast.warning(t('paymentCreateFailed') || "Tạo đơn thanh toán thất bại!");
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
            const res = await axios.get(`http://localhost:8099/api/membership/v1/user`,
                { withCredentials: true }
            );
            if (res.data && res.data.data) {
                const data = res.data.data;
                setMembership(data.name);
                setTotalDay(data.duration);
                if (data.startDate) setStartDate(data.startDate);
                if (data.endDate) {
                    const end = new Date(data.endDate);
                    const now = new Date();
                    const diffTime = end - now;
                    const diffDays = diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
                    setDayLeft(diffDays);
                } else {
                    setDayLeft(data.duration || 0);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (user) {
            fetchMember();
        }
    }, [user]);

    useEffect(() => {
        const updateMembership = async () => {
            if (status === "PAID" && cancel === "false" && code === "00") {
                try {
                    const member = JSON.parse(localStorage.getItem('member'));
                    if (!member) return;

                    await axios.post(`http://localhost:8099/api/user-membership/v1/payment/${user.userId}/${member.id}`,
                        {},
                        { withCredentials: true }
                    );
                    toast.success(t('subscribeSuccess', { plan: member.vip }) || `Đăng ký gói ${member.vip} thành công!`);
                    localStorage.removeItem('member');
                    fetchMember();
                    navigate('/Member', { replace: true });
                } catch (error) {
                    console.error("Cập nhật membership thất bại", error);
                    toast.error(t('updateMemberError') || "Có lỗi xảy ra khi cập nhật gói hội viên.");
                }
            }
        }
        updateMembership();
    }, [status, cancel, code, user?.userId, navigate]);

    return (
        <div className={styles.pageWrapper}>
            {/* Hero Section */}
            <header className={styles.heroSection}>
                <div className="container">
                    <div className={styles.headerContent}>
                        <h2 className={styles.title}>{t('becomeMember')}</h2>
                        <p className={styles.subtitle}>{t('memberSubtitle')}</p>
                    </div>
                </div>
            </header>

            <div className="container" style={{ marginTop: '-80px', position: 'relative', zIndex: 10 }}>
                <div className={styles.cardContainer}>

                    {memberships.map((plan, index) => {
                        const lowerType = plan.type?.toLowerCase() || '';
                        let cardClass = styles.vipStandard;
                        if (lowerType.includes('gold')) cardClass = styles.vipGold;
                        else if (lowerType.includes('premium')) cardClass = styles.vipPremium;
                        else if (lowerType.includes('silver')) cardClass = styles.vipSilver;
                        else if (lowerType.includes('diamond') || lowerType.includes('platinum')) cardClass = styles.vipDiamond;

                        const isRecommended = index === 1;

                        return (
                            <div key={plan.id || index} className={`${styles.card} ${cardClass} ${isRecommended ? styles.isRecommended : ''}`}>
                                {isRecommended && <div className={styles.ribbon}>{t('recommended')}</div>}
                                <h3 className={styles.name}>{plan.name ? plan.name.toUpperCase() : t('membershipPlan')}</h3>
                                <div className={styles.packageType}>{plan.type ? plan.type.toUpperCase() : t('basic')}</div>
                                <div className={styles.priceContainer}>
                                    <p className={styles.price}>{plan.price ? plan.price.toLocaleString('vi-VN') : 0}<span className={styles.priceCurrency}>đ</span></p>
                                    <p className={styles.duration}>{t('validForDays', { days: plan.duration })}</p>
                                </div>
                                <ul className={styles.benefitList}>
                                    {plan.benefits && Array.isArray(plan.benefits) && plan.benefits.length > 0 ? (
                                        plan.benefits.map((benefit, bIndex) => {
                                            let text = "Quyền lợi";
                                            if (benefit.type === 'direct') {
                                                text = benefit.description;
                                            } else if (benefit.type === 'voucher' && benefit.voucher) {
                                                text = `Tặng Voucher ${benefit.voucher.code} - ${benefit.voucher.description || ''}`;
                                            } else if (benefit.type === 'combo' && benefit.combo) {
                                                text = `Tặng Combo ${benefit.combo.name}`;
                                            } else {
                                                text = benefit.description || benefit.type || "Quyền lợi";
                                            }

                                            return (
                                                <li key={bIndex}>
                                                    <span className={styles.checkIcon}><i className="bi bi-check-lg"></i></span>
                                                    {text}
                                                </li>
                                            );
                                        })
                                    ) : (
                                        <>
                                            <li><span className={styles.checkIcon}><i className="bi bi-check-lg"></i></span> {t('unlimitedMovies')}</li>
                                            <li><span className={styles.checkIcon}><i className="bi bi-check-lg"></i></span> {t('priorityService')}</li>
                                            <li><span className={styles.checkIcon}><i className="bi bi-check-lg"></i></span> {t('earnPoints')}</li>
                                        </>
                                    )}
                                </ul>
                                <div className={styles.buttonWrapper}>
                                    <button
                                        className={`${styles.subscribeBtn} ${membership === plan.name ? styles.disabled : ""}`}
                                        onClick={membership === plan.name ? null : () => handleSelectPlan(plan)}
                                        disabled={membership === plan.name}
                                    >
                                        {membership === plan.name ? t('inUse') : t('subscribeNow')}
                                    </button>
                                    {membership === plan.name && (
                                        <p className={styles.dayLeftText}>
                                            <i className="bi bi-clock-history"></i> {t('daysRemaining', { days: dayLeft })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Popup xác nhận */}
            {showConfirm && (
                <div className={styles.overlay}>
                    <div className={styles.confirmBox}>
                        <button className={styles.closeBtn} onClick={handleClose}>
                            <i className="bi bi-x-lg"></i>
                        </button>

                        <h4>{t('confirmUpgrade')}</h4>
                        <p>{t('selectingPlan', { plan: selectedPlan })}</p>

                        <div className={styles.terms}>
                            <p className="fw-bold mb-3 text-dark">{t('termsAndPolicy')}</p>
                            <ul className="list-unstyled">
                                <li className="mb-2">• {t('term1')}</li>
                                <li className="mb-2">• {t('term2')}</li>
                                <li className="mb-2">• {t('term3')}</li>
                                <li className="mb-2">• {t('term4')}</li>
                                <li className="mb-2">• {t('term5')}</li>
                            </ul>
                            <p className="mt-3 small">{t('termsAgree')}</p>
                        </div>

                        <label className={styles.agreeContainer}>
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                            />
                            {t('iAgree')}
                        </label>

                        <div className={styles.buttonGroup}>
                            <button onClick={handleClose} className={styles.cancelBtn}>{t('goBack')}</button>
                            <button
                                onClick={handleConfirm}
                                disabled={!agreed}
                                className={styles.confirmBtn}
                            >
                                {t('payNow')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Member;
