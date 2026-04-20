export interface Membership {
    id?: number;
    image?: File | null;
    imageUrl?: string;
    name: string;
    price: number;
    type: string;
    discount: number;
    duration?: number;
    description?: string;
    status: string;
}