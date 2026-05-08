export interface Voucher {
    id?: number;
    code: string;
    type: string;
    description: string;
    startDate?: string;
    endDate?: string;
    discount?: number;
    quantity?: number;
    minOrderValue?: number;
    status?: string;
}