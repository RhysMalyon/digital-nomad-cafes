<template>
    <div class="container">
        <div class="form-signup">
            <form @submit="onSubmit">
                <div class="form-group mt-3">
                    <label>Email</label>
                    <input
                        type="text"
                        v-model="email"
                        :class="{
                            'form-control': true,
                            'is-invalid': emailError,
                        }"
                    />
                    <div class="invalid-feedback">{{ emailError }}</div>
                </div>

                <div class="form-group mt-3">
                    <label>Password</label>
                    <input
                        type="password"
                        v-model="password"
                        @input="
                            (value) => {
                                validatePasswordCriteria(value);
                            }
                        "
                        :class="{
                            'form-control': true,
                            'is-invalid': passwordError,
                        }"
                    />
                    <div class="invalid-feedback">{{ passwordError }}</div>
                    <PasswordValidate
                        :is-minimum-length="isMinimumLength"
                        :has-number="hasNumber"
                        :has-lowercase="hasLowercase"
                        :has-uppercase="hasUppercase"
                        :has-special="hasSpecial"
                    />
                </div>

                <div class="form-group mt-3">
                    <label>Password Confirmation</label>
                    <input
                        type="password"
                        v-model="passwordConfirmation"
                        :class="{
                            'form-control': true,
                            'is-invalid': passwordConfirmationError,
                        }"
                    />
                    <div class="invalid-feedback">
                        {{ passwordConfirmationError }}
                    </div>
                </div>

                <div class="form-group">
                    <button
                        class="btn btn-primary mt-3 w-100"
                        :disabled="isSubmitting"
                    >
                        <span
                            v-show="isSubmitting"
                            class="spinner-border spinner-border-sm mr-1"
                        ></span>
                        Sign Up
                    </button>
                </div>
            </form>
            <div v-if="apiError" class="alert alert-danger mt-3 mb-0">
                {{ apiError }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore';
import { useField, useForm } from 'vee-validate';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as Yup from 'yup';
import PasswordValidate from '@/components/PasswordValidate.vue';

const router = useRouter();
const route = useRoute();

const validEmailCheck = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
// Password must include 1 uppercase letter, 1 lowercase letter, 1 numerical digit, and 1 special character
const passwordStrengthCheck =
    /^(?=(.*[a-z]){1,})(?!.* )(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/;

// Individual criteria validation
const isMinimumLength = ref<boolean>(false);
const hasNumber = ref<boolean>(false);
const hasLowercase = ref<boolean>(false);
const hasUppercase = ref<boolean>(false);
const hasSpecial = ref<boolean>(false);

const validatePasswordCriteria = (value: Event) => {
    const input = value.target as HTMLInputElement;

    if (input) {
        isMinimumLength.value = input.value.length >= 8;
        hasNumber.value = /\d/.test(input.value);
        hasLowercase.value = /[a-z]/.test(input.value);
        hasUppercase.value = /[A-Z]/.test(input.value);
        hasSpecial.value = /[!@#$%^&*)(+=._-]/.test(input.value);
    }
};

const schema = Yup.object().shape({
    email: Yup.string()
        .matches(validEmailCheck, 'Invalid email.')
        .required('Email is a required field.'),
    password: Yup.string()
        .matches(
            passwordStrengthCheck,
            'Password must be at least 8 characters and contain at least 1 lowercase character, 1 uppercase character, 1 number, and 1 special character'
        )
        .required('Password is a required field.'),
    passwordConfirmation: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords do not match.')
        .required('Please confirm your password.'),
});

const { handleSubmit, isSubmitting } = useForm({
    validationSchema: schema,
});

const { value: email, errorMessage: emailError } = useField('email');
const { value: password, errorMessage: passwordError } = useField('password');
const { value: passwordConfirmation, errorMessage: passwordConfirmationError } =
    useField('passwordConfirmation');

const apiError = ref<string | null>(null);

const onSubmit = handleSubmit(async (values) => {
    apiError.value = null;

    const authStore = useAuthStore();
    const { email, password } = values;

    try {
        if (email && password) {
            await authStore.signup(email, password);
            if (authStore.isAuthenticated) {
                // Redirect to previous url (default to home page)
                router.push((route.query.redirect as string) || '/');
            } else {
                apiError.value = 'Something went wrong, please try again.';
            }
        }
    } catch (error) {
        if (typeof error === 'string') {
            apiError.value = error;
        } else {
            apiError.value = 'Something went wrong.';
        }
    }
});
</script>

<style lang="scss">
.form-login {
    max-width: 300px;
    margin: 0 auto;

    h2 {
        text-align: center;
    }
}
</style>
