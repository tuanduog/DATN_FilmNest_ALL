import axiosServices from "utils/axios";
import { User } from "types/user";
import { PageRequest } from "types/paging";

const getList = async (pageRequest: PageRequest) => {
    try {
        const response = await axiosServices.get('/api/user/v1', { params: pageRequest });
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const create = async (user: User) => {
    try {
        const response = await axiosServices.post('/api/user/v1', user);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const getById = async (id: number) => {
    try {
        const response = await axiosServices.get(`/api/user/v1/${id}`);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const update = async (id: number, user: any) => {
    try {
        const response = await axiosServices.put(`/api/user/v1/${id}`, user);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const deleteById = async (id: number) => {
    try {
        const response = await axiosServices.delete(`/api/user/v1/${id}`);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const checkExistUser = async (username: string) => {
    try {
        const response = await axiosServices.get('/api/user/v1/check-exist', { params: { username } });
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const getProfile = async () => {
    try {
        const response = await axiosServices.get(`/api/user/v1/profile`);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const updateProfile = async (profile: User) => {
    try {
        const response = await axiosServices.put(`/api/user/v1/profile`, profile);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

const changePassword = async (oldPassword: string, newPassword: string) => {
    const response = await axiosServices.put(`/api/user/v1/change-password`, {
        oldPassword: oldPassword,
        newPassword: newPassword
    });
    return response.data;
}

export { getList, create, getById, update, deleteById, checkExistUser, getProfile, updateProfile, changePassword };
