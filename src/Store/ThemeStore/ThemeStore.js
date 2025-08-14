import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../helpers/colors.js';

export const useThemeStore = create((set) => ({
    theme: 'light', themeRefresh: false, themes: [],currentThemePath:null,color: colors.light,
    fetchColor: async () => {
        theme = await AsyncStorage.getItem('theme');
        theme = JSON.parse(theme)
        newColor = theme === "dark" ? colors.dark : colors.light
        set({ color: newColor });
    },
    fetchTheme: async () => {
        let theme = await AsyncStorage.getItem('theme');
        theme = JSON.parse(theme)
        set({ theme: theme });
    },
    toggleTheme: async (d) => {
        set({ themeRefresh: !d });
    },
}));