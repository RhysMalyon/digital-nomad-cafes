<template>
    <div
        v-if="placeImages"
        class="place__images row g-0 position-relative"
        style="height: 400px"
    >
        <div class="place__images-container col-md-8 g-0 h-100">
            <img
                :src="placeImages[0].getUrl()"
                alt="test"
                class="place__images-cover w-100 h-100"
            />
        </div>
        <div
            v-if="!isMobileScreen"
            class="place__images-container col-md-4 g-0 flex-column h-100"
        >
            <img
                :src="placeImages[1].getUrl()"
                class="place__images-secondary"
                alt="test"
            />
            <img
                :src="placeImages[2].getUrl()"
                class="place__images-secondary"
                alt="test"
            />
        </div>
        <div
            class="position-absolute"
            style="bottom: 8px; right: 8px; width: max-content"
        >
            <button
                type="button"
                class="btn btn-light d-flex p-2"
                data-bs-toggle="modal"
                data-bs-target="#imageCarousel"
            >
                <BIconGrid3x3Gap />
            </button>
        </div>
        <div class="position-absolute top-0 left-0 ms-2 mt-2">
            <span v-if="isOpen" class="tag open">Open</span>
            <span v-else class="tag closed">Closed</span>
        </div>
    </div>
    <div class="place__header d-flex align-items-center">
        <div
            class="container d-flex flex-column flex-md-row justify-content-between align-items-md-center"
        >
            <div class="d-flex flex-column">
                <h1 class="mb-0">
                    <a :href="place.website">
                        {{ place.name }}
                    </a>
                </h1>
                <div class="d-flex">
                    <p v-if="place.hasPower" class="place__header-feature mb-0">
                        <BIconPlug />
                    </p>
                    <p v-if="place.hasWifi" class="place__header-feature mb-0">
                        <BIconWifi />
                    </p>
                </div>
            </div>
            <div
                v-if="ratings"
                class="ratings__container d-flex align-items-center ms-md-3 mt-3 mt-md-0 position-relative"
            >
                <a class="position-absolute w-100 h-100" href="#reviews"></a>
                <img :src="GoogleIcon" class="ratings__container-icon me-2" />
                <span
                    class="ratings__container-content d-flex align-items-center"
                >
                    {{ ratings }}
                    <BIconStarFill class="ms-1 me-2" />
                    ({{ userRatingsTotal }})
                </span>
            </div>
        </div>
    </div>
    <div class="container my-3">
        <div class="d-flex flex-column flex-md-row justify-content-md-between">
            <div class="place__section border-0">
                <h3 class="place__section-heading mb-3">Location</h3>
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

            <div class="place__section">
                <h3 class="place__section-heading mb-3">Opening Hours</h3>
                <p v-if="businessStatus !== 'OPERATIONAL'">
                    Permanently Closed'
                </p>

                <div v-if="openingHours" class="text-center mt-3">
                    <p v-for="(day, i) in openingHours.weekday_text" :key="i">
                        {{ day }}
                    </p>
                </div>
                <div v-else>
                    <p>Sorry, we don't have this information.</p>
                </div>
            </div>
        </div>

        <ReviewsContainer :reviews-array="reviewsArray" />
        <CarouselModal :place-images="placeImages" />
    </div>
</template>

<script setup lang="ts">
import GoogleIcon from '@/assets/google_icon.png';
import ReviewsContainer from '@/components/AboutComponents/ReviewsContainer.vue';
import CarouselModal from '@/components/CarouselModal.vue';
import { apiClient } from '@/services/apiClient';
import { fetchPlaceData } from '@/services/googleMaps';
import type Place from '@/types/place';
import { setOpenStatus } from '@/utils/openStatus';
import { useHead } from '@vueuse/head';
import {
    BIconGrid3x3Gap,
    BIconPlug,
    BIconStarFill,
    BIconWifi,
} from 'bootstrap-icons-vue';
import { onMounted, reactive, ref, type PropType, type Ref } from 'vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';

