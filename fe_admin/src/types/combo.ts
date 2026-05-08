export interface Combo {
    id?: number;
    name: string;
    price: number;
    description: string;
    status?: string;
    image?: File | null;
    imageUrl?: string;
}