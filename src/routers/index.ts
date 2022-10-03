import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw,
} from 'vue-router';
import AboutView from '@/views/AboutView.vue';
import HomeView from '@/views/HomeView.vue';
import FavoritesView from '@/views/FavoritesView.vue';
import LoginView from '@/views/LoginView.vue';
import { useAuthStore } from '@/stores/AuthStore';
import {
    fetchUserData,
    hasToken,
    isTokenExpired,
    saveTokens,
    updateTokens,
} from '@/utils/authClient';
import type { Token } from '@/types/token';

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
        path: '/login',
        name: 'login',
        component: LoginView,
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
                    console.log(minutesToExpiry);

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
                    } else {
                        // Use existing access token
                        fetchUserData(
                            authStore.user.user_id,
                            tokensObject.access_token
                        );
                    }
                }

                next();
            }
        } else {
            next({
                path: '/login',
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
