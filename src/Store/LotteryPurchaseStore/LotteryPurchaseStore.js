import {create} from 'zustand';
import ApiClient from '../../api/ApiClient';

export const useLotteryPurchaseStore = create(set => ({
  lotteryDetail: null,
  howtoplayData: null,
  recentDraws: [],
  lotteries: [],
  fetchLotteryDetail: async payload => {
    try {
      const response = await ApiClient.get(`api/user/singlelottery/${payload}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  fetchLotteries: async payload => {
    try {
      const response = await ApiClient.get('api/user/lotteries');
      return response;
    } catch (error) {
      throw error;
    }
  },
  setLotteries: async payload => {
    set({lotteries: payload});
  },
  printPurchaseLottery: async payload => {
    try {
      const response = await ApiClient.get(`api/user/print-purchasedetails/${payload}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  setLotteryDetail: async payload => {
    set({lotteryDetail: payload});
  },
  fetchHowtoPlay: async payload => {
    try {
      const response = await ApiClient.get(`api/user/how-to-play/${payload}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  setHowtoPlay: async payload => {
    set({howtoplayData: payload});
  },
  fetchRecentDraws: async (payload, params) => {
    try {
      const response = await ApiClient.get(`api/user/recent-draws/${payload}${params}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  setRecentDraws: async payload => {
    set({recentDraws: payload.data});
  },
  fetchLotteryPrize: async payload => {
    try {
      const response = await ApiClient.get(`api/user/price/${payload}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  buyLottery: async (payload, id) => {
    try {
      const response = await ApiClient.post(`api/user/purchase-lottery/${id}`, payload);
      return response;
    } catch (error) {
      throw error;
    }
  },
}));
