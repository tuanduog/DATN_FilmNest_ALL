export interface Room {
    id?: number;
    name: string;
    capacity: number;
    totalRow: number;
    totalColumn: number;
    type: string;
    status: string;
    theaterId: number | null;
    theaterName?: string;
    seats?: any[];
}