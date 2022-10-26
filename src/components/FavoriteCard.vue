<template>
    <div class="h-100">
        <div class="card h-100 position-relative">
            <a class="btn-favorite position-absolute top-0 end-0 mt-2 me-2">
                <BIconHeartFill @click="handleFavoriteDelete(place.id)" />
            </a>
            <div class="d-flex">
                <div v-if="image" class="card-image">
                    <img
                        :src="`${image}`"
                        :alt="place.name"
                        class="place__image"
                    />
                </div>
                <div
                    class="card-body d-flex flex-column align-items-center justify-content-center text-center"
                >
                    <h5 class="mb-3">
                        <router-link :to="`/about/${place.id}`">
                            {{ place.name }}
                        </router-link>
                    </h5>
                    <small>
                        <a :href="place.website" target="_blank"> Website </a>
                    </small>
                    <br />
                    <small v-if="place.phoneNumber">
                        {{
                            place.phoneNumber === 'undefined'
                                ? 'No number available'
                                : place.phoneNumber
                        }}
                    </small>
                    <div class="d-flex mt-3">
                        <p v-if="place.hasPower" class="feature m-0 me-2">
                            <BIconPlug />
                        </p>
                        <p v-if="place.hasWifi" class="feature m-0">
                            <BIconWifi />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore';
import type Place from '@/types/place';
import { BIconPlug, BIconWifi, BIconHeartFill } from 'bootstrap-icons-vue';
import { ref, type PropType, type Ref } from 'vue';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const toast = useToast();

const props = defineProps({
    place: {
        required: true,
        type: Object as PropType<Place>,
    },
    image: {
        required: false,
        type: String,
    },
});

const place: Ref<Place> = ref(props.place);
const image: Ref<string | undefined> = ref(props.image);

interface Favorite extends Place {
    favorite_id: number;
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
</script>

<style lang="scss" scoped>
.place__image {
    width: 100%;
    height: 400px;
    position: absolute;
    top: 0;

    object-fit: cover;
}

.card {
    transition: ease-in-out 500ms;
    overflow: hidden;
    position: relative;

    &-image {
        height: 400px;
    }

    &-body {
        background: #ff9b00;
        z-index: 1;
        position: absolute;
        width: 100%;
        bottom: -30%;
        transition: ease-in-out 500ms;

        a {
            color: #212529;
        }
    }

    &:hover .card-body {
        bottom: 0;
    }
}

.background-gradient {
    background-image: linear-gradient(270deg, #ff9b00, transparent);
    z-index: 100;
}
</style>
