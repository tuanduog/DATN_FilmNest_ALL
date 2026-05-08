export interface Showtime {
    id: number;
    movieId: number;
    roomId: number;
    theaterId?: number;
    movieName?: string;
    roomName?: string;
    theaterName?: string;
    showDate: string;
    startTime: string;
    surcharge: number;
    status?: string;
}