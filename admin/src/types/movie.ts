export interface Movie {
    id?: number;
    name: string;
    description?: string;
    director?: string;
    actor?: string;
    genre?: string;
    releaseDate?: string;
    endDate?: string;
    duration?: number;
    trailerUrl?: string;
    showingStatus?: string;
    status?: string;
    image?: File | string | null;
    imageUrl?: string;
}