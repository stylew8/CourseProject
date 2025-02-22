import axiosInstance from './axiosInstance';

export const getTemplate = async (templateId) => {
    const response = await axiosInstance.get(`/Templates/${templateId}`);
    return response.data;
};

export const updateTemplate = async (templateId, updatedTemplate) => {
    const response = await axiosInstance.put(`/templates/${templateId}`, updatedTemplate, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const createTemplate = async (formData) => {
    const response = await axiosInstance.post('/templates/create', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const deleteTemplate = async (templateId) => {
    const response = await axiosInstance.delete(`/templates/${templateId}`);
    return response.data;
};
