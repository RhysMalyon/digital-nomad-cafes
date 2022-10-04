<template>
    <div class="container">
        <div v-if="authStore.favorites.length > 0">
            <ul v-for="favorite in authStore.favorites" :key="favorite['id']">
                <li>{{ favorite['name'] }}</li>
            </ul>
        </div>

        <div v-else>
            <p>You don't have any favourites yet.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore';

const authStore = useAuthStore();
</script>

<style></style>
