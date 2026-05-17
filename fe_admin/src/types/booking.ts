import { Showtime } from "./showtime";
import { Voucher } from "./voucher";
import { Combo } from "./combo";

export interface Booking {
    id?: number;
    code: string;
    username: string;
    chair: string;
    totalPrice: number;
    paymentStatus?: string;
    showTime?: Showtime;
    bookingCombos?: BookingCombo[];
    vouchers?: Voucher[];
}

export interface BookingCombo {
    id?: number;
    Combo: Combo;
    type: string;
    quantity: number;
    price: number;
}