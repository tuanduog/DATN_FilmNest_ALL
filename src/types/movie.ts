export interface Movie {
    id?: number;
    title: string;
    description?: string;
    director?: string;
    cast?: string[];
    genre?: string;
    releaseDate?: string;
    duration?: number;
    rating?: string;
    posterUrl?: string;
    trailerUrl?: string;
    status?: string;
}