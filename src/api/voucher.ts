import axiosServices from "utils/axios";
import { Voucher } from "types/voucher";
import { PageRequest } from "types/paging";

const getList = async (pageRequest: PageRequest) => {
    try {
        const response = await axiosServices.get('/api/voucher/v1', { params: pageRequest });
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const create = async (voucher: Voucher) => {
    try {
        const response = await axiosServices.post('/api/voucher/v1', voucher);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const getById = async (id: number) => {
    try {
        const response = await axiosServices.get(`/api/voucher/v1/${id}`);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const update = async (id: number, voucher: Voucher) => {
    try {
        const response = await axiosServices.put(`/api/voucher/v1/${id}`, voucher);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const deleteById = async (id: number) => {
    try {
        const response = await axiosServices.delete(`/api/voucher/v1/${id}`);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

export { getList, create, getById, update, deleteById };
