import { create } from 'zustand';
import constants from '../../api/constants';
import ApiClient from '../../api/ApiClient';

export const authStore = create((set) => ({
    userInfo: null, users: [], dashboardData: null, currentLang: 'English',
    setCurrentLang: async (payload) => {
        set({ currentLang: payload })
    },
    fetchAllUsers: async () => {
        const response = await ApiClient.get("https://api.9orbits.com/api/auth/users/?access_level=all_data");
        set({ users: response?.data || [] });
    },
    changePassword: async (payload) => {
        const response = await ApiClient.post(constants.CHANGE_PASSWORD, payload);
        return response
    },
    userLogin: async (payload) => {
        const response = await ApiClient.post(constants.LOGIN_PATH, payload, {}, {}, false);
        return response
    },
    setUserInfo: async (payload) => {
        set({ userInfo: payload })
    },
    fetchDashboard: async () => {
        const response = await ApiClient.get(constants.DASHBOARD);
        return response;
    },
    setDashboard: async (payload) => {
        set({ dashboardData: payload })
    },
    // requestOtp: async (payload) => {
    //     const response = await ApiClient.post(constants.REQUEST_OTP, payload, {}, {}, false);
    //     return response
    // },
    // verifyOtp: async (payload) => {
    //     const response = await ApiClient.post(constants.VERIFY_OTP, payload, {}, {}, false);
    //     return response
    // },

}));