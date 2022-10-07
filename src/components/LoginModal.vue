<template>
    <div
        class="modal fade"
        id="loginModal"
        tabindex="-1"
        aria-labelledby="loginModalLabel"
        aria-hidden="true"
        ref="loginModal"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="loginModalLabel">Sign In</h5>
                    <button
                        id="closeBtn"
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        ref="closeBtn"
                    ></button>
                </div>
                <div class="modal-body">
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
                            <div class="invalid-feedback">
                                {{ usernameError }}
                            </div>
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
                            <div class="invalid-feedback">
                                {{ passwordError }}
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
                                Login
                            </button>
                        </div>
                        <div
                            v-if="apiError"
                            class="alert alert-danger mt-3 mb-0"
                        >
                            {{ apiError }}
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <router-link
                        to="/signup"
                        class="text-decoration-none"
                        @click="triggerBtnClose()"
                    >
                        Not a member? Sign up.
                    </router-link>
                </div>
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

const apiError = ref<string | null>(null);

const closeBtn = ref<HTMLButtonElement | null>(null);

const triggerBtnClose = () => {
    closeBtn.value = document.getElementById('closeBtn') as HTMLButtonElement;

    closeBtn.value.click();
};

const onSubmit = handleSubmit(async (values) => {
    apiError.value = null;

    const authStore = useAuthStore();
    const { username, password } = values;

    try {
        if (username && password) {
            await authStore.login(username, password);
            if (authStore.isAuthenticated) {
                // Redirect to previous url (default to home page)
                router.push((route.query.redirect as string) || '/');

                triggerBtnClose();
            } else {
                apiError.value = 'Username or password is incorrect.';
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

<style></style>
