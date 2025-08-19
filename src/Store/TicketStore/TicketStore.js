import {create} from 'zustand';
import ApiClient from '../../api/ApiClient';
export const useTicketStore = create(set => ({
  purchaseDetails: [],
  winningDetails: [],
  pageData: null,
  pageData2: null,
  fetchPurchaseDetails: async payload => {
    try {
      const response = await ApiClient.get(`api/user/purchasedetails${payload}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  setPurchaseDetails: async payload => {
    set({purchaseDetails: payload});
  },
  setPageData: async payload => {
    set({pageData: payload});
  },
  setPageData2: async payload => {
    set({pageData2: payload});
  },
  fetchWinningDetails: async payload => {
    try {
      const response = await ApiClient.get(`api/user/winningdetails/${payload}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  setWinningDetails: async payload => {
    set({winningDetails: payload});
  },
  voidTicket: async p => {
    try {
      const response = await ApiClient.post(`api/user/void-ticket?orderId=${p}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  cancelTicket: async p => {
    try {
      const response = await ApiClient.post(`api/user/cancel-ticket?orderId=${p}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  payOut: async p => {
    try {
      const response = await ApiClient.post(`api/user/payout/${p}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  fetchWinning: async (p, p2, p3) => {
    try {
      const response = await ApiClient.get(`api/user/view-winningdetails/${p}/${p2}/${p3}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  fetchPurchase: async (p, p2, p3) => {
    try {
      const response = await ApiClient.get(`api/user/view-purchasedetails?orderId=${p}&cardId=${p2}&drawTime=${p3}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  fetchWinner: async payload => {
    try {
      const response = await ApiClient.get(`api/user/winner-list/${payload}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  purchaseSuccess: async payload => {
    try {
      const response = await ApiClient.get(`api/user/printstatus/${payload}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
}));
