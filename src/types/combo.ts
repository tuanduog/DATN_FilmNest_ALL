export interface Combo {
    id?: string;
    name: string;
    price: number;
    description: string;
    status?: string;
    image?: File | null;
    imageUrl?: string;
}