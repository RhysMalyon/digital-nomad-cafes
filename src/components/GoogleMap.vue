<template>
    <GMapMap
        :center="state.mapCenter"
        :zoom="state.mapZoom"
        map-type-id="terrain"
        style="width: 100vw; height: calc(100vh - 56px)"
        ref="myMap"
    >
        <GMapMarker
            v-for="place in state.filteredPlaces"
            :key="place.placeId"
            :position="place.location"
            :clickable="true"
            @click="openMarker(place.placeId)"
            @closeclick="openMarker(null)"
        >
            <GMapInfoWindow
                :closeclick="true"
                @closeclick="openMarker(null)"
                :opened="state.openedMarkerID === place.placeId"
            >
                <div style="width: 200px">
                    <h5>
                        <router-link :to="`/about/${place.id}`">
                            {{ place.name }}
                        </router-link>
                    </h5>
                    <p>{{ place.address }}</p>
                </div>
            </GMapInfoWindow>
        </GMapMarker>
    </GMapMap>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type Place from '@/types/place';
// import clusterImages from '@/assets/clusterImages';
import { apiClient } from '@/services/placeApi';

const state: {
    filteredPlaces: Place[];
    placeName: string;
    mapCenter: {
        lat: number;
        lng: number;
    };
    mapZoom: number;
    openedMarkerID: string | null;
} = reactive({
    filteredPlaces: computed(() => updatePlaceList()),
    placeName: '',
    mapCenter: computed(() => findMapCenter()),
    mapZoom: 7,
    openedMarkerID: null,
});

const myMap = ref(null);
const places: Place[] = await fetchPlacesData();

async function fetchPlacesData() {
    const { data } = await apiClient.get('/places');
    data.forEach((place: Place) => {
        place.location = {
            lat: place.latitude,
            lng: place.longitude,
        };
    });

    return data;
}

function openMarker(id: null | string) {
    state.openedMarkerID = id;
}

function updatePlaceList(): Place[] {
    if (!state.placeName) {
        return places;
    }

    return [...places].filter((place: Place) => {
        return place.name.toLowerCase().includes(state.placeName.toLowerCase());
    });
}

function findMapCenter() {
    if (state.filteredPlaces.length === 0) {
        return { lat: 35.6762, lng: 139.6503 };
    } else if (state.filteredPlaces.length === 1) {
        state.mapZoom = 15;
        return {
            lat: state.filteredPlaces[0].latitude,
            lng: state.filteredPlaces[0].longitude,
        };
    } else {
        let avgLat = 0;
        let avgLng = 0;

        state.filteredPlaces.forEach((place) => {
            avgLat += place.latitude;
            avgLng += place.longitude;
        });

        state.mapZoom = 10;

        return {
            lat: avgLat / state.filteredPlaces.length,
            lng: avgLng / state.filteredPlaces.length,
        };
    }
}
</script>
