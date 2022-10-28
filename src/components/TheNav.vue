<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div class="container-fluid h-100">
            <router-link to="/" class="navbar-brand h-100">
                <img
                    src="@/assets/logo__white-only.webp"
                    alt="Digital Nomads Logo"
                    class="h-100"
                />
            </router-link>
            <button
                type="button"
                class="btn btn-outline-light"
                data-bs-toggle="modal"
                data-bs-target="#loginModal"
                v-if="!authStore.isAuthenticated"
            >
                Sign In
            </button>
            <div v-if="authStore.isAuthenticated" class="d-flex">
                <router-link to="/favorites" class="nav-link me-3">
                    Favorites
                </router-link>
                <a class="nav-link" @click="authStore.logout">Sign Out</a>
            </div>
        </div>
    </nav>
    <LoginModal />
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore';
import LoginModal from './LoginModal.vue';

const authStore = useAuthStore();
</script>

<style lang="scss" scoped>
nav {
    height: 56px;
}

p {
    color: #fff;
    width: fit-content;
    margin-bottom: 0;
}

.nav-link {
    cursor: pointer;
    color: #fff;
    text-decoration: none;

    &:hover,
    &:focus {
        color: #fff;
        text-decoration: none;
        opacity: 50%;
    }
}

.router-link-active {
    text-decoration: underline;
}
</style>
