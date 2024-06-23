import { defineStore } from 'pinia';
import { useApi, useApiPrivate } from '../composables/useApi';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {},
    accessToken: localStorage.getItem('accessToken') || '',
    authReady: false,
  }),

  getters: {
    userDetail: (state) => state.user,
    isAuthenticated: (state) => !!state.accessToken,
  },

  actions: {
    async attempt() {
      if (this.accessToken) {
        try {
          await this.refresh();
          await this.getUser();
        } catch (error) {
          return;
        }
      }
    },

    async login(payload) {
      try {
        const { data } = await useApi().post(`/api/auth/login`, payload);
        this.accessToken = data.access_token;
        localStorage.setItem('accessToken', data.access_token); // Store token in localStorage
        await this.getUser();
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    async register(payload) {
      try {
        const { data } = await useApi().post(`/api/auth/register`, payload);
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    async getUser() {
      try {
        const { data } = await useApiPrivate().get(`/api/auth/user`);
        this.user = data;
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    async logout() {
      try {
        const { data } = await useApiPrivate().post(`/api/auth/logout`);
        this.accessToken = '';
        this.user = {};
        localStorage.removeItem('accessToken'); // Remove token from localStorage
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    async refresh() {
      try {
        const { data } = await useApi().post(`/api/auth/refresh`);
        this.accessToken = data.access_token;
        localStorage.setItem('accessToken', data.access_token); // Store token in localStorage
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
});
