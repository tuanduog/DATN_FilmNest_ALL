import axiosServices from "utils/axios";
import { Employee } from "types/employee";
import { PageRequest } from "types/paging";

const getList = async (pageRequest: PageRequest) => {
    try {
        const response = await axiosServices.get('/api/employee/v1', { params: pageRequest });
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const create = async (employee: Employee) => {
    try {
        const response = await axiosServices.post('/api/employee/v1', employee);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const getById = async (id: number) => {
    try {
        const response = await axiosServices.get(`/api/employee/v1/${id}`);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const update = async (id: number, employee: any) => {
    try {
        const response = await axiosServices.put(`/api/employee/v1/${id}`, employee);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const deleteById = async (id: number) => {
    try {
        const response = await axiosServices.delete(`/api/employee/v1/${id}`);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

export { getList, create, getById, update, deleteById };
