import { PageRequest } from "types/paging";
import axiosServices from "utils/axios";
import { Combo } from "types/combo";

const getList = async (pageRequest: PageRequest) => {
    try {
        const response = await axiosServices.get('/api/combo/v1', { params: pageRequest });
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const create = async (combo: Combo) => {
    try {
        const response = await axiosServices.post('/api/combo/v1', combo);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const getById = async (id: number) => {
    try {
        const response = await axiosServices.get(`/api/combo/v1/${id}`);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const update = async (id: number, combo: any) => {
    try {
        const response = await axiosServices.put(`/api/combo/v1/${id}`, combo);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const deleteById = async (id: number) => {
    try {
        const response = await axiosServices.delete(`/api/combo/v1/${id}`);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

export { getList, create, getById, update, deleteById };