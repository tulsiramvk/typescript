import {create} from 'zustand';
import ApiClient from '../../api/ApiClient';

export const useSupportStore = create(set => ({
  supportList: [],
  fetchViewSupportList: async payload => {
    try {
      const response = await ApiClient.get(`api/user/view-supportTicket/${payload}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  fetchSupportList: async payload => {
    try {
      const response = await ApiClient.get(`api/user/list-supportTicket/${payload}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  setSupportList: async payload => {
    set({supportList: payload});
  },
  fetchUpdateView: async () => {
    try {
      const response = await ApiClient.get('api/user/update-profile');
      return response;
    } catch (error) {
      throw error;
    }
  },
  createSupport: async (payload) => {
    let formdata = new FormData();
    formdata.append('name', payload.name);
    formdata.append('email', payload.email);
    formdata.append('subject', payload.subject);
    formdata.append('message', payload.message);
    formdata.append('priority', payload.priority);
    try {
      const response = await ApiClient.post(
        'api/user/create-supportTicket',
        formdata,
        {
          'Content-Type': 'multipart/form-data',
        },
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  uploadSupportAttachments: async (payload, id) => {
    try {
      const response = await ApiClient.post(
        `api/user/create-supportAttachment/${id}`,
        payload,
        {
          'Content-Type': 'multipart/form-data',
        },
        {
          redirect: 'follow',
          credentials: 'include',
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  createReply: async (payload, id) => {
    try {
      const response = await ApiClient.post(
        `api/user/reply-supportTicket/${id}`,
        payload,
        {
          'Content-Type': 'multipart/form-data',
        },
        {
          redirect: 'follow',
          credentials: 'omit',
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
}));
