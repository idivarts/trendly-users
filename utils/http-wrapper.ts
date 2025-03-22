import { AuthApp } from "./auth";

const BASE_URL = 'https://be.trendly.pro';
export class HttpWrapper {
    public static fetch = async (urlPath: string, init?: RequestInit): Promise<Response> => {
        let idToken = ""
        if (AuthApp.currentUser) {
            idToken = await AuthApp.currentUser.getIdToken();
        }
        return fetch(BASE_URL + urlPath, {
            ...init,
            headers: {
                ...init?.headers,
                ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
            },
        });
    }
}