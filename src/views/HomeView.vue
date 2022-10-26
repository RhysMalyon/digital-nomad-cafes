<template>
    <Suspense>
        <template #default>
            <GoogleMap />
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
import { useHead } from '@vueuse/head';
import { reactive } from 'vue';
import GoogleMap from '@/components/GoogleMap.vue';

// Page Meta
const siteData = reactive({
    title: `Home | ${import.meta.env.VITE_SITE_NAME}`,
    description: 'Find your nearest work-friendly cafe',
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
</script>

<style lang="scss">
.loading-spinner {
    height: calc(100vh - 176px);

    .spinner-border {
        color: #ff9b00;
    }
}
</style>
