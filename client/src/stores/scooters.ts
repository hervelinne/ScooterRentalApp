import { defineStore } from "pinia";
import { useApi, useApiPrivate } from "../composables/useApi";

export interface Scooter {
  _id: string;
  brand: string;
  color: string;
  address?: string;
  city?: string;
  location: { coordinates: [number, number]; type: string };
  price?: number;
  imageName?: string;
  isAvailable: boolean;
}

export interface scooterData {
  brand: string;
  color: string;
  address?: string;
  city?: string;
  latitude: number;
  longitude: number;
  price?: number;
  imageName?: string;
}

export interface ScooterState {
  scooters: Scooter[];
  scooter: Scooter | null;
}

export const useScooterStore = defineStore("scooter", {
  state: (): ScooterState => ({
    scooters: [],
    scooter: null,
  }),

  getters: {
    allScooters: (state: ScooterState) => state.scooters,
    currentScooter: (state: ScooterState) => state.scooter,
  },

  actions: {
    async addScooter(payload: scooterData) {
        const { data } = await useApiPrivate().post(`/api/scooter/add_scooter`, payload);
        return data;
    },

    async fetchAllScooters(): Promise<void> {
        const { data } = await useApi().get("/api/scooter/get_scooters");
        this.scooters = data;

    },

    async getScooterById(scooterId: string): Promise<Scooter> {
      try {
        const { data } = await useApi().get(`/api/scooter/get_scooter/${scooterId}`);
        this.scooter = data;
        return data;
      } catch (error) {
        console.error('Error fetching scooter details:', error);
        throw error;
      }
    },

    async updateScooter(scooterId: string, scooterData: scooterData) {
      try {
        await useApiPrivate().put(`/api/scooter/update_scooter/${scooterId}`, scooterData);
      } catch (error) {
        console.error('Error updating scooter:', error);
        throw error;
      }
    },

  },
});
