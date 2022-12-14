<template>
    <GMapMap
        :center="state.mapCenter"
        :zoom="state.mapZoom"
        :options="{
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
        }"
        map-type-id="terrain"
        style="width: 100vw; height: calc(100vh - 56px)"
        ref="myMap"
    >
        <GMapMarker
            v-for="place in state.filteredPlaces"
            :key="place.id"
            :position="place.location"
            :clickable="true"
            @click="
                openMarker(place.placeId);
                handleMarkerClick(place);
            "
            @closeclick="openMarker(null)"
        >
            <GMapInfoWindow
                :closeclick="true"
                @closeclick="openMarker(null)"
                :opened="state.openedMarkerID === place.placeId"
                class="p-0"
            >
                <div
                    class="position-absolute w-100 h-100 background-gradient"
                ></div>
                <div class="infowindow__active">
                    <div v-if="placeImages" class="position-relative">
                        <img
                            :src="placeImages[0].getUrl()"
                            class="w-100"
                            alt="Test"
                        />
                    </div>
                    <span
                        :class="isOpen ? 'tag__card open' : 'tag__card closed'"
                    >
                        {{ isOpen ? 'Open' : 'Closed' }}
                    </span>
                    <div class="infowindow__active-body w-100 p-3">
                        <h5 class="mb-0">
                            <router-link :to="`/about/${place.id}`">
                                {{ place.name }}
                            </router-link>
                        </h5>
                        <div
                            class="d-flex justify-content-between align-items-center mt-3"
                        >
                            <div class="d-flex">
                                <p v-if="place.hasPower" class="mb-0">
                                    <BIconPlug style="font-size: 1.5rem" />
                                </p>
                                <p v-if="place.hasWifi" class="mb-0">
                                    <BIconWifi style="font-size: 1.5rem" />
                                </p>
                            </div>
                            <a class="btn-favorite">
                                <BIconHeartFill
                                    @click="handleFavoriteDelete(place.id)"
                                    v-if="isFavorite(place.id)"
                                />
                                <BIconHeart
                                    @click="handleFavoriteAdd(place.id)"
                                    v-else
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </GMapInfoWindow>
        </GMapMarker>
    </GMapMap>

    <div class="search-bar input-group mb-3">
        <input
            type="text"
            class="form-control"
            placeholder="Enter store name"
            v-model="state.placeName"
        />
    </div>

    <div class="d-flex position-absolute display-toggle">
        <button
            class="btn btn-primary d-flex"
            @click="toggleList"
            v-if="mapActive"
        >
            <span class="me-1">Show List</span>
            <BIconViewList class="my-auto" />
        </button>
        <button class="btn btn-primary d-flex" @click="toggleList" v-else>
            <span class="me-1">Show Map</span>
            <BIconPinMap class="my-auto" />
        </button>
    </div>

    <div class="place-container d-none d-lg-block" ref="placeContainer">
        <div class="my-3">
            <div class="home">
                <div
                    class="row row-cols-1 row-cols-sm-2 row-cols-lg-1 gy-3 mx-auto"
                >
                    <div v-for="place in state.filteredPlaces" :key="place.id">
                        <place-card :place="place" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import PlaceCard from '@/components/PlaceCard.vue';
import { apiClient } from '@/services/apiClient';
import { fetchPlaceData } from '@/services/googleMaps';
import { useAuthStore } from '@/stores/AuthStore';
import type Place from '@/types/place';
import {
    BIconHeart,
    BIconHeartFill,
    BIconPinMap,
    BIconPlug,
    BIconViewList,
    BIconWifi,
} from 'bootstrap-icons-vue';
import { computed, onMounted, onUnmounted, reactive, ref, type Ref } from 'vue';
import { useToast } from 'vue-toastification';
import { setOpenStatus } from '@/utils/openStatus';

const myMap = ref();

const authStore = useAuthStore();
const toast = useToast();

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

// Fetch place data from Google Places on marker click
const placeImages = ref() as Ref<google.maps.places.PlacePhoto[] | undefined>;
const openingHours = ref() as Ref<
    google.maps.places.PlaceOpeningHours | undefined
>;
const isOpen = ref<boolean | undefined>(false);
const currentDate = new Date();
const currentDay = currentDate.getDay();

