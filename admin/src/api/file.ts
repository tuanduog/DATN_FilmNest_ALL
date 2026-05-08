import axiosServices from "utils/axios";

const uploadImage = async (request: FormData) => {
    try {
        const response = await axiosServices.post('/api/files/upload/image', request, { headers: { 'Content-Type': 'multipart/form-data' } });
        return response.data;
    } catch (error: Error | any) {
        return error;
    }
}

export { uploadImage };