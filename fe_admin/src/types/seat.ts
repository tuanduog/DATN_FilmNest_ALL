export type SeatType = 'STANDARD' | 'VIP' | 'SWEETBOX';
export type SeatStatus = 'ACTIVE' | 'DISABLED' | 'DELETED';

export interface Seat {
    row: number;
    col: number;
    label: string;
    type: SeatType;
    price: number;
    seatStatus: SeatStatus;
}
