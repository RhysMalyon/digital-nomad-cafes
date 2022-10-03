<template>
    <TheNav />
    <Suspense>
        <router-view />
    </Suspense>
</template>

<script setup lang="ts">
import TheNav from './components/TheNav.vue';
</script>
