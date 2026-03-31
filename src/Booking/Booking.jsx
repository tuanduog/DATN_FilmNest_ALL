import React, { useRef } from "react";
import '../Booking/Booking.css';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import { toast } from "react-toastify";

function Booking() {
    const navigate = useNavigate();
    const [movieInfo, setMovieInfo] = useState({});
    const [time, setTime] = useState({});
    const [date, setDate] = useState("");
    const [selectedSeat, setSelectedSeat] = useState([]);
    const user = JSON.parse(sessionStorage.getItem("user")) || {};
    const savedTheater = JSON.parse(localStorage.getItem("theater"));
    const bookingInfo = JSON.parse(localStorage.getItem('bookingInfo'));
    const [othersSelecting, setOthersSelecting] = useState({});
    const d = new Date();
    const y = d.getFullYear();
    const savedDate = bookingInfo.date + "/" + y;
    const [day, month, year] = savedDate.split('/');
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const [timeLeft, setTimeLeft] = useState(() => {
        const storedTime = localStorage.getItem('timeLeft');
        return storedTime ? parseInt(storedTime, 10) : 600;
    });
    const [bookeds, setBookeds] = useState([]);
    const client = useRef(null); // giữ client ko biến mất khi re-render
    const allowSelect = Object.values(othersSelecting).flat();
    // phim, 

    const seatPrices = {
        normal: 70000,
        vip: 100000,
        couple: 130000
    };

    const calculateTotal = () => {
        return selectedSeat.reduce((total, seat) => {
            const type = getSeatType(seat);
            return total + (seatPrices[type] || 0);
        }, 0);
    };
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };
    const fetchBBST = async () => {
        try {
            console.log('time', time.showTimeId);
            const res = await axios.get(`http://localhost:8099/booking/get-byshowtime/${time.showTimeId}`,
                { withCredentials: true }
            );
            const filterbook = res.data.filter(book => book.date === formattedDate);
            console.log('booked', filterbook)
            setBookeds(filterbook);
        } catch (error) {
            console.error("Không lấy được booking theo showtimeId", error);
        }
    }

    useEffect(() => {
        const chairString = selectedSeat.join(', ');
        localStorage.setItem('chairString', chairString);
    }, [selectedSeat]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const data = JSON.parse(localStorage.getItem("bookingInfo"));
        if (data) {
            setMovieInfo(data.movieInfo);
            setTime(data.time);
            setDate(data.date);
        }
    }, []);

    useEffect(() => {
        if (time?.showTimeId) {
            fetchBBST();

        }
    }, [time?.showTimeId]);

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

    const seatTypes = {
        vip: ['C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'D6', 'D7', 'D8', 'D9']
    };

    const getSeatType = (seat) => {
        const row = seat.charAt(0);
        if (seatTypes.vip.includes(seat)) return "vip";
        if (row === "G") return "couple";
        return "normal";
    };

    useEffect(() => {
        if (!time?.showTimeId || !movieInfo.movieId) return;

        if (client.current) {
            client.current.deactivate();
        }

        client.current = new Client({
            brokerURL: "ws://localhost:8099/wsocket",
            debug: (str) => console.log("STOMP:", str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log("Connected to WS!");
                client.current.subscribe(
                    `/topic/seats/${movieInfo.movieId}/${time.showTimeId}/${formattedDate}`,
                    (message) => {
                        const seatSelecting = JSON.parse(message.body);
                        console.log("Seat selecting:", seatSelecting);
                        const [userId, seats] = Object.entries(seatSelecting)[0];
                        const seatList = seats ? seats.split(',').map(s => s.trim()) : [];
                        setOthersSelecting(prev => ({
                            ...prev,
                            [userId]: userId === String(user.userId) ? [] : seatList
                        }));
                    }
                );
            }
        });

        client.current.activate();

        return () => {
            if (client.current) {
                client.current.deactivate();
            }
        };
    }, [movieInfo.movieId, time.showTimeId, formattedDate]);


    useEffect(() => {
        if (!time?.showTimeId || !movieInfo.movieId) return;
        if (!client.current) return;

        axios.get(`http://localhost:8099/booking/seats-locking/${movieInfo.movieId}/${time.showTimeId}/${formattedDate}`,
            { withCredentials: true })
            .then(response => {
                const data = response.data || {};
                console.log("Ghế đang bị giữ:", data);
                // Lấy ghế mình đang giữ
                const mySeats = data[String(user.userId)]
                    ? data[String(user.userId)].split(',').map(s => s.trim()) : [];

                // Lấy ghế người khác giữ
                const filtered = Object.fromEntries(
                    Object.entries(data).filter(([uid]) => uid !== String(user.userId))
                );
                const normalized = Object.fromEntries(
                    Object.entries(filtered).map(([uid, seats]) => [uid, seats.split(',').map(s => s.trim())])
                );
                setOthersSelecting(normalized);
                setSelectedSeat(mySeats);
            })
            .catch(error => {
                console.error("Không lấy được ghế đang bị giữ", error);
            });

    }, [movieInfo.movieId, time.showTimeId, formattedDate]); // chạy lại khi movieId, showTimeId hoặc formattedDate thay đổi


    const handleSeatSelection = (seatNumber) => {
        setSelectedSeat((prev) => {
            const isSelected = prev.includes(seatNumber); // => trả bool
            let newSeats;
            if (bookeds.some(booking => booking.chair?.split(', ').includes(seatNumber))) {
                return prev;
            }
            const allOtherSeats = Object.values(othersSelecting).flat();
            if (allOtherSeats.includes(seatNumber)) {
                toast.warning("Ghế này đang được người khác chọn trước rồi, vui lòng chọn ghế khác.");
                return prev;
            }
            if (isSelected) {
                newSeats = prev.filter(seat => seat !== seatNumber); // chọn rồi => bỏ khỏi mảng
            } else {
                if (prev.length >= 8) {
                    setTimeout(() => {
                        toast.warning("Bạn chỉ được chọn tối đa 8 ghế.");
                    }, 0);
                    return prev;
                }
                newSeats = [...prev, seatNumber]; // add ghế mới vào
            }

            // newSeats là ds ghế đang chọn -> lấy ném vào ws
            // xác định ngày đang đặt, giờ đặt, phim, user, ghế -> showtime, user, date

            const seatInfo = {
                movieId: movieInfo.movieId,
                date: formattedDate, // ngày chọn
                showTimeId: time.showTimeId,
                userId: user.userId,
                seats: newSeats.join(', '), // ghế đang chọn
                created_at: new Date().toISOString()
            }

            if (client.current && client.current.connected) {
                client.current.publish({ destination: "/app/seat-selecting", body: JSON.stringify(seatInfo) });
            }

            return newSeats;
        });
    };

    const handlePaymentInfo = () => {
        if (selectedSeat.length > 0) {
            const seatTypeList = selectedSeat.map(seat => getSeatType(seat));
            navigate("/Payment_info", {
                state: {
                    total: calculateTotal(),
                    // formattedTotal: calculateTotal().toLocaleString('vi-VN'),
                    selectedSeats: selectedSeat,
                    seatTypes: seatTypeList
                }
            });
            window.scrollTo(0, 0);
        } else {
            toast.warning("Vui lòng chọn ít nhất 1 ghế");
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex flex-wrap p-4 ticket-booking-container gap-5 justify-content-center">

                {/* Khu vực chọn ghế */}
                <div className="seating-layout">
                    <div className="screen text-center mb-4">MÀN HÌNH CHIẾU</div>

                    <div className="seat-grid">
                        {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((row) => (
                            <div className="seat-row" key={row}>
                                {Array.from({ length: 14 }, (_, i) => {
                                    const seatNumber = `${row}${i + 1}`;
                                    const seatIndex = i + 1;
                                    const isSold = bookeds.some(booking =>
                                        booking.chair?.split(', ').includes(seatNumber)
                                    );
                                    const type = getSeatType(seatNumber);

                                    if (type === 'couple' && seatIndex % 2 === 0) return null;

                                    return (
                                        <div
                                            key={seatNumber}
                                            className={`seat ${type} ${isSold ? 'sold' :
                                                    selectedSeat.includes(seatNumber) // ghế mình chọn -> màu xanh dương
                                                        ? 'selected'
                                                        : allowSelect.includes(seatNumber) // ghế người khác chọn -> màu xanh nhajt
                                                            ? 'selecting'
                                                            : ''}`}
                                            onClick={() => handleSeatSelection(seatNumber)}
                                            style={{ cursor: 'pointer', ...(type === 'couple' ? { width: '80px' } : {}) }}
                                        >
                                            {seatNumber}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    <div className="legend mt-4">
                        <h6 className="mb-2 fw-bold col-2">Loại ghế:</h6>
                        <div className="d-flex flex-wrap gap-4">
                            <div>
                                <span className="seat normal me-2"></span>
                                Ghế thường  <span className="text">( 70.000 VNĐ )</span>
                            </div>
                            <div>
                                <span className="seat vip me-2"></span>
                                Ghế VIP <span className="text">( 100.000 VNĐ )</span>
                            </div>
                            <div>
                                <span className="seat couple me-2"></span>
                                Ghế đôi <span className="text">( 130.000 VNĐ )</span>
                            </div>
                        </div>
                    </div>
                    <div className="legend mt-4">
                        <h6 className="mb-3 fw-bold col-2">Tình trạng:</h6>
                        <div className="d-flex flex-wrap gap-4">
                            <div><span className="seat empty"></span>Ghế trống</div>
                            <div><span className="seat selected"></span>Đang chọn</div>
                            <div><span className="seat selecting"></span>Đang bị giữ</div>
                            <div><span className="seat sold"></span>Đã bán</div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between mt-4 px-2">
                        <div>
                            <p className="fw-bold mb-1">Tổng tiền</p>
                            <h5 className="text-primary">{calculateTotal().toLocaleString('vi-VN')} VNĐ</h5>
                        </div>
                        <div>
                            <p className="fw-bold mb-1">⏳ Thời gian còn lại</p>
                            <h5 className="text-success">{formatTime(timeLeft)}</h5>
                        </div>
                    </div>
                </div>

                {/* Khu vực thông tin phim */}
                <div className="ticket-summary">
                    <img src={movieInfo.image} className="img-fluid mb-3 rounded" alt="Poster" width={220} />
                    <h5 className="fw-bold text-primary fs-3 mb-2">{movieInfo.movieName}</h5>
                    <p className="text-muted fst-italic mb-3"><strong>2D Phụ đề</strong></p>
                    <ul className="list-unstyled lh-lg">
                        <li><strong className="text-dark">Thể loại:</strong> {movieInfo.genre}</li>
                        <li><strong className="text-dark">Thời lượng:</strong> {movieInfo.duration}</li>
                        <li><strong className="text-dark">Rạp chiếu:</strong> {savedTheater.theaterName}</li>
                        <li><strong className="text-dark">Ngày chiếu:</strong> {date}/2025</li>
                        <li><strong className="text-dark">Giờ chiếu:</strong> {time?.startTime?.slice(0, 5)}</li>
                        <li><strong className="text-dark">Phòng chiếu:</strong> {time?.roomName?.roomName}</li>
                        <li><strong className="text-dark">Ghế ngồi:</strong>
                            {selectedSeat.length === 0 ? (
                                <span className="badge bg-secondary"></span>
                            ) : (
                                <div className="mt-2">
                                    {[...Array(Math.ceil(selectedSeat.length / 4))].map((_, rowIndex) => (
                                        <div className="d-flex flex-wrap mb-1" key={rowIndex}>
                                            {selectedSeat
                                                .slice(rowIndex * 4, rowIndex * 4 + 4)
                                                .map((seat) => (
                                                    <span
                                                        key={seat}
                                                        className="badge bg-secondary me-2"
                                                        style={{ width: '45px', textAlign: 'center' }}
                                                    >
                                                        {seat}
                                                    </span>
                                                ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </li>
                    </ul>
                    <hr />
                    <button className="btn btn-primary w-100 mt-2" onClick={handlePaymentInfo}>TIẾP TỤC</button>
                </div>
            </div>
        </div>
    );
}

export default Booking;
