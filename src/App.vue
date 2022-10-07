<template>
    <TheNav />
    <Suspense>
        <template #default>
            <router-view />
        </template>
        <template #fallback> Loading... </template>
    </Suspense>
</template>

<script setup lang="ts">
import TheNav from './components/TheNav.vue';
</script>
