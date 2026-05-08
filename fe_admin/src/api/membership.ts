import { PageRequest } from "types/paging";
import axiosServices from "utils/axios";
import { Membership } from "types/membership";

const getList = async (pageRequest: PageRequest) => {
    try {
        const response = await axiosServices.get('/api/membership/v1', { params: pageRequest });
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const create = async (membership: Membership) => {
    try {
        const response = await axiosServices.post('/api/membership/v1', membership);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const getById = async (id: number) => {
    try {
        const response = await axiosServices.get(`/api/membership/v1/${id}`);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const update = async (id: number, membership: any) => {
    try {
        const response = await axiosServices.put(`/api/membership/v1/${id}`, membership);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const deleteById = async (id: number) => {
    try {
        const response = await axiosServices.delete(`/api/membership/v1/${id}`);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

export { getList, create, getById, update, deleteById };