<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div class="container-fluid">
            <router-link to="/" class="navbar-brand" href="#">
                <BIconHouseFill />
            </router-link>
        </div>
    </nav>
    <Suspense>
        <router-view />
    </Suspense>
</template>

<script setup lang="ts">
import { BIconHouseFill } from 'bootstrap-icons-vue';
</script>
