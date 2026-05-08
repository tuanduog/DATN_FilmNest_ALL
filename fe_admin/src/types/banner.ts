export interface Banner {
    id?: number;
    name: string;
    image?: File | null;
    imageUrl?: string;
    createdAt?: string;
    updatedAt?: string;
    status?: string;
}