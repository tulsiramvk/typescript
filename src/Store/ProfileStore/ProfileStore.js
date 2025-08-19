import { create } from 'zustand';
import ApiClient from '../../api/ApiClient';

export const useProfileStore = create(set => ({
  userProfile: null,
  countries: [],
  state: [],
  cities: [],
  fetchUserProfile: async payload => {
    try {
      const response = await ApiClient.get('api/user/my-profile');
      return response;
    } catch (error) {
      throw error;
    }
  },
  fetchUpdateView: async () => {
    try {
      const response = await ApiClient.get('api/user/update-profile');
      return response;
    } catch (error) {
      throw error;
    }
  },
  setUserProfile: async payload => {
    set({ userProfile: payload });
  },
  fetchCountries: async payload => {
    try {
      const response = await ApiClient.get('api/countries-list');
      set({ countries: response.data.data });
    } catch (error) {
      throw error;
    }
  },
  fetchState: async payload => {
    try {
      const response = await ApiClient.get(`api/state-list?country_id=${payload}`);
      set({ state: response.data.data });
    } catch (error) {
      throw error;
    }
  },
  fetchCity: async payload => {
    try {
      const response = await ApiClient.get(`api/city-list?state_id=${payload}`);
      set({ cities: response.data.data });
    } catch (error) {
      throw error;
    }
  },
  updateProfile: async payload => {
    try {
      const response = await ApiClient.post('api/user/edit-profile', payload);
      return response;
    } catch (error) {
      throw error;
    }
  },
  updateProfilePic: async payload => {
    try {
      const response = await ApiClient.post('api/user/edit-profile-picture', payload, {
        'Content-Type': 'multipart/form-data',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  changePassword: async payload => {
    try {
      const response = await ApiClient.post('api/user/change-password', payload);
      return response;
    } catch (error) {
      throw error;
    }
  },
}));
