<template>
    <Suspense>
        <template #default>
            <PlaceInformation
                :is-mobile-screen="isMobileScreen"
                :route="route"
            />
        </template>
        <template #fallback>
            <div
                class="loading-spinner d-flex justify-content-center align-items-center"
            >
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </template>
    </Suspense>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import PlaceInformation from '../components/AboutComponents/PlaceInformation.vue';

const route = useRoute();

// Watch screen width to disable additional images
const isMobileScreen = ref(window.innerWidth < 768);
const screenSize = ref();

window.addEventListener('resize', () => {
    screenSize.value = window.innerWidth;
});

watch(
    () => [screenSize.value],
    () => {
        isMobileScreen.value = screenSize.value < 768;
    }
);

onMounted(() => {
    screenSize.value = window.innerWidth;
    isMobileScreen.value = screenSize.value < 768;
});
</script>
