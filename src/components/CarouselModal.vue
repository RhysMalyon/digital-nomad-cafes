<template>
    <div
        class="modal fade"
        id="imageCarousel"
        tabindex="-1"
        aria-labelledby="imageCarouselLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-body p-0">
                    <div
                        v-if="imageArray"
                        id="imageCarouselControls"
                        class="carousel slide w-100"
                        data-bs-ride="carousel"
                    >
                        <div class="carousel-indicators">
                            <button
                                v-for="(_image, index) in imageArray"
                                :key="index"
                                type="button"
                                data-bs-target="#carouselExampleIndicators"
                                :data-bs-slide-to="`${index}`"
                                class="active"
                                aria-current="true"
                                aria-label="Slide 1"
                            ></button>
                        </div>
                        <div class="carousel-inner">
                            <div
                                v-for="(image, index) in imageArray"
                                :key="index"
                                :class="
                                    index === 0
                                        ? 'carousel-item active'
                                        : 'carousel-item'
                                "
                            >
                                <img
                                    :src="image.getUrl()"
                                    alt=""
                                    class="d-block w-100"
                                    style="
                                        height: 522px;
                                        object-fit: cover;
                                        object-position: 50% 50%;
                                    "
                                    loading="lazy"
                                />
                            </div>
                        </div>
                        <button
                            class="carousel-control-prev"
                            type="button"
                            data-bs-target="#imageCarouselControls"
                            data-bs-slide="prev"
                        >
                            <span
                                class="carousel-control-prev-icon"
                                aria-hidden="true"
                            ></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button
                            class="carousel-control-next"
                            type="button"
                            data-bs-target="#imageCarouselControls"
                            data-bs-slide="next"
                        >
                            <span
                                class="carousel-control-next-icon"
                                aria-hidden="true"
                            ></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, type PropType } from 'vue';

const imageArray = ref<google.maps.places.PlacePhoto[] | undefined>();

const props = defineProps({
    placeImages: {
        type: Array as PropType<google.maps.places.PlacePhoto[] | undefined>,
    },
});

watch(
    () => [props.placeImages],
    () => {
        imageArray.value = props.placeImages;
    }
);
</script>

<style lang="scss">
// Bootstrap carousel progress indicator override
.carousel-indicators [data-bs-target] {
    background-color: #ff9b00 !important;
    border: 1px solid #391b00 !important;
}
</style>

<!--
* Button component to trigger modal

<button
    type="button"
    class="btn btn-light d-flex p-2"
    data-bs-toggle="modal"
    data-bs-target="#imageCarousel"
>
    <BIconGrid3x3Gap />
</button>
 -->
