import { PageRequest } from "types/paging";
import axiosServices from "utils/axios";
import { Theater } from "types/theater";

const getList = async (pageRequest: PageRequest) => {
    try {
        const response = await axiosServices.get('/api/theater/v1', { params: pageRequest });
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const create = async (theater: Theater) => {
    try {
        const response = await axiosServices.post('/api/theater/v1', theater);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const getById = async (id: number) => {
    try {
        const response = await axiosServices.get(`/api/theater/v1/${id}`);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const update = async (id: number, theater: any) => {
    try {
        const response = await axiosServices.put(`/api/theater/v1/${id}`, theater);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const deleteById = async (id: number) => {
    try {
        const response = await axiosServices.delete(`/api/theater/v1/${id}`);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

export { getList, create, getById, update, deleteById };