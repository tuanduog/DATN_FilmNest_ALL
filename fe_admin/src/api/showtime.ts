import { PageRequest } from "types/paging";
import axiosServices from "utils/axios";
import { Showtime } from "types/showtime";

const getList = async (pageRequest: PageRequest) => {
    try {
        const response = await axiosServices.get('/api/showtime/v1', { params: pageRequest });
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const create = async (showtime: Showtime) => {
    try {
        const response = await axiosServices.post('/api/showtime/v1', showtime);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const getById = async (id: number) => {
    try {
        const response = await axiosServices.get(`/api/showtime/v1/${id}`);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const update = async (id: number, showtime: any) => {
    try {
        const response = await axiosServices.put(`/api/showtime/v1/${id}`, showtime);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const deleteById = async (id: number) => {
    try {
        const response = await axiosServices.delete(`/api/showtime/v1/${id}`);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

export { getList, create, getById, update, deleteById };