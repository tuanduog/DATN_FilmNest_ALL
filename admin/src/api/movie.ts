import { PageRequest } from "types/paging";
import axiosServices from "utils/axios";
import { Movie } from "types/movie";

const getList = async (pageRequest: PageRequest) => {
    try {
        const response = await axiosServices.get('/api/movie/v1', { params: pageRequest });
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const create = async (movie: Movie) => {
    try {
        const response = await axiosServices.post('/api/movie/v1', movie);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const getById = async (id: number) => {
    try {
        const response = await axiosServices.get(`/api/movie/v1/${id}`);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const update = async (id: number, movie: any) => {
    try {
        const response = await axiosServices.put(`/api/movie/v1/${id}`, movie);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const deleteById = async (id: number) => {
    try {
        const response = await axiosServices.delete(`/api/movie/v1/${id}`);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

export { getList, create, getById, update, deleteById };