import router from '@/routers';
import { apiClient } from '@/services/apiClient';
import type { Token } from '@/types/token';
import {
    clearToken,
    fetchUserFavorites,
    hasToken,
    saveTokens,
} from '@/utils/authClient';
import type { AxiosResponse } from 'axios';
import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';

interface DefaultUserState {
    user_id: number;
    username: string;
}

interface LoginResponse extends Token {
    user_id: number;
    username: string;
}

const defaultUserState: DefaultUserState = {
    user_id: -1,
    username: '',
};

const toast = useToast();

export const useAuthStore = defineStore({
    id: 'auth',

    state: () => ({
        user: { ...defaultUserState },
        isAuthenticated: hasToken(),
        isInitialized: false,
        favorites: [],
    }),

    actions: {
        async setData() {
            const userData = localStorage.getItem('diginomad_user');

            if (userData) {
                const data = JSON.parse(userData);
                this.user = Object.assign({}, defaultUserState, data);

                const tokens = localStorage.getItem('diginomad_tokens');

                if (tokens) {
                    const tokensObject = JSON.parse(tokens) as Token;

                    if (this.favorites.length === 0) {
                        this.getFavorites(
                            this.user.user_id,
                            tokensObject.access_token
                        );
                    }
                }
            }
        },

        // Initialize user if authenticated
        async initialize() {
            try {
                if (this.isAuthenticated) {
                    this.setData();
                }

                this.isInitialized = true;
            } catch (error) {
                console.error(error);
            }
        },

        // Remove data from state
        clearData() {
            this.user = Object.assign({}, defaultUserState);
            this.favorites = [];
            localStorage.removeItem('diginomad_user');
        },

        // Signup is completed with email - referred to as username in other cases
        async signup(email: string, password: string) {
            try {
                const response: AxiosResponse = await apiClient.post('/users', {
                    username: email,
                    password: password,
                    role: 'user',
                });

                if (response.status === 200) {
                    const loginResponse: LoginResponse = await apiClient.post(
                        '/auth/login',
                        {
                            username: email,
                            password: password,
                        }
                    );

                    saveTokens(loginResponse);

                    localStorage.setItem(
                        'diginomad_user',
                        JSON.stringify({
                            user_id: loginResponse.user_id,
                            username: loginResponse.username,
                        })
                    );

                    this.setData();
                    this.isAuthenticated = true;
                }
            } catch (error) {
                console.error(error);
            }
        },

        async login(username: string, password: string) {
            try {
                const response: AxiosResponse = await apiClient.post(
                    '/auth/login',
                    {
                        username: username,
                        password: password,
                    }
                );

                if (response.status === 200) {
                    const loginResponse: LoginResponse = response.data;

                    saveTokens(loginResponse);

                    localStorage.setItem(
                        'diginomad_user',
                        JSON.stringify({
                            user_id: loginResponse.user_id,
                            username: loginResponse.username,
                        })
                    );

                    this.setData();
                    this.isAuthenticated = true;

                    toast.success('Signed in successfully!', {
                        timeout: 2000,
                        hideProgressBar: true,
                    });
                }
            } catch (err) {
                console.error(err);
            }
        },

        logout() {
            this.isAuthenticated = false;

            this.clearData();
            clearToken();

            router.push('/');

            toast.success('Signed out!', {
                timeout: 2000,
                hideProgressBar: true,
            });
        },

        async getFavorites(user_id: number, access_token: string) {
            const favoritesList = await fetchUserFavorites(
                user_id,
                access_token
            );

            this.favorites = favoritesList.favorites;
        },

        async setFavorite(place_id: string | number) {
            try {
                const tokens = localStorage.getItem('diginomad_tokens');

                if (tokens) {
                    const tokensObject = JSON.parse(tokens) as Token;

                    await apiClient.post(
                        '/users/favorites',
                        {
                            user_id: this.user.user_id,
                            place_id: place_id,
                        },
                        {
                            headers: {
                                authorization: `Bearer ${tokensObject.access_token}`,
                            },
                        }
                    );

                    this.getFavorites(
                        this.user.user_id,
                        tokensObject.access_token
                    );
                }
            } catch (error) {
                console.error(error);
            }
        },

        async deleteFavorite(favorite_id: string | number) {
            try {
                const tokens = localStorage.getItem('diginomad_tokens');

                if (tokens) {
                    const tokensObject = JSON.parse(tokens) as Token;

                    await apiClient.delete(`/users/favorites/${favorite_id}`, {
                        headers: {
                            authorization: `Bearer ${tokensObject.access_token}`,
                        },
                    });

                    this.getFavorites(
                        this.user.user_id,
                        tokensObject.access_token
                    );
                }
            } catch (error) {
                console.error(error);
            }
        },
    },
});
