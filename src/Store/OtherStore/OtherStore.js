import {create} from 'zustand';
import ApiClient from '../../api/ApiClient';

export const useOtherStore = create(set => ({
  about: null,
  contact: null,
  faqs: null,
  fetchAbout: async () => {
    try {
      const response = await ApiClient.get('api/user/aboutUs');
      return response;
    } catch (error) {
      throw error;
    }
  },
  setAbout: async payload => {
    set({about: payload});
  },
  fetchContact: async () => {
    try {
      const response = await ApiClient.get('api/user/contactUs');
      return response;
    } catch (error) {
      throw error;
    }
  },
  setContact: async payload => {
    set({contact: payload});
  },
  fetchFaq: async () => {
    try {
      const response = await ApiClient.get('api/user/faq');
      return response;
    } catch (error) {
      throw error;
    }
  },
  setFaq: async payload => {
    set({faqs: payload});
  },
}));
