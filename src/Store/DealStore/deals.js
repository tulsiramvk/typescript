import { create } from 'zustand';
import constants from '../../api/constants';
import ApiClient from '../../api/ApiClient';

export const dealsStore = create((set) => ({
    deals: [],
    viewDeals: async (id) => {
        const response = await ApiClient.get(constants.DEALS_PATH + id + '/');
        return response
    },
    getDeals: async () => {
        const response = await ApiClient.get(constants.DEALS_PATH);
        return response
    },
    updateDeals: async (payload, id) => {
        const response = await ApiClient.put(constants.DEALS_PATH + id + '/', payload);
        return response
    },
    deleteDeals: async (id) => {
        const response = await ApiClient.delete(constants.DEALS_PATH + id + '/');
        return response
    },
    closeDeals: async (id) => {
        const response = await ApiClient.post(constants.DEALS_PATH + id + '/'+'mark-won/',null);
        return response
    },
    addDeals: async (payload) => {
        const response = await ApiClient.post(constants.DEALS_PATH, payload);
        return response
    },
    setDeals: async (payload) => {
        set({ deals: payload })
    },

}));