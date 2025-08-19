import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { BASE_URL } from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthenticationStore } from '../Store/AuthenticationStore';

const axiosInstance = axios.create({
  baseURL: BASE_URL, // Replace with your API base URL
  timeout: 10000, // Set a timeout of 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

const networkError = {
  status: 0,
  message: 'Internet Connection Problem',
};
const defaultError = {
  status: 0,
  message: 'Server Error',
};

const parseError = error => {
  if (!error.response) return defaultError;

  const { status, data } = error.response;
  const message =
    data?.message && data?.message?.length > 0 ? data?.message : 'Something went wrong!';
  const extraErrorDetails = data?.data
    ? Object.values(data?.data).join('\n')
    : '';

  return {
    status,
    message: `${message}${extraErrorDetails ? `:\n\n${extraErrorDetails}` : ''}`,
  };
};

const getToken = async () => {
  let token = await AsyncStorage.getItem('userInfo');
  return JSON.parse(token);
};

const checkNetworkStatus = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected;
};

const request = async (method, path, params = {}, customHeaders = {}, options = {}, requireAuth = true) => {
  try {
    const isConnected = await checkNetworkStatus();
    if (!isConnected) throw networkError;
    let headers = { ...customHeaders };
    if (requireAuth) {
      const token = await getToken();
      headers.Authorization = 'Bearer ' + token?.access_token;
    }
    const response = await axiosInstance.request({
      method,
      url: path,
      data: params,
      headers,
      ...options,
    });
    return response;
  } catch (error) {
    console.log({ error });
    if(error?.response?.status === 401) {
      // Logout()
      await AsyncStorage.removeItem("userInfo")
      useAuthenticationStore.getState().setUserInfo(null);
      
    }
    throw parseError(error);
  } finally {

  }
};

export default {
  get: (path, customHeaders = {}, options = {}, requireAuth = true) => request('get', path, {}, customHeaders, options, requireAuth),
  post: (path, params = {}, customHeaders = {}, options = {}, requireAuth = true) => request('post', path, params, customHeaders, options, requireAuth),
  put: (path, params = {}, customHeaders = {}, options = {}, requireAuth = true) => request('put', path, params, customHeaders, options, requireAuth),
  delete: (path, customHeaders = {}, options = {}, requireAuth = true) => request('delete', path, {}, customHeaders, options, requireAuth),
};