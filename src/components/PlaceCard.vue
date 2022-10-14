<template>
    <div class="col h-100">
        <div class="card h-100">
            <div class="card-body">
                <h5 class="card-title">
                    <router-link :to="`/about/${place.id}`">
                        {{ place.name }}
                    </router-link>
                </h5>
                <div>
                    <small>
                        <a :href="place.website" target="_blank"> Website </a>
                    </small>
                    <br />
                    <small>{{ place.phoneNumber }}</small>
                </div>
                <div class="d-flex mt-3">
                    <p v-if="place.hasPower" class="feature m-0 me-2">
                        <BIconPlug />
                    </p>
                    <p v-if="place.hasWifi" class="feature m-0">
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

<style lang="scss" scoped>
// .card {
//     color: #391b00;
//     background: #ff9b00;
// }

// .feature {
//     width: 40px;
//     height: 40px;

//     display: flex;
//     justify-content: center;
//     align-items: center;

//     border: 1px solid #fff;
//     border-radius: 50%;
//     padding: 8px;
// }
</style>
