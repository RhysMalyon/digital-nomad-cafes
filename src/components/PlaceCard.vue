<template>
    <div class="col h-100">
        <div class="card h-100">
            <div class="card-body">
                <h5 class="card-title">
                    <router-link :to="`/about/${place.id}`">
                        {{ place.name }}
                    </router-link>
                </h5>
                <div class="d-flex mt-3">
                    <p v-if="place.hasPower" class="m-0">
                        <BIconPlug />
                    </p>
                    <p v-if="place.hasWifi" class="m-0">
                        <BIconWifi />
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, type PropType, type Ref } from 'vue';
import type Place from '@/types/place';
import { BIconPlug, BIconWifi } from 'bootstrap-icons-vue';

const props = defineProps({
    place: {
        required: true,
        type: Object as PropType<Place>,
    },
});

const place: Ref<Place> = ref(props.place);
</script>
