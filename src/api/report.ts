import axiosServices from "utils/axios";

const getTicketChart = async (theaterId: number | null, filterType: string) => {
    try {
        const response = await axiosServices.get(`/api/report/v1/revenue/ticket`, { params: { theaterId, filterType } });
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const getRevenueStructureChart = async (theaterId: number | null, filterType: string) => {
    try {
        const response = await axiosServices.get(`/api/report/v1/revenue/structure`, { params: { theaterId, filterType } });
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const getMovieChart = async (theaterId: number | null, filterType: string) => {
    try {
        const response = await axiosServices.get(`/api/report/v1/revenue/movie`, { params: { theaterId, filterType } });
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const getTheaterChart = async (filterType: string) => {
    try {
        const response = await axiosServices.get(`/api/report/v1/revenue/theater`, { params: { filterType } });
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const getRoomChart = async (theaterId: number | null, filterType: string) => {
    try {
        const response = await axiosServices.get(`/api/report/v1/revenue/room`, { params: { theaterId, filterType } });
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const getLastSummary = async (theaterId: number | null, filterType: string) => {
    try {
        const response = await axiosServices.get(`/api/report/v1/revenue/last-summary`, { params: { theaterId, filterType } });
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

export { getTicketChart, getRevenueStructureChart, getMovieChart, getTheaterChart, getRoomChart, getLastSummary };
