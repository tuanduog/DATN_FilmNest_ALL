export interface Theater {
    id?: number;
    name: string;
    address: string;
    provinceCode: number;
    provinceName: string;
    communeCode: number;
    communeName: string;
    description: string;
    hotline: string;
    latitude?: number;
    longitude?: number;
    openTime: string;
    closeTime: string;
    status?: string;
}