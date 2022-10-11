<template>
    <div v-if="place">
        <div
            v-if="placeImages"
            id="carouselExampleControls"
            class="carousel slide w-100"
            data-bs-ride="carousel"
        >
            <div class="carousel-inner">
                <div
                    v-for="(image, index) in placeImages"
                    :key="index"
                    :class="
                        index === 0 ? 'carousel-item active' : 'carousel-item'
                    "
                >
                    <img
                        :src="image.getUrl()"
                        alt=""
                        class="d-block w-100"
                        style="
                            height: 522px;
                            object-fit: cover;
                            object-position: 50% 50%;
                        "
                    />
                </div>
            </div>
            <button
                class="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleControls"
                data-bs-slide="prev"
            >
                <span
                    class="carousel-control-prev-icon"
                    aria-hidden="true"
                ></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button
                class="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleControls"
                data-bs-slide="next"
            >
                <span
                    class="carousel-control-next-icon"
                    aria-hidden="true"
                ></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
        <div class="container my-3">
            <h1>
                <a :href="place.website" style="text-decoration: none">
                    {{ place.name }}
                    <BIconLink45deg />
                </a>
            </h1>
            <div class="place__facilities d-flex mb-3">
                <span :class="openingHours?.isOpen ? 'tag open' : 'tag closed'">
                    {{ openingHours?.isOpen ? 'Open' : 'Closed' }}
                </span>
                <p v-if="place.hasPower"><BIconPlug /></p>
                <p v-if="place.hasWifi"><BIconWifi /></p>
            </div>
            <div class="row flex-column flex-md-row">
                <div class="col-md-6">
                    <h3>Address</h3>
                    <p>{{ place.address }}</p>
                    <GMapMap
                        :center="place.location"
                        :zoom="15"
                        map-type-id="terrain"
                        style="width: 100%; height: 100%; min-height: 320px"
                        ref="myMap"
                    >
                        <GMapMarker :position="place.location" />
                    </GMapMap>
                </div>

                <div class="col-md-6">
                    <h3>Opening Hours</h3>
                    <p>
                        {{
                            businessStatus === 'OPERATIONAL'
                                ? ''
                                : 'Permanently Closed'
                        }}
                    </p>

                    <div v-if="openingHours">
                        <p
                            v-for="(day, i) in openingHours.weekday_text"
                            :key="i"
                        >
                            {{ day }}
                        </p>
                    </div>
                    <div v-else>
                        <p>Sorry, we don't have this information.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { fetchPlaceData } from '@/services/googleMaps';
import { apiClient } from '@/services/apiClient';
import type Place from '@/types/place';
import { BIconPlug, BIconWifi, BIconLink45deg } from 'bootstrap-icons-vue';
import { onMounted, reactive, ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@vueuse/head';

const route = useRoute();
const myMap = ref();

// Fetch place and populate data
const place = ref({}) as Ref<Place>;
const placeImages = ref() as Ref<google.maps.places.PlacePhoto[] | undefined>;
const businessStatus = ref() as Ref<
    google.maps.places.BusinessStatus | undefined
>;
const openingHours = ref() as Ref<
    google.maps.places.PlaceOpeningHours | undefined
>;

const fetchPlace = async () => {
    const { data } = await apiClient.get(`/places/${route.params.id}`);
    data[0].location = { lat: data[0].latitude, lng: data[0].longitude };

    return data[0];
};

place.value = await fetchPlace();
place.value.location = {
    lat: place.value.latitude,
    lng: place.value.longitude,
};

// Page Meta
const siteData = reactive({
    title: `${place.value.name} | ${import.meta.env.VITE_SITE_NAME}`,
    description: `${place.value.address}`,
});

useHead({
    title: () => siteData.title,
    meta: [
        {
            name: 'description',
            content: () => siteData.description,
        },
    ],
});

// Lifecycle Hooks
onMounted(async () => {
    const service = await myMap.value.$mapPromise.then(
        async (mapObject: google.maps.Map) => {
            return new window.google.maps.places.PlacesService(mapObject);
        }
    );

    const { photos, business_status, opening_hours } = (await fetchPlaceData(
        service,
        place.value.placeId,
        ['photo', 'business_status', 'opening_hours']
    )) as google.maps.places.PlaceResult;

    placeImages.value = photos;
    businessStatus.value = business_status;
    openingHours.value = opening_hours;
});
</script>

<style lang="scss" scoped>
.place {
    &__facilities {
        p {
            margin-bottom: 0;
        }

        .tag {
            padding: 4px 8px;
            border-radius: 8px;
            margin-right: 8px;
        }

        .open {
            color: #fff;
            background-color: #008531;
        }

        .closed {
            color: #fff;
            background-color: #850000;
        }
    }
}
</style>
