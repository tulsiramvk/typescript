import { create } from 'zustand';
import constants from '../../api/constants';
import ApiClient from '../../api/ApiClient';

export const meetingStore = create((set) => ({
    meetings: [], 
    addMeeting: async (payload) => {
        const response = await ApiClient.post(constants.LOGIN_PATH, payload, {}, {}, false);
        return response
    },
    setMeetings: async (payload) => {
        set({ userInfo: payload })
    },

}));