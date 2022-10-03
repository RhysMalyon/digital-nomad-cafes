<template>
    <ul v-for="favorite in favorites" :key="favorite.id">
        <li>{{ favorite.name }}</li>
    </ul>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore';
import type Place from '@/types/place';

const authStore = useAuthStore();
let favorites: Place[];

if (authStore.favorites) {
    favorites = authStore.favorites;
}
</script>

<style></style>
