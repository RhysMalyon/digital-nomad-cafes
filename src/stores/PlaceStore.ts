import type Place from '@/types/place';
import { defineStore } from 'pinia';
import { apiClient } from '@/services/apiClient';

export const usePlaceStore = defineStore({
    id: 'place',

    state: () => ({
        places: [] as Place[],
    }),

    actions: {
        async setPlacesData() {
            const { data } = await apiClient.get('/places');
            this.places = data;
        },
    },
});
