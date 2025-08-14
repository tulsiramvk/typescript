import { create } from 'zustand';
import constants from '../../api/constants';
import ApiClient from '../../api/ApiClient';

export const leadStore = create((set) => ({
    contacts: [], leads:[],customers:[],customField:[],branches:[],pipelines:[],products:[],sources:[],departments:[],stages:[],

    // =Masters
    fetchBranches: async (payload) => {
        const response = await ApiClient.get(constants.BRANCHES);
        set({branches:response?.data || []})
    },
    fetchDepartments: async (payload) => {
        const response = await ApiClient.get(constants.DEPARTMENTS);
        set({departments:response?.data || []})
    },
    fetchSources: async (payload) => {
        const response = await ApiClient.get(constants.SOURCES);
        set({sources:response?.data || []})
    },
    fetchProducts: async (payload) => {
        const response = await ApiClient.get(constants.PRODUCTS);
        set({products:response?.data || []})
    },
    fetchPipelines: async (payload) => {
        const response = await ApiClient.get(constants.PIPELINES);
        set({pipelines:response?.data || []})
    },
    fetchStages: async (payload) => {
        const response = await ApiClient.get(constants.STAGES);
        set({stages:response?.data || []})
    },
    
    // =Contacts
    fetchCustomField: async (payload) => {
        const response = await ApiClient.get(constants.CUSTOM_FIELDS+payload);
        set({customField:response?.data || []})
    },
    viewContact: async (u) => {
        const response = await ApiClient.get(constants.CONTACTS+u+'/');
        return response
    },
    getContacts: async (payload) => {
        const response = await ApiClient.get(constants.CONTACTS);
        return response
    },
    addContacts: async (payload) => {
        const response = await ApiClient.post(constants.CONTACTS, payload);
        return response
    },
    updateContacts: async (payload,id) => {
        const response = await ApiClient.put(constants.CONTACTS+id+'/', payload);
        return response
    },
    setContacts: async (payload) => {
        set({ contacts: payload })
    },

    // ============Leads 

    getLeads: async (payload) => {
        const response = await ApiClient.get(constants.LEADS);
        return response
    },
    viewLeads: async (id) => {
        const response = await ApiClient.get(constants.LEADS+id+'/');
        return response
    },
    addLeads: async (payload) => {
        const response = await ApiClient.post(constants.LEADS, payload);
        return response
    },
    updateLeads: async (payload,id) => {
        const response = await ApiClient.put(constants.LEADS+id+'/', payload);
        return response
    },
    setLeads: async (payload) => {
        set({ leads: payload })
    },

    // ============Customers 

    getCustomers: async (payload) => {
        const response = await ApiClient.get(constants.CUSTOMERS);
        return response
    },
    viewCustomers: async (u) => {
        const response = await ApiClient.get(constants.CUSTOMERS+u+'/');
        return response
    },
    addCustomers: async (payload) => {
        const response = await ApiClient.post(constants.CUSTOMERS, payload);
        return response
    },
    updateCustomers: async (payload,id) => {
        const response = await ApiClient.put(constants.CUSTOMERS+id+'/', payload);
        return response
    },
    setCustomers: async (payload) => {
        set({ customers: payload })
    },
    // ============Owner Change
    changeOwner: async (payload) => {
        const response = await ApiClient.post(constants.CHANGE_OWNER, payload);
        return response
    },

}));