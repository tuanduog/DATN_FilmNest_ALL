import { PageRequest } from "types/paging";
import axiosServices from "utils/axios";
import { Room } from "types/room";

const getList = async (pageRequest: PageRequest) => {
    try {
        const response = await axiosServices.get('/api/room/v1', { params: pageRequest });
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const getListByTheaterId = async (theaterId: number, pageRequest: PageRequest) => {
    try {
        const response = await axiosServices.get(`/api/room/v1/theater/${theaterId}`, { params: pageRequest });
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const create = async (room: Room) => {
    try {
        const response = await axiosServices.post('/api/room/v1', room);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const getById = async (id: number) => {
    try {
        const response = await axiosServices.get(`/api/room/v1/${id}`);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const update = async (id: number, room: any) => {
    try {
        const response = await axiosServices.put(`/api/room/v1/${id}`, room);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const deleteById = async (id: number) => {
    try {
        const response = await axiosServices.delete(`/api/room/v1/${id}`);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

export { getList, getListByTheaterId, create, getById, update, deleteById };