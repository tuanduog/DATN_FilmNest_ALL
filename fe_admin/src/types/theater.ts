export interface Theater {
    id?: number;
    name: string;
    address: string;
    provinceCode: string;
    provinceName: string;
    communeCode: string;
    communeName: string;
    description: string;
    hotline: string;
    latitude?: number;
    longitude?: number;
    openTime: string;
    closeTime: string;
    status?: string;
}