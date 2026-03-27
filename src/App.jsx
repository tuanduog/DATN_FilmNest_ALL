import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Home/Home";
import Header from "./Header/Header";
import Footer from './Footer/Footer';
import Movies from './Movies/Movies';
import Ranking from "./Ranking/Ranking";
import Theater from "./Theater/Theater";
import Member from "./Member/Member";
import Movie_detail from "./Movies/Movie_detail";
import Booking from "./Booking/Booking";
import PaymentInfo from "./Payment/Payment_info";
import Login from "./Auth/Login";
import Up from "./up";
import Filter from "./Search/Filter";
import History from "./History/History";
import Payment from "./Payment/Payment";
import UserInfo from "./UserInfo/User_info";
import Test from "./test";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/Movies" element={<Movies />}></Route>
        <Route path="/Ranking" element={<Ranking />}></Route>
        <Route path="/Theater" element={<Theater />}></Route>
        <Route path="/Member" element={<Member />}></Route>
        <Route path="/Movie_detail" element={<Movie_detail />}></Route>
        <Route path="/Booking" element={<Booking />}></Route>
        <Route path="/Payment_info" element={<PaymentInfo />}></Route>
        <Route path="/Login" element={<Login />}></Route>
        <Route path="/up" element={<Up />}></Route>
        <Route path="/Filter" element={<Filter />}></Route>
        <Route path="/Booking_history" element={<History />}></Route>
        <Route path="/Payment" element={<Payment />}></Route>
        <Route path="/Profile" element={<UserInfo />}></Route>
        <Route path="/test" element={<Test />}></Route>
      </Routes>
      <ToastContainer
        autoClose={2000}
        draggable={false}
        position="top-right"
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnHover
        style={{ right: '0' }}
      />
      <Footer />
    </BrowserRouter>
  );
}

export default App;