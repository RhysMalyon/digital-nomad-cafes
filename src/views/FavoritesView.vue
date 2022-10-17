<template>
    <div class="favorites__header">
        <div class="container">
            <h1 class="mb-0">Favorites</h1>
        </div>
    </div>
    <div class="container my-3">
        <div v-if="favorites.length > 0" class="row">
            <favorite-card
                v-for="favorite in favorites"
                :key="favorite['id']"
                :place="favorite"
                :image="favorite.images[0] ? favorite.images[0] : undefined"
                class="col-6 my-3"
            />
        </div>

        <div v-else>
            <p>You don't have any favourites yet.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore';
import { useHead } from '@vueuse/head';
import { reactive, ref, watch } from 'vue';
import FavoriteCard from '@/components/FavoriteCard.vue';
import type Place from '@/types/place';

// Page Meta
const siteData = reactive({
    title: `Favorites | ${import.meta.env.VITE_SITE_NAME}`,
    description: 'Your favorite work friendly cafes.',
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

const authStore = useAuthStore();

const favorites = ref<Place[]>(authStore.favorites);

watch(
    () => [authStore.favorites],
    () => {
        favorites.value = authStore.favorites;
    }
);
</script>

<style>
.favorites__header {
    background: #ff9b00;
    padding: 2rem 0;
    text-transform: uppercase;
}
</style>
