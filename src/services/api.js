import axios from 'axios';

// Mock service module preparing for backend integration
const API_BASE_URL = 'https://ai-recruitment-system-sano.onrender.com/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const recruitmentService = {
    // Methods throwing to console for now, easily hooked up later
    getDashboardStats: async () => {
        // return apiClient.get('/stats');
        console.log('Fetching mock dashboard stats');
        return { data: { success: true } };
    },

    analyzeJobDescription: async (payload) => {
        // return apiClient.post('/jobs/analyze', payload);
        console.log('Sending job description to AI', payload);
        return { data: { success: true } };
    },

    uploadResumes: async () => {
        // return apiClient.post('/resumes/upload', formData, { 
        //   headers: { 'Content-Type': 'multipart/form-data' }
        // });
        console.log('Uploading resumes for processing');
        return { data: { success: true } };
    },

    getRankings: async (jobId) => {
        // return apiClient.get(`/rankings/${jobId}`);
        console.log('Fetching candidate rankings for job:', jobId);
        return { data: { success: true } };
    }
};

export default apiClient;
