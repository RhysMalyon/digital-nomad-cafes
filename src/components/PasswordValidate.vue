<template>
    <div class="mt-3">
        <small :class="setClass(props.isMinimumLength)">
            <span v-if="props.isMinimumLength"><BIconCheckCircle /></span>
            <span v-else><BIconXCircle /></span>
            8 characters
        </small>

        <br />

        <small :class="setClass(props.hasNumber)">
            <span v-if="props.hasNumber"><BIconCheckCircle /></span>
            <span v-else><BIconXCircle /></span>
            1 number
        </small>

        <br />

        <small :class="setClass(props.hasLowercase)">
            <span v-if="props.hasLowercase"><BIconCheckCircle /></span>
            <span v-else><BIconXCircle /></span>
            1 lowercase character
        </small>

        <br />

        <small :class="setClass(props.hasUppercase)">
            <span v-if="props.hasUppercase"><BIconCheckCircle /></span>
            <span v-else><BIconXCircle /></span>
            1 uppercase character
        </small>

        <br />

        <small :class="setClass(props.hasSpecial)">
            <span v-if="props.hasSpecial"><BIconCheckCircle /></span>
            <span v-else><BIconXCircle /></span>
            1 special character
        </small>
    </div>
</template>

<script setup lang="ts">
import { BIconXCircle, BIconCheckCircle } from 'bootstrap-icons-vue';
const props = defineProps({
    isMinimumLength: {
        required: true,
        type: Boolean,
    },
    hasNumber: {
        required: true,
        type: Boolean,
    },
    hasLowercase: {
        required: true,
        type: Boolean,
    },
    hasUppercase: {
        required: true,
        type: Boolean,
    },
    hasSpecial: {
        required: true,
        type: Boolean,
    },
});

const setClass = (criteria: boolean) => {
    return criteria ? 'valid-input' : 'invalid-input';
};
</script>

<style>
.valid-input {
    color: green;
}

.invalid-input {
    color: #dc3545;
}
</style>
