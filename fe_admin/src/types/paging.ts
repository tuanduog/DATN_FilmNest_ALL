export interface PageResult<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        offset: number;
    };
    totalPages: number;
    totalElements: number;
}

export interface PageRequest {
    size?: number;
    page?: number;
    sort?: string;
    keyword?: string;
    type?: string | undefined;
    status?: string | undefined;
    role?: string | undefined;
    showingStatus?: string | undefined;
}

export const DEFAULT_PAGE_SIZE = 10;
