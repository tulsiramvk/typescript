import { create } from 'zustand';
import constants from '../../api/constants';
import ApiClient from '../../api/ApiClient';

export const activityStore = create((set) => ({
    activities: [], 
    getActivity: async (payload) => {
        const response = await ApiClient.get(constants.ACTIVITY_PATH);
        return response
    },
    viewActivity: async (payload) => {
        console.log(constants.ACTIVITY_PATH+payload);
        
        const response = await ApiClient.get(constants.ACTIVITY_PATH+payload);
        return response
    },
    addActivity: async (payload) => {
        const response = await ApiClient.post(constants.ACTIVITY_PATH, payload);
        return response
    },
    updateActivity: async (payload,id) => {
        const response = await ApiClient.put(constants.ACTIVITY_PATH+id+'/', payload);
        return response
    },
    deleteActivities: async (id) => {
        const response = await ApiClient.delete(constants.ACTIVITY_PATH+id+'/');
        return response
    },
    setActivity: async (payload) => {
        set({ activities: payload })
    },

}));