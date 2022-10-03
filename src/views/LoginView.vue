<template>
    <div class="form-login">
        <form @submit="onSubmit">
            <div class="form-group mt-3">
                <label>Username</label>
                <input
                    type="text"
                    v-model="username"
                    :class="{
                        'form-control': true,
                        'is-invalid': usernameError,
                    }"
                />
                <div class="invalid-feedback">{{ usernameError }}</div>
            </div>

            <div class="form-group mt-3">
                <label>Password</label>
                <input
                    type="password"
                    v-model="password"
                    :class="{
                        'form-control': true,
                        'is-invalid': passwordError,
                    }"
                />
                <div class="invalid-feedback">{{ passwordError }}</div>
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
                    Login
                </button>
            </div>
            <div v-if="apiError" class="alert alert-danger mt-3 mb-0">
                {{ apiError }}
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore';
import { useField, useForm } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';
import * as Yup from 'yup';

const router = useRouter();
const route = useRoute();

const schema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
});

const { handleSubmit, isSubmitting } = useForm({
    validationSchema: schema,
});

const { value: username, errorMessage: usernameError } = useField('username');
const { value: password, errorMessage: passwordError } = useField('password');

let apiError: string | null = null;

const onSubmit = handleSubmit(async (values) => {
    apiError = null;

    const authStore = useAuthStore();
    const { username, password } = values;

    try {
        if (username && password) {
            await authStore.login(username, password);
            if (authStore.isAuthenticated) {
                // Redirect to previous url (default to home page)
                router.push((route.query.redirect as string) || '/');
            }
        } else {
            apiError = 'Please enter username and/or password.';
        }
    } catch (error) {
        if (typeof error === 'string') {
            apiError = error;
        } else {
            apiError = 'Something went wrong.';
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
