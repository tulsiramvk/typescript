import {create} from 'zustand';
import ApiClient from '../../api/ApiClient';
import { localTimezone } from '../../helpers/utils';

export const useDashboardStore = create(set => ({
  dashboardDetail: null,
  voids: [],
  commissions: [],
  paid: [],
  pageData: null,
  pageData2: null,
  pageData3: null,
  fetchDashboardDetail: async () => {
    try {
      const response = await ApiClient.get('api/user/agent-dashboard?timezone=' + localTimezone);
      return response;
    } catch (error) {
      throw error;
    }
  },
  setDashboardDetail: async payload => {
    set({dashboardDetail: payload});
  },
  fetchVoid: async payload => {
    try {
      const response = await ApiClient.get(`api/user/view-voidticket/${payload}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  setPageData: async payload => {
    set({pageData: payload});
  },
  setPageData2: async payload => {
    set({pageData2: payload});
  },
  setPageData3: async payload => {
    set({pageData3: payload});
  },
  setVoid: async payload => {
    set({voids: payload});
  },
  fetchCommissions: async payload => {
    try {
      const response = await ApiClient.get(`api/user/commission/${payload}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  setCommissions: async payload => {
    set({commissions: payload});
  },
  fetchPaid: async payload => {
    try {
      const response = await ApiClient.get(`api/user/view-paidwinning/${payload}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  setPaid: async payload => {
    set({paid: payload});
  },
}));
