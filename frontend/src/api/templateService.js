import axiosInstance from './axiosInstance';

export const getTemplate = async (templateId) => {
    const response = await axiosInstance.get(`/Templates/${templateId}`);
    return response.data;
};

export const updateTemplate = async (templateId, updatedTemplate) => {
    const response = await axiosInstance.put(`/templates/${templateId}`, updatedTemplate);
    return response.data;
};

export const createTemplate = async (data) => {
    const response = await axiosInstance.post('/templates/create', data);
    return response.data;
};
