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
    const [seats, setSeats] = useState([]);
    const client = useRef(null);
    const allowSelect = Object.values(othersSelecting).flat();

    useEffect(() => {
        const fetchSeats = async () => {
            try {
                const res = await axios.get(`http://localhost:8099/api/seat/v1/room/${bookingInfo.time.roomId}`,
                    { withCredentials: true });
                if (res.data && res.data.data) {
                    setSeats(res.data.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách ghế", error);
            }
        }
        fetchSeats();
    }, [bookingInfo?.time?.roomId]);

    const calculateTotal = () => {
        const surcharge = time?.surcharge || 0;
        return selectedSeat.reduce((total, seatLabel) => {
            const seat = seats.find(s => s.label === seatLabel);
            return total + (seat?.price || 0) + surcharge;
        }, 0);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };
    const fetchBBST = async () => {
        try {
            const res = await axios.get(`http://localhost:8099/booking/get-byshowtime/${time.showTimeId}`,
                { withCredentials: true }
            );
            const filterbook = res.data.filter(book => book.date === formattedDate);
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

    const getSeatType = (seatLabel) => {
        const seat = seats.find(s => s.label === seatLabel);
        if (!seat) return "normal";
        const type = (seat.type || seat.seatType || "normal").toLowerCase();
        return type === "standard" ? "normal" : type;
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
        <div className="booking-page">
            <div className="container-fluid py-4">
                <div className="ticket-booking-container">

                    {/* Khu vực chọn ghế */}
                    <div className="seating-layout">
                        <div className="screen-container">
                            <div className="screen"></div>
                            <div className="screen-text">Màn hình chiếu</div>
                        </div>

                        <div className="seat-grid">
                            {seats.length > 0 ? (
                                Object.entries(
                                    seats.reduce((acc, seat) => {
                                        const row = seat.row;
                                        if (!acc[row]) acc[row] = [];
                                        acc[row].push(seat);
                                        return acc;
                                    }, {})
                                ).sort(([a], [b]) => parseInt(a) - parseInt(b)).map(([row, rowSeats]) => (
                                    <div className="seat-row" key={row}>
                                        {rowSeats.sort((a, b) => a.col - b.col).map((seat) => {

                                            const seatLabel = seat.label;
                                            const isSold = bookeds.some(booking =>
                                                booking.chair?.split(', ').includes(seatLabel)
                                            );
                                            let type = (seat.type || seat.seatType || "normal").toLowerCase();
                                            if (type === "standard") type = "normal";

                                            return (
                                                <div
                                                    key={seat.id}
                                                    className={`seat ${type} ${isSold ? 'sold' :
                                                        selectedSeat.includes(seatLabel)
                                                            ? 'selected'
                                                            : allowSelect.includes(seatLabel)
                                                                ? 'selecting'
                                                                : ''}`}
                                                    onClick={() => handleSeatSelection(seatLabel)}
                                                    title={`${seatLabel} - ${type.toUpperCase()}`}
                                                >
                                                    {seatLabel}
                                                </div>
                                            );
                                        })}
                                    </div>

                                ))
                            ) : (
                                /* Fallback grid */
                                ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((row) => (
                                    <div className="seat-row" key={row}>
                                        {Array.from({ length: 14 }, (_, i) => {

                                            const seatLabel = `${row}${i + 1}`;
                                            const isSold = bookeds.some(booking =>
                                                booking.chair?.split(', ').includes(seatLabel)
                                            );
                                            const type = getSeatType(seatLabel);
                                            if (type === 'couple' && (i + 1) % 2 === 0) return null;
                                            return (
                                                <div
                                                    key={seatLabel}
                                                    className={`seat ${type} ${isSold ? 'sold' :
                                                        selectedSeat.includes(seatLabel)
                                                            ? 'selected'
                                                            : allowSelect.includes(seatLabel)
                                                                ? 'selecting'
                                                                : ''}`}
                                                    onClick={() => handleSeatSelection(seatLabel)}
                                                >
                                                    {seatLabel}
                                                </div>
                                            );
                                        })}
                                    </div>

                                ))
                            )}
                        </div>

                        {/* Legend Section */}
                        <div className="legend-container">
                            <div className="legend-group">
                                <div className="legend-title">Loại ghế</div>
                                <div className="d-flex flex-wrap gap-3">
                                    {seats.some(s => s.type?.toLowerCase() === 'standard') && (
                                        <div className="legend-item">
                                            <div className="legend-seat normal">
                                                <i className="bi bi-person"></i>
                                            </div>
                                            <span>Thường: ({(seats.find(s => s.type?.toLowerCase() === 'standard')?.price || 0).toLocaleString()}đ)</span>
                                        </div>
                                    )}
                                    {seats.some(s => s.type?.toLowerCase() === 'vip') && (
                                        <div className="legend-item">
                                            <div className="legend-seat vip">
                                                <i className="bi bi-gem"></i>
                                            </div>
                                            <span>VIP: ({(seats.find(s => s.type?.toLowerCase() === 'vip')?.price || 0).toLocaleString()}đ)</span>
                                        </div>
                                    )}
                                    {seats.some(s => s.type?.toLowerCase() === 'sweetbox') && (
                                        <div className="legend-item">
                                            <div className="legend-seat couple">
                                                <i className="bi bi-heart"></i>
                                            </div>
                                            <span>Đôi: ({(seats.find(s => s.type?.toLowerCase() === 'sweetbox')?.price || 0).toLocaleString()}đ)</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="legend-group">
                                <div className="legend-title">Trạng thái</div>
                                <div className="d-flex flex-wrap gap-3">
                                    <div className="legend-item">
                                        <div className="legend-seat empty"></div>
                                        <span>Trống</span>
                                    </div>
                                    <div className="legend-item">
                                        <div className="legend-seat selected"></div>
                                        <span>Đang chọn</span>
                                    </div>

                                    <div className="legend-item">
                                        <div className="legend-seat selecting"></div>
                                        <span>Đang giữ</span>
                                    </div>
                                    <div className="legend-item">
                                        <div className="legend-seat sold"></div>
                                        <span>Đã bán</span>
                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>

                    {/* Sidebar Thông tin vé */}
                    <aside className="ticket-summary">
                        <img src={movieInfo.image} className="movie-mini-poster" alt={movieInfo.movieName} />
                        <h2 className="summary-title">{movieInfo.movieName}</h2>

                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label"><i className="bi bi-tag me-2"></i>Thể loại</span>
                                <span className="info-value">{movieInfo.genre}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label"><i className="bi bi-clock me-2"></i>Thời lượng</span>
                                <span className="info-value">{movieInfo.duration} phút</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label"><i className="bi bi-geo-alt me-2"></i>Rạp</span>
                                <span className="info-value">{savedTheater?.name}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label"><i className="bi bi-calendar-event me-2"></i>Suất chiếu</span>
                                <span className="info-value">{time?.startTime?.slice(0, 5)} • {date}/{y}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label"><i className="bi bi-door-open me-2"></i>Phòng</span>
                                <span className="info-value">{time?.roomName || "Phòng chiếu"}</span>
                            </div>

                            <div className="mt-3">
                                <span className="info-label d-block mb-2">Ghế đã chọn</span>
                                <div className="selected-seats-badge-container">
                                    {selectedSeat.length > 0 ? (
                                        selectedSeat.map(seat => (
                                            <span key={seat} className="seat-badge">{seat}</span>
                                        ))
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="total-section">
                            <div className="total-label">Tổng cộng tạm tính</div>
                            <div className="total-amount">
                                {calculateTotal().toLocaleString('vi-VN')}
                                <span className="total-currency">VNĐ</span>
                            </div>
                        </div>

                        <button
                            className="btn-checkout"
                            onClick={handlePaymentInfo}
                            disabled={selectedSeat.length === 0}
                        >
                            {selectedSeat.length > 0 ? "TIẾP TỤC THANH TOÁN" : "VUI LÒNG CHỌN GHẾ"}
                        </button>
                    </aside>
                </div>
            </div>

            {/* Timer floating */}
            <div className="timer-floating">
                <i className="bi bi-hourglass-split timer-icon"></i>
                <div className="timer-content">
                    <div className="text-muted" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Thời gian giữ ghế</div>
                    <div className="timer-value">{formatTime(timeLeft)}</div>
                </div>
            </div>
        </div>
    );
}

export default Booking;


