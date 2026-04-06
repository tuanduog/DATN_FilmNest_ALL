import axiosServices from "utils/axios";
import { AuthInfo } from "types/auth";

const login = async (authInfo: AuthInfo) => {
    try {
        const response = await axiosServices.post('/auth/login', authInfo);
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

export default login;