async function handleMarkerClick(place: Place) {
    placeImages.value = undefined;
    openingHours.value = undefined;

    const service = await myMap.value.$mapPromise.then(
        async (mapObject: google.maps.Map) => {
            return new window.google.maps.places.PlacesService(mapObject);
        }
    );

    const { photos, opening_hours } = (await fetchPlaceData(
        service,
        place.placeId,
        ['photo', 'opening_hours']
    )) as google.maps.places.PlaceResult;

    placeImages.value = photos;
    openingHours.value = opening_hours;

    if (openingHours.value) {
        if (openingHours.value.periods) {
            openingHours.value.periods.forEach((period) => {
                if (period.open.day === currentDay) {
                    isOpen.value = setOpenStatus(period);
                }
                console.log(isOpen.value);
            });
        }
    }
}

interface Favorite extends Place {
    favorite_id: number;
}

function isFavorite(place_id: number | string) {
    let favoriteStatus = false;

    authStore.favorites.forEach((favorite: Favorite) => {
        if (favorite.id === place_id) {
            favoriteStatus = true;
            return;
        }
    });

    return favoriteStatus;
}

function handleFavoriteAdd(place_id: number | string) {
    if (authStore.isAuthenticated) {
        authStore.setFavorite(place_id);
    } else {
        toast.info('Sign in to save your favorite cafes!');
    }
}

function handleFavoriteDelete(id: number | string) {
    if (authStore.isAuthenticated) {
        const favoriteToDelete: Favorite[] = authStore.favorites.filter(
            (favorite: Favorite) => {
                return favorite.id === id;
            }
        );

        authStore.deleteFavorite(favoriteToDelete[0].favorite_id);
    } else {
        toast.info('Sign in to save your favorite cafes!');
    }
}

// Place list container toggle
const placeContainer = ref<HTMLElement | null>(null);
const mapActive = ref(true);

const toggleList = () => {
    if (placeContainer.value) {
        const containerClassList = placeContainer.value.classList;
        handleWindowResize();

        if (window.innerWidth >= 992) {
            containerClassList.toggle('slide-in');
        } else {
            containerClassList.remove('slide-in');
            containerClassList.toggle('d-none');
        }

        mapActive.value = !mapActive.value;
    }
};

// Maintain container visibility between screen sizes
const handleWindowResize = () => {
    if (placeContainer.value) {
        const containerClassList = placeContainer.value.classList;

        if (window.innerWidth >= 992) {
            if (mapActive.value) {
                containerClassList.contains('slide-in') &&
                    containerClassList.remove('slide-in');
            } else {
                containerClassList.add('slide-in');
            }
        } else {
            if (mapActive.value) {
                !containerClassList.contains('d-none') &&
                    containerClassList.add('d-none');
            } else {
                containerClassList.remove('d-none');
            }
        }
    }
};

onMounted(() => {
    window.addEventListener('resize', handleWindowResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleWindowResize);
});
</script>

<style lang="scss">
// Default infowindow overrides
.gm-style {
    .gm-style-iw-c {
        padding: 0 !important;
    }

    .gm-style-iw-t {
        &::after {
            // Override infowindow arrow colour
            background: #000000 !important;
        }
    }

    .gm-ui-hover-effect {
        z-index: 101;
    }
}

.search-bar {
    // input-group overrides
    position: absolute !important;
    width: 360px !important;

    max-width: 100%;
    top: 56px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;

    @media (min-width: 360px) {
        top: 64px;
    }
}

.background-gradient {
    background-image: linear-gradient(360deg, black, transparent);
    z-index: 100;
}

.infowindow__active {
    width: 400px;

    img {
        height: 270px;
        object-fit: cover;
    }

    &-body {
        position: absolute;
        bottom: 0;
        color: #fff;
        z-index: 101;

        a {
            color: #fff;

            &:hover {
                color: #ffaf33;
            }
        }
    }
}

.display-toggle {
    z-index: 1;
    top: 112px;
    left: 50%;
    transform: translateX(-50%);
}

.home {
    padding-top: 6rem;

    @media (min-width: 992px) {
        padding-top: 0;
    }
}

.place-container {
    position: absolute;
    height: 100vh;
    width: 100vw;
    top: 56px;
    flex-wrap: wrap;
    background: #fff;

    @media (min-width: 992px) {
        height: 80%;
        width: 30%;
        max-width: 360px;
        top: 50%;
        transform: translate(-100%, -50%);
        overflow: scroll;
        border-radius: 0 1rem 1rem 0;
        box-shadow: 2px 4px 8px rgb(10 10 10 / 30%);
        padding-right: 4px;
        transition: ease-in-out 500ms;
    }
}

.slide-in {
    @media (min-width: 992px) {
        transform: translate(0%, -50%);
    }
}
</style>
