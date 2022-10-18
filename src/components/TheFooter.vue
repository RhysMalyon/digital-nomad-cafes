<template>
    <footer class="w-100 py-4 d-flex flex-column align-items-center">
        <a href="https://www.instagram.com/nomadfriendlycafes/" class="mb-2">
            <BIconInstagram /> nomadfriendlycafes
        </a>
        <p>Digital Nomad Cafes {{ currentYear }}</p>
    </footer>
</template>

<script setup lang="ts">
import { BIconInstagram } from 'bootstrap-icons-vue';
const currentYear = new Date().getFullYear();
</script>

<style lang="scss">
footer {
    background: #212529;
    color: #ff9b00;
    font-family: 'Roboto', sans-serif;

    a {
        color: #ff9b00;
        text-decoration: none;
        transition: ease-in-out 200ms;

        &:hover {
            color: #ff9b00;
            opacity: 0.7;
        }
    }
}
</style>
