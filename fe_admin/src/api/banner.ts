import { PageRequest } from "types/paging";
import axiosServices from "utils/axios";
import { Banner } from "types/banner";

const getList = async (pageRequest: PageRequest) => {
    try {
        const response = await axiosServices.get('/api/banner/v1', { params: pageRequest });
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const create = async (banner: Banner) => {
    try {
        const response = await axiosServices.post('/api/banner/v1', banner);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const getById = async (id: number) => {
    try {
        const response = await axiosServices.get(`/api/banner/v1/${id}`);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const update = async (id: number, banner: any) => {
    try {
        const response = await axiosServices.put(`/api/banner/v1/${id}`, banner);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const deleteById = async (id: number) => {
    try {
        const response = await axiosServices.delete(`/api/banner/v1/${id}`);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

export { getList, create, getById, update, deleteById };