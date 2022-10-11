import { useAuthStore } from '@/stores/AuthStore';
import type { Token } from '@/types/token';
import {
    fetchUserData,
    hasToken,
    isTokenExpired,
    saveTokens,
    updateTokens,
} from '@/utils/authClient';
import AboutView from '@/views/AboutView.vue';
import FavoritesView from '@/views/FavoritesView.vue';
import HomeView from '@/views/HomeView.vue';
import SignupView from '@/views/SignupView.vue';
import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw,
} from 'vue-router';
import { useToast } from 'vue-toastification';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: '/about/:id',
        name: 'about',
        component: AboutView,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: '/favorites',
        name: 'favorites',
        component: FavoritesView,
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/signup',
        name: 'signup',
        component: SignupView,
        meta: {
            requiresAuth: false,
        },
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore();
    const toast = useToast();

    if (!authStore.isInitialized) {
        authStore.initialize();
    }

    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (authStore.isAuthenticated) {
            if (hasToken()) {
                const tokens = localStorage.getItem('diginomad_tokens');

                if (tokens) {
                    const tokensObject = JSON.parse(tokens) as Token;

                    const minutesToExpiry = Math.floor(
                        (new Date(tokensObject.expiry_timestamp).getTime() -
                            new Date().getTime()) /
                            60000
                    );

                    try {
                        if (
                            isTokenExpired(tokensObject) ||
                            (minutesToExpiry <= 5 && minutesToExpiry > 0)
                        ) {
                            // Refresh tokens and fetch with new access token
                            const updatedTokens = await updateTokens(
                                tokensObject,
                                authStore.user.username
                            );

                            saveTokens(updatedTokens);
                            fetchUserData(
                                authStore.user.user_id,
                                updatedTokens.access_token
                            );
                        } else if (minutesToExpiry > 5) {
                            // Use existing access token
                            fetchUserData(
                                authStore.user.user_id,
                                tokensObject.access_token
                            );
                        }
                    } catch (error) {
                        console.error(error);
                        // Sign user out and redirect to home
                        authStore.logout();

                        toast.info('Session timed out, please sign in again.', {
                            timeout: 5000,
                            hideProgressBar: true,
                        });
                    }
                }

                next();
            }
        } else {
            next({
                query: {
                    redirect: to.fullPath,
                },
            });
        }
    } else {
        next();
    }
});

export default router;
