<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div class="container-fluid">
            <router-link to="/" class="navbar-brand">
                <BIconHouseFill />
            </router-link>
            <p v-if="!authStore.isAuthenticated" @click="router.push('/login')">
                Sign In
            </p>
            <div class="d-flex">
                <router-link
                    v-if="authStore.isAuthenticated"
                    to="/favorites"
                    class="me-3"
                >
                    Favorites
                </router-link>
                <p v-if="authStore.isAuthenticated" @click="authStore.logout">
                    Sign Out
                </p>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { BIconHouseFill } from 'bootstrap-icons-vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/AuthStore';

const authStore = useAuthStore();
const router = useRouter();
</script>

<style scoped>
p {
    color: #fff;
    width: fit-content;
    margin-bottom: 0;
}
</style>
