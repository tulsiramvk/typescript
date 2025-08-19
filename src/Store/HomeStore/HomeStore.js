import {create} from 'zustand';
import ApiClient from '../../api/ApiClient';
import { localTimezone } from './../../helpers/utils';

export const useHomeStore = create(set => ({
  homeData: null,
  balance: 0,
  connectedDevice: null,
  serviceUUID: null,
  characteristicUUID: null,
  isEnabled: false,
  fetchHomeData: async payload => {
    try {
      const response = await ApiClient.get(`api/user/home?timezone=${localTimezone}`);      
      return response;
    } catch (error) {
      throw error;
    }
  },
  setIsEnabled: async payload => {
    set({isEnabled: payload});
  },
  setHomeData: async payload => {
    set({homeData: payload});
  },
  fetchBalance: async () => {
    try {
      const response = await ApiClient.get(`api/user/balance`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  fetchBalance2: async () => {
    try {
      const res = await ApiClient.get(`api/user/balance`);
      set({balance: res?.data?.data?.balance || 0.00});
    } catch (error) {
      throw error;
    }
  },
  setBalance: async payload => {
    set({balance: payload.balance});
  },
  setConnectedDevice: async payload => {
    set({connectedDevice: payload});
  },
  setServiceUUID: async payload => {
    set({serviceUUID: payload});
  },
  setCharacteristicUUID: async payload => {
    set({characteristicUUID: payload});
  },
  fetchAllSold: async (p1, p2) => {
    try {
      const response = await ApiClient.get(`api/user/all-bet-numbers/${p1}?draw_time=${p2}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  fetchSoldNumbers: async (p1, p2) => {
    try {
      const response = await ApiClient.get(`api/user/sold-numbers/${p1}?draw_time=${p2}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  authenticateUser: async () => {
    try {
      const response = await ApiClient.get(`api/user/checkStatus`);
      return response;
    } catch (error) {
      throw error;
    }
  },
}));
