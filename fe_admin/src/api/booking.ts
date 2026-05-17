import { PageRequest } from "types/paging";
import axiosServices from "utils/axios";

const getList = async (pageRequest: PageRequest) => {
    try {
        const response = await axiosServices.get('/booking/v1', { params: pageRequest });
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const getListByTheaterId = async (theaterId: number, pageRequest: PageRequest) => {
    try {
        const response = await axiosServices.get(`/booking/v1/theater/${theaterId}`, { params: pageRequest });
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const getById = async (id: number) => {
    try {
        const response = await axiosServices.get(`/booking/v1/${id}`);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

export { getList, getListByTheaterId, getById };