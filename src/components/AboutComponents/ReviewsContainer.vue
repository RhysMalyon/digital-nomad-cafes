<template>
    <div id="reviews" class="place__reviews mt-5 row">
        <h3>Reviews</h3>
        <div
            v-for="(review, index) in reviewsArray"
            :key="index + 1"
            class="col-md-6"
        >
            <div class="place__reviews-review my-3">
                <div class="row g-0 mb-3">
                    <div
                        class="review__icon col-1 d-flex justify-content-center align-items-center"
                    >
                        <BIconChatRightQuoteFill />
                    </div>
                    <div class="review__body col-11 d-flex align-items-center">
                        <p class="mb-0">{{ review.text }}</p>
                    </div>
                </div>
                <div
                    class="review__body-profile d-flex align-items-center ps-3"
                >
                    <img
                        :src="review.profile_photo_url"
                        :alt="review.author_name"
                        width="30"
                        height="30"
                    />
                    <p class="mb-0 ms-3">
                        {{ review.author_name }} {{ review.rating }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { BIconChatRightQuoteFill } from 'bootstrap-icons-vue';

defineProps({
    reviewsArray: {
        required: true,
        type: Array as PropType<google.maps.places.PlaceReview[] | undefined>,
    },
});
</script>

<style lang="scss" scoped>
.place {
    &__reviews {
        &-review {
            padding: 1rem 2rem;

            .review {
                &__icon {
                    width: max-content;
                    color: #ff9b00;
                    position: absolute;
                    font-size: 3rem;
                    z-index: -1;
                    opacity: 25%;
                }

                &__body {
                    p {
                        padding: 1rem 1rem 0 1rem;
                    }

                    &-profile {
                        img {
                            border: 1px solid #ff9b00;
                            border-radius: 50%;
                        }
                    }
                }
            }
        }
    }
}
</style>
