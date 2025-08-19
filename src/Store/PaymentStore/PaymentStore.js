import {create} from 'zustand';
import ApiClient from '../../api/ApiClient';

export const usePaymentStore = create(set => ({
  deposit: [],
  withdraw: [],
  transaction: [],
  fetchDeposit: async payload => {
    try {
      const response = await ApiClient.get(`api/user/deposits/${payload}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  setDeposit: async payload => {
    set({deposit: payload});
  },
  fetchWithdraw: async payload => {
    try {
      const response = await ApiClient.get(`api/user/withdraws/${payload}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  setWithdraw: async payload => {
    set({withdraw: payload});
  },
  fetchTransaction: async payload => {
    try {
      const response = await ApiClient.get(`api/user/transactions/${payload}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  setTransaction: async payload => {
    set({transaction: payload});
  },
}));
