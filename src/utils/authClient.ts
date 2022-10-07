import { apiClient } from '@/services/apiClient';
import type { Token } from '@/types/token';
import type { AxiosResponse } from 'axios';

// Check for access token
export function hasToken(): boolean {
    console.debug('oAuth2Client#hasToken');

    // Get access token from localStorage
    const token = JSON.parse(
        localStorage.getItem('diginomad_tokens') as string
    );

    return !!token;
}

// Clear token from storage
export function clearToken() {
    console.debug('oAuth2Client#clearToken');

    // Remove access token from localStorage
    localStorage.removeItem('diginomad_tokens');
}

// Verify token isn't expired
export function isTokenExpired(token: Token) {
    console.debug('oAuth2Client#isTokenExpired');

    const currentTime = new Date().toLocaleString();
    const tokenExpiresAt = new Date(token.expiry_timestamp).toLocaleString();

    return tokenExpiresAt < currentTime;
}

export async function validateTokens(token: Token, username: string) {
    try {
        if (isTokenExpired(token)) {
            return updateTokens(token, username);
        } else {
            console.log('Valid token');
            return token;
        }
    } catch (err) {
        console.error(err);
    }
}

export async function updateTokens(token: Token, username: string) {
    const response: AxiosResponse = await apiClient.post(
        '/auth/refresh-token',
        {
            refresh_token: token.refresh_token,
            username: username,
        }
    );

    return response.data;
}

export async function fetchUserData(id: number, token: string) {
    try {
        await apiClient.get(`/users/${id}`, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
    } catch (err) {
        console.error(err);
    }
}

export function saveTokens(response: Token) {
    localStorage.setItem(
        'diginomad_tokens',
        JSON.stringify({
            access_token: response.access_token,
            expires_in: response.expires_in,
            refresh_token: response.refresh_token,
            expiry_timestamp: response.expiry_timestamp,
        })
    );
}

export async function fetchUserFavorites(id: number, token: string) {
    try {
        const response: AxiosResponse = await apiClient.get(
            `/users/${id}/favorites`,
            {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error(error);
    }
}