const myMap = ref();
const props = defineProps({
    isMobileScreen: {
        required: true,
        type: Boolean,
    },
    route: {
        required: true,
        type: Object as PropType<RouteLocationNormalizedLoaded>,
    },
});

// Fetch place and populate data
const place = ref({}) as Ref<Place>;
const placeImages = ref() as Ref<google.maps.places.PlacePhoto[] | undefined>;
const businessStatus = ref() as Ref<
    google.maps.places.BusinessStatus | undefined
>;
const openingHours = ref() as Ref<
    google.maps.places.PlaceOpeningHours | undefined
>;
const isOpen = ref<boolean | undefined>(false);
const currentDate = new Date();
const currentDay = currentDate.getDay();

const ratings = ref<number | undefined>(0);
const userRatingsTotal = ref<number | undefined>(0);
const reviewsArray = ref([]) as Ref<
    google.maps.places.PlaceReview[] | undefined
>;

const fetchPlace = async () => {
    const { data } = await apiClient.get(`/places/${props.route.params.id}`);
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

    const {
        photos,
        business_status,
        opening_hours,
        rating,
        user_ratings_total,
        reviews,
    } = (await fetchPlaceData(service, place.value.placeId, [
        'photo',
        'business_status',
        'opening_hours',
        'rating',
        'user_ratings_total',
        'reviews',
    ])) as google.maps.places.PlaceResult;

    placeImages.value = photos;
    businessStatus.value = business_status;
    openingHours.value = opening_hours;
    ratings.value = rating;
    userRatingsTotal.value = user_ratings_total;
    reviewsArray.value = reviews;

    if (openingHours.value) {
        if (openingHours.value.periods) {
            openingHours.value.periods.forEach((period) => {
                if (period.open.day === currentDay) {
                    isOpen.value = setOpenStatus(period);
                }
            });
        }
    }
});
</script>

<style lang="scss" scoped>
.place {
    &__images {
        transition: ease-in-out 500ms;

        &-container {
            display: inline-block;
            overflow: hidden;
        }

        &-cover {
            @extend .place__images;

            object-fit: cover;

            &:hover {
                scale: 1.02;
            }
        }

        &-secondary {
            @extend .place__images;

            display: none;
            height: 50%;
            width: 100%;
            object-fit: cover;

            &:hover {
                scale: 1.02;
            }

            @media (min-width: 768px) {
                display: inline-block;
            }
        }
    }

    &__header {
        padding: 16px 32px;
        background-color: #ff9b00;
        min-height: 100px;

        h1 {
            font-size: clamp(1.5rem, 4vw, 2.5rem);
        }

        a {
            text-decoration: none;
            color: #212529;
        }

        &-feature {
            font-family: 'Roboto', sans-serif;
            font-size: 1.25rem;
            color: #212529;
        }
    }

    &__section {
        margin-top: 2rem;
        border: 1px solid #ffaf33;
        border-radius: 1rem;
        overflow: hidden;

        @media (min-width: 768px) {
            width: 49%;
        }

        &-heading {
            background: #ffaf33;
            padding: 1rem;
            margin-bottom: 0 !important;
            text-transform: uppercase;
            text-align: center;
        }
    }

    &__reviews {
        &-review {
            padding: 1rem 2rem;

            .review {
                &__icon {
                    width: max-content;
                    color: #ff9b00;
                    position: absolute;
                    font-size: 3rem;
                    z-index: -1;
                    opacity: 25%;
                }

                &__body {
                    p {
                        padding: 1rem 1rem 0 1rem;
                    }

                    &-profile {
                        img {
                            border: 1px solid #ff9b00;
                            border-radius: 50%;
                        }
                    }
                }
            }
        }
    }
}

.ratings__container {
    width: fit-content;
    height: fit-content;
    padding: 8px 16px;
    border-radius: 16px;
    background: #fff;

    &-icon {
        width: 24px;
        height: 24px;
    }

    &-content {
        svg {
            color: #ff9b00;
        }
    }
}
</style>
