<template>
    <TheNav />
    <Suspense>
        <template #default>
            <router-view />
        </template>
        <template #fallback>
            <div class="h-100" style="height: 100vh">
                <p>Loading...</p>
            </div>
        </template>
    </Suspense>
    <TheFooter />
</template>

<script setup lang="ts">
import TheNav from './components/TheNav.vue';
import TheFooter from './components/TheFooter.vue';
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@900&family=Roboto:wght@500;700&display=swap');

h1 {
    font-family: 'Archivo', sans-serif;
}

h2,
h3,
h4,
h5 {
    font-family: 'Roboto', sans-serif;
}

body {
    font-family: Georgia, 'Times New Roman', Times, serif;
}

.btn-primary {
    background: #ff9b00 !important;
    border-color: #ff9b00 !important;
    box-shadow: 2px 2px 8px rgb(10 10 10 / 40%);
}

.tag {
    padding: 4px 8px;
    border-radius: 8px;

    &__card {
        @extend .tag;

        text-transform: uppercase;
        font-weight: bold;
        font-size: 0.6rem;

        z-index: 100;
        margin-right: 8px;
        position: absolute;
        top: 4px;
        left: 4px;
        box-shadow: 1px 1px 4px rgb(10 10 10 / 40%);
    }
}

.open {
    color: #fff;
    background-color: #008531;
}

.closed {
    color: #fff;
    background-color: #850000;
}

.btn-favorite {
    height: 40px;
    width: 40px;

    display: flex;
    justify-content: center;
    align-items: center;

    color: rgb(255, 0, 149) !important;
    background-color: #fff;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 10;

    svg {
        padding-top: 4px;
        transition: ease-in-out 200ms;
    }

    &:hover {
        color: rgb(187, 0, 109);

        svg {
            transform: scale(1.1);
        }
    }
}
</style>
