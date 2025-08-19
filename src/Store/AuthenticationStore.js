import { create } from 'zustand';
import ApiClient from '../api/ApiClient';

export const useAuthenticationStore = create(set => ({
  userInfo: null,
  tabData: [],
  loginUser: async payload => {
    try {
      const response = await ApiClient.post(`api/login`, payload, {}, {}, false); // false indicates no token required
      return response;
    } catch (error) {
      throw error;
    }
  },
  setUserInfo: async payload => {
    set({ userInfo: payload });
  },
  sendOtp: async payload => {
    try {
      const response = await ApiClient.post(`api/send-otp-email`, payload, {}, {}, false); // false indicates no token required
      return response;
    } catch (error) {
      throw error;
    }
  },
  VerifyOtp: async payload => {
    try {
      const response = await ApiClient.post(`api/verify-otp`, payload, {}, {}, false); // false indicates no token required
      return response;
    } catch (error) {
      throw error;
    }
  },
  changePassword: async payload => {
    try {
      const response = await ApiClient.post(`api/forget-password`, payload, {}, {}, false); // false indicates no token required
      return response;
    } catch (error) {
      throw error;
    }
  },
  fetchTab: async () => {
    try {
      const response = await ApiClient.get(`api/user/tabManagement`);
      set({ tabData: response?.data?.data });
    } catch (error) {      
      throw error;
    }
  },
}));